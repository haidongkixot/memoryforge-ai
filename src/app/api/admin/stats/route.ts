import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  if ((session.user as any).role !== 'admin') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const [totalUsers, totalGames, totalSessions, avgScoreResult, topGames] = await Promise.all([
      prisma.user.count(),
      prisma.game.count(),
      prisma.gameSession.count(),
      prisma.gameSession.aggregate({ _avg: { score: true } }),
      prisma.game.findMany({
        orderBy: { gameSessions: { _count: 'desc' } },
        take: 1,
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { gameSessions: true } },
        },
      }),
    ])

    const topGame = topGames[0] ?? null

    return NextResponse.json({
      totalUsers,
      totalGames,
      totalSessions,
      avgScore: Math.round(avgScoreResult._avg.score ?? 0),
      topGame: topGame
        ? { id: topGame.id, name: topGame.name, slug: topGame.slug, sessions: topGame._count.gameSessions }
        : null,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
