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

  const { searchParams } = new URL(req.url)
  const gameId = searchParams.get('gameId')
  const contentType = searchParams.get('contentType')

  try {
    const where: Record<string, string> = {}
    if (gameId) where.gameId = gameId
    if (contentType) where.contentType = contentType

    const contents = await prisma.gameContent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { game: { select: { name: true, slug: true } } },
    })
    return NextResponse.json(contents)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { gameId, contentType, content, difficulty, label, isActive } = await req.json()
    if (!gameId || !contentType || !content) {
      return NextResponse.json({ error: 'Missing required fields: gameId, contentType, content' }, { status: 400 })
    }

    const created = await prisma.gameContent.create({
      data: {
        gameId,
        contentType,
        content,
        difficulty: difficulty || 'beginner',
        label: label || 'Default',
        isActive: isActive !== undefined ? isActive : true,
      },
    })
    return NextResponse.json(created)
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + String(err) }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const updated = await prisma.gameContent.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await prisma.gameContent.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
