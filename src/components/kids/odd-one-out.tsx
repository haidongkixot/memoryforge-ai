'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

interface Puzzle { items: string[]; oddIndex: number; reason: string }

const PUZZLES: Puzzle[] = [
  { items: ['🍎', '🍊', '🍋', '🐶'], oddIndex: 3, reason: 'Not a fruit!' },
  { items: ['✈️', '🚗', '🚌', '🌸'], oddIndex: 3, reason: 'Not a vehicle!' },
  { items: ['🎸', '🥁', '🎺', '🏀'], oddIndex: 3, reason: 'Not an instrument!' },
  { items: ['👩', '👨', '🧒', '🌲'], oddIndex: 3, reason: 'Not a person!' },
  { items: ['🐟', '🐙', '🦈', '🦁'], oddIndex: 3, reason: 'Not a sea animal!' },
  { items: ['📱', '💻', '📺', '🍕'], oddIndex: 3, reason: 'Not electronics!' },
  { items: ['⚽', '🏀', '🎾', '📖'], oddIndex: 3, reason: 'Not a ball!' },
  { items: ['🌧️', '❄️', '☀️', '🪑'], oddIndex: 3, reason: 'Not weather!' },
  { items: ['🦁', '🐯', '🐻', '🐦'], oddIndex: 3, reason: 'Not a big animal!' },
  { items: ['👟', '👢', '🩴', '🎩'], oddIndex: 3, reason: 'Not footwear!' },
  { items: ['🍕', '🍔', '🌮', '🔨'], oddIndex: 3, reason: 'Not food!' },
  { items: ['🌹', '🌻', '🌷', '⚡'], oddIndex: 3, reason: 'Not a flower!' },
  { items: ['🏠', '🏰', '🏫', '🌊'], oddIndex: 3, reason: 'Not a building!' },
  { items: ['🎨', '🖌️', '🖍️', '🔧'], oddIndex: 3, reason: 'Not for art!' },
  { items: ['🧊', '❄️', '🌨️', '🔥'], oddIndex: 3, reason: 'Not cold!' },
  { items: ['🍰', '🧁', '🍩', '🥦'], oddIndex: 3, reason: 'Not a dessert!' },
  { items: ['🚂', '🚁', '⛵', '📚'], oddIndex: 3, reason: 'Not a vehicle!' },
  { items: ['🐕', '🐈', '🐠', '🪨'], oddIndex: 3, reason: 'Not an animal!' },
  { items: ['🌍', '🌙', '⭐', '🎈'], oddIndex: 3, reason: 'Not in space!' },
  { items: ['🔴', '🟢', '🔵', '🎵'], oddIndex: 3, reason: 'Not a color circle!' },
  { items: ['🧤', '🧣', '🧥', '🍭'], oddIndex: 3, reason: 'Not clothing!' },
  { items: ['📐', '📏', '✏️', '🐸'], oddIndex: 3, reason: 'Not school supplies!' },
  { items: ['🥁', '🎹', '🎻', '🏈'], oddIndex: 3, reason: 'Not an instrument!' },
  { items: ['🍌', '🥭', '🍑', '🧲'], oddIndex: 3, reason: 'Not a fruit!' },
  { items: ['🦅', '🦜', '🐧', '🐍'], oddIndex: 3, reason: 'Not a bird!' },
]

function shuffleWithOdd(items: string[], oddIdx: number): { shuffled: string[]; newOddIdx: number } {
  const entries = items.map((item, i) => ({ item, isOdd: i === oddIdx }))
  const s = entries.sort(() => Math.random() - 0.5)
  return { shuffled: s.map(e => e.item), newOddIdx: s.findIndex(e => e.isOdd) }
}

export default function OddOneOut({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)

  const shuffledPuzzles = useMemo(() => {
    const p = [...PUZZLES].sort(() => Math.random() - 0.5).slice(0, rounds)
    return p.map(pz => {
      const { shuffled, newOddIdx } = shuffleWithOdd(pz.items, pz.oddIndex)
      return { items: shuffled, oddIndex: newOddIdx, reason: pz.reason }
    })
  }, [level, rounds])

  const total = shuffledPuzzles.length

  const handlePick = useCallback((idx: number) => {
    if (feedback !== null) return
    const correct = idx === shuffledPuzzles[round].oddIndex
    const pts = correct ? 50 + level * 5 : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setFeedback(null) }
    }, 1200)
  }, [round, total, feedback, score, shuffledPuzzles, level, onComplete])

  const p = shuffledPuzzles[round]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <div className="text-center">
        <p className="text-xl font-bold text-[#1f2937] mb-1">🔍 Find the Odd One Out!</p>
        <p className="text-[#6B7280]">One of these doesn&apos;t belong. Which one?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {p.items.map((item, i) => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 hover:scale-105'
          if (feedback !== null) {
            if (i === p.oddIndex) cls = 'bg-green-100 border-2 border-green-400 scale-110'
            else cls = 'bg-gray-100 border-2 border-gray-200 opacity-60'
          }
          return (
            <button key={i} onClick={() => handlePick(i)}
              className={`${cls} rounded-2xl py-6 text-5xl transition-all active:scale-95`}>
              {item}
            </button>
          )
        })}
      </div>

      {feedback !== null && (
        <div className={`text-center ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          <div className="text-lg font-bold">{feedback ? 'You found it! 🎯' : 'Not quite! 🤔'}</div>
          <div className="text-sm text-[#6B7280] mt-1">{p.reason}</div>
        </div>
      )}
    </div>
  )
}
