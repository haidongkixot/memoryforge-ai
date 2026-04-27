import { NextRequest, NextResponse } from 'next/server'
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
    extensionId: z.string().min(8).max(64),
    pairingCode: z
      .string()
      .regex(/^\d{6}$/, 'pairingCode must be 6 digits'),
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

  if (!extensionIpRateLimit('token-issue', req)) {
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
    return jsonCors(req, { error: 'invalid_payload', details: parsed.error.flatten() }, { status: 400 })
  }
  const { extensionId, pairingCode } = parsed.data

  if (!isAllowedExtensionId(extensionId)) {
    return jsonCors(req, { error: 'extension_not_allowed' }, { status: 401 })
  }

  // Single-use: delete on lookup regardless of validity.
  let codeRow
  try {
    codeRow = await prisma.extensionPairingCode.delete({ where: { code: pairingCode } })
  } catch {
    return jsonCors(req, { error: 'invalid_pairing_code' }, { status: 400 })
  }

  if (codeRow.expiresAt.getTime() < Date.now()) {
    return jsonCors(req, { error: 'pairing_code_expired' }, { status: 400 })
  }

  const accessToken = generateToken()
  const refreshToken = generateToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ACCESS_TOKEN_TTL_MS)
  const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_TTL_MS)

  await prisma.extensionToken.create({
    data: {
      userId: codeRow.userId,
      tokenHash: sha256(accessToken),
      refreshHash: sha256(refreshToken),
      extensionId,
      userAgent: req.headers.get('user-agent') ?? null,
      issuedAt: now,
      expiresAt,
      refreshExpiresAt,
    },
  })

  return jsonCors(req, {
    accessToken,
    refreshToken,
    expiresAt: expiresAt.toISOString(),
    refreshExpiresAt: refreshExpiresAt.toISOString(),
    tokenType: 'Bearer',
  })
}
