import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const Body = z.object({ syncGames: z.boolean() }).strict()

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!session?.user || !userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }
  const prefs = await prisma.extensionPreferences.findUnique({ where: { userId } })
  return NextResponse.json({
    syncGames: prefs?.syncGames ?? false,
    updatedAt: prefs?.updatedAt?.toISOString() ?? null,
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!session?.user || !userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }
  const prefs = await prisma.extensionPreferences.upsert({
    where: { userId },
    create: { userId, syncGames: parsed.data.syncGames },
    update: { syncGames: parsed.data.syncGames },
  })
  return NextResponse.json({
    syncGames: prefs.syncGames,
    updatedAt: prefs.updatedAt.toISOString(),
  })
}
