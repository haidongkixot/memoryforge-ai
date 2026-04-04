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
    const chapters = await prisma.academyChapter.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, slug: true, title: true, category: true,
        sortOrder: true, minPlanSlug: true, isActive: true,
        createdAt: true, updatedAt: true,
        _count: { select: { progress: true } },
      },
    })
    return NextResponse.json(chapters)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const data = await req.json()
    const chapter = await prisma.academyChapter.create({
      data: {
        slug: data.slug,
        title: data.title,
        body: data.body,
        category: data.category,
        sortOrder: data.sortOrder ?? 0,
        keyTakeaways: data.keyTakeaways ?? [],
        minPlanSlug: data.minPlanSlug ?? 'free',
        quizData: data.quizData ?? null,
        isActive: data.isActive ?? true,
      },
    })
    return NextResponse.json(chapter)
  } catch (err: any) {
    if (err?.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const chapter = await prisma.academyChapter.update({
      where: { id },
      data,
    })
    return NextResponse.json(chapter)
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

    await prisma.academyChapter.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
