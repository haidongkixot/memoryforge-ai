import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  generatePairingCode,
  isExtensionEnabled,
  PAIRING_CODE_TTL_MS,
  extensionRateLimit,
} from '@/lib/extension-auth'

export const dynamic = 'force-dynamic'

const MAX_BODY = 64 * 1024

export async function POST(req: NextRequest) {
  if (!isExtensionEnabled()) {
    return NextResponse.json({ error: 'extension_disabled' }, { status: 503 })
  }

  // Hard payload cap
  const len = Number(req.headers.get('content-length') ?? '0')
  if (len > MAX_BODY) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 })
  }

  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!session?.user || !userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  if (!extensionRateLimit('pair', userId)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  // Generate a unique 6-digit code (retry a few times on collision).
  let code = ''
  let attempts = 0
  const expiresAt = new Date(Date.now() + PAIRING_CODE_TTL_MS)
  while (attempts < 6) {
    code = generatePairingCode()
    try {
      // If code already exists, replace it ONLY if it's expired or owned by this user.
      const existing = await prisma.extensionPairingCode.findUnique({ where: { code } })
      if (existing) {
        if (existing.userId === userId || existing.expiresAt.getTime() < Date.now()) {
          await prisma.extensionPairingCode.delete({ where: { code } })
        } else {
          attempts++
          continue
        }
      }
      // Best-effort: clean up this user's expired/older codes to avoid bloat.
      await prisma.extensionPairingCode.deleteMany({
        where: { userId, OR: [{ expiresAt: { lt: new Date() } }] },
      })
      await prisma.extensionPairingCode.create({ data: { code, userId, expiresAt } })
      break
    } catch {
      attempts++
    }
  }
  if (!code) {
    return NextResponse.json({ error: 'could_not_allocate_code' }, { status: 500 })
  }

  return NextResponse.json({
    code,
    expiresAt: expiresAt.toISOString(),
    expiresInSeconds: Math.floor(PAIRING_CODE_TTL_MS / 1000),
  })
}
