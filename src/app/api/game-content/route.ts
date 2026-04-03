import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const gameId = searchParams.get('gameId')
  const contentType = searchParams.get('contentType')
  const difficulty = searchParams.get('difficulty')

  if (!gameId || !contentType) {
    return NextResponse.json(null)
  }

  try {
    const where: Record<string, unknown> = {
      gameId,
      contentType,
      isActive: true,
    }
    if (difficulty) where.difficulty = difficulty

    // Get all matching content packs, pick one at random
    const contents = await prisma.gameContent.findMany({ where })

    if (contents.length === 0) {
      return NextResponse.json(null)
    }

    // Return a random content pack
    const picked = contents[Math.floor(Math.random() * contents.length)]
    return NextResponse.json(picked)
  } catch {
    return NextResponse.json(null)
  }
}
