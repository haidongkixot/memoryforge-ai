import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { chapterId } = await req.json()
    if (!chapterId) return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 })

    const progress = await prisma.userChapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      create: { userId, chapterId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    })

    return NextResponse.json(progress)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
