import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extensionRateLimit, verifyExtensionToken } from '@/lib/extension-auth'
import { handlePreflight, jsonCors } from '@/lib/extension-cors'

export const dynamic = 'force-dynamic'

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req)
}

export async function GET(req: NextRequest) {
  const auth = await verifyExtensionToken(req)
  if (!auth.ok) {
    return jsonCors(req, { error: auth.error, hint: auth.hint }, { status: auth.status })
  }
  if (!extensionRateLimit('stats-get', auth.ctx.userId)) {
    return jsonCors(req, { error: 'rate_limited' }, { status: 429 })
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  since.setUTCHours(0, 0, 0, 0)

  const sessions = await prisma.gameSession.findMany({
    where: { userId: auth.ctx.userId, completedAt: { gte: since } },
    select: { score: true, accuracy: true, completedAt: true },
  })

  // Bucket by UTC date (YYYY-MM-DD).
  const buckets = new Map<string, { sessionCount: number; scoreSum: number; accSum: number }>()
  // Pre-seed last 7 days so the sparkline always has 7 buckets.
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setUTCHours(0, 0, 0, 0)
    d.setUTCDate(d.getUTCDate() - i)
    buckets.set(d.toISOString().slice(0, 10), { sessionCount: 0, scoreSum: 0, accSum: 0 })
  }

  for (const s of sessions) {
    const key = s.completedAt.toISOString().slice(0, 10)
    const b = buckets.get(key)
    if (!b) continue
    b.sessionCount += 1
    b.scoreSum += s.score
    b.accSum += s.accuracy
  }

  const days = Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    sessionCount: b.sessionCount,
    avgScore: b.sessionCount ? Math.round(b.scoreSum / b.sessionCount) : 0,
    avgAccuracy:
      b.sessionCount ? Math.round((b.accSum / b.sessionCount) * 1000) / 1000 : 0,
  }))

  return jsonCors(req, { days })
}
