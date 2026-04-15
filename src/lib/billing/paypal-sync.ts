import { prisma } from '@/lib/prisma'
import { getPayPalSubscription } from '@/lib/paypal/subscriptions'
import { getPlanSlugFromPayPalPlanId } from '@/lib/paypal/tier-resolver'

export interface PayPalSyncResult {
  ok: boolean; reason?: string; subscriptionId?: string; userId?: string; planSlug?: string; status?: string
}

function normalizeStatus(s: string): string {
  return ({ ACTIVE:'active', APPROVAL_PENDING:'incomplete', APPROVED:'incomplete', SUSPENDED:'past_due', CANCELLED:'canceled', EXPIRED:'canceled' } as Record<string,string>)[s] ?? s.toLowerCase()
}

function effectiveUserPlan(status: string, slug: string): string {
  return (status === 'active' || status === 'past_due') ? slug : 'free'
}

export async function syncSubscriptionFromPayPal(subscriptionId: string): Promise<PayPalSyncResult> {
  let sub: any
  try { sub = await getPayPalSubscription(subscriptionId) } catch (err) {
    return { ok: false, reason: `Failed to fetch: ${err}`, subscriptionId }
  }

  let userId: string | null = null
  if (sub.custom_id) {
    const u = await prisma.user.findUnique({ where: { id: sub.custom_id }, select: { id: true } })
    if (u) userId = u.id
  }
  if (!userId && sub.subscriber?.email_address) {
    const u = await prisma.user.findUnique({ where: { email: sub.subscriber.email_address }, select: { id: true } })
    if (u) userId = u.id
  }
  if (!userId) return { ok: false, reason: `No user found for sub ${subscriptionId}`, subscriptionId }

  const mapped = getPlanSlugFromPayPalPlanId(sub.plan_id)
  if (!mapped) return { ok: false, reason: `Unknown plan_id ${sub.plan_id}`, subscriptionId, userId }

  const plan = await prisma.plan.findUnique({ where: { slug: mapped.slug }, select: { id: true, slug: true } })
  if (!plan) return { ok: false, reason: `No Plan row for slug=${mapped.slug}`, subscriptionId, userId }

  const status = normalizeStatus(sub.status)
  const currentPeriodStart = sub.billing_info?.last_payment?.time
    ? new Date(sub.billing_info.last_payment.time)
    : (sub.start_time ? new Date(sub.start_time) : new Date())
  const currentPeriodEnd = sub.billing_info?.next_billing_time
    ? new Date(sub.billing_info.next_billing_time) : null
  const cancelledAt = (sub.status === 'CANCELLED' || sub.status === 'EXPIRED') ? new Date() : null

  await prisma.subscription.upsert({
    where: { paypalSubId: subscriptionId },
    update: { userId, planId: plan.id, status, period: mapped.interval, currentPeriodStart, currentPeriodEnd: currentPeriodEnd ?? undefined, endDate: currentPeriodEnd ?? undefined, cancelledAt },
    create: { userId, planId: plan.id, status, period: mapped.interval, paypalSubId: subscriptionId, currentPeriodStart, currentPeriodEnd: currentPeriodEnd ?? undefined, startDate: new Date(), endDate: currentPeriodEnd ?? undefined, cancelledAt },
  })

  await prisma.user.update({ where: { id: userId }, data: { plan: effectiveUserPlan(status, plan.slug) } })
  console.log('[paypal/sync] upserted sub=', subscriptionId, 'user=', userId, 'plan=', plan.slug)
  return { ok: true, subscriptionId, userId, planSlug: plan.slug, status }
}
