import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [totalUsers, totalGames, totalSessions, topPlayers, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.game.count(),
    prisma.gameSession.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { gameSessions: { _count: 'desc' } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: { select: { gameSessions: true } },
      },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { gameSessions: true } },
      },
    }),
  ])

  const avgScoreResult = await prisma.gameSession.aggregate({ _avg: { score: true } })
  const avgScore = Math.round(avgScoreResult._avg.score ?? 0)

  const stats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: '👥', color: 'bg-blue-600' },
    { label: 'Total Games', value: totalGames.toLocaleString(), icon: '🎮', color: 'bg-purple-600' },
    { label: 'Total Sessions', value: totalSessions.toLocaleString(), icon: '📋', color: 'bg-indigo-600' },
    { label: 'Avg Score', value: avgScore.toLocaleString(), icon: '⭐', color: 'bg-amber-600' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">MemoryForge AI — platform overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Players */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">Top Players</h2>
            <Link href="/admin/leaderboard" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {topPlayers.map((player, i) => (
              <div key={player.id} className="px-6 py-3 flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-gray-500">#{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {(player.name ?? player.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{player.name ?? 'Unnamed'}</p>
                  <p className="text-xs text-gray-500 truncate">{player.email}</p>
                </div>
                <span className="text-sm font-semibold text-indigo-400">{player._count.gameSessions} sessions</span>
              </div>
            ))}
            {topPlayers.length === 0 && (
              <p className="px-6 py-4 text-sm text-gray-500">No players yet.</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">User</th>
                  <th className="px-6 py-3 text-left font-medium">Role</th>
                  <th className="px-6 py-3 text-left font-medium">Sessions</th>
                  <th className="px-6 py-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/admin/users/${user.id}`} className="hover:text-indigo-400 transition-colors">
                        <p className="font-medium text-white">{user.name ?? 'Unnamed'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-300">{user._count.gameSessions}</td>
                    <td className="px-6 py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-4 text-gray-500 text-center">No users yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
