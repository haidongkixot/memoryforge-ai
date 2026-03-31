import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { xpToLevel } from '@/lib/gamification'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'all'

    let dateFilter: Date | undefined
    const now = new Date()
    if (period === 'week') {
      dateFilter = new Date(now.getTime() - 7 * 86_400_000)
    } else if (period === 'month') {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Get XP totals grouped by user
    const xpData = await prisma.xpLedger.groupBy({
      by: ['userId'],
      _sum: { amount: true },
      ...(dateFilter ? { where: { createdAt: { gte: dateFilter } } } : {}),
      orderBy: { _sum: { amount: 'desc' } },
      take: 20,
    })

    if (xpData.length === 0) {
      return NextResponse.json({ leaders: [] })
    }

    const userIds = xpData.map((x) => x.userId)

    // Get user names and game stats
    const [users, gameStats] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      }),
      prisma.gameSession.groupBy({
        by: ['userId'],
        where: { userId: { in: userIds } },
        _count: { id: true },
        _avg: { accuracy: true },
      }),
    ])

    const userMap = new Map(users.map((u) => [u.id, u]))
    const statsMap = new Map(gameStats.map((s) => [s.userId, s]))

    const leaders = xpData.map((x, i) => {
      const user = userMap.get(x.userId)
      const stats = statsMap.get(x.userId)
      const totalXp = x._sum.amount || 0
      const { level } = xpToLevel(totalXp)

      return {
        rank: i + 1,
        name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
        totalXp,
        level,
        gamesPlayed: stats?._count?.id || 0,
        avgAccuracy: Math.round(stats?._avg?.accuracy || 0),
      }
    })

    return NextResponse.json({ leaders })
  } catch {
    return NextResponse.json({ leaders: [] })
  }
}
