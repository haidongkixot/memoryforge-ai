import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(200),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  })
  if (!user || !user.password) {
    return NextResponse.json(
      { error: 'No password set for this account' },
      { status: 400 }
    )
  }

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!ok) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }

  const hash = await bcrypt.hash(parsed.data.newPassword, 12)
  await prisma.user.update({ where: { id: userId }, data: { password: hash } })

  return NextResponse.json({ ok: true })
}
