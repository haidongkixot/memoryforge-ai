/**
 * Content-gating helpers for difficulty-based plan restrictions.
 *
 * Mapping:
 *   beginner     -> free  (all plans)
 *   intermediate -> pro   (pro and above)
 *   advanced     -> pro   (pro only)
 */

const PLAN_TIER: Record<string, number> = { free: 0, plus: 1, pro: 2 }
const DIFFICULTY_MIN_PLAN: Record<string, string> = {
  beginner: 'free',
  intermediate: 'pro',
  advanced: 'pro',
}

/** Check if user's plan can access content at the given difficulty. */
export function canAccessDifficulty(
  userPlan: string = 'free',
  difficulty: string = 'beginner',
): boolean {
  const minPlan = DIFFICULTY_MIN_PLAN[difficulty] ?? 'free'
  const userTier = PLAN_TIER[userPlan] ?? 0
  const requiredTier = PLAN_TIER[minPlan] ?? 0
  return userTier >= requiredTier
}

/** Return the minimum plan slug required for a difficulty level. */
export function minPlanForDifficulty(difficulty: string): string {
  return DIFFICULTY_MIN_PLAN[difficulty] ?? 'free'
}
