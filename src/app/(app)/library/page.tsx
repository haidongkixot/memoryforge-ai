'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string; benefits: string[]
}

const CATEGORIES = ['all', 'visual-memory', 'working-memory', 'verbal-memory', 'cognitive-training', 'social-memory', 'processing-speed', 'spatial-memory']
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced']
const CATEGORY_ICONS: Record<string, string> = {
  'visual-memory': '👁️', 'working-memory': '🧠', 'verbal-memory': '📝', 'cognitive-training': '⚡',
  'social-memory': '👥', 'processing-speed': '🏃', 'spatial-memory': '🗺️',
}

export default function LibraryPage() {
  const [games, setGames] = useState<Game[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    if (difficulty !== 'all') params.set('difficulty', difficulty)
    const timer = setTimeout(() => {
      fetch(`/api/exercises?${params}`).then(r => r.json()).then(d => Array.isArray(d) && setGames(d))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, category, difficulty])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#593CC8]">Game Library</h1>
        <p className="text-[#6B7280] mt-1">Choose a game to train your brain</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search games..."
          className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[#1f2937] focus:border-[#593CC8] focus:outline-none flex-1 min-w-[200px] shadow-sm transition-colors" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[#1f2937] focus:border-[#593CC8] focus:outline-none shadow-sm">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.replace('-', ' ')}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[#1f2937] focus:border-[#593CC8] focus:outline-none shadow-sm">
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d === 'all' ? 'All Levels' : d}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(game => (
          <Link key={game.id} href={`/practice/${game.slug}`}
            className="bg-white border border-gray-100 hover:border-[#593CC8]/30 rounded-2xl p-6 shadow-sm transition-all group hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{CATEGORY_ICONS[game.category] || '🎮'}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                game.difficulty === 'advanced' ? 'bg-red-50 text-red-500' :
                game.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-600' :
                'bg-[#ABF263]/20 text-green-600'
              }`}>{game.difficulty}</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[#593CC8] transition-colors">{game.name}</h3>
            <p className="text-[#6B7280] text-sm mt-1 line-clamp-2">{game.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {game.benefits.slice(0, 2).map(b => (
                <span key={b} className="text-xs bg-[#5DEAEA]/10 text-[#593CC8] px-2 py-0.5 rounded-full font-medium">{b}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {games.length === 0 && (
        <div className="text-center py-12 text-[#9CA3AF]">No games found. Try adjusting your filters.</div>
      )}
    </div>
  )
}
