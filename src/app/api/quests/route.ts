import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Quest {
  id: string
  title: string
  description: string
  type: 'play' | 'beat_record' | 'try_new' | 'streak' | 'accuracy'
  target: number
  progress: number
  xpReward: number
  completed: boolean
  gameSlug?: string
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = (session.user as any).id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's stats
    const [todaySessions, allGames, userGameIds, streak] = await Promise.all([
      prisma.gameSession.findMany({
        where: { userId, completedAt: { gte: today } },
        include: { game: { select: { slug: true, name: true, category: true } } },
      }),
      prisma.game.findMany({
        where: { isActive: true },
        select: { id: true, slug: true, name: true, category: true },
      }),
      prisma.gameSession.findMany({
        where: { userId },
        select: { gameId: true },
        distinct: ['gameId'],
      }),
      prisma.streak.findUnique({
        where: { userId_type: { userId, type: 'daily_play' } },
      }),
    ])

    const playedTodayCount = todaySessions.length
    const playedGameIds = new Set(userGameIds.map((g) => g.gameId))
    const todayGameSlugs = new Set(todaySessions.map((s) => s.game.slug))

    // Get personal bests
    const personalBests = await prisma.gameSession.groupBy({
      by: ['gameId'],
      where: { userId },
      _max: { score: true },
    })
    const bestMap = new Map(personalBests.map((pb) => [pb.gameId, pb._max.score || 0]))

    const quests: Quest[] = []

    // Quest 1: Play 3 games today
    quests.push({
      id: 'daily-play-3',
      title: 'Daily Training',
      description: 'Play 3 games today',
      type: 'play',
      target: 3,
      progress: Math.min(playedTodayCount, 3),
      xpReward: 20,
      completed: playedTodayCount >= 3,
    })

    // Quest 2: Beat your personal record in any game
    const beatRecord = todaySessions.some((s) => {
      const best = bestMap.get(s.gameId)
      return best !== undefined && s.score > best
    })
    quests.push({
      id: 'beat-record',
      title: 'Personal Best',
      description: 'Beat your record in any game',
      type: 'beat_record',
      target: 1,
      progress: beatRecord ? 1 : 0,
      xpReward: 30,
      completed: beatRecord,
      gameSlug: allGames[0]?.slug,
    })

    // Quest 3: Try a game you haven't played
    const unplayed = allGames.filter((g) => !playedGameIds.has(g.id))
    const triedNew = todaySessions.some((s) => {
      // Check if this was the first time ever (only session for that game)
      return !playedGameIds.has(s.gameId) || todayGameSlugs.has(s.game.slug)
    })
    quests.push({
      id: 'try-new',
      title: 'Explorer',
      description: unplayed.length > 0
        ? `Try a new game: ${unplayed[0].name}`
        : 'Try a different game category today',
      type: 'try_new',
      target: 1,
      progress: unplayed.length > 0 && todaySessions.some((s) => unplayed.find((u) => u.id === s.gameId)) ? 1 : 0,
      xpReward: 25,
      completed: unplayed.length > 0 && todaySessions.some((s) => unplayed.find((u) => u.id === s.gameId)),
      gameSlug: unplayed[0]?.slug || allGames[0]?.slug,
    })

    // Quest 4: Achieve 80%+ accuracy
    const highAccuracy = todaySessions.some((s) => s.accuracy >= 80)
    quests.push({
      id: 'high-accuracy',
      title: 'Sharpshooter',
      description: 'Achieve 80% or higher accuracy in a game',
      type: 'accuracy',
      target: 1,
      progress: highAccuracy ? 1 : 0,
      xpReward: 25,
      completed: highAccuracy,
      gameSlug: allGames.find((g) => g.category === 'visual')?.slug || allGames[0]?.slug,
    })

    // Quest 5: Keep your streak going
    const currentStreak = streak?.currentCount || 0
    quests.push({
      id: 'keep-streak',
      title: 'Consistency',
      description: playedTodayCount > 0 ? 'Streak maintained!' : 'Play today to keep your streak alive',
      type: 'streak',
      target: 1,
      progress: playedTodayCount > 0 ? 1 : 0,
      xpReward: 15,
      completed: playedTodayCount > 0,
    })

    return NextResponse.json({ quests })
  } catch {
    return NextResponse.json({ quests: [] })
  }
}
