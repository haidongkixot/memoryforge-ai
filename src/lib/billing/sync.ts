/**
 * syncSubscriptionFromStripe — the source of truth for MemoryForge billing state.
 *
 * The Stripe webhook handler calls this on every subscription lifecycle event.
 * Given a Stripe.Subscription object, we:
 *   1. Resolve the MemoryForge user via the Stripe customer's email
 *   2. Map the subscription's price ID -> plan slug via tier-resolver
 *   3. Look up the local Plan row by slug
 *   4. Upsert the local Subscription row keyed by stripeSubId
 *   5. Update User.plan to the resolved slug (or 'free' on cancellation)
 *
 * IMPORTANT: This function updates BOTH the Subscription row AND the User.plan
 * field.
 */
import type Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe/client'
import { getPlanSlugFromPriceId } from '@/lib/stripe/tier-resolver'

export interface SyncResult {
  ok: boolean
  reason?: string
  subscriptionId?: string
  userId?: string
  planSlug?: string
  status?: string
}

function tsToDate(ts: number | null | undefined): Date | null {
  if (typeof ts !== 'number') return null
  return new Date(ts * 1000)
}

async function resolveUserIdFromCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): Promise<{ userId: string; email: string } | null> {
  let email: string | null = null
  let metadataUserId: string | null = null

  if (typeof customer === 'string') {
    try {
      const cust = await stripe.customers.retrieve(customer)
      if ((cust as Stripe.DeletedCustomer).deleted) {
        return null
      }
      const c = cust as Stripe.Customer
      email = c.email ?? null
      metadataUserId = c.metadata?.userId ?? null
    } catch (err) {
      console.error('[billing/sync] failed to retrieve customer', customer, err)
      return null
    }
  } else if ((customer as Stripe.DeletedCustomer).deleted) {
    return null
  } else {
    const c = customer as Stripe.Customer
    email = c.email ?? null
    metadataUserId = c.metadata?.userId ?? null
  }

  if (metadataUserId) {
    const byId = await prisma.user.findUnique({
      where: { id: metadataUserId },
      select: { id: true, email: true },
    })
    if (byId) return { userId: byId.id, email: byId.email }
  }

  if (email) {
    const byEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })
    if (byEmail) return { userId: byEmail.id, email: byEmail.email }
  }

  return null
}

/**
 * Determine the effective plan slug for the User.plan field.
 */
function effectiveUserPlan(
  status: string,
  mappedSlug: string
): string {
  const activeLike = new Set(['active', 'trialing', 'past_due'])
  if (activeLike.has(status)) return mappedSlug
  return 'free'
}

export async function syncSubscriptionFromStripe(
  subscription: Stripe.Subscription
): Promise<SyncResult> {
  const stripeSubId = subscription.id

  // 1. Resolve the user.
  const userInfo = await resolveUserIdFromCustomer(subscription.customer)
  if (!userInfo) {
    const reason = `No MemoryForge user found for Stripe customer ${
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id
    }`
    console.warn('[billing/sync]', reason, 'sub=', stripeSubId)
    return { ok: false, reason, subscriptionId: stripeSubId }
  }

  // 2. Map the first subscription item's price ID -> plan slug.
  const firstItem = subscription.items?.data?.[0]
  const priceId = firstItem?.price?.id
  if (!priceId) {
    const reason = `Subscription ${stripeSubId} has no items[0].price.id`
    console.warn('[billing/sync]', reason)
    return { ok: false, reason, subscriptionId: stripeSubId, userId: userInfo.userId }
  }

  const mapped = getPlanSlugFromPriceId(priceId)
  if (!mapped) {
    const reason = `Stripe price ${priceId} does not match any configured plan slug — ignoring`
    console.warn('[billing/sync]', reason, 'sub=', stripeSubId)
    return { ok: false, reason, subscriptionId: stripeSubId, userId: userInfo.userId }
  }

  // 3. Look up the local Plan row by slug.
  const plan = await prisma.plan.findUnique({
    where: { slug: mapped.slug },
    select: { id: true, slug: true },
  })
  if (!plan) {
    const reason = `No local Plan row for slug=${mapped.slug} (run prisma seed?)`
    console.warn('[billing/sync]', reason, 'sub=', stripeSubId)
    return { ok: false, reason, subscriptionId: stripeSubId, userId: userInfo.userId }
  }

  // 4. Compute timestamps.
  const sub: any = subscription as any
  const itemAny: any = firstItem as any
  const currentPeriodStartTs: number =
    itemAny?.current_period_start ?? sub.current_period_start ?? 0
  const currentPeriodEndTs: number =
    itemAny?.current_period_end ?? sub.current_period_end ?? 0
  const currentPeriodStart =
    tsToDate(currentPeriodStartTs) ?? new Date()
  const currentPeriodEnd =
    tsToDate(currentPeriodEndTs) ?? new Date()

  let cancelledAt = tsToDate(subscription.canceled_at)
  if (
    !cancelledAt &&
    (subscription.status === 'canceled' ||
      subscription.status === 'incomplete_expired')
  ) {
    cancelledAt = new Date()
  }

  // 5. Upsert the local Subscription row keyed by stripeSubId (unique).
  await prisma.subscription.upsert({
    where: { stripeSubId },
    update: {
      userId: userInfo.userId,
      planId: plan.id,
      status: subscription.status,
      period: mapped.interval,
      currentPeriodStart,
      currentPeriodEnd,
      cancelledAt,
    },
    create: {
      userId: userInfo.userId,
      planId: plan.id,
      status: subscription.status,
      period: mapped.interval,
      stripeSubId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelledAt,
    },
  })

  // 6. Update User.plan to the effective plan slug.
  const userPlan = effectiveUserPlan(subscription.status, plan.slug)
  await prisma.user.update({
    where: { id: userInfo.userId },
    data: { plan: userPlan },
  })

  console.log(
    '[billing/sync] upserted',
    'sub=', stripeSubId,
    'user=', userInfo.userId,
    'plan=', plan.slug,
    'userPlan=', userPlan,
    'status=', subscription.status
  )

  return {
    ok: true,
    subscriptionId: stripeSubId,
    userId: userInfo.userId,
    planSlug: plan.slug,
    status: subscription.status,
  }
}
