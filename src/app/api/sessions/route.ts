import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { gameId, score, level, accuracy, duration, movesCount } = await req.json()
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: (session.user as any).id,
        gameId,
        score: score || 0,
        level: level || 1,
        accuracy: accuracy || 0,
        duration: duration || 0,
        movesCount: movesCount || 0,
      },
    })
    return NextResponse.json(gameSession, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const sessions = await prisma.gameSession.findMany({
      where: { userId: (session.user as any).id },
      include: { game: { select: { name: true, slug: true, category: true } } },
      orderBy: { completedAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(sessions)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}