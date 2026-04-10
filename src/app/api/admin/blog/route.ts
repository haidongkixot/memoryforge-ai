import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

// GET — list all blog posts (admin sees all statuses)
export async function GET() {
  try {
    await requireAdmin()
    const posts = await (prisma as any).blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

// POST — create a new blog post
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const data = await req.json()

    const post = await (prisma as any).blogPost.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt ?? null,
        body: data.body,
        coverImage: data.coverImage ?? null,
        tags: data.tags ?? [],
        status: data.status ?? 'draft',
        authorId: (session.user as any).id ?? null,
        publishedAt: data.status === 'published' ? new Date() : null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'A post with that slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

// PATCH — update a blog post
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const data = await req.json()
    const { id, ...updates } = data

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    if (updates.status === 'published') {
      const existing = await (prisma as any).blogPost.findUnique({ where: { id } })
      if (existing && !existing.publishedAt) {
        updates.publishedAt = new Date()
      }
    }

    const post = await (prisma as any).blogPost.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json(post)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

// DELETE — remove a blog post
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await (prisma as any).blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}
