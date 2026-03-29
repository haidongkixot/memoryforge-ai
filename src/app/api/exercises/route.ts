import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')

  try {
    if (slug) {
      const game = await prisma.game.findUnique({ where: { slug } })
      if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(game)
    }

    const where: any = { isActive: true }
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(games, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}