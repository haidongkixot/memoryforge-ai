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
    const users = await prisma.user.findMany({
      take: 20,
      orderBy: { gameSessions: { _count: 'desc' } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gameSessions: {
          select: { score: true },
        },
        _count: {
          select: { gameSessions: true },
        },
      },
    })

    const leaderboard = users
      .filter((u) => u._count.gameSessions > 0)
      .map((u, i) => {
        const scores = u.gameSessions.map((s) => s.score)
        return {
          rank: i + 1,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          totalSessions: u._count.gameSessions,
          bestScore: scores.length > 0 ? Math.max(...scores) : 0,
          totalScore: scores.reduce((acc, s) => acc + s, 0),
        }
      })

    return NextResponse.json(leaderboard)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
