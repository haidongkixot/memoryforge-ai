'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface GamStats {
  xp: number; level: number; xpInCurrentLevel: number; xpForNextLevel: number; progressPercent: number; currentStreak: number
}

export default function GamificationBar() {
  const [stats, setStats] = useState<GamStats | null>(null)

  useEffect(() => {
    fetch('/api/gamification')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then(d => { if (d?.level) setStats(d) })
      .catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <div className="bg-white border-b border-[#E5E7EB] px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] border border-[#6366f1]/30 flex items-center justify-center">
            <span className="text-[#6366f1] font-bold text-xs">{stats.level}</span>
          </div>
          <span className="text-[#6B7280] text-xs hidden sm:block">Level {stats.level}</span>
        </div>
        <div className="flex-1 max-w-xs flex items-center gap-2">
          <span className="text-[#6B7280] text-xs whitespace-nowrap">{stats.xpInCurrentLevel}/{stats.xpForNextLevel} XP</span>
          <div className="flex-1 bg-[#E5E7EB] rounded-full h-1.5">
            <div className="bg-gradient-to-r from-[#6366f1] to-[#5DEAEA] h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.progressPercent}%` }} />
          </div>
        </div>
        {stats.currentStreak > 0 && (
          <Link href="/quests" className="flex items-center gap-1 text-[#F97316] hover:text-[#EA580C] transition-colors">
            <span>🔥</span><span className="font-bold text-xs">{stats.currentStreak}d</span>
            <span className="text-[#6B7280] text-xs hidden sm:block">streak</span>
          </Link>
        )}
        <Link href="/quests" className="text-xs text-[#6366f1] hover:text-[#5558e6] transition-colors hidden sm:block font-medium">Daily Quests &rarr;</Link>
        <Link href="/leaderboard" className="text-xs text-[#6B7280] hover:text-[#6366f1] transition-colors hidden sm:block">🏆 Leaderboard</Link>
      </div>
    </div>
  )
}
