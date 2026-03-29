'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'

export default function ProgressPage() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { fetch('/api/progress').then(r => r.json()).then(setData).catch(() => {}) }, [])

  if (!data) return <div className="text-gray-400 text-center py-12">Loading progress...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Progress</h1>
        <p className="text-gray-400 mt-1">Track your cognitive training journey</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Score', value: data.totalScore?.toLocaleString() || '0', color: 'text-indigo-400' },
          { label: 'Sessions', value: data.totalSessions || 0, color: 'text-indigo-400' },
          { label: 'Accuracy', value: `${data.avgAccuracy || 0}%`, color: 'text-green-400' },
          { label: 'Highest Level', value: data.highestLevel || 0, color: 'text-yellow-400' },
          { label: 'Streak', value: `${data.currentStreak || 0}d`, color: 'text-red-400' },
          { label: 'Time', value: `${data.totalMinutes || 0}m`, color: 'text-cyan-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
          {data.achievements?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {data.achievements.map((a: any) => (
                <div key={a.id} className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                  <div className="text-2xl">🏅</div>
                  <div>
                    <div className="text-sm font-medium text-white">{a.achievement}</div>
                    <div className="text-xs text-gray-400">{new Date(a.unlockedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Complete games to earn achievements!</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Sessions</h2>
          {data.recentSessions?.length > 0 ? (
            <div className="space-y-3">
              {data.recentSessions.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                  <div>
                    <div className="text-sm font-medium text-white">{s.gameName}</div>
                    <div className="text-xs text-gray-400">{s.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-indigo-400">{s.score} pts</div>
                    <div className="text-xs text-gray-400">Lvl {s.level} · {s.accuracy}%</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sessions yet. Start playing!</p>
          )}
        </div>
      </div>
    </div>
  )
}