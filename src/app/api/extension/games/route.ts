import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { extensionRateLimit, verifyExtensionToken } from '@/lib/extension-auth'
import { handlePreflight, jsonCors } from '@/lib/extension-cors'

export const dynamic = 'force-dynamic'

const MAX_BODY = 64 * 1024

// Quick games for the extension: short loops, <= 3 minutes.
const QUICK_GAME_SLUGS = ['card-match', 'sequence-recall', 'pattern-recall', 'lightning-tap'] as const

const PostBody = z
  .object({
    gameSlug: z.enum(QUICK_GAME_SLUGS),
    score: z.number().int().min(0).max(1_000_000),
    accuracy: z.number().min(0).max(1),
    durationMs: z.number().int().min(0).max(10 * 60 * 1000),
    level: z.number().int().min(1).max(100),
  })
  .strict()

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req)
}

export async function GET(req: NextRequest) {
  const auth = await verifyExtensionToken(req)
  if (!auth.ok) {
    return jsonCors(req, { error: auth.error, hint: auth.hint }, { status: auth.status })
  }
  if (!extensionRateLimit('games-get', auth.ctx.userId)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  const games = await prisma.game.findMany({
    where: { slug: { in: QUICK_GAME_SLUGS as unknown as string[] }, isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      gameType: true,
      gridSize: true,
      timeLimit: true,
    },
    orderBy: { sortOrder: 'asc' },
  })

  return jsonCors(req, { games })
}

export async function POST(req: NextRequest) {
  const len = Number(req.headers.get('content-length') ?? '0')
  if (len > MAX_BODY) {
    return jsonCors(req, { error: 'payload_too_large' }, { status: 413 })
  }

  const auth = await verifyExtensionToken(req)
  if (!auth.ok) {
    return jsonCors(req, { error: auth.error, hint: auth.hint }, { status: auth.status })
  }
  if (!extensionRateLimit('games-post', auth.ctx.userId)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return jsonCors(req, { error: 'invalid_json' }, { status: 400 })
  }
  const parsed = PostBody.safeParse(raw)
  if (!parsed.success) {
    return jsonCors(
      req,
      { error: 'invalid_payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  // Opt-in gate
  const prefs = await prisma.extensionPreferences.findUnique({
    where: { userId: auth.ctx.userId },
  })
  if (!prefs?.syncGames) {
    return jsonCors(
      req,
      {
        error: 'sync_disabled',
        hint: 'Enable "Sync games to my account" in extension preferences to save sessions.',
      },
      { status: 403 },
    )
  }

  const game = await prisma.game.findUnique({
    where: { slug: parsed.data.gameSlug },
    select: { id: true },
  })
  if (!game) {
    return jsonCors(req, { error: 'game_not_found' }, { status: 404 })
  }

  const session = await prisma.gameSession.create({
    data: {
      userId: auth.ctx.userId,
      gameId: game.id,
      score: parsed.data.score,
      level: parsed.data.level,
      accuracy: parsed.data.accuracy,
      duration: Math.round(parsed.data.durationMs / 1000),
    },
    select: { id: true, completedAt: true, score: true, accuracy: true },
  })

  return jsonCors(req, {
    sessionId: session.id,
    completedAt: session.completedAt.toISOString(),
    score: session.score,
    accuracy: session.accuracy,
  })
}
