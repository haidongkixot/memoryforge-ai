import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.HUMANOS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const email = url.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ app: 'memoryforge', email, found: false, stats: null })

  const [sessionsCount, scoreAgg, lastSession] = await Promise.all([
    prisma.gameSession.count({ where: { userId: user.id } }),
    prisma.gameSession.aggregate({
      where: { userId: user.id },
      _sum: { score: true },
    }),
    prisma.gameSession.findFirst({
      where: { userId: user.id },
      orderBy: { completedAt: 'desc' },
      select: {
        completedAt: true,
        game: { select: { name: true } },
      },
    }),
  ])

  const totalScore = scoreAgg._sum.score ?? 0

  return NextResponse.json({
    app: 'memoryforge',
    appLabel: 'MemoryForge',
    email,
    found: true,
    stats: {
      totalSessions: sessionsCount,
      lastActiveAt: lastSession?.completedAt ?? null,
      lastActivity: lastSession?.game?.name ?? null,
      metric: `Score: ${totalScore.toLocaleString()} across ${sessionsCount} session${sessionsCount !== 1 ? 's' : ''}`,
    },
  })
}
