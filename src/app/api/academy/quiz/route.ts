import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { chapterId, answers } = await req.json()
    if (!chapterId || !answers) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const chapter = await prisma.academyChapter.findUnique({ where: { id: chapterId } })
    if (!chapter || !chapter.quizData) return NextResponse.json({ error: 'No quiz data' }, { status: 404 })

    const quiz = chapter.quizData as Array<{ question: string; options: string[]; correctIndex: number }>
    let correct = 0
    const results = quiz.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex
      if (isCorrect) correct++
      return { question: q.question, chosen: answers[i], correctIndex: q.correctIndex, isCorrect }
    })

    const score = Math.round((correct / quiz.length) * 100)

    await prisma.userChapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      create: { userId, chapterId, completed: true, completedAt: new Date(), quizScore: score, quizAnswers: results },
      update: { completed: true, completedAt: new Date(), quizScore: score, quizAnswers: results },
    })

    return NextResponse.json({ score, correct, total: quiz.length, results })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
