import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getLevelFromXp(totalXp: number) {
  let level = 1, threshold = 100, accumulated = 0
  while (totalXp >= accumulated + threshold) {
    accumulated += threshold; level++; threshold = Math.floor(threshold * 1.3)
  }
  return { level, currentXp: totalXp - accumulated, nextLevelXp: threshold }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  try {
    const [xpResult, streak] = await Promise.all([
      prisma.xpLedger.aggregate({ where: { userId }, _sum: { amount: true } }),
      prisma.streak.findFirst({ where: { userId } }),
    ])
    const totalXp = xpResult._sum.amount ?? 0
    const lvl = getLevelFromXp(totalXp)
    return NextResponse.json({
      xp: totalXp,
      level: lvl.level,
      xpInCurrentLevel: lvl.currentXp,
      xpForNextLevel: lvl.nextLevelXp,
      progressPercent: Math.round((lvl.currentXp / lvl.nextLevelXp) * 100),
      currentStreak: streak?.currentCount ?? 0,
      longestStreak: streak?.longestCount ?? 0,
    })
  } catch (err) {
    console.error('[gamification]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
