'use client'
import { useEffect, useState } from 'react'

interface LeaderEntry {
  rank: number
  name: string
  totalXp: number
  level: number
  gamesPlayed: number
  avgAccuracy: number
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leaderboard?period=${period}`)
      .then((r) => r.json())
      .then((data) => setLeaders(data.leaders || []))
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false))
  }, [period])

  const medals = ['', '#FFD700', '#C0C0C0', '#CD7F32']

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 mt-1">Top memory athletes ranked by XP</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'month', 'week'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-indigo-500/50'
              }`}
            >
              {p === 'all' ? 'All Time' : p === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-900/50 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2 text-right">XP</div>
          <div className="col-span-2 text-right">Level</div>
          <div className="col-span-1 text-right hidden sm:block">Games</div>
          <div className="col-span-2 text-right hidden sm:block">Accuracy</div>
        </div>

        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-gray-800/50">
                <div className="h-5 bg-gray-800 rounded animate-pulse w-full" />
              </div>
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p className="text-lg mb-1">No entries yet</p>
            <p className="text-sm">Play some games to appear on the leaderboard!</p>
          </div>
        ) : (
          leaders.map((entry) => (
            <div
              key={entry.rank}
              className={`grid grid-cols-12 gap-2 px-6 py-4 border-b border-gray-800/50 items-center transition-colors hover:bg-gray-800/30 ${
                entry.rank <= 3 ? 'bg-gray-800/20' : ''
              }`}
            >
              <div className="col-span-1">
                {entry.rank <= 3 ? (
                  <span className="text-lg" style={{ color: medals[entry.rank] }}>
                    {entry.rank === 1 ? '1st' : entry.rank === 2 ? '2nd' : '3rd'}
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium">{entry.rank}</span>
                )}
              </div>
              <div className="col-span-4">
                <span className="text-white font-medium">{entry.name || 'Anonymous'}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-indigo-400 font-semibold">{entry.totalXp.toLocaleString()}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-gray-300">Lv. {entry.level}</span>
              </div>
              <div className="col-span-1 text-right hidden sm:block">
                <span className="text-gray-400">{entry.gamesPlayed}</span>
              </div>
              <div className="col-span-2 text-right hidden sm:block">
                <span className="text-gray-400">{entry.avgAccuracy}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
