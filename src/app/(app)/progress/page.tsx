'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'

export default function ProgressPage() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { fetch('/api/progress').then(r => r.json()).then(setData).catch(() => {}) }, [])

  if (!data) return <div className="text-[#6B7280] text-center py-12">Loading progress...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1f2937]">Your Progress</h1>
        <p className="text-[#6B7280] mt-1">Track your cognitive training journey</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Score', value: data.totalScore?.toLocaleString() || '0', color: 'text-[#6366f1]' },
          { label: 'Sessions', value: data.totalSessions || 0, color: 'text-[#6366f1]' },
          { label: 'Accuracy', value: `${data.avgAccuracy || 0}%`, color: 'text-green-500' },
          { label: 'Highest Level', value: data.highestLevel || 0, color: 'text-yellow-500' },
          { label: 'Streak', value: `${data.currentStreak || 0}d`, color: 'text-[#F97316]' },
          { label: 'Time', value: `${data.totalMinutes || 0}m`, color: 'text-[#5DEAEA]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#6B7280] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">Achievements</h2>
          {data.achievements?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {data.achievements.map((a: any) => (
                <div key={a.id} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3">
                  <div className="text-2xl">🏅</div>
                  <div>
                    <div className="text-sm font-medium text-[#1f2937]">{a.achievement}</div>
                    <div className="text-xs text-[#9CA3AF]">{new Date(a.unlockedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#9CA3AF] text-sm">Complete games to earn achievements!</p>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">Recent Sessions</h2>
          {data.recentSessions?.length > 0 ? (
            <div className="space-y-3">
              {data.recentSessions.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3">
                  <div>
                    <div className="text-sm font-medium text-[#1f2937]">{s.gameName}</div>
                    <div className="text-xs text-[#9CA3AF]">{s.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#6366f1]">{s.score} pts</div>
                    <div className="text-xs text-[#9CA3AF]">Lvl {s.level} · {s.accuracy}%</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#9CA3AF] text-sm">No sessions yet. Start playing!</p>
          )}
        </div>
      </div>
    </div>
  )
}
