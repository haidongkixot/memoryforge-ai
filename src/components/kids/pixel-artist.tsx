'use client'
import { useState, useCallback, useEffect } from 'react'

interface Props { onComplete: (score: number) => void }

const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7', '#F97316']

function genPixelArt(): boolean[] {
  // 4x4 grid with ~40-60% filled
  return Array.from({ length: 16 }, () => Math.random() > 0.5)
}

export default function PixelArtist({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'study' | 'draw' | 'result'>('study')
  const [userGrid, setUserGrid] = useState<boolean[]>(Array(16).fill(false))
  const total = 8

  const [puzzles] = useState(() =>
    Array.from({ length: total }, () => ({
      pattern: genPixelArt(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  )

  // Auto-transition from study to draw
  useEffect(() => {
    if (phase !== 'study') return
    const t = setTimeout(() => {
      setPhase('draw')
      setUserGrid(Array(16).fill(false))
    }, 3000)
    return () => clearTimeout(t)
  }, [phase])

  const handleToggle = useCallback((idx: number) => {
    if (phase !== 'draw') return
    setUserGrid(g => { const n = [...g]; n[idx] = !n[idx]; return n })
  }, [phase])

  const handleCheck = useCallback(() => {
    setPhase('result')
    const target = puzzles[round].pattern
    const correct = userGrid.filter((v, i) => v === target[i]).length
    const pts = Math.round((correct / 16) * 100)
    const newScore = score + pts
    setScore(newScore)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(newScore)
      else { setRound(r => r + 1); setPhase('study') }
    }, 1800)
  }, [userGrid, puzzles, round, total, score, onComplete])

  const p = puzzles[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Art {round + 1}/{total}</span>
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
          <div className="grid grid-cols-4 gap-1.5 bg-gray-50 p-3 rounded-xl inline-grid">
            {p.pattern.map((on, i) => (
              <div key={i}
                className="w-12 h-12 rounded-lg transition-all"
                style={{ backgroundColor: on ? p.color : '#F3F4F6', border: `2px solid ${on ? p.color : '#E5E7EB'}` }}
              />
            ))}
          </div>
          <div className="mt-3 text-sm text-yellow-600 font-semibold animate-pulse">Memorizing... 3 seconds</div>
        </div>
      )}

      {phase === 'draw' && (
        <div className="text-center">
          <p className="text-[#6B7280] font-medium mb-3">Now recreate the pixel art from memory!</p>
          <div className="grid grid-cols-4 gap-1.5 bg-gray-50 p-3 rounded-xl inline-grid">
            {userGrid.map((on, i) => (
              <button key={i}
                onClick={() => handleToggle(i)}
                className="w-12 h-12 rounded-lg transition-all active:scale-90"
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
              <div className="grid grid-cols-4 gap-1 inline-grid">
                {p.pattern.map((on, i) => (
                  <div key={i} className="w-8 h-8 rounded" style={{ backgroundColor: on ? p.color : '#F3F4F6' }} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1 font-semibold">Yours</div>
              <div className="grid grid-cols-4 gap-1 inline-grid">
                {userGrid.map((on, i) => {
                  const correct = on === p.pattern[i]
                  return (
                    <div key={i} className="w-8 h-8 rounded"
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
