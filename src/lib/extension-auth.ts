import { createHash, randomBytes } from 'crypto'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import { checkRateLimit } from './rate-limit'

/**
 * Per-user rate limit at 60 rpm per route.
 * Returns true if allowed, false if blocked.
 */
export function extensionRateLimit(routeKey: string, userId: string): boolean {
  return checkRateLimit(`extension:${routeKey}:${userId}`, 60, 60_000)
}

/**
 * Per-IP rate limit for unauthenticated routes (pair issuance, token issue).
 */
export function extensionIpRateLimit(routeKey: string, req: NextRequest): boolean {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  return checkRateLimit(`extension:${routeKey}:ip:${ip}`, 60, 60_000)
}

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function generatePairingCode(): string {
  // 6-digit numeric code, leading zeros preserved.
  const n = Math.floor(Math.random() * 1_000_000)
  return n.toString().padStart(6, '0')
}

export function generateToken(): string {
  // 32-byte hex (64 chars)
  return randomBytes(32).toString('hex')
}

export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000 // 15 min
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
export const PAIRING_CODE_TTL_MS = 120 * 1000 // 120s

export function isExtensionEnabled(): boolean {
  return process.env.EXTENSION_ENABLED === 'true'
}

export function getAllowedExtensionIds(): string[] {
  return (process.env.EXTENSION_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function isAllowedExtensionId(id: string | null | undefined): boolean {
  if (!id) return false
  const allow = getAllowedExtensionIds()
  // If no allowlist configured, deny all (fail closed) unless dev (no env at all).
  if (allow.length === 0) return false
  return allow.includes(id)
}

export interface ExtensionAuthContext {
  userId: string
  tokenId: string
  extensionId: string
}

export type ExtensionAuthResult =
  | { ok: true; ctx: ExtensionAuthContext }
  | { ok: false; status: number; error: string; hint?: string }

/**
 * Validates Bearer token + X-Extension-Id header against ExtensionToken table.
 * Returns context on success, otherwise an error to send back.
 */
export async function verifyExtensionToken(req: NextRequest): Promise<ExtensionAuthResult> {
  if (!isExtensionEnabled()) {
    return { ok: false, status: 503, error: 'extension_disabled', hint: 'Extension feature is currently disabled.' }
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const m = /^Bearer\s+([A-Fa-f0-9]{32,256})$/.exec(authHeader)
  if (!m) {
    return { ok: false, status: 401, error: 'missing_or_malformed_token' }
  }
  const token = m[1]

  const extensionId = req.headers.get('x-extension-id')
  if (!extensionId) {
    return { ok: false, status: 401, error: 'missing_extension_id' }
  }
  if (!isAllowedExtensionId(extensionId)) {
    return { ok: false, status: 401, error: 'extension_not_allowed' }
  }

  const tokenHash = sha256(token)
  const row = await prisma.extensionToken.findUnique({ where: { tokenHash } })
  if (!row) {
    return { ok: false, status: 401, error: 'invalid_token' }
  }
  if (row.revokedAt) {
    return { ok: false, status: 401, error: 'token_revoked' }
  }
  if (row.expiresAt.getTime() < Date.now()) {
    return { ok: false, status: 401, error: 'token_expired', hint: 'Refresh the access token.' }
  }
  if (row.extensionId !== extensionId) {
    return { ok: false, status: 401, error: 'extension_id_mismatch' }
  }

  // best-effort lastUsedAt update; do not block on failure
  prisma.extensionToken
    .update({ where: { id: row.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {})

  return { ok: true, ctx: { userId: row.userId, tokenId: row.id, extensionId } }
}
