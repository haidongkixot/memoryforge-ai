'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Quest {
  id: string
  title: string
  description: string
  type: 'play' | 'beat_record' | 'try_new' | 'streak' | 'accuracy'
  target: number
  progress: number
  xpReward: number
  completed: boolean
  gameSlug?: string
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quests')
      .then((r) => r.json())
      .then((data) => setQuests(data.quests || []))
      .catch(() => setQuests([]))
      .finally(() => setLoading(false))
  }, [])

  const questIcons: Record<string, string> = {
    play: '🎮',
    beat_record: '🏆',
    try_new: '🌟',
    streak: '🔥',
    accuracy: '🎯',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1f2937]">Daily Quests</h1>
        <p className="text-[#6B7280] mt-1">Complete quests to earn bonus XP and build your skills</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 animate-pulse h-36" />
          ))}
        </div>
      ) : quests.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-xl font-semibold text-[#1f2937] mb-2">No Quests Available</h2>
          <p className="text-[#6B7280] text-sm mb-4">
            Play a few games first and daily quests will appear based on your activity.
          </p>
          <Link
            href="/library"
            className="inline-block bg-[#6366f1] hover:bg-[#5558e6] text-white px-6 py-3 rounded-full font-semibold transition-colors text-sm shadow-[0_4px_15px_rgba(99,102,241,0.25)]"
          >
            Browse Games
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((q) => (
              <div
                key={q.id}
                className={`bg-white border rounded-2xl p-6 transition-all shadow-[0_2px_15px_rgba(99,102,241,0.04)] ${
                  q.completed ? 'border-[#ABF263]/50 bg-[#ABF263]/5' : 'border-[#E5E7EB] hover:border-[#6366f1]/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{questIcons[q.type] || '📋'}</span>
                    <div>
                      <h3 className="text-[#1f2937] font-semibold">{q.title}</h3>
                      <p className="text-[#6B7280] text-sm">{q.description}</p>
                    </div>
                  </div>
                  <span className="text-[#6366f1] text-sm font-medium whitespace-nowrap ml-2">
                    +{q.xpReward} XP
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-1">
                    <span>Progress</span>
                    <span>
                      {q.progress}/{q.target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        q.completed ? 'bg-[#ABF263]' : 'bg-gradient-to-r from-[#6366f1] to-[#5DEAEA]'
                      }`}
                      style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                    />
                  </div>
                </div>

                {!q.completed && q.gameSlug && (
                  <Link
                    href={`/practice/${q.gameSlug}`}
                    className="inline-block mt-4 text-sm text-[#6366f1] hover:text-[#5558e6] transition-colors font-medium"
                  >
                    Play now &rarr;
                  </Link>
                )}
                {q.completed && (
                  <div className="mt-4 text-sm text-green-500 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <p className="text-[#6B7280] text-sm text-center">
              Quests refresh daily. Complete them all for bonus streak rewards!
            </p>
          </div>
        </>
      )}
    </div>
  )
}
