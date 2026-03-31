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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { gameSessions: true, achievements: true },
        },
      },
    })

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const gameSessions = await prisma.gameSession.findMany({
      where: { userId: params.id },
      orderBy: { completedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        score: true,
        level: true,
        accuracy: true,
        duration: true,
        movesCount: true,
        completedAt: true,
        game: {
          select: { name: true, slug: true, category: true },
        },
      },
    })

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: params.id },
      orderBy: { unlockedAt: 'desc' },
      select: {
        id: true,
        achievement: true,
        unlockedAt: true,
      },
    })

    return NextResponse.json({ user, gameSessions, achievements })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
