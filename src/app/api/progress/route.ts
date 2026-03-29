import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  try {
    const sessions = await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 100,
      include: { game: { select: { name: true, category: true } } },
    })

    const totalSessions = sessions.length
    const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.duration, 0) / 60)
    const avgAccuracy = totalSessions > 0
      ? Math.round(sessions.reduce((a, s) => a + s.accuracy, 0) / totalSessions)
      : 0
    const highestLevel = sessions.reduce((max, s) => Math.max(max, s.level), 0)
    const totalScore = sessions.reduce((a, s) => a + s.score, 0)

    // Streak calculation
    const daySet = new Set(sessions.map(s => s.completedAt.toISOString().slice(0, 10)))
    const days = Array.from(daySet).sort().reverse()
    let currentStreak = 0
    for (let i = 0; i < days.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      if (days[i] === expected) currentStreak++
      else break
    }

    // Favorite category
    const catCount: Record<string, number> = {}
    sessions.forEach(s => { catCount[s.game.category] = (catCount[s.game.category] || 0) + 1 })
    const favoriteCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'

    const recentSessions = sessions.slice(0, 10).map(s => ({
      id: s.id,
      gameName: s.game.name,
      category: s.game.category,
      score: s.score,
      level: s.level,
      accuracy: s.accuracy,
      duration: s.duration,
      completedAt: s.completedAt,
    }))

    const achievements = await prisma.userAchievement.findMany({ where: { userId } })

    return NextResponse.json({
      totalSessions,
      totalMinutes,
      avgAccuracy,
      highestLevel,
      totalScore,
      currentStreak,
      favoriteCategory,
      recentSessions,
      achievements,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
