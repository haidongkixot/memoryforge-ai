'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalSessions: number
  totalMinutes: number
  avgAccuracy: number
  highestLevel: number
  totalScore: number
  currentStreak: number
  favoriteCategory: string
  recentSessions: any[]
}

const defaultStats: Stats = {
  totalSessions: 0,
  totalMinutes: 0,
  avgAccuracy: 0,
  highestLevel: 0,
  totalScore: 0,
  currentStreak: 0,
  favoriteCategory: 'none',
  recentSessions: [],
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/progress')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then(data => {
        setStats({
          totalSessions: Number(data?.totalSessions) || 0,
          totalMinutes: Number(data?.totalMinutes) || 0,
          avgAccuracy: Number(data?.avgAccuracy) || 0,
          highestLevel: Number(data?.highestLevel) || 0,
          totalScore: Number(data?.totalScore) || 0,
          currentStreak: Number(data?.currentStreak) || 0,
          favoriteCategory: String(data?.favoriteCategory || 'none'),
          recentSessions: Array.isArray(data?.recentSessions) ? data.recentSessions : [],
        })
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const statCards = [
    { label: 'Total Score', value: stats.totalScore.toLocaleString(), icon: '🏆' },
    { label: 'Sessions', value: stats.totalSessions, icon: '🎮' },
    { label: 'Avg Accuracy', value: `${stats.avgAccuracy}%`, icon: '🎯' },
    { label: 'Streak', value: `${stats.currentStreak} days`, icon: '🔥' },
    { label: 'Highest Level', value: stats.highestLevel, icon: '⬆️' },
    { label: 'Training Time', value: `${stats.totalMinutes} min`, icon: '⏱️' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#593CC8]">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Your cognitive training overview</p>
      </div>

      {!loaded ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map(s => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-[#593CC8]">{s.value}</div>
                <div className="text-xs text-[#6B7280]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#593CC8] mb-4">Quick Play</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Card Match', slug: 'card-match', icon: '🃏' },
                  { name: 'Sequence', slug: 'sequence-recall', icon: '🔢' },
                  { name: 'N-Back', slug: 'n-back', icon: '🧠' },
                  { name: 'Speed Sort', slug: 'speed-sort', icon: '⚡' },
                ].map(g => (
                  <Link key={g.slug} href={`/practice/${g.slug}`}
                    className="bg-[#F8F9FE] hover:bg-[#593CC8]/5 border border-gray-100 hover:border-[#593CC8]/30 rounded-2xl p-4 transition-all">
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className="text-sm font-medium text-[#1f2937]">{g.name}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#593CC8] mb-4">Recent Activity</h2>
              {stats.recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentSessions.slice(0, 5).map((s: any, idx: number) => (
                    <div key={s?.id ?? idx} className="flex items-center justify-between text-sm">
                      <span className="text-[#4B5563]">{s?.gameName ?? 'Unknown'}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#593CC8] font-medium">Score: {s?.score ?? 0}</span>
                        <span className="text-[#9CA3AF]">{s?.completedAt ? new Date(s.completedAt).toLocaleDateString() : '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#6B7280] text-sm">No sessions yet. Start a game to begin tracking!</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="flex gap-4">
        <Link href="/library" className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-[0_4px_15px_rgba(89,60,200,0.25)]">
          Browse All Games
        </Link>
        <Link href="/progress" className="border border-gray-200 hover:border-[#593CC8]/50 text-[#6B7280] hover:text-[#593CC8] px-6 py-3 rounded-full transition-colors font-medium">
          View Progress
        </Link>
        <Link href="/settings/referral" className="bg-[#593CC8]/10 hover:bg-[#593CC8]/20 border border-[#593CC8]/30 text-[#593CC8] px-6 py-3 rounded-full transition-colors font-medium flex items-center gap-2">
          🎁 Invite Friends
        </Link>
      </div>
    </div>
  )
}
