/**
 * Stripe price ID <-> Plan slug mapping for MemoryForge AI.
 *
 * Plan slugs: free | pro
 *
 * Stripe price IDs are stored in env vars keyed by:
 *   STRIPE_PRICE_PRO_MONTHLY=price_xxx
 *   STRIPE_PRICE_PRO_YEARLY=price_yyy
 *
 * `free` has no Stripe price (it is the default fallback tier).
 */

export type PlanSlug = 'free' | 'pro'
export type BillingInterval = 'monthly' | 'yearly'

export const PAID_PLAN_SLUGS: ReadonlyArray<Exclude<PlanSlug, 'free'>> = [
  'pro',
] as const

export const ALL_PLAN_SLUGS: ReadonlyArray<PlanSlug> = [
  'free',
  'pro',
] as const

export function isPlanSlug(value: unknown): value is PlanSlug {
  return (
    typeof value === 'string' &&
    (ALL_PLAN_SLUGS as ReadonlyArray<string>).includes(value)
  )
}

export function isPaidPlanSlug(
  value: unknown
): value is Exclude<PlanSlug, 'free'> {
  return (
    typeof value === 'string' &&
    (PAID_PLAN_SLUGS as ReadonlyArray<string>).includes(value)
  )
}

export function isBillingInterval(value: unknown): value is BillingInterval {
  return value === 'monthly' || value === 'yearly'
}

/**
 * Resolve a Stripe price ID for a (slug, interval) pair from env vars.
 * Returns null if the env var is missing.
 */
export function getStripePriceId(
  slug: Exclude<PlanSlug, 'free'>,
  interval: BillingInterval
): string | null {
  const key = `STRIPE_PRICE_${slug.toUpperCase()}_${interval.toUpperCase()}`
  const value = process.env[key]
  if (!value) return null
  return value
}

/**
 * Reverse map: given a Stripe price ID, find which (slug, interval) it
 * corresponds to. Returns null if no match.
 */
export function getPlanSlugFromPriceId(
  priceId: string
): { slug: Exclude<PlanSlug, 'free'>; interval: BillingInterval } | null {
  for (const slug of PAID_PLAN_SLUGS) {
    for (const interval of ['monthly', 'yearly'] as const) {
      const id = getStripePriceId(slug, interval)
      if (id && id === priceId) {
        return { slug, interval }
      }
    }
  }
  return null
}

/**
 * List every (slug, interval, priceId) configured in env.
 */
export function listConfiguredPrices(): Array<{
  slug: Exclude<PlanSlug, 'free'>
  interval: BillingInterval
  priceId: string
}> {
  const out: Array<{
    slug: Exclude<PlanSlug, 'free'>
    interval: BillingInterval
    priceId: string
  }> = []
  for (const slug of PAID_PLAN_SLUGS) {
    for (const interval of ['monthly', 'yearly'] as const) {
      const id = getStripePriceId(slug, interval)
      if (id) out.push({ slug, interval, priceId: id })
    }
  }
  return out
}
