import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// ── XP Reward Table ──

export const XP_REWARDS = {
  game_complete: 15,
  perfect_score: 50,
  personal_best: 25,
  streak_3: 10,
  streak_7: 30,
  streak_30: 100,
  first_game_of_day: 5,
  technique_practiced: 10,
  plan_day_complete: 20,
} as const

export type XpReason = keyof typeof XP_REWARDS

// ── Core XP Functions ──

export async function awardXp(
  userId: string,
  reason: XpReason,
  metadata?: Record<string, unknown>
): Promise<number> {
  const amount = XP_REWARDS[reason]

  await prisma.xpLedger.create({
    data: { userId, amount, reason, metadata: metadata as Prisma.InputJsonValue | undefined },
  })

  return amount
}

export async function getTotalXp(userId: string): Promise<number> {
  const result = await prisma.xpLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  })
  return result._sum.amount ?? 0
}

export function xpToLevel(totalXp: number): { level: number; xpInLevel: number; xpForNext: number } {
  // Each level requires progressively more XP: level N needs N * 100 XP
  let remaining = totalXp
  let level = 1

  while (remaining >= level * 100) {
    remaining -= level * 100
    level++
  }

  return {
    level,
    xpInLevel: remaining,
    xpForNext: level * 100,
  }
}

// ── Streak Management ──

export async function updateStreak(
  userId: string,
  type: string = 'daily_play'
): Promise<{ currentCount: number; longestCount: number; isNew: boolean }> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000)

  const existing = await prisma.streak.findUnique({
    where: { userId_type: { userId, type } },
  })

  if (!existing) {
    const streak = await prisma.streak.create({
      data: { userId, type, currentCount: 1, longestCount: 1, lastActiveAt: now },
    })
    return { currentCount: 1, longestCount: 1, isNew: true }
  }

  const lastActive = new Date(existing.lastActiveAt)
  const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate())

  // Already counted today
  if (lastActiveDay.getTime() === todayStart.getTime()) {
    return { currentCount: existing.currentCount, longestCount: existing.longestCount, isNew: false }
  }

  // Consecutive day
  if (lastActiveDay.getTime() === yesterdayStart.getTime()) {
    const newCount = existing.currentCount + 1
    const newLongest = Math.max(newCount, existing.longestCount)
    await prisma.streak.update({
      where: { userId_type: { userId, type } },
      data: { currentCount: newCount, longestCount: newLongest, lastActiveAt: now },
    })
    return { currentCount: newCount, longestCount: newLongest, isNew: false }
  }

  // Streak broken — reset
  await prisma.streak.update({
    where: { userId_type: { userId, type } },
    data: { currentCount: 1, lastActiveAt: now },
  })
  return { currentCount: 1, longestCount: existing.longestCount, isNew: false }
}

// ── Post-Game XP Processing ──

export async function processGameRewards(
  userId: string,
  gameId: string,
  score: number,
  accuracy: number
): Promise<{ totalAwarded: number; reasons: XpReason[] }> {
  const reasons: XpReason[] = []
  let totalAwarded = 0

  // Base completion XP
  totalAwarded += await awardXp(userId, 'game_complete', { gameId, score })
  reasons.push('game_complete')

  // Perfect score bonus
  if (accuracy >= 100) {
    totalAwarded += await awardXp(userId, 'perfect_score', { gameId })
    reasons.push('perfect_score')
  }

  // Personal best check
  const previousBest = await prisma.gameSession.findFirst({
    where: { userId, gameId },
    orderBy: { score: 'desc' },
    select: { score: true },
  })
  if (!previousBest || score > previousBest.score) {
    totalAwarded += await awardXp(userId, 'personal_best', { gameId, score })
    reasons.push('personal_best')
  }

  // First game of the day
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayGames = await prisma.gameSession.count({
    where: { userId, completedAt: { gte: todayStart } },
  })
  if (todayGames <= 1) {
    totalAwarded += await awardXp(userId, 'first_game_of_day', { gameId })
    reasons.push('first_game_of_day')
  }

  // Update streak and award streak XP
  const streak = await updateStreak(userId)
  if (streak.currentCount === 3) {
    totalAwarded += await awardXp(userId, 'streak_3')
    reasons.push('streak_3')
  } else if (streak.currentCount === 7) {
    totalAwarded += await awardXp(userId, 'streak_7')
    reasons.push('streak_7')
  } else if (streak.currentCount === 30) {
    totalAwarded += await awardXp(userId, 'streak_30')
    reasons.push('streak_30')
  }

  // Update daily stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  await prisma.dailyStat.upsert({
    where: { userId_date: { userId, date: today } },
    create: {
      userId,
      date: today,
      gamesPlayed: 1,
      totalScore: score,
      totalXp: totalAwarded,
      avgAccuracy: accuracy,
      bestAccuracy: accuracy,
    },
    update: {
      gamesPlayed: { increment: 1 },
      totalScore: { increment: score },
      totalXp: { increment: totalAwarded },
      bestAccuracy: { set: accuracy }, // simplified; real impl would use max
    },
  })

  return { totalAwarded, reasons }
}
