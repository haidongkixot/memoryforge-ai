'use client'

import { useEffect, useState } from 'react'

type LeaderboardEntry = {
  rank: number
  id: string
  name: string | null
  email: string
  role: string
  totalSessions: number
  bestScore: number
  totalScore: number
}

const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600']
const rankIcons = ['🥇', '🥈', '🥉']

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/leaderboard')
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-gray-400 text-sm mt-1">Top 20 players by total sessions</p>
      </div>

      {/* Top 3 Podium */}
      {!loading && entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
            const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
            return (
              <div
                key={entry.id}
                className={`bg-gray-900 rounded-xl border p-5 text-center ${
                  actualRank === 1 ? 'border-yellow-700/50 ring-1 ring-yellow-700/30' : 'border-gray-800'
                }`}
              >
                <p className="text-3xl mb-2">{rankIcons[actualRank - 1]}</p>
                <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold text-white mx-auto mb-2">
                  {(entry.name ?? entry.email)[0].toUpperCase()}
                </div>
                <p className="font-semibold text-white text-sm truncate">{entry.name ?? 'Unnamed'}</p>
                <p className="text-xs text-gray-500 truncate">{entry.email}</p>
                <p className="text-lg font-bold text-indigo-400 mt-2">{entry.totalSessions}</p>
                <p className="text-xs text-gray-500">sessions</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium w-16">Rank</th>
                <th className="px-6 py-3 text-left font-medium">Player</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Sessions</th>
                <th className="px-6 py-3 text-left font-medium">Best Score</th>
                <th className="px-6 py-3 text-left font-medium">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading leaderboard…</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No data yet.</td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-3">
                      <span className={`font-bold text-base ${rankColors[entry.rank - 1] ?? 'text-gray-400'}`}>
                        {entry.rank <= 3 ? rankIcons[entry.rank - 1] : `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {(entry.name ?? entry.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{entry.name ?? 'Unnamed'}</p>
                          <p className="text-xs text-gray-500">{entry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        entry.role === 'admin' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {entry.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-indigo-400">{entry.totalSessions.toLocaleString()}</td>
                    <td className="px-6 py-3 text-amber-400 font-medium">{entry.bestScore.toLocaleString()}</td>
                    <td className="px-6 py-3 text-gray-300">{entry.totalScore.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
