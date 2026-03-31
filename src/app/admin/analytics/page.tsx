import { prisma } from '@/lib/prisma'

export default async function AdminAnalyticsPage() {
  const now = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [totalUsers, totalSessions, totalGames, recentUsers, topGames] = await Promise.all([
    prisma.user.count(),
    prisma.gameSession.count(),
    prisma.game.count({ where: { isActive: true } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 30, select: { createdAt: true } }),
    prisma.game.findMany({
      take: 8,
      where: { isActive: true },
      include: { _count: { select: { gameSessions: true } } },
      orderBy: { gameSessions: { _count: 'desc' } },
    }),
  ])

  const avgScoreResult = await prisma.gameSession.aggregate({ _avg: { score: true } })
  const avgScore = Math.round(avgScoreResult._avg.score ?? 0)

  const signupsPerDay = last7Days.map(d => ({
    label: `${d.getMonth() + 1}/${d.getDate()}`,
    count: recentUsers.filter(u => u.createdAt.toISOString().split('T')[0] === d.toISOString().split('T')[0]).length,
  }))

  const maxSignups = Math.max(...signupsPerDay.map(d => d.count), 1)
  const maxGame = Math.max(...topGames.map(g => g._count.gameSessions), 1)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Platform performance and usage metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, color: 'text-blue-400' },
          { label: 'Total Sessions', value: totalSessions, color: 'text-indigo-400' },
          { label: 'Active Games', value: totalGames, color: 'text-purple-400' },
          { label: 'Avg Score', value: avgScore.toLocaleString(), color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-6">New Signups — Last 7 Days</h2>
        <div className="flex items-end gap-3 h-32">
          {signupsPerDay.map(d => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-indigo-400 font-medium">{d.count}</span>
              <div className="w-full bg-indigo-600/60 rounded-t-sm min-h-[4px]" style={{ height: `${Math.max((d.count / maxSignups) * 100, 4)}px` }} />
              <span className="text-xs text-gray-500">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Most Played Games</h2>
        <div className="space-y-3">
          {topGames.map(g => (
            <div key={g.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{g.name}</span>
                <span className="text-indigo-400">{g._count.gameSessions} sessions</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(g._count.gameSessions / maxGame) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
