import type { PlanSlug, BillingInterval } from '@/lib/stripe/tier-resolver'
export type { PlanSlug, BillingInterval }

const PAID_PLAN_SLUGS = ['pro'] as const
type PaidPlanSlug = 'pro'

export function getPayPalPlanId(slug: PaidPlanSlug, interval: BillingInterval): string | null {
  const key = `PAYPAL_PLAN_${slug.toUpperCase()}_${interval.toUpperCase()}`
  return process.env[key] ?? null
}

export function getPlanSlugFromPayPalPlanId(paypalPlanId: string): { slug: PaidPlanSlug; interval: BillingInterval } | null {
  for (const slug of PAID_PLAN_SLUGS) {
    for (const interval of ['monthly', 'yearly'] as const) {
      const id = getPayPalPlanId(slug, interval)
      if (id && id === paypalPlanId) return { slug, interval }
    }
  }
  return null
}
