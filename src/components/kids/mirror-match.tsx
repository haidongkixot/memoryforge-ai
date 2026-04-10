'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7', '#F97316']

function generatePattern(gridSize: number): boolean[] {
  return Array.from({ length: gridSize * gridSize }, () => Math.random() > 0.5)
}

function mirrorPattern(p: boolean[], gridSize: number): boolean[] {
  const m = [...p]
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < Math.floor(gridSize / 2); c++) {
      m[r * gridSize + c] = p[r * gridSize + (gridSize - 1 - c)]
      m[r * gridSize + (gridSize - 1 - c)] = p[r * gridSize + c]
    }
  }
  return m
}

export default function MirrorMatch({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15)
  const gridSize = level <= 10 ? 3 : level <= 20 ? 4 : 5
  const cellCount = gridSize * gridSize
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [checked, setChecked] = useState(false)
  const color = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], [level])

  const patterns = useMemo(() =>
    Array.from({ length: rounds }, () => {
      const p = generatePattern(gridSize)
      return { original: p, mirror: mirrorPattern(p, gridSize) }
    }), [level, rounds, gridSize])

  const [userGrid, setUserGrid] = useState<boolean[]>(Array(cellCount).fill(false))

  const handleToggle = useCallback((idx: number) => {
    if (checked) return
    setUserGrid(g => { const n = [...g]; n[idx] = !n[idx]; return n })
  }, [checked])

  const handleCheck = useCallback(() => {
    setChecked(true)
    const target = patterns[round].mirror
    const correct = userGrid.filter((v, i) => v === target[i]).length
    const pts = Math.round((correct / cellCount) * (50 + level * 5))
    const newScore = score + pts

    setTimeout(() => {
      if (round + 1 >= rounds) onComplete(newScore)
      else {
        setRound(r => r + 1)
        setUserGrid(Array(cellCount).fill(false))
        setChecked(false)
      }
    }, 1500)

    setScore(newScore)
  }, [userGrid, patterns, round, rounds, score, cellCount, level, onComplete])

  const pat = patterns[round]
  const cellSize = gridSize <= 3 ? 'w-12 h-12 sm:w-14 sm:h-14' : gridSize <= 4 ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-lg text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{rounds}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium">Create the mirror image! (flip left ↔ right)</p>

      <div className="flex items-center gap-4">
        {/* Original */}
        <div>
          <div className="text-xs text-center text-[#6B7280] mb-2 font-semibold">Original</div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {pat.original.map((on, i) => (
              <div key={i}
                className={`${cellSize} rounded-lg transition-all`}
                style={{ backgroundColor: on ? color : '#F3F4F6', border: `2px solid ${on ? color : '#E5E7EB'}` }}
              />
            ))}
          </div>
        </div>

        <div className="text-2xl text-[#6B7280]">🪞</div>

        {/* User grid */}
        <div>
          <div className="text-xs text-center text-[#6B7280] mb-2 font-semibold">Your Mirror</div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {userGrid.map((on, i) => {
              let borderColor = on ? color : '#E5E7EB'
              if (checked) {
                const shouldBe = pat.mirror[i]
                borderColor = on === shouldBe ? '#22C55E' : '#EF4444'
              }
              return (
                <button key={i} onClick={() => handleToggle(i)}
                  className={`${cellSize} rounded-lg transition-all active:scale-95`}
                  style={{ backgroundColor: on ? color : '#F3F4F6', border: `2px solid ${borderColor}` }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {!checked && (
        <button onClick={handleCheck}
          className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
          Check Mirror! 🪞
        </button>
      )}

      {checked && (
        <div className="text-lg font-bold text-green-500">
          {userGrid.every((v, i) => v === pat.mirror[i]) ? 'Perfect Mirror! ✨' : 'Good try! 💪'}
        </div>
      )}
    </div>
  )
}
