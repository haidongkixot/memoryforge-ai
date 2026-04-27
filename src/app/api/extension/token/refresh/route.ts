import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
  generateToken,
  isAllowedExtensionId,
  isExtensionEnabled,
  sha256,
  extensionIpRateLimit,
} from '@/lib/extension-auth'
import { handlePreflight, jsonCors } from '@/lib/extension-cors'

export const dynamic = 'force-dynamic'

const MAX_BODY = 64 * 1024

const Body = z
  .object({
    refreshToken: z.string().regex(/^[A-Fa-f0-9]{64}$/),
  })
  .strict()

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req)
}

export async function POST(req: NextRequest) {
  if (!isExtensionEnabled()) {
    return jsonCors(req, { error: 'extension_disabled' }, { status: 503 })
  }
  const len = Number(req.headers.get('content-length') ?? '0')
  if (len > MAX_BODY) {
    return jsonCors(req, { error: 'payload_too_large' }, { status: 413 })
  }

  const extensionId = req.headers.get('x-extension-id')
  if (!extensionId || !isAllowedExtensionId(extensionId)) {
    return jsonCors(req, { error: 'extension_not_allowed' }, { status: 401 })
  }

  if (!extensionIpRateLimit('token-refresh', req)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return jsonCors(req, { error: 'invalid_json' }, { status: 400 })
  }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) {
    return jsonCors(req, { error: 'invalid_payload' }, { status: 400 })
  }

  const refreshHash = sha256(parsed.data.refreshToken)
  const row = await prisma.extensionToken.findUnique({ where: { refreshHash } })

  if (!row) {
    // Reuse detection: hash not found could mean replay of a rotated token.
    // We can't tie it to a userId, but treat as a hard error.
    return jsonCors(req, { error: 'invalid_refresh_token' }, { status: 401 })
  }

  if (row.revokedAt) {
    // Reuse detection: presented a refresh that was already rotated/revoked → revoke ALL for that user.
    await prisma.extensionToken.updateMany({
      where: { userId: row.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    return jsonCors(
      req,
      { error: 'refresh_reuse_detected', hint: 'All tokens revoked. Re-pair the extension.' },
      { status: 401 },
    )
  }

  if (row.refreshExpiresAt.getTime() < Date.now()) {
    return jsonCors(req, { error: 'refresh_expired' }, { status: 401 })
  }

  if (row.extensionId !== extensionId) {
    return jsonCors(req, { error: 'extension_id_mismatch' }, { status: 401 })
  }

  // Rotate both tokens. Mark old row as revoked (kept for reuse detection),
  // and create the new pair.
  const accessToken = generateToken()
  const refreshToken = generateToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ACCESS_TOKEN_TTL_MS)
  const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_TTL_MS)

  await prisma.$transaction([
    prisma.extensionToken.update({
      where: { id: row.id },
      data: { revokedAt: now },
    }),
    prisma.extensionToken.create({
      data: {
        userId: row.userId,
        tokenHash: sha256(accessToken),
        refreshHash: sha256(refreshToken),
        extensionId,
        userAgent: req.headers.get('user-agent') ?? row.userAgent,
        issuedAt: now,
        expiresAt,
        refreshExpiresAt,
      },
    }),
  ])

  return jsonCors(req, {
    accessToken,
    refreshToken,
    expiresAt: expiresAt.toISOString(),
    refreshExpiresAt: refreshExpiresAt.toISOString(),
    tokenType: 'Bearer',
  })
}
