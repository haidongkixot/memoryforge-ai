import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileClient from './profile-client'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id
  if (!session?.user || !sessionUserId) {
    redirect('/login?callbackUrl=/profile')
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      password: true,
      accounts: {
        select: { id: true, provider: true, providerAccountId: true },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        hasPassword: !!user.password,
        accounts: user.accounts.map((a) => ({
          id: a.id,
          provider: a.provider,
          providerAccountId: a.providerAccountId,
        })),
      }}
    />
  )
}
