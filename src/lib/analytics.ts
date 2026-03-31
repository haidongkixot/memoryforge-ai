import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// ── Event Tracking ──

export async function trackEvent(params: {
  userId?: string
  event: string
  category: string
  properties?: Record<string, unknown>
  sessionId?: string
}) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        event: params.event,
        category: params.category,
        sessionId: params.sessionId,
        properties: params.properties as Prisma.InputJsonValue | undefined,
        ...(params.userId ? { user: { connect: { id: params.userId } } } : {}),
      },
    })
  } catch {
    console.error(`[analytics] Failed to track event: ${params.event}`)
  }
}

// ── Pre-defined Event Helpers ──

export const analytics = {
  gameStarted(userId: string, gameId: string, gameSlug: string) {
    return trackEvent({
      userId,
      event: 'game_started',
      category: 'engagement',
      properties: { gameId, gameSlug },
    })
  },

  gameCompleted(userId: string, gameId: string, score: number, accuracy: number, duration: number) {
    return trackEvent({
      userId,
      event: 'game_completed',
      category: 'engagement',
      properties: { gameId, score, accuracy, duration },
    })
  },

  achievementUnlocked(userId: string, achievement: string) {
    return trackEvent({
      userId,
      event: 'achievement_unlocked',
      category: 'milestone',
      properties: { achievement },
    })
  },

  streakUpdated(userId: string, count: number, type: string) {
    return trackEvent({
      userId,
      event: 'streak_updated',
      category: 'engagement',
      properties: { count, type },
    })
  },

  coachInteraction(userId: string, messageRole: string) {
    return trackEvent({
      userId,
      event: 'coach_interaction',
      category: 'ai',
      properties: { messageRole },
    })
  },

  pageViewed(userId: string | undefined, page: string) {
    return trackEvent({
      userId,
      event: 'page_viewed',
      category: 'navigation',
      properties: { page },
    })
  },

  signUp(userId: string, method: string) {
    return trackEvent({
      userId,
      event: 'sign_up',
      category: 'auth',
      properties: { method },
    })
  },

  signIn(userId: string, method: string) {
    return trackEvent({
      userId,
      event: 'sign_in',
      category: 'auth',
      properties: { method },
    })
  },
}

// ── Aggregation Queries ──

export async function getEventCounts(
  event: string,
  since: Date,
  until?: Date
): Promise<number> {
  return prisma.analyticsEvent.count({
    where: {
      event,
      createdAt: {
        gte: since,
        ...(until ? { lte: until } : {}),
      },
    },
  })
}

export async function getUserEngagementStats(userId: string, days: number = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [totalGames, totalXp, dailyStats, streaks] = await Promise.all([
    prisma.gameSession.count({
      where: { userId, completedAt: { gte: since } },
    }),
    prisma.xpLedger.aggregate({
      where: { userId, createdAt: { gte: since } },
      _sum: { amount: true },
    }),
    prisma.dailyStat.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: 'desc' },
    }),
    prisma.streak.findMany({
      where: { userId },
    }),
  ])

  const activeDays = dailyStats.length
  const avgAccuracy =
    dailyStats.length > 0
      ? dailyStats.reduce((sum, d) => sum + d.avgAccuracy, 0) / dailyStats.length
      : 0

  return {
    totalGames,
    totalXp: totalXp._sum.amount ?? 0,
    activeDays,
    avgAccuracy: Math.round(avgAccuracy * 100) / 100,
    currentStreaks: streaks.map((s) => ({
      type: s.type,
      current: s.currentCount,
      longest: s.longestCount,
    })),
    dailyStats,
  }
}
