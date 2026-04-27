import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!session?.user || !userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }
  const tokens = await prisma.extensionToken.findMany({
    where: { userId, revokedAt: null },
    select: {
      id: true,
      extensionId: true,
      userAgent: true,
      issuedAt: true,
      expiresAt: true,
      lastUsedAt: true,
    },
    orderBy: { issuedAt: 'desc' },
  })
  return NextResponse.json({
    tokens: tokens.map((t) => ({
      id: t.id,
      extensionId: t.extensionId,
      userAgent: t.userAgent,
      issuedAt: t.issuedAt.toISOString(),
      expiresAt: t.expiresAt.toISOString(),
      lastUsedAt: t.lastUsedAt?.toISOString() ?? null,
    })),
  })
}
