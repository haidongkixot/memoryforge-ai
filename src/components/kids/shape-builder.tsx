'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const SHAPE_SETS = [
  ['🔴', '🔵', '🟢', '🟡', '🟣'], ['⬛', '⬜', '🟫', '🟦', '🟥'],
  ['🔺', '🔻', '💠', '🔶', '🔷'], ['⚪', '⚫', '🔴', '🔵', '🟠'],
  ['🟩', '🟦', '🟪', '🟥', '🟧'], ['🔶', '🔷', '🔸', '🔹', '💎'],
  ['🟡', '🟠', '🔴', '🟣', '🟤'], ['⬜', '🟫', '⬛', '🟩', '🟦'],
]

function generatePuzzle(level: number, seed: number) {
  const setIdx = (seed * 3 + level) % SHAPE_SETS.length
  const shapes = SHAPE_SETS[setIdx]
  const uniqueCount = Math.min(2 + Math.floor(level / 6), 5)
  const seqLen = Math.min(4 + Math.floor(level / 5), 8)

  const base = shapes.slice(0, uniqueCount)
  const seq: string[] = []
  for (let i = 0; i < seqLen; i++) seq.push(base[i % base.length])
  const answer = base[seqLen % base.length]

  const opts = new Set([answer])
  for (const s of shapes) { if (opts.size < 4) opts.add(s) }
  return { seq, answer, opts: Array.from(opts).sort(() => Math.random() - 0.5) }
}

export default function ShapeBuilder({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15)
  const puzzles = useMemo(() => Array.from({ length: rounds }, (_, i) => generatePuzzle(level, i + level * 50)), [level, rounds])
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)

  const handlePick = useCallback((opt: string) => {
    if (feedback !== null) return
    const correct = opt === puzzles[round].answer
    const pts = correct ? 50 + level * 5 : 0
    setScore(s => s + pts)
    setFeedback(correct)
    setTimeout(() => {
      if (round + 1 >= rounds) onComplete(score + pts)
      else { setRound(r => r + 1); setFeedback(null) }
    }, 1000)
  }, [round, rounds, feedback, score, puzzles, level, onComplete])

  const p = puzzles[round]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{rounds}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>
      <p className="text-[#6B7280] font-medium">Complete the shape pattern!</p>
      <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-2xl flex-wrap justify-center">
        {p.seq.map((s, i) => <span key={i} className="text-4xl">{s}</span>)}
        <span className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 text-purple-400 text-2xl font-bold">?</span>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {p.opts.map(opt => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50'
          if (feedback !== null) {
            if (opt === p.answer) cls = 'bg-green-100 border-2 border-green-400 scale-105'
            else cls = 'bg-gray-100 border-2 border-gray-200 opacity-50'
          }
          return (<button key={opt} onClick={() => handlePick(opt)} className={`${cls} rounded-2xl py-4 text-4xl transition-all active:scale-95`}>{opt}</button>)
        })}
      </div>
      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Perfect shape! 🔷' : 'Good try! Keep going! 💪'}
        </div>
      )}
    </div>
  )
}
