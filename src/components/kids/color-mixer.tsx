'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

type Color = 'red' | 'blue' | 'yellow'
interface MixQ { target: string; targetColor: string; mix: [Color, Color]; opts: [Color, Color][] }

const MIXES: MixQ[] = [
  { target: 'Green', targetColor: '#22C55E', mix: ['blue', 'yellow'], opts: [['red', 'blue'], ['blue', 'yellow'], ['red', 'yellow']] },
  { target: 'Orange', targetColor: '#F97316', mix: ['red', 'yellow'], opts: [['red', 'yellow'], ['blue', 'yellow'], ['red', 'blue']] },
  { target: 'Purple', targetColor: '#A855F7', mix: ['red', 'blue'], opts: [['red', 'blue'], ['red', 'yellow'], ['blue', 'yellow']] },
  { target: 'Green', targetColor: '#22C55E', mix: ['yellow', 'blue'], opts: [['red', 'blue'], ['red', 'yellow'], ['yellow', 'blue']] },
  { target: 'Orange', targetColor: '#F97316', mix: ['yellow', 'red'], opts: [['yellow', 'red'], ['blue', 'yellow'], ['red', 'blue']] },
  { target: 'Purple', targetColor: '#A855F7', mix: ['blue', 'red'], opts: [['blue', 'yellow'], ['blue', 'red'], ['red', 'yellow']] },
  { target: 'Green', targetColor: '#22C55E', mix: ['blue', 'yellow'], opts: [['red', 'yellow'], ['red', 'blue'], ['blue', 'yellow']] },
  { target: 'Orange', targetColor: '#F97316', mix: ['red', 'yellow'], opts: [['blue', 'yellow'], ['red', 'blue'], ['red', 'yellow']] },
  { target: 'Purple', targetColor: '#A855F7', mix: ['red', 'blue'], opts: [['red', 'yellow'], ['blue', 'yellow'], ['red', 'blue']] },
  { target: 'Green', targetColor: '#22C55E', mix: ['yellow', 'blue'], opts: [['yellow', 'blue'], ['red', 'blue'], ['red', 'yellow']] },
]

const COLOR_MAP: Record<string, string> = { red: '#EF4444', blue: '#3B82F6', yellow: '#EAB308' }

function mixMatch(a: [Color, Color], b: [Color, Color]) {
  return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0])
}

export default function ColorMixer({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [shuffled] = useState(() => [...MIXES].sort(() => Math.random() - 0.5))
  const total = shuffled.length

  const handlePick = useCallback((opt: [Color, Color]) => {
    if (feedback !== null) return
    const correct = mixMatch(opt, shuffled[round].mix)
    const pts = correct ? 100 : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) {
        onComplete(score + pts)
      } else {
        setRound(r => r + 1)
        setFeedback(null)
      }
    }, 1200)
  }, [round, total, feedback, score, shuffled, onComplete])

  const q = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <div className="text-center">
        <p className="text-[#6B7280] font-medium mb-3">Which two colors make...</p>
        <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl">
          <div className="w-12 h-12 rounded-full shadow-inner" style={{ backgroundColor: q.targetColor }} />
          <span className="text-2xl font-extrabold" style={{ color: q.targetColor }}>{q.target}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {q.opts.map((opt, i) => {
          const isCorrect = mixMatch(opt, q.mix)
          let cls = 'bg-white border-2 border-gray-200 hover:border-orange-400 hover:shadow-md'
          if (feedback !== null) {
            if (isCorrect) cls = 'bg-green-50 border-2 border-green-400 scale-[1.02]'
            else cls = 'bg-gray-50 border-2 border-gray-200 opacity-50'
          }
          return (
            <button key={i} onClick={() => handlePick(opt)}
              className={`${cls} rounded-2xl py-4 px-6 flex items-center justify-center gap-4 transition-all active:scale-95`}>
              <div className="w-10 h-10 rounded-full shadow-sm border border-white" style={{ backgroundColor: COLOR_MAP[opt[0]] }} />
              <span className="text-2xl font-bold text-gray-400">+</span>
              <div className="w-10 h-10 rounded-full shadow-sm border border-white" style={{ backgroundColor: COLOR_MAP[opt[1]] }} />
            </button>
          )
        })}
      </div>

      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Great mixing! 🎨' : `It was ${q.mix[0]} + ${q.mix[1]}! 💪`}
        </div>
      )}
    </div>
  )
}
