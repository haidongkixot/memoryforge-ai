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
        <h1 className="text-3xl font-bold text-white">Daily Quests</h1>
        <p className="text-gray-400 mt-1">Complete quests to earn bonus XP and build your skills</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse h-36" />
          ))}
        </div>
      ) : quests.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-xl font-semibold text-white mb-2">No Quests Available</h2>
          <p className="text-gray-400 text-sm mb-4">
            Play a few games first and daily quests will appear based on your activity.
          </p>
          <Link
            href="/library"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm"
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
                className={`bg-gray-900 border rounded-xl p-6 transition-all ${
                  q.completed ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{questIcons[q.type] || '📋'}</span>
                    <div>
                      <h3 className="text-white font-semibold">{q.title}</h3>
                      <p className="text-gray-400 text-sm">{q.description}</p>
                    </div>
                  </div>
                  <span className="text-indigo-400 text-sm font-medium whitespace-nowrap ml-2">
                    +{q.xpReward} XP
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {q.progress}/{q.target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        q.completed ? 'bg-green-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                    />
                  </div>
                </div>

                {!q.completed && q.gameSlug && (
                  <Link
                    href={`/practice/${q.gameSlug}`}
                    className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Play now &rarr;
                  </Link>
                )}
                {q.completed && (
                  <div className="mt-4 text-sm text-green-400 font-medium flex items-center gap-1">
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

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm text-center">
              Quests refresh daily. Complete them all for bonus streak rewards!
            </p>
          </div>
        </>
      )}
    </div>
  )
}
