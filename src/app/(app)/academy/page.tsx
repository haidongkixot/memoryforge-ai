'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Chapter {
  id: string; slug: string; title: string; category: string
  keyTakeaways: string[]; minPlanSlug: string
  progress: { completed: boolean; quizScore: number | null } | null
}

const CATEGORY_ICONS: Record<string, string> = {
  'working-memory': '🧠', 'verbal-memory': '📝', 'visual-memory': '👁️',
  'processing-speed': '⚡', 'cognitive-training': '🎯',
}

export default function AcademyPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/academy').then(r => r.json()).then(setChapters).catch(() => {})
  }, [])

  const categories = ['all', ...Array.from(new Set(chapters.map(c => c.category)))]
  const filtered = filter === 'all' ? chapters : chapters.filter(c => c.category === filter)

  const completed = chapters.filter(c => c.progress?.completed).length
  const total = chapters.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#593CC8]">Academy</h1>
        <p className="text-[#6B7280] mt-1">Learn the science behind memory training</p>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#1f2937]">Your progress</span>
            <span className="text-sm text-[#6B7280]">{completed}/{total} chapters</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-[#593CC8] h-2.5 rounded-full transition-all" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === c
                ? 'bg-[#593CC8] text-white shadow-sm'
                : 'bg-white text-[#6B7280] border border-gray-100 hover:border-[#593CC8]/30'
            }`}>
            {c === 'all' ? 'All' : (CATEGORY_ICONS[c] || '') + ' ' + c.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {/* Chapter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ch => (
          <Link key={ch.id} href={`/academy/${ch.slug}`}
            className="bg-white border border-gray-100 hover:border-[#593CC8]/30 rounded-2xl p-6 shadow-sm transition-all group hover:shadow-md relative">
            {ch.progress?.completed && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">&#10003;</span>
              </div>
            )}
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{CATEGORY_ICONS[ch.category] || '📖'}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                ch.minPlanSlug === 'free' ? 'bg-green-50 text-green-600' :
                ch.minPlanSlug === 'plus' ? 'bg-blue-50 text-blue-600' :
                'bg-purple-50 text-purple-600'
              }`}>{ch.minPlanSlug === 'free' ? 'Free' : ch.minPlanSlug.toUpperCase()}</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[#593CC8] transition-colors">{ch.title}</h3>
            <div className="flex flex-wrap gap-1 mt-3">
              {ch.keyTakeaways.slice(0, 2).map((t, i) => (
                <span key={i} className="text-xs bg-[#5DEAEA]/10 text-[#593CC8] px-2 py-0.5 rounded-full font-medium line-clamp-1">{t}</span>
              ))}
            </div>
            {ch.progress?.quizScore !== null && ch.progress?.quizScore !== undefined && (
              <div className="mt-3 text-xs text-[#6B7280]">Quiz: {ch.progress.quizScore}%</div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#9CA3AF]">No chapters available yet.</div>
      )}
    </div>
  )
}
