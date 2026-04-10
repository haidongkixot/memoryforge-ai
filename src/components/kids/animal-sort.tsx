'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

interface SortQ { question: string; groupA: string; groupB: string; items: { emoji: string; label: string; group: 'A' | 'B' }[] }

const ROUNDS: SortQ[] = [
  { question: 'Can it fly?', groupA: 'Yes ✈️', groupB: 'No 🚫', items: [
    { emoji: '🦅', label: 'Eagle', group: 'A' }, { emoji: '🐘', label: 'Elephant', group: 'B' },
    { emoji: '🦋', label: 'Butterfly', group: 'A' }, { emoji: '🐍', label: 'Snake', group: 'B' },
    { emoji: '🦜', label: 'Parrot', group: 'A' }, { emoji: '🐢', label: 'Turtle', group: 'B' },
  ]},
  { question: 'Does it live in water?', groupA: 'Water 🌊', groupB: 'Land 🏔️', items: [
    { emoji: '🐟', label: 'Fish', group: 'A' }, { emoji: '🦁', label: 'Lion', group: 'B' },
    { emoji: '🐙', label: 'Octopus', group: 'A' }, { emoji: '🐒', label: 'Monkey', group: 'B' },
    { emoji: '🦈', label: 'Shark', group: 'A' }, { emoji: '🐄', label: 'Cow', group: 'B' },
  ]},
  { question: 'Is it a pet?', groupA: 'Pet 🏠', groupB: 'Wild 🌿', items: [
    { emoji: '🐶', label: 'Dog', group: 'A' }, { emoji: '🐺', label: 'Wolf', group: 'B' },
    { emoji: '🐱', label: 'Cat', group: 'A' }, { emoji: '🐻', label: 'Bear', group: 'B' },
    { emoji: '🐹', label: 'Hamster', group: 'A' }, { emoji: '🦊', label: 'Fox', group: 'B' },
  ]},
  { question: 'Does it have legs?', groupA: 'Has Legs 🦵', groupB: 'No Legs 🐛', items: [
    { emoji: '🐕', label: 'Dog', group: 'A' }, { emoji: '🐍', label: 'Snake', group: 'B' },
    { emoji: '🐓', label: 'Chicken', group: 'A' }, { emoji: '🐛', label: 'Worm', group: 'B' },
    { emoji: '🐸', label: 'Frog', group: 'A' }, { emoji: '🐟', label: 'Fish', group: 'B' },
  ]},
  { question: 'Is it bigger than you?', groupA: 'Bigger 📏', groupB: 'Smaller 🤏', items: [
    { emoji: '🐘', label: 'Elephant', group: 'A' }, { emoji: '🐁', label: 'Mouse', group: 'B' },
    { emoji: '🦒', label: 'Giraffe', group: 'A' }, { emoji: '🐜', label: 'Ant', group: 'B' },
    { emoji: '🐋', label: 'Whale', group: 'A' }, { emoji: '🐦', label: 'Bird', group: 'B' },
  ]},
  { question: 'Does it have fur?', groupA: 'Furry 🧸', groupB: 'Not Furry 🦎', items: [
    { emoji: '🐻', label: 'Bear', group: 'A' }, { emoji: '🐊', label: 'Crocodile', group: 'B' },
    { emoji: '🐰', label: 'Rabbit', group: 'A' }, { emoji: '🐸', label: 'Frog', group: 'B' },
    { emoji: '🦊', label: 'Fox', group: 'A' }, { emoji: '🐢', label: 'Turtle', group: 'B' },
  ]},
  { question: 'Is it nocturnal?', groupA: 'Night 🌙', groupB: 'Day ☀️', items: [
    { emoji: '🦉', label: 'Owl', group: 'A' }, { emoji: '🐓', label: 'Rooster', group: 'B' },
    { emoji: '🦇', label: 'Bat', group: 'A' }, { emoji: '🦅', label: 'Eagle', group: 'B' },
    { emoji: '🐺', label: 'Wolf', group: 'A' }, { emoji: '🐝', label: 'Bee', group: 'B' },
  ]},
  { question: 'Does it eat meat?', groupA: 'Meat Eater 🥩', groupB: 'Plant Eater 🥬', items: [
    { emoji: '🦁', label: 'Lion', group: 'A' }, { emoji: '🐄', label: 'Cow', group: 'B' },
    { emoji: '🦈', label: 'Shark', group: 'A' }, { emoji: '🐰', label: 'Rabbit', group: 'B' },
    { emoji: '🐊', label: 'Crocodile', group: 'A' }, { emoji: '🐴', label: 'Horse', group: 'B' },
  ]},
]

export default function AnimalSort({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [sorted, setSorted] = useState<Record<number, 'A' | 'B'>>({})
  const [checked, setChecked] = useState(false)
  const [shuffled] = useState(() => [...ROUNDS].sort(() => Math.random() - 0.5))
  const total = shuffled.length
  const q = shuffled[round]

  const handleSort = useCallback((idx: number, group: 'A' | 'B') => {
    if (checked) return
    setSorted(s => ({ ...s, [idx]: group }))
  }, [checked])

  const handleCheck = useCallback(() => {
    if (Object.keys(sorted).length < q.items.length) return
    setChecked(true)
    const correct = q.items.filter((item, i) => sorted[i] === item.group).length
    const pts = Math.round((correct / q.items.length) * 100)
    const newScore = score + pts

    setTimeout(() => {
      if (round + 1 >= total) {
        onComplete(newScore)
      } else {
        setRound(r => r + 1)
        setSorted({})
        setChecked(false)
      }
    }, 1500)

    setScore(newScore)
  }, [sorted, q, round, total, score, onComplete])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-lg text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <h3 className="text-xl font-bold text-[#1f2937]">{q.question}</h3>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-2">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 text-center">
          <div className="font-bold text-green-600 mb-2">{q.groupA}</div>
          <div className="min-h-[60px] flex flex-wrap gap-2 justify-center">
            {q.items.map((item, i) => sorted[i] === 'A' && (
              <span key={i} className={`text-2xl px-2 py-1 rounded-xl ${checked ? (item.group === 'A' ? 'bg-green-200' : 'bg-red-200') : 'bg-white'}`}>
                {item.emoji}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
          <div className="font-bold text-red-500 mb-2">{q.groupB}</div>
          <div className="min-h-[60px] flex flex-wrap gap-2 justify-center">
            {q.items.map((item, i) => sorted[i] === 'B' && (
              <span key={i} className={`text-2xl px-2 py-1 rounded-xl ${checked ? (item.group === 'B' ? 'bg-green-200' : 'bg-red-200') : 'bg-white'}`}>
                {item.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {q.items.map((item, i) => {
          if (sorted[i]) return null
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-3xl bg-white border-2 border-gray-200 rounded-xl px-3 py-2">{item.emoji}</span>
              <div className="flex gap-1">
                <button onClick={() => handleSort(i, 'A')} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-0.5 rounded-full transition-colors font-medium">
                  {q.groupA.split(' ')[0]}
                </button>
                <button onClick={() => handleSort(i, 'B')} className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-0.5 rounded-full transition-colors font-medium">
                  {q.groupB.split(' ')[0]}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {Object.keys(sorted).length === q.items.length && !checked && (
        <button onClick={handleCheck}
          className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
          Check! ✅
        </button>
      )}
    </div>
  )
}
