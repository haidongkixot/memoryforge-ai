import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const GOAL_MAP: Record<string, string> = {
  sharpen: 'Sharpen Memory',
  learn: 'Learn Faster',
  sharp: 'Stay Sharp',
  fun: 'Fun Challenge',
}

const PLAN_TEMPLATES: Record<string, Array<{ day: number; gameSlug: string; targetScore: number }>> = {
  sharpen: [
    { day: 1, gameSlug: 'card-match', targetScore: 500 },
    { day: 2, gameSlug: 'sequence-recall', targetScore: 400 },
    { day: 3, gameSlug: 'number-matrix', targetScore: 600 },
    { day: 4, gameSlug: 'card-match', targetScore: 600 },
    { day: 5, gameSlug: 'spatial-puzzle', targetScore: 500 },
    { day: 6, gameSlug: 'sequence-recall', targetScore: 500 },
    { day: 7, gameSlug: 'number-matrix', targetScore: 700 },
  ],
  learn: [
    { day: 1, gameSlug: 'word-association', targetScore: 400 },
    { day: 2, gameSlug: 'sequence-recall', targetScore: 400 },
    { day: 3, gameSlug: 'face-name', targetScore: 300 },
    { day: 4, gameSlug: 'word-association', targetScore: 500 },
    { day: 5, gameSlug: 'number-matrix', targetScore: 500 },
    { day: 6, gameSlug: 'face-name', targetScore: 400 },
    { day: 7, gameSlug: 'word-association', targetScore: 600 },
  ],
  sharp: [
    { day: 1, gameSlug: 'card-match', targetScore: 400 },
    { day: 2, gameSlug: 'word-association', targetScore: 400 },
    { day: 3, gameSlug: 'spatial-puzzle', targetScore: 400 },
    { day: 4, gameSlug: 'sequence-recall', targetScore: 400 },
    { day: 5, gameSlug: 'number-matrix', targetScore: 400 },
    { day: 6, gameSlug: 'face-name', targetScore: 300 },
    { day: 7, gameSlug: 'card-match', targetScore: 500 },
  ],
  fun: [
    { day: 1, gameSlug: 'card-match', targetScore: 300 },
    { day: 2, gameSlug: 'sequence-recall', targetScore: 300 },
    { day: 3, gameSlug: 'spatial-puzzle', targetScore: 300 },
    { day: 4, gameSlug: 'word-association', targetScore: 300 },
    { day: 5, gameSlug: 'face-name', targetScore: 200 },
    { day: 6, gameSlug: 'number-matrix', targetScore: 300 },
    { day: 7, gameSlug: 'card-match', targetScore: 400 },
  ],
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = (session.user as any).id
    const { goal, experience, preferredTime } = await req.json()

    const safeGoal = typeof goal === 'string' ? goal.slice(0, 50) : 'fun'
    const safeExperience = typeof experience === 'string' ? experience.slice(0, 50) : 'beginner'
    const safeTime = typeof preferredTime === 'string' ? preferredTime.slice(0, 10) : '10'

    // Store onboarding preferences in AppConfig
    await prisma.appConfig.upsert({
      where: { key: `onboarding_${userId}` },
      update: {
        value: { goal: safeGoal, experience: safeExperience, preferredTime: safeTime },
      },
      create: {
        key: `onboarding_${userId}`,
        label: 'User onboarding preferences',
        value: { goal: safeGoal, experience: safeExperience, preferredTime: safeTime },
      },
    })

    // Create a 7-day training plan based on goal
    const template = PLAN_TEMPLATES[safeGoal] || PLAN_TEMPLATES.fun
    const goalName = GOAL_MAP[safeGoal] || 'Memory Training'

    // Look up game IDs
    const games = await prisma.game.findMany({
      where: { slug: { in: template.map((t) => t.gameSlug) } },
      select: { id: true, slug: true },
    })
    const gameMap = new Map(games.map((g) => [g.slug, g.id]))

    // Deactivate any existing plan
    await prisma.trainingPlan.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'archived' },
    })

    // Create new plan
    const plan = await prisma.trainingPlan.create({
      data: {
        userId,
        name: `${goalName} - Week 1`,
        goal: goalName,
        status: 'active',
        endDate: new Date(Date.now() + 7 * 86_400_000),
        items: {
          create: template.map((t) => ({
            dayNumber: t.day,
            gameId: gameMap.get(t.gameSlug) || null,
            techniqueSlug: null,
            targetScore: t.targetScore,
          })),
        },
      },
    })

    // Initialize memory profiles if none exist
    const existingProfiles = await prisma.memoryProfile.count({ where: { userId } })
    if (existingProfiles === 0) {
      const types = ['visual', 'sequential', 'spatial', 'verbal', 'numerical']
      const baseScore = safeExperience === 'advanced' ? 60 : safeExperience === 'intermediate' ? 45 : 30
      await prisma.memoryProfile.createMany({
        data: types.map((t) => ({
          userId,
          memoryType: t,
          strengthScore: baseScore + Math.floor(Math.random() * 10),
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({ success: true, planId: plan.id })
  } catch (err) {
    console.error('Onboarding error:', err)
    return NextResponse.json({ error: 'Failed to save onboarding' }, { status: 500 })
  }
}
