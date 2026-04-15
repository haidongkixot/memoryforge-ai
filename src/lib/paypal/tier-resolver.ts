const PAID_PLAN_SLUGS = ['pro'] as const
type PaidPlanSlug = 'pro'
type BillingInterval = 'monthly' | 'yearly'

export function getPayPalPlanId(slug: PaidPlanSlug, interval: BillingInterval): string | null {
  return process.env[`PAYPAL_PLAN_${slug.toUpperCase()}_${interval.toUpperCase()}`] ?? null
}

export function getPlanSlugFromPayPalPlanId(paypalPlanId: string): { slug: PaidPlanSlug; interval: BillingInterval } | null {
  for (const interval of ['monthly', 'yearly'] as const) {
    const id = getPayPalPlanId('pro', interval)
    if (id && id === paypalPlanId) return { slug: 'pro', interval }
  }
  return null
}
