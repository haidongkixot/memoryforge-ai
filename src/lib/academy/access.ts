/**
 * Plan hierarchy for academy chapter access.
 * Static plans (MemoryForge has no Plan model yet).
 * Order matters: index = tier level.
 */
const PLAN_HIERARCHY = ['free', 'plus', 'pro'] as const
type PlanSlug = (typeof PLAN_HIERARCHY)[number]

/**
 * Determine whether a user's current plan can access a chapter
 * that requires `minPlanSlug`.
 *
 * @param userPlanSlug - The plan the user is subscribed to (default "free")
 * @param minPlanSlug  - The minimum plan required by the chapter
 * @returns true if access is allowed
 */
export function canAccessChapter(
  userPlanSlug: string = 'free',
  minPlanSlug: string = 'free',
): boolean {
  const userTier = PLAN_HIERARCHY.indexOf(userPlanSlug as PlanSlug)
  const requiredTier = PLAN_HIERARCHY.indexOf(minPlanSlug as PlanSlug)
  // Unknown plans default to free (index 0)
  return (userTier < 0 ? 0 : userTier) >= (requiredTier < 0 ? 0 : requiredTier)
}

/**
 * Return a human-readable label for the plan slug.
 */
export function planLabel(slug: string): string {
  const labels: Record<string, string> = { free: 'Free', plus: 'Plus', pro: 'Pro' }
  return labels[slug] ?? slug
}
