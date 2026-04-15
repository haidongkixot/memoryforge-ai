import { prisma } from '@/lib/prisma'
import { getPayPalSubscription } from '@/lib/paypal/subscriptions'
import { getPlanSlugFromPayPalPlanId } from '@/lib/paypal/tier-resolver'

export interface PayPalSyncResult {
  ok: boolean; reason?: string; subscriptionId?: string; userId?: string; planSlug?: string; status?: string
}

function normalizeStatus(paypalStatus: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'active', APPROVAL_PENDING: 'incomplete', APPROVED: 'incomplete',
    SUSPENDED: 'past_due', CANCELLED: 'canceled', EXPIRED: 'canceled',
  }
  return map[paypalStatus] ?? paypalStatus.toLowerCase()
}

function effectiveUserPlan(status: string, mappedSlug: string): string {
  return status === 'active' || status === 'past_due' ? mappedSlug : 'free'
}

export async function syncSubscriptionFromPayPal(subscriptionId: string): Promise<PayPalSyncResult> {
  let sub: any
  try { sub = await getPayPalSubscription(subscriptionId) } catch (err) {
    return { ok: false, reason: `Failed to fetch PayPal subscription: ${err}`, subscriptionId }
  }

  let userId: string | null = null
  const customId: string | null = sub.custom_id ?? null
  const email: string | null = sub.subscriber?.email_address ?? null

  if (customId) {
    const u = await prisma.user.findUnique({ where: { id: customId }, select: { id: true } })
    if (u) userId = u.id
  }
  if (!userId && email) {
    const u = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (u) userId = u.id
  }
  if (!userId) return { ok: false, reason: `No user found for PayPal sub ${subscriptionId}`, subscriptionId }

  const paypalPlanId: string = sub.plan_id
  const mapped = getPlanSlugFromPayPalPlanId(paypalPlanId)
  if (!mapped) return { ok: false, reason: `Unknown PayPal plan_id ${paypalPlanId}`, subscriptionId, userId }

  const plan = await prisma.plan.findUnique({ where: { slug: mapped.slug }, select: { id: true, slug: true } })
  if (!plan) return { ok: false, reason: `No Plan row for slug=${mapped.slug}`, subscriptionId, userId }

  const status = normalizeStatus(sub.status)
  const lastPaymentTime = sub.billing_info?.last_payment?.time
  const nextBillingTime = sub.billing_info?.next_billing_time
  const currentPeriodStart = lastPaymentTime ? new Date(lastPaymentTime) : (sub.start_time ? new Date(sub.start_time) : new Date())
  const currentPeriodEnd = nextBillingTime ? new Date(nextBillingTime) : null
  const cancelledAt = (sub.status === 'CANCELLED' || sub.status === 'EXPIRED') ? new Date() : null

  await prisma.subscription.upsert({
    where: { paypalSubId: subscriptionId },
    update: {
      userId, planId: plan.id, status, period: mapped.interval,
      currentPeriodStart, currentPeriodEnd: currentPeriodEnd ?? undefined,
      endDate: currentPeriodEnd ?? undefined, cancelledAt,
    },
    create: {
      userId, planId: plan.id, status, period: mapped.interval,
      paypalSubId: subscriptionId,
      currentPeriodStart, currentPeriodEnd: currentPeriodEnd ?? undefined,
      startDate: new Date(), endDate: currentPeriodEnd ?? undefined, cancelledAt,
    },
  })

  const userPlan = effectiveUserPlan(status, plan.slug)
  await prisma.user.update({ where: { id: userId }, data: { plan: userPlan } })

  console.log('[paypal/sync] upserted', 'sub=', subscriptionId, 'user=', userId, 'plan=', plan.slug, 'status=', status)
  return { ok: true, subscriptionId, userId, planSlug: plan.slug, status }
}
