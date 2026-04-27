import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { extensionRateLimit, verifyExtensionToken } from '@/lib/extension-auth'
import { handlePreflight, jsonCors } from '@/lib/extension-cors'

export const dynamic = 'force-dynamic'

const MAX_BODY = 64 * 1024

const Body = z
  .object({
    all: z.boolean().optional(),
  })
  .strict()

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req)
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

  if (!extensionRateLimit('token-revoke', auth.ctx.userId)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  let raw: unknown = {}
  if (len > 0) {
    try {
      raw = await req.json()
    } catch {
      return jsonCors(req, { error: 'invalid_json' }, { status: 400 })
    }
  }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) {
    return jsonCors(req, { error: 'invalid_payload' }, { status: 400 })
  }

  const now = new Date()
  if (parsed.data.all) {
    const result = await prisma.extensionToken.updateMany({
      where: { userId: auth.ctx.userId, revokedAt: null },
      data: { revokedAt: now },
    })
    return jsonCors(req, { revoked: result.count, scope: 'all' })
  }

  await prisma.extensionToken.update({
    where: { id: auth.ctx.tokenId },
    data: { revokedAt: now },
  })
  return jsonCors(req, { revoked: 1, scope: 'current' })
}
