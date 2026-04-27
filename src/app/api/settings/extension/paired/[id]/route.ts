import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!session?.user || !userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }
  const row = await prisma.extensionToken.findUnique({ where: { id: params.id } })
  if (!row || row.userId !== userId) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (!row.revokedAt) {
    await prisma.extensionToken.update({
      where: { id: row.id },
      data: { revokedAt: new Date() },
    })
  }
  return NextResponse.json({ ok: true })
}
