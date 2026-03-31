'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type UserDetail = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  createdAt: string
  updatedAt: string
  _count: { gameSessions: number; achievements: number }
}

type GameSession = {
  id: string
  score: number
  level: number
  accuracy: number
  duration: number
  movesCount: number
  completedAt: string
  game: { name: string; slug: string; category: string }
}

type Achievement = {
  id: string
  achievement: string
  unlockedAt: string
}

type UserData = {
  user: UserDetail
  gameSessions: GameSession[]
  achievements: Achievement[]
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'profile' | 'history'>('profile')

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <p className="text-gray-500">Loading user…</p>
      </div>
    )
  }

  if (!data?.user) {
    return (
      <div className="p-8">
        <p className="text-red-400">User not found.</p>
        <Link href="/admin/users" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">← Back to Users</Link>
      </div>
    )
  }

  const { user, gameSessions, achievements } = data

  const bestScore = gameSessions.length > 0 ? Math.max(...gameSessions.map((s) => s.score)) : 0
  const totalScore = gameSessions.reduce((acc, s) => acc + s.score, 0)
  const avgAccuracy =
    gameSessions.length > 0
      ? (gameSessions.reduce((acc, s) => acc + s.accuracy, 0) / gameSessions.length).toFixed(1)
      : '0.0'

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/users" className="hover:text-gray-300">Users</Link>
        <span>/</span>
        <span className="text-gray-300">{user.name ?? user.email}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-700 flex items-center justify-center text-xl font-bold text-white">
          {(user.name ?? user.email)[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{user.name ?? 'Unnamed'}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded text-xs font-medium ${
          user.role === 'admin' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-400'
        }`}>
          {user.role}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1 w-fit border border-gray-800">
        {(['profile', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t === 'history' ? 'Game History' : 'Profile'}
          </button>
        ))}
      </div>

      {/* Tab: Profile */}
      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">User Info</h2>
            <div className="space-y-3">
              {[
                { label: 'Name', value: user.name ?? '—' },
                { label: 'Email', value: user.email },
                { label: 'Role', value: user.role },
                { label: 'Joined', value: new Date(user.createdAt).toLocaleString() },
                { label: 'Updated', value: new Date(user.updatedAt).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-200 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Stats Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Sessions', value: user._count.gameSessions },
                { label: 'Best Score', value: bestScore.toLocaleString() },
                { label: 'Total Score', value: totalScore.toLocaleString() },
                { label: 'Avg Accuracy', value: `${avgAccuracy}%` },
                { label: 'Achievements', value: user._count.achievements },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3 lg:col-span-2">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Achievements</h2>
              <div className="flex flex-wrap gap-2">
                {achievements.map((a) => (
                  <span key={a.id} className="px-3 py-1 bg-amber-900/40 text-amber-400 rounded-full text-xs font-medium">
                    🏅 {a.achievement}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Game History */}
      {tab === 'history' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800/60 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Game</th>
                  <th className="px-6 py-3 text-left font-medium">Score</th>
                  <th className="px-6 py-3 text-left font-medium">Level</th>
                  <th className="px-6 py-3 text-left font-medium">Accuracy</th>
                  <th className="px-6 py-3 text-left font-medium">Duration</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {gameSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No sessions yet.</td>
                  </tr>
                ) : (
                  gameSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-white">{s.game.name}</p>
                        <p className="text-xs text-gray-500">{s.game.category}</p>
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
        </div>
      )}
    </div>
  )
}
