import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canAccessChapter } from '@/lib/academy/access'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  try {
    const chapter = await prisma.academyChapter.findUnique({
      where: { slug: params.slug, isActive: true },
    })
    if (!chapter) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Plan gating — for now every logged-in user is "free"
    const userPlan = 'free'
    const hasAccess = canAccessChapter(userPlan, chapter.minPlanSlug)

    let progress = null
    if (userId) {
      progress = await prisma.userChapterProgress.findUnique({
        where: { userId_chapterId: { userId, chapterId: chapter.id } },
        select: { completed: true, quizScore: true, quizAnswers: true, completedAt: true },
      })
    }

    return NextResponse.json({
      ...chapter,
      hasAccess,
      progress,
      // Strip body if locked
      body: hasAccess ? chapter.body : chapter.body.slice(0, 300) + '...',
      quizData: hasAccess ? chapter.quizData : null,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
