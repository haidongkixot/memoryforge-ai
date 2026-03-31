'use client'

import { useEffect, useState } from 'react'

type Game = {
  id: string
  name: string
  slug: string
  category: string
  difficulty: string
  gameType: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  _count: { gameSessions: number }
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-900/40 text-green-400',
  intermediate: 'bg-yellow-900/40 text-yellow-400',
  advanced: 'bg-red-900/40 text-red-400',
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchGames = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/games')
      const data = await res.json()
      setGames(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  const toggleActive = async (gameId: string, current: boolean) => {
    setActionLoading(gameId)
    try {
      await fetch('/api/admin/games', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId, isActive: !current }),
      })
      await fetchGames()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Games</h1>
        <p className="text-gray-400 text-sm mt-1">{games.length} games in catalog</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-left font-medium">Difficulty</th>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Sessions</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading games…</td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No games found.</td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-white">{game.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{game.slug}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-300 capitalize">{game.category}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        difficultyColors[game.difficulty] ?? 'bg-gray-800 text-gray-400'
                      }`}>
                        {game.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 capitalize">{game.gameType}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        game.isActive ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {game.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-300 font-medium">{game._count.gameSessions}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => toggleActive(game.id, game.isActive)}
                        disabled={actionLoading === game.id}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                          game.isActive
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                            : 'bg-green-900/40 text-green-400 hover:bg-green-900/70'
                        }`}
                      >
                        {actionLoading === game.id ? '…' : game.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
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
