import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getTotalXp, xpToLevel } from '@/lib/gamification'
import { getUserEngagementStats } from '@/lib/analytics'

// ── Types ──

export interface CoachContext {
  userId: string
  totalXp: number
  level: number
  recentStats: Awaited<ReturnType<typeof getUserEngagementStats>>
  memoryProfiles: Array<{ memoryType: string; strengthScore: number; improvementRate: number }>
  activePlan: { name: string; goal: string; progress: number } | null
}

export interface CoachResponse {
  message: string
  suggestions: string[]
  focusArea?: string
}

// ── Build Context ──

export async function buildCoachContext(userId: string): Promise<CoachContext> {
  const [totalXp, recentStats, memoryProfiles, activePlan] = await Promise.all([
    getTotalXp(userId),
    getUserEngagementStats(userId, 14),
    prisma.memoryProfile.findMany({
      where: { userId },
      select: { memoryType: true, strengthScore: true, improvementRate: true },
    }),
    prisma.trainingPlan.findFirst({
      where: { userId, status: 'active' },
      include: { items: true },
    }),
  ])

  const { level } = xpToLevel(totalXp)

  let planProgress: { name: string; goal: string; progress: number } | null = null
  if (activePlan) {
    const total = activePlan.items.length
    const completed = activePlan.items.filter((i) => i.completed).length
    planProgress = {
      name: activePlan.name,
      goal: activePlan.goal,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  return {
    userId,
    totalXp,
    level,
    recentStats,
    memoryProfiles,
    activePlan: planProgress,
  }
}

// ── System Prompt Builder ──

export function buildSystemPrompt(ctx: CoachContext): string {
  const weakest = ctx.memoryProfiles.length > 0
    ? ctx.memoryProfiles.reduce((a, b) => (a.strengthScore < b.strengthScore ? a : b))
    : null

  return [
    'You are MemoryForge Coach, an expert AI memory training coach.',
    'Your role is to guide users through science-based memory improvement.',
    'Be encouraging but honest. Use short, actionable advice.',
    '',
    `User level: ${ctx.level} (${ctx.totalXp} XP)`,
    `Games played (14d): ${ctx.recentStats.totalGames}`,
    `Active days (14d): ${ctx.recentStats.activeDays}`,
    `Average accuracy: ${ctx.recentStats.avgAccuracy}%`,
    ctx.recentStats.currentStreaks.length > 0
      ? `Streaks: ${ctx.recentStats.currentStreaks.map((s) => `${s.type}: ${s.current}d`).join(', ')}`
      : 'No active streaks.',
    weakest
      ? `Weakest area: ${weakest.memoryType} (score ${weakest.strengthScore})`
      : 'No memory profile data yet.',
    ctx.activePlan
      ? `Active plan: "${ctx.activePlan.name}" — ${ctx.activePlan.progress}% complete`
      : 'No active training plan.',
    '',
    'Focus on practical memory techniques: method of loci, spaced repetition,',
    'chunking, visualization, and association. Tailor advice to their data.',
  ].join('\n')
}

// ── Conversation Persistence ──

export async function saveMessage(
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  context?: Record<string, unknown>
) {
  return prisma.coachMessage.create({
    data: { userId, role, content, context: context as Prisma.InputJsonValue | undefined },
  })
}

export async function getConversationHistory(
  userId: string,
  limit: number = 20
) {
  return prisma.coachMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { role: true, content: true, createdAt: true },
  }).then((msgs) => msgs.reverse())
}

// ── Insight Engine ──

export async function generateInsights(ctx: CoachContext): Promise<CoachResponse> {
  const suggestions: string[] = []
  let focusArea: string | undefined
  const parts: string[] = []

  // Inactivity nudge
  if (ctx.recentStats.activeDays < 3) {
    parts.push('You have been away for a while. Consistency matters more than intensity for memory training.')
    suggestions.push('Try a quick 2-minute pattern recall game to get back on track.')
  }

  // Accuracy coaching
  if (ctx.recentStats.avgAccuracy > 0 && ctx.recentStats.avgAccuracy < 60) {
    parts.push('Your accuracy could use improvement. Slow down and focus on encoding each item before moving on.')
    suggestions.push('Practice the chunking technique: group items into meaningful clusters of 3-4.')
  }

  // Streak encouragement
  const dailyStreak = ctx.recentStats.currentStreaks.find((s) => s.type === 'daily_play')
  if (dailyStreak && dailyStreak.current >= 3) {
    parts.push(`Great consistency! You are on a ${dailyStreak.current}-day streak. Keep it going.`)
  }

  // Weakness targeting
  const weakest = ctx.memoryProfiles.length > 0
    ? ctx.memoryProfiles.reduce((a, b) => (a.strengthScore < b.strengthScore ? a : b))
    : null
  if (weakest && weakest.strengthScore < 40) {
    focusArea = weakest.memoryType
    parts.push(`Your ${weakest.memoryType} memory could use extra attention.`)
    suggestions.push(`Play games that target ${weakest.memoryType} memory to build that skill.`)
  }

  // Plan progress
  if (ctx.activePlan) {
    if (ctx.activePlan.progress >= 80) {
      parts.push(`Almost done with "${ctx.activePlan.name}" — finish strong!`)
    } else if (ctx.activePlan.progress < 20) {
      suggestions.push(`Start working on your training plan "${ctx.activePlan.name}" today.`)
    }
  }

  // Level milestone
  if (ctx.level >= 5 && ctx.level % 5 === 0) {
    parts.push(`Congratulations on reaching level ${ctx.level}! Your dedication is paying off.`)
  }

  if (parts.length === 0) {
    parts.push('You are doing well. Keep practicing regularly and challenging yourself with harder levels.')
    suggestions.push('Try increasing the difficulty on your favorite game.')
  }

  return {
    message: parts.join(' '),
    suggestions,
    focusArea,
  }
}
