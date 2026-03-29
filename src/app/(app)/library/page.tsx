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
        <h1 className="text-3xl font-bold text-white">Game Library</h1>
        <p className="text-gray-400 mt-1">Choose a game to train your brain</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search games..."
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none flex-1 min-w-[200px]" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.replace('-', ' ')}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none">
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d === 'all' ? 'All Levels' : d}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(game => (
          <Link key={game.id} href={`/practice/${game.slug}`}
            className="bg-gray-900 border border-gray-800 hover:border-indigo-400/50 rounded-xl p-6 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{CATEGORY_ICONS[game.category] || '🎮'}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                game.difficulty === 'advanced' ? 'bg-red-500/20 text-red-400' :
                game.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>{game.difficulty}</span>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{game.name}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{game.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {game.benefits.slice(0, 2).map(b => (
                <span key={b} className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">{b}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {games.length === 0 && (
        <div className="text-center py-12 text-gray-500">No games found. Try adjusting your filters.</div>
      )}
    </div>
  )
}