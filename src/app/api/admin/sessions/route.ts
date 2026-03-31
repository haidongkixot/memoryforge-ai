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

export async function GET(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '25', 10))
    const gameId = searchParams.get('gameId') ?? undefined
    const skip = (page - 1) * limit

    const where = gameId ? { gameId } : {}

    const [sessions, total] = await Promise.all([
      prisma.gameSession.findMany({
        where,
        orderBy: { completedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          score: true,
          level: true,
          accuracy: true,
          duration: true,
          completedAt: true,
          user: {
            select: { name: true, email: true },
          },
          game: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.gameSession.count({ where }),
    ])

    return NextResponse.json({
      sessions,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
