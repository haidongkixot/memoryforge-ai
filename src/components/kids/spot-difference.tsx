'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

const EMOJI_POOL = ['🌸', '🌻', '🌺', '🍄', '🌿', '🍀', '🌵', '🎀', '🦋', '🐝', '🐞', '🌈', '⭐', '🎵', '💎', '🔮', '🎪', '🎨', '🏵️', '🧸']

function genGrid(): string[] {
  const pool = [...EMOJI_POOL].sort(() => Math.random() - 0.5)
  return Array.from({ length: 16 }, (_, i) => pool[i % pool.length])
}

function genDifferences(grid: string[], count: number): { modified: string[]; diffIndices: number[] } {
  const modified = [...grid]
  const available = [...EMOJI_POOL]
  const indices = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, count)

  indices.forEach(idx => {
    let replacement: string
    do {
      replacement = available[Math.floor(Math.random() * available.length)]
    } while (replacement === modified[idx])
    modified[idx] = replacement
  })

  return { modified, diffIndices: indices }
}

export default function SpotDifference({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [found, setFound] = useState<Set<number>>(new Set())
  const total = 6
  const diffCount = 3

  const [puzzles] = useState(() =>
    Array.from({ length: total }, () => {
      const original = genGrid()
      const { modified, diffIndices } = genDifferences(original, diffCount)
      return { original, modified, diffIndices }
    })
  )

  const p = puzzles[round]

  const handleClick = useCallback((idx: number) => {
    if (found.has(idx)) return
    if (!p.diffIndices.includes(idx)) return

    const newFound = new Set(found).add(idx)
    setFound(newFound)

    if (newFound.size === diffCount) {
      const pts = 100
      const newScore = score + pts
      setScore(newScore)

      setTimeout(() => {
        if (round + 1 >= total) onComplete(newScore)
        else { setRound(r => r + 1); setFound(new Set()) }
      }, 1200)
    }
  }, [found, p, round, total, score, onComplete])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-lg text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Picture {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-semibold">Found: {found.size}/{diffCount}</span>
      </div>

      <p className="text-[#6B7280] font-medium">Find {diffCount} differences! Tap them in the RIGHT picture.</p>

      <div className="flex gap-4 flex-wrap justify-center">
        {/* Original */}
        <div>
          <div className="text-xs text-center text-[#6B7280] mb-1 font-semibold">Original</div>
          <div className="grid grid-cols-4 gap-1.5 bg-blue-50 p-2 rounded-xl border-2 border-blue-200">
            {p.original.map((emoji, i) => (
              <div key={i} className="w-11 h-11 bg-white rounded-lg flex items-center justify-center text-xl">
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Modified */}
        <div>
          <div className="text-xs text-center text-[#6B7280] mb-1 font-semibold">Changed</div>
          <div className="grid grid-cols-4 gap-1.5 bg-pink-50 p-2 rounded-xl border-2 border-pink-200">
            {p.modified.map((emoji, i) => {
              const isFound = found.has(i)
              const isDiff = p.diffIndices.includes(i)
              return (
                <button key={i}
                  onClick={() => handleClick(i)}
                  className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl transition-all ${
                    isFound ? 'bg-green-200 border-2 border-green-400 scale-110' :
                    'bg-white hover:bg-pink-100 active:scale-95'
                  }`}>
                  {emoji}
                  {isFound && <span className="absolute text-xs">✅</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {found.size === diffCount && (
        <div className="text-xl font-bold text-green-500">All found! Eagle eyes! 👀✨</div>
      )}
    </div>
  )
}
