/**
 * createCheckoutSession — server-side helper that wraps Stripe's
 * checkout.sessions.create with MemoryForge conventions.
 */
import type Stripe from 'stripe'
import { stripe } from './client'
import {
  getStripePriceId,
  type BillingInterval,
  type PlanSlug,
} from './tier-resolver'

export interface CreateCheckoutSessionParams {
  userId: string
  userEmail: string
  userName?: string | null
  priceSlug: Exclude<PlanSlug, 'free'>
  interval: BillingInterval
  appUrl: string
}

export interface CreateCheckoutSessionResult {
  url: string
  sessionId: string
  customerId: string
  priceId: string
}

export async function findOrCreateCustomerByEmail(
  email: string,
  name?: string | null,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0) {
    return existing.data[0]
  }
  return stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: metadata ?? undefined,
  })
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CreateCheckoutSessionResult> {
  const {
    userId,
    userEmail,
    userName,
    priceSlug,
    interval,
    appUrl,
  } = params

  const priceId = getStripePriceId(priceSlug, interval)
  if (!priceId) {
    throw new Error(
      `No Stripe price configured for slug=${priceSlug} interval=${interval}. ` +
        `Set STRIPE_PRICE_${priceSlug.toUpperCase()}_${interval.toUpperCase()} in env.`
    )
  }

  const customer = await findOrCreateCustomerByEmail(userEmail, userName, {
    userId,
  })

  const successUrl = `${appUrl.replace(/\/$/, '')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${appUrl.replace(/\/$/, '')}/checkout/canceled`

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_update: {
      address: 'auto',
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    metadata: {
      userId,
      planSlug: priceSlug,
      interval,
    },
    subscription_data: {
      metadata: {
        userId,
        planSlug: priceSlug,
        interval,
      },
    },
  })

  if (!session.url) {
    throw new Error('Stripe returned a checkout session without a URL')
  }

  return {
    url: session.url,
    sessionId: session.id,
    customerId: customer.id,
    priceId,
  }
}
