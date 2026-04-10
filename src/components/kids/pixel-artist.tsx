'use client'
import { useState, useCallback, useEffect, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7', '#F97316']

function genPixelArt(gridSize: number): boolean[] {
  return Array.from({ length: gridSize * gridSize }, () => Math.random() > 0.45)
}

export default function PixelArtist({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15)
  const gridSize = level <= 8 ? 3 : level <= 16 ? 4 : level <= 24 ? 5 : 6
  const cellCount = gridSize * gridSize
  const studyTime = level <= 10 ? 4000 : level <= 20 ? 3000 : 2000

  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'study' | 'draw' | 'result'>('study')
  const [userGrid, setUserGrid] = useState<boolean[]>(Array(cellCount).fill(false))

  const puzzles = useMemo(() =>
    Array.from({ length: rounds }, () => ({
      pattern: genPixelArt(gridSize),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })), [level, rounds, gridSize])

  useEffect(() => {
    if (phase !== 'study') return
    const t = setTimeout(() => {
      setPhase('draw')
      setUserGrid(Array(cellCount).fill(false))
    }, studyTime)
    return () => clearTimeout(t)
  }, [phase, cellCount, studyTime])

  const handleToggle = useCallback((idx: number) => {
    if (phase !== 'draw') return
    setUserGrid(g => { const n = [...g]; n[idx] = !n[idx]; return n })
  }, [phase])

  const handleCheck = useCallback(() => {
    setPhase('result')
    const target = puzzles[round].pattern
    const correct = userGrid.filter((v, i) => v === target[i]).length
    const pts = Math.round((correct / cellCount) * (50 + level * 5))
    const newScore = score + pts
    setScore(newScore)

    setTimeout(() => {
      if (round + 1 >= rounds) onComplete(newScore)
      else { setRound(r => r + 1); setPhase('study') }
    }, 1800)
  }, [userGrid, puzzles, round, rounds, score, cellCount, level, onComplete])

  const p = puzzles[round]
  const cellSize = gridSize <= 3 ? 'w-14 h-14' : gridSize <= 4 ? 'w-12 h-12' : gridSize <= 5 ? 'w-10 h-10' : 'w-8 h-8'
  const smallCell = gridSize <= 3 ? 'w-10 h-10' : gridSize <= 4 ? 'w-8 h-8' : gridSize <= 5 ? 'w-7 h-7' : 'w-6 h-6'

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Art {round + 1}/{rounds}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className={`px-3 py-1 rounded-full font-semibold ${
          phase === 'study' ? 'bg-yellow-50 text-yellow-600' : phase === 'draw' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
        }`}>
          {phase === 'study' ? 'Memorize! 👀' : phase === 'draw' ? 'Draw it! 🎨' : 'Checking...'}
        </span>
      </div>

      {phase === 'study' && (
        <div className="text-center">
          <p className="text-[#6B7280] font-medium mb-3">Remember this pixel art!</p>
          <div className="grid gap-1.5 bg-gray-50 p-3 rounded-xl inline-grid"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {p.pattern.map((on, i) => (
              <div key={i}
                className={`${cellSize} rounded-lg transition-all`}
                style={{ backgroundColor: on ? p.color : '#F3F4F6', border: `2px solid ${on ? p.color : '#E5E7EB'}` }}
              />
            ))}
          </div>
          <div className="mt-3 text-sm text-yellow-600 font-semibold animate-pulse">Memorizing... {studyTime / 1000}s</div>
        </div>
      )}

      {phase === 'draw' && (
        <div className="text-center">
          <p className="text-[#6B7280] font-medium mb-3">Now recreate the pixel art from memory!</p>
          <div className="grid gap-1.5 bg-gray-50 p-3 rounded-xl inline-grid"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {userGrid.map((on, i) => (
              <button key={i}
                onClick={() => handleToggle(i)}
                className={`${cellSize} rounded-lg transition-all active:scale-90`}
                style={{ backgroundColor: on ? p.color : '#F3F4F6', border: `2px solid ${on ? p.color : '#E5E7EB'}` }}
              />
            ))}
          </div>
          <button onClick={handleCheck}
            className="mt-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg block mx-auto">
            Done! ✅
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center">
          <div className="flex gap-8 justify-center mb-4">
            <div>
              <div className="text-xs text-[#6B7280] mb-1 font-semibold">Original</div>
              <div className="grid gap-1 inline-grid"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                {p.pattern.map((on, i) => (
                  <div key={i} className={`${smallCell} rounded`} style={{ backgroundColor: on ? p.color : '#F3F4F6' }} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1 font-semibold">Yours</div>
              <div className="grid gap-1 inline-grid"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                {userGrid.map((on, i) => {
                  const correct = on === p.pattern[i]
                  return (
                    <div key={i} className={`${smallCell} rounded`}
                      style={{
                        backgroundColor: on ? p.color : '#F3F4F6',
                        outline: correct ? '2px solid #22C55E' : '2px solid #EF4444',
                        outlineOffset: '-1px',
                      }} />
                  )
                })}
              </div>
            </div>
          </div>
          <div className="text-lg font-bold text-green-500">
            {userGrid.every((v, i) => v === p.pattern[i]) ? 'Perfect pixel art! 🎨✨' : 'Good memory! 🧠'}
          </div>
        </div>
      )}
    </div>
  )
}
