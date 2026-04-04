import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  try {
    const chapters = await prisma.academyChapter.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, slug: true, title: true, category: true,
        sortOrder: true, keyTakeaways: true, minPlanSlug: true,
        createdAt: true,
      },
    })

    // Attach user progress if logged in
    let progressMap: Record<string, { completed: boolean; quizScore: number | null }> = {}
    if (userId) {
      const progress = await prisma.userChapterProgress.findMany({
        where: { userId },
        select: { chapterId: true, completed: true, quizScore: true },
      })
      for (const p of progress) {
        progressMap[p.chapterId] = { completed: p.completed, quizScore: p.quizScore }
      }
    }

    const result = chapters.map((ch) => ({
      ...ch,
      progress: progressMap[ch.id] ?? null,
    }))

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
