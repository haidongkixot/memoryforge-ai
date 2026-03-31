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
    const games = await prisma.game.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        difficulty: true,
        gameType: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        _count: {
          select: { gameSessions: true },
        },
      },
    })
    return NextResponse.json(games)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { id, isActive } = await req.json()
    if (!id || isActive === undefined) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const game = await prisma.game.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, isActive: true },
    })
    return NextResponse.json(game)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
