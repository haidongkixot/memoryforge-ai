'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

interface BalanceQ {
  left: { emoji: string; count: number }[]
  right: { emoji: string; count: number }[]
  answer: 'left' | 'right' | 'equal'
}

const WEIGHTS: Record<string, number> = {
  '🍎': 2, '🍊': 3, '🍋': 1, '🍇': 4, '🍓': 1, '🍌': 2, '🥝': 2, '🍑': 3,
  '⚽': 5, '🏀': 7, '🎾': 2, '🏐': 4,
  '🐱': 4, '🐶': 6, '🐹': 1, '🐰': 3,
}

function genQuestion(): BalanceQ {
  const emojis = Object.keys(WEIGHTS)
  const pickItems = (): { emoji: string; count: number }[] => {
    const n = 1 + Math.floor(Math.random() * 2)
    const items: { emoji: string; count: number }[] = []
    for (let i = 0; i < n; i++) {
      items.push({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        count: 1 + Math.floor(Math.random() * 3),
      })
    }
    return items
  }

  const left = pickItems()
  const right = pickItems()
  const leftW = left.reduce((s, i) => s + WEIGHTS[i.emoji] * i.count, 0)
  const rightW = right.reduce((s, i) => s + WEIGHTS[i.emoji] * i.count, 0)
  const answer: 'left' | 'right' | 'equal' = leftW > rightW ? 'left' : rightW > leftW ? 'right' : 'equal'

  return { left, right, answer }
}

export default function BalanceScale({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [questions] = useState(() => Array.from({ length: 10 }, () => genQuestion()))
  const total = questions.length

  const handlePick = useCallback((pick: 'left' | 'right' | 'equal') => {
    if (feedback !== null) return
    const correct = pick === questions[round].answer
    const pts = correct ? 100 : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setFeedback(null) }
    }, 1200)
  }, [round, total, feedback, score, questions, onComplete])

  const q = questions[round]
  const renderSide = (items: { emoji: string; count: number }[]) => (
    <div className="flex flex-wrap gap-1 justify-center">
      {items.map((item, i) => (
        <span key={i} className="text-2xl">
          {Array.from({ length: item.count }, (_, j) => (
            <span key={j}>{item.emoji}</span>
          ))}
        </span>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium">Which side is heavier? ⚖️</p>

      {/* Scale display */}
      <div className="flex items-end gap-4 w-full max-w-md">
        <div className={`flex-1 border-2 rounded-2xl p-4 min-h-[80px] flex items-center justify-center ${
          feedback !== null && q.answer === 'left' ? 'border-green-400 bg-green-50' : 'border-blue-200 bg-blue-50'
        }`}>
          {renderSide(q.left)}
        </div>
        <span className="text-4xl mb-2">⚖️</span>
        <div className={`flex-1 border-2 rounded-2xl p-4 min-h-[80px] flex items-center justify-center ${
          feedback !== null && q.answer === 'right' ? 'border-green-400 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          {renderSide(q.right)}
        </div>
      </div>

      {/* Answer buttons */}
      <div className="flex gap-3">
        <button onClick={() => handlePick('left')}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all active:scale-95 ${
            feedback !== null
              ? q.answer === 'left' ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-400'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
          }`}>
          ⬅️ Left
        </button>
        <button onClick={() => handlePick('equal')}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all active:scale-95 ${
            feedback !== null
              ? q.answer === 'equal' ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-400'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}>
          ⚖️ Equal
        </button>
        <button onClick={() => handlePick('right')}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all active:scale-95 ${
            feedback !== null
              ? q.answer === 'right' ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-400'
              : 'bg-red-100 hover:bg-red-200 text-red-500'
          }`}>
          Right ➡️
        </button>
      </div>

      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Great weighing! ⚖️✨' : `The ${q.answer} side was heavier!`}
        </div>
      )}
    </div>
  )
}
