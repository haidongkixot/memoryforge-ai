'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const EMOJI_POOL = ['🌸', '🌻', '🌺', '🍄', '🌿', '🍀', '🌵', '🎀', '🦋', '🐝', '🐞', '🌈', '⭐', '🎵', '💎', '🔮', '🎪', '🎨', '🏵️', '🧸']

function genGrid(gridSize: number): string[] {
  const pool = [...EMOJI_POOL].sort(() => Math.random() - 0.5)
  return Array.from({ length: gridSize * gridSize }, (_, i) => pool[i % pool.length])
}

function genDifferences(grid: string[], count: number): { modified: string[]; diffIndices: number[] } {
  const modified = [...grid]
  const available = [...EMOJI_POOL]
  const indices = Array.from({ length: grid.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, count)

  indices.forEach(idx => {
    let replacement: string
    do {
      replacement = available[Math.floor(Math.random() * available.length)]
    } while (replacement === modified[idx])
    modified[idx] = replacement
  })

  return { modified, diffIndices: indices }
}

export default function SpotDifference({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(4 + Math.floor(level / 3), 15)
  const gridSize = level <= 12 ? 4 : 5
  const diffCount = level <= 8 ? 2 : level <= 18 ? 3 : 4

  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [found, setFound] = useState<Set<number>>(new Set())

  const puzzles = useMemo(() =>
    Array.from({ length: rounds }, () => {
      const original = genGrid(gridSize)
      const { modified, diffIndices } = genDifferences(original, diffCount)
      return { original, modified, diffIndices }
    }), [level, rounds, gridSize, diffCount])

  const p = puzzles[round]

  const handleClick = useCallback((idx: number) => {
    if (found.has(idx)) return
    if (!p.diffIndices.includes(idx)) return

    const newFound = new Set(found).add(idx)
    setFound(newFound)

    if (newFound.size === diffCount) {
      const pts = 50 + level * 5
      const newScore = score + pts
      setScore(newScore)

      setTimeout(() => {
        if (round + 1 >= rounds) onComplete(newScore)
        else { setRound(r => r + 1); setFound(new Set()) }
      }, 1200)
    }
  }, [found, p, round, rounds, score, diffCount, level, onComplete])

  const cellSize = gridSize <= 4 ? 'w-11 h-11' : 'w-9 h-9'
  const textSize = gridSize <= 4 ? 'text-xl' : 'text-lg'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-lg text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Picture {round + 1}/{rounds}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-semibold">Found: {found.size}/{diffCount}</span>
      </div>

      <p className="text-[#6B7280] font-medium">Find {diffCount} differences! Tap them in the RIGHT picture.</p>

      <div className="flex gap-4 flex-wrap justify-center">
        <div>
          <div className="text-xs text-center text-[#6B7280] mb-1 font-semibold">Original</div>
          <div className={`grid gap-1.5 bg-blue-50 p-2 rounded-xl border-2 border-blue-200`}
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {p.original.map((emoji, i) => (
              <div key={i} className={`${cellSize} bg-white rounded-lg flex items-center justify-center ${textSize}`}>
                {emoji}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-center text-[#6B7280] mb-1 font-semibold">Changed</div>
          <div className={`grid gap-1.5 bg-pink-50 p-2 rounded-xl border-2 border-pink-200`}
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {p.modified.map((emoji, i) => {
              const isFound = found.has(i)
              return (
                <button key={i}
                  onClick={() => handleClick(i)}
                  className={`${cellSize} rounded-lg flex items-center justify-center ${textSize} transition-all ${
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
