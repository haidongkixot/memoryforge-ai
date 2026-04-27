import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { extensionRateLimit, verifyExtensionToken } from '@/lib/extension-auth'
import { handlePreflight, jsonCors } from '@/lib/extension-cors'

export const dynamic = 'force-dynamic'

const MAX_BODY = 64 * 1024

const PutBody = z
  .object({
    syncGames: z.boolean(),
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
  if (!extensionRateLimit('preferences-get', auth.ctx.userId)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  const prefs = await prisma.extensionPreferences.findUnique({
    where: { userId: auth.ctx.userId },
  })
  return jsonCors(req, {
    syncGames: prefs?.syncGames ?? false,
    updatedAt: prefs?.updatedAt?.toISOString() ?? null,
  })
}

export async function PUT(req: NextRequest) {
  const len = Number(req.headers.get('content-length') ?? '0')
  if (len > MAX_BODY) {
    return jsonCors(req, { error: 'payload_too_large' }, { status: 413 })
  }

  const auth = await verifyExtensionToken(req)
  if (!auth.ok) {
    return jsonCors(req, { error: auth.error, hint: auth.hint }, { status: auth.status })
  }
  if (!extensionRateLimit('preferences-put', auth.ctx.userId)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return jsonCors(req, { error: 'invalid_json' }, { status: 400 })
  }
  const parsed = PutBody.safeParse(raw)
  if (!parsed.success) {
    return jsonCors(req, { error: 'invalid_payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const prefs = await prisma.extensionPreferences.upsert({
    where: { userId: auth.ctx.userId },
    create: { userId: auth.ctx.userId, syncGames: parsed.data.syncGames },
    update: { syncGames: parsed.data.syncGames },
  })

  return jsonCors(req, { syncGames: prefs.syncGames, updatedAt: prefs.updatedAt.toISOString() })
}
