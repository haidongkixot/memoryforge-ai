import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Tile {
  href: string
  title: string
  description: string
  icon: string
}

const TILES: Tile[] = [
  {
    href: '/profile',
    title: 'Profile',
    description: 'Manage your name, password, and account.',
    icon: 'P',
  },
  {
    href: '/settings/referral',
    title: 'Referral',
    description: 'Invite friends and earn free Pro months.',
    icon: 'R',
  },
  {
    href: '/settings/extension',
    title: 'Extension',
    description: 'Pair the MemoryForge Chrome extension.',
    icon: 'E',
  },
]

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login?callbackUrl=/settings')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#593CC8]">Settings</h1>
        <p className="text-[#6B7280] mt-1">Manage your account, referrals, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#E0E7FF] transition group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#593CC8] flex items-center justify-center text-white font-bold shrink-0">
                {tile.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[#1f2937] group-hover:text-[#593CC8] transition">
                  {tile.title}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">{tile.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
