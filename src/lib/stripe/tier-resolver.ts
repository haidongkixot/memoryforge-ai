export type PlanSlug = 'free' | 'pro'
export type BillingInterval = 'monthly' | 'yearly'
export function isPaidPlanSlug(slug: string): slug is Exclude<PlanSlug, 'free'> {
  return slug === 'pro'
}
export function isBillingInterval(s: string): s is BillingInterval {
  return s === 'monthly' || s === 'yearly'
}
export function getStripePriceId(slug: PlanSlug, interval: BillingInterval): string | null {
  if (slug === 'free') return null
  const map: Record<string, string | undefined> = {
    'pro:monthly': process.env.STRIPE_PRICE_PRO_MONTHLY,
    'pro:yearly': process.env.STRIPE_PRICE_PRO_YEARLY,
  }
  return map[`${slug}:${interval}`] ?? null
}
export function getPlanSlugFromPriceId(priceId: string): { slug: PlanSlug; interval: BillingInterval } | null {
  const entries = [
    { env: process.env.STRIPE_PRICE_PRO_MONTHLY, slug: 'pro' as PlanSlug, interval: 'monthly' as BillingInterval },
    { env: process.env.STRIPE_PRICE_PRO_YEARLY, slug: 'pro' as PlanSlug, interval: 'yearly' as BillingInterval },
  ]
  for (const e of entries) {
    if (e.env && e.env === priceId) return { slug: e.slug, interval: e.interval }
  }
  return null
}
