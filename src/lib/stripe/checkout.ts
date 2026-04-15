import Stripe from 'stripe'
import { stripe } from './client'
import { getStripePriceId, type PlanSlug, type BillingInterval } from './tier-resolver'

export async function findOrCreateCustomerByEmail(email: string, userId: string): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0) return existing.data[0].id
  const customer = await stripe.customers.create({ email, metadata: { userId } })
  return customer.id
}

export interface CreateCheckoutSessionParams {
  userId: string
  email: string
  planSlug: PlanSlug
  interval: BillingInterval
  appUrl: string
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const { userId, email, planSlug, interval, appUrl } = params
  const priceId = getStripePriceId(planSlug, interval)
  if (!priceId) throw new Error(`No price configured for ${planSlug}:${interval}`)
  const customerId = await findOrCreateCustomerByEmail(email, userId)
  const base = appUrl.replace(/\/$/, '')
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/checkout/canceled`,
    metadata: { userId, planSlug, interval },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  })
}
