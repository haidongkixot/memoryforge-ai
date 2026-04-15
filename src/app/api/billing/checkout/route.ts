import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { isPaidPlanSlug, isBillingInterval } from '@/lib/stripe/tier-resolver'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { priceSlug, interval } = await req.json()
  if (!isPaidPlanSlug(priceSlug)) return NextResponse.json({ error: 'Invalid plan slug' }, { status: 400 })
  if (!isBillingInterval(interval)) return NextResponse.json({ error: 'Invalid interval' }, { status: 400 })
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://memoryforge.app'
    const checkoutSession = await createCheckoutSession({
      userId: (session.user as any).id,
      email: session.user.email,
      planSlug: priceSlug,
      interval,
      appUrl,
    })
    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('[billing/checkout]', err)
    return NextResponse.json({ error: err.message ?? 'Checkout failed' }, { status: 500 })
  }
}
