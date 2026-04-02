'use client'
import { useState, useEffect, useCallback } from 'react'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string
  benefits: string[]; rules: string[]; gameType: string; gridSize: number; timeLimit: number; maxLevel: number
}

interface Props {
  game: Game
  onComplete: (score: number, level: number, accuracy: number, moves: number) => void
}

type Phase = 'study' | 'reproduce' | 'results'

const CELL_COLORS = ['#593CC8', '#5DEAEA', '#ABF263', '#f59e0b', '#ef4444', '#8b5cf6']

function randomPattern(size: number): boolean[] {
  const total = size * size
  const fillCount = Math.floor(total * 0.4)
  const indices = Array.from({ length: total }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, fillCount)
  const pattern = Array(total).fill(false)
  indices.forEach(i => { pattern[i] = true })
  return pattern
}

function getPatternColor(index: number): string {
  return CELL_COLORS[index % CELL_COLORS.length]
}

export default function SpatialMemoryGame({ game, onComplete }: Props) {
  const size = Math.min(Math.max(game.gridSize || 4, 3), 6)
  const total = size * size
  const studySeconds = 15

  const [pattern] = useState<boolean[]>(() => randomPattern(size))
  const [patternColors] = useState<string[]>(() =>
    Array.from({ length: total }, (_, i) => pattern[i] ? getPatternColor(i) : '')
  )
  const [phase, setPhase] = useState<Phase>('study')
  const [studyTime, setStudyTime] = useState(studySeconds)
  const [playerPattern, setPlayerPattern] = useState<boolean[]>(() => Array(total).fill(false))
  const [startTime] = useState(Date.now())

  // Study countdown
  useEffect(() => {
    if (phase !== 'study') return
    if (studyTime <= 0) { setPhase('reproduce'); return }
    const t = setTimeout(() => setStudyTime(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, studyTime])

  const toggleCell = useCallback((idx: number) => {
    if (phase !== 'reproduce') return
    setPlayerPattern(prev => {
      const next = [...prev]
      next[idx] = !next[idx]
      return next
    })
  }, [phase])

  const handleSubmit = useCallback(() => {
    setPhase('results')
    const filledOriginal = pattern.filter(Boolean).length
    let correctCount = 0
    let wrongCount = 0

    for (let i = 0; i < total; i++) {
      if (pattern[i] && playerPattern[i]) correctCount++
      else if (!pattern[i] && playerPattern[i]) wrongCount++
    }

    const score = filledOriginal > 0
      ? Math.max(0, Math.round(((correctCount - wrongCount * 0.5) / filledOriginal) * 1000))
      : 0
    const accuracy = filledOriginal > 0 ? Math.round((correctCount / filledOriginal) * 100) : 0
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    onComplete(score, 1, accuracy, elapsed)
  }, [pattern, playerPattern, total, startTime, onComplete])

  const studyProgress = (studyTime / studySeconds) * 100

  if (phase === 'study') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Remember the pattern!</h2>
          <p className="text-[#6B7280] text-sm mt-1">{studyTime} seconds to memorize</p>
        </div>
        <div className="w-full max-w-sm bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${studyProgress}%`, backgroundColor: studyTime > 5 ? '#5DEAEA' : '#ef4444' }}
          />
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {pattern.map((filled, i) => (
            <div
              key={i}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all"
              style={{
                backgroundColor: filled ? patternColors[i] : '#f9fafb',
                borderColor: filled ? patternColors[i] : '#e5e7eb',
                opacity: filled ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'reproduce') {
    const filled = playerPattern.filter(Boolean).length
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Reproduce the pattern!</h2>
          <p className="text-[#6B7280] text-sm mt-1">Click cells to fill them in • {filled} cells filled</p>
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {playerPattern.map((filled, i) => (
            <button
              key={i}
              onClick={() => toggleCell(i)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all hover:scale-105 ${
                filled
                  ? 'border-[#593CC8]'
                  : 'bg-gray-50 border-gray-200 hover:border-[#593CC8]/40 hover:bg-[#593CC8]/5'
              }`}
              style={filled ? { backgroundColor: '#593CC8' } : {}}
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-[0_4px_15px_rgba(89,60,200,0.25)]"
        >
          Submit Pattern
        </button>
      </div>
    )
  }

  // Results
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-[#593CC8]">Results</h2>
      <div className="flex gap-8 flex-wrap justify-center">
        <div>
          <p className="text-center text-sm font-semibold text-[#6B7280] mb-3">Original</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {pattern.map((filled, i) => (
              <div
                key={i}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2"
                style={{
                  backgroundColor: filled ? patternColors[i] : '#f9fafb',
                  borderColor: filled ? patternColors[i] : '#e5e7eb',
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-center text-sm font-semibold text-[#6B7280] mb-3">Your Answer</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {playerPattern.map((pFilled, i) => {
              const oFilled = pattern[i]
              const correct = oFilled && pFilled
              const missed = oFilled && !pFilled
              const wrong = !oFilled && pFilled
              return (
                <div
                  key={i}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center text-sm font-bold ${
                    correct ? 'bg-[#ABF263]/40 border-[#ABF263]' :
                    missed ? 'bg-yellow-50 border-yellow-300' :
                    wrong ? 'bg-red-50 border-red-400' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  {correct ? '✓' : missed ? '○' : wrong ? '✗' : ''}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-sm flex-wrap justify-center">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#ABF263] inline-block" /> Correct</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 inline-block" /> Missed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-400 inline-block" /> Wrong</span>
      </div>
    </div>
  )
}
