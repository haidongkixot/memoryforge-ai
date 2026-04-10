'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Game {
  id: string; name: string; slug: string; description: string; benefits: string[]
}

const AGE_TAGS = ['Ages 6-8', 'Ages 8-10', 'Ages 10-15']
const GAME_ICONS: Record<string, string> = {
  'emoji-pattern': '🔮', 'color-mixer': '🎨', 'animal-sort': '🦁', 'shape-builder': '🔷',
  'story-sequence': '📖', 'odd-one-out': '🔍', 'mirror-match': '🪞', 'number-ninja': '🥷',
  'word-scramble': '🔤', 'maze-runner': '🏃', 'treasure-map': '🗺️', 'code-breaker': '🔐',
  'balance-scale': '⚖️', 'spot-difference': '👀', 'rhythm-repeat': '🥁', 'pixel-artist': '🖼️',
  'word-chain': '🔗', 'guess-rule': '🧩', 'tower-builder': '🏗️', 'emotion-detective': '😊',
}

const CARD_COLORS = [
  'from-blue-400 to-blue-500', 'from-pink-400 to-pink-500', 'from-green-400 to-green-500',
  'from-orange-400 to-orange-500', 'from-purple-400 to-purple-500', 'from-cyan-400 to-cyan-500',
  'from-rose-400 to-rose-500', 'from-amber-400 to-amber-500', 'from-teal-400 to-teal-500',
  'from-indigo-400 to-indigo-500', 'from-emerald-400 to-emerald-500', 'from-fuchsia-400 to-fuchsia-500',
  'from-sky-400 to-sky-500', 'from-lime-400 to-lime-500', 'from-violet-400 to-violet-500',
  'from-red-400 to-red-500', 'from-yellow-400 to-yellow-500', 'from-blue-500 to-purple-500',
  'from-pink-500 to-orange-500', 'from-green-500 to-teal-500',
]

export default function KidsZonePage() {
  const [games, setGames] = useState<Game[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/exercises?kidsZone=true')
      .then(r => r.json())
      .then(d => Array.isArray(d) && setGames(d))
      .catch(() => {})
  }, [])

  const filtered = games.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-3xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 text-8xl flex items-center justify-center gap-4 select-none">
          🧠 ⭐ 🎮 🚀 🌈 💡
        </div>
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">For Little Ones 🌟</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Fun brain games for clever kids! Train your thinking skills while having a blast!
          </p>
          <div className="flex justify-center gap-3 mt-4">
            {AGE_TAGS.map(tag => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search games..."
          className="w-full max-w-md bg-white border-2 border-orange-200 rounded-full px-6 py-3 text-[#1f2937] focus:border-orange-400 focus:outline-none shadow-sm text-lg placeholder:text-orange-300"
        />
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-6 text-sm">
        <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-semibold">🎮 {games.length} Games</span>
        <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full font-semibold">🆓 All Free!</span>
        <span className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full font-semibold">🧠 Brain Training</span>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((game, i) => {
          const icon = GAME_ICONS[game.slug] || '🎮'
          const gradient = CARD_COLORS[i % CARD_COLORS.length]
          return (
            <Link
              key={game.id}
              href={`/kids-zone/${game.slug}`}
              className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${gradient} p-6 text-center`}>
                <span className="text-5xl block mb-2 group-hover:scale-110 transition-transform duration-300">{icon}</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1f2937] group-hover:text-[#F97316] transition-colors">{game.name}</h3>
                <p className="text-[#6B7280] text-sm mt-1 line-clamp-2">{game.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {(game.benefits ?? []).slice(0, 2).map(b => (
                    <span key={b} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">{b}</span>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-block bg-gradient-to-r from-orange-400 to-pink-400 text-white text-sm font-bold px-5 py-1.5 rounded-full group-hover:shadow-lg transition-shadow">
                    Play Now!
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#9CA3AF]">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-lg">No games found. Try a different search!</p>
        </div>
      )}
    </div>
  )
}
