'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

const PATTERNS = [
  { seq: ['🐶', '🐱', '🐶', '🐱', '🐶'], answer: '🐱', opts: ['🐱', '🐶', '🐰', '🐸'] },
  { seq: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', opts: ['🔴', '🔵', '🟢', '🟡'] },
  { seq: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', opts: ['⭐', '🌙', '☀️', '🌍'] },
  { seq: ['🍎', '🍊', '🍋', '🍎', '🍊'], answer: '🍋', opts: ['🍎', '🍊', '🍋', '🍇'] },
  { seq: ['👆', '👇', '👆', '👇', '👆'], answer: '👇', opts: ['👆', '👇', '👈', '👉'] },
  { seq: ['🌸', '🌸', '🌻', '🌻', '🌸'], answer: '🌸', opts: ['🌸', '🌻', '🌹', '🌺'] },
  { seq: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣'], answer: '3️⃣', opts: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'] },
  { seq: ['🐟', '🐟', '🐙', '🐟', '🐟'], answer: '🐙', opts: ['🐟', '🐙', '🦀', '🐳'] },
  { seq: ['🎵', '🎶', '🎵', '🎶', '🎵'], answer: '🎶', opts: ['🎵', '🎶', '🔔', '🎺'] },
  { seq: ['🟩', '🟨', '🟩', '🟨', '🟩'], answer: '🟨', opts: ['🟩', '🟨', '🟦', '🟥'] },
  { seq: ['🚗', '🚌', '🚗', '🚌', '🚗'], answer: '🚌', opts: ['🚗', '🚌', '🚀', '✈️'] },
  { seq: ['😊', '😢', '😊', '😢', '😊'], answer: '😢', opts: ['😊', '😢', '😡', '😴'] },
]

export default function EmojiPattern({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [shuffled] = useState(() => [...PATTERNS].sort(() => Math.random() - 0.5).slice(0, 10))
  const total = shuffled.length

  const handlePick = useCallback((opt: string) => {
    if (feedback !== null) return
    const correct = opt === shuffled[round].answer
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
    }, 1000)
  }, [round, total, feedback, score, shuffled, onComplete])

  const pattern = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium">What comes next in the pattern?</p>

      <div className="flex items-center gap-2 bg-gray-50 px-6 py-4 rounded-2xl">
        {pattern.seq.map((e, i) => (
          <span key={i} className="text-3xl sm:text-4xl">{e}</span>
        ))}
        <span className="text-3xl sm:text-4xl w-12 h-12 flex items-center justify-center border-2 border-dashed border-orange-300 rounded-xl bg-orange-50 text-orange-400 font-bold">?</span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {pattern.opts.map(opt => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50'
          if (feedback !== null) {
            if (opt === pattern.answer) cls = 'bg-green-100 border-2 border-green-400 scale-105'
            else if (feedback === false) cls = 'bg-gray-100 border-2 border-gray-200 opacity-50'
          }
          return (
            <button key={opt} onClick={() => handlePick(opt)}
              className={`${cls} rounded-2xl py-4 text-4xl transition-all active:scale-95`}>
              {opt}
            </button>
          )
        })}
      </div>

      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Correct! 🎉' : 'Not quite! 💪 Try the next one!'}
        </div>
      )}
    </div>
  )
}
