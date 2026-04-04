import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Providers from '@/components/providers'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/games', label: 'Games', icon: '🎮' },
  { href: '/admin/sessions', label: 'Sessions', icon: '📋' },
  { href: '/admin/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/plans', label: 'Plans', icon: '💳' },
  { href: '/admin/academy', label: 'Academy', icon: '🎓' },
  { href: '/admin/cms', label: 'Blog / CMS', icon: '📝' },
  { href: '/admin/ai-config', label: 'AI Config', icon: '🤖' },
  { href: '/admin/ai-logs', label: 'AI Logs', icon: '📋' },
  { href: '/admin/logs', label: 'System Logs', icon: '🔍' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'admin') redirect('/')

  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-950 text-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">
              🧠
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">MemoryForge</p>
              <p className="text-xs text-indigo-400 font-semibold tracking-wide">ADMIN PANEL</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                {(session.user?.name ?? session.user?.email ?? 'A')[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-gray-300 truncate">{session.user?.name ?? 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </Providers>
  )
}
