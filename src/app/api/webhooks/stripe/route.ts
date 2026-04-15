import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { tryClaimEvent } from '@/lib/billing/webhook-events'
import { syncSubscriptionFromStripe } from '@/lib/billing/sync'

export const dynamic = 'force-dynamic'

const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !sig) return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 400 })
  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: any) {
    console.error('[webhook/stripe] signature error', err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }
  if (!HANDLED_EVENTS.has(event.type)) return NextResponse.json({ received: true, skipped: true })
  const status = await tryClaimEvent(event.id)
  if (status === 'duplicate') {
    console.log('[webhook/stripe] duplicate event', event.id, event.type)
    return NextResponse.json({ received: true, duplicate: true })
  }
  try {
    if (event.type === 'checkout.session.completed') {
      const cs = event.data.object
      if (cs.mode === 'subscription' && cs.subscription) {
        const subscription = await stripe.subscriptions.retrieve(cs.subscription as string, { expand: ['items.data.price'] })
        await syncSubscriptionFromStripe(subscription)
      }
    } else if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      await syncSubscriptionFromStripe(event.data.object)
    } else if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
      const invoice = event.data.object
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string, { expand: ['items.data.price'] })
        await syncSubscriptionFromStripe(subscription)
      }
    }
  } catch (err) {
    console.error('[webhook/stripe] handler error', event.type, err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
  return NextResponse.json({ received: true })
}
