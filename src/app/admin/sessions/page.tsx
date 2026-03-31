'use client'

import { useEffect, useState } from 'react'

type GameSession = {
  id: string
  score: number
  level: number
  accuracy: number
  duration: number
  completedAt: string
  user: { name: string | null; email: string }
  game: { name: string; slug: string }
}

type SessionsResponse = {
  sessions: GameSession[]
  total: number
  totalPages: number
}

export default function AdminSessionsPage() {
  const [data, setData] = useState<SessionsResponse>({ sessions: [], total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [gameFilter, setGameFilter] = useState('')
  const [games, setGames] = useState<{ id: string; name: string; slug: string }[]>([])

  useEffect(() => {
    fetch('/api/admin/games')
      .then((r) => r.json())
      .then((d) => setGames(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25' })
    if (gameFilter) params.set('gameId', gameFilter)
    fetch(`/api/admin/sessions?${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [page, gameFilter])

  const handleGameFilter = (value: string) => {
    setGameFilter(value)
    setPage(1)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-gray-400 text-sm mt-1">{data.total.toLocaleString()} total sessions</p>
        </div>
        <select
          value={gameFilter}
          onChange={(e) => handleGameFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Games</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">User</th>
                <th className="px-6 py-3 text-left font-medium">Game</th>
                <th className="px-6 py-3 text-left font-medium">Score</th>
                <th className="px-6 py-3 text-left font-medium">Level</th>
                <th className="px-6 py-3 text-left font-medium">Accuracy</th>
                <th className="px-6 py-3 text-left font-medium">Duration</th>
                <th className="px-6 py-3 text-left font-medium">Completed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading sessions…</td>
                </tr>
              ) : data.sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No sessions found.</td>
                </tr>
              ) : (
                data.sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-white">{s.user.name ?? 'Unnamed'}</p>
                      <p className="text-xs text-gray-500">{s.user.email}</p>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-gray-200">{s.game.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{s.game.slug}</p>
                    </td>
                    <td className="px-6 py-3 font-semibold text-indigo-400">{s.score.toLocaleString()}</td>
                    <td className="px-6 py-3 text-gray-300">{s.level}</td>
                    <td className="px-6 py-3 text-gray-300">{s.accuracy.toFixed(1)}%</td>
                    <td className="px-6 py-3 text-gray-300">{s.duration}s</td>
                    <td className="px-6 py-3 text-gray-500">{new Date(s.completedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-3 py-1 rounded text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
