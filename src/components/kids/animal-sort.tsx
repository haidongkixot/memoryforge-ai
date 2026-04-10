'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

interface SortQ { question: string; groupA: string; groupB: string; items: { emoji: string; group: 'A' | 'B' }[] }

const ALL_ROUNDS: SortQ[] = [
  { question: 'Can it fly?', groupA: 'Yes ✈️', groupB: 'No 🚫', items: [{ emoji: '🦅', group: 'A' }, { emoji: '🐘', group: 'B' }, { emoji: '🦋', group: 'A' }, { emoji: '🐍', group: 'B' }, { emoji: '🦜', group: 'A' }, { emoji: '🐢', group: 'B' }] },
  { question: 'Does it live in water?', groupA: 'Water 🌊', groupB: 'Land 🏔️', items: [{ emoji: '🐟', group: 'A' }, { emoji: '🦁', group: 'B' }, { emoji: '🐙', group: 'A' }, { emoji: '🐒', group: 'B' }, { emoji: '🦈', group: 'A' }, { emoji: '🐄', group: 'B' }] },
  { question: 'Is it a pet?', groupA: 'Pet 🏠', groupB: 'Wild 🌿', items: [{ emoji: '🐶', group: 'A' }, { emoji: '🐺', group: 'B' }, { emoji: '🐱', group: 'A' }, { emoji: '🐻', group: 'B' }, { emoji: '🐹', group: 'A' }, { emoji: '🦊', group: 'B' }] },
  { question: 'Does it have legs?', groupA: 'Legs 🦵', groupB: 'No Legs 🐛', items: [{ emoji: '🐕', group: 'A' }, { emoji: '🐍', group: 'B' }, { emoji: '🐓', group: 'A' }, { emoji: '🐛', group: 'B' }, { emoji: '🐸', group: 'A' }, { emoji: '🐟', group: 'B' }] },
  { question: 'Is it bigger than you?', groupA: 'Bigger 📏', groupB: 'Smaller 🤏', items: [{ emoji: '🐘', group: 'A' }, { emoji: '🐁', group: 'B' }, { emoji: '🦒', group: 'A' }, { emoji: '🐜', group: 'B' }, { emoji: '🐋', group: 'A' }, { emoji: '🐦', group: 'B' }] },
  { question: 'Does it have fur?', groupA: 'Furry 🧸', groupB: 'Not Furry 🦎', items: [{ emoji: '🐻', group: 'A' }, { emoji: '🐊', group: 'B' }, { emoji: '🐰', group: 'A' }, { emoji: '🐸', group: 'B' }, { emoji: '🦊', group: 'A' }, { emoji: '🐢', group: 'B' }] },
  { question: 'Is it nocturnal?', groupA: 'Night 🌙', groupB: 'Day ☀️', items: [{ emoji: '🦉', group: 'A' }, { emoji: '🐓', group: 'B' }, { emoji: '🦇', group: 'A' }, { emoji: '🦅', group: 'B' }, { emoji: '🐺', group: 'A' }, { emoji: '🐝', group: 'B' }] },
  { question: 'Does it eat meat?', groupA: 'Meat 🥩', groupB: 'Plants 🥬', items: [{ emoji: '🦁', group: 'A' }, { emoji: '🐄', group: 'B' }, { emoji: '🦈', group: 'A' }, { emoji: '🐰', group: 'B' }, { emoji: '🐊', group: 'A' }, { emoji: '🐴', group: 'B' }] },
  { question: 'Does it have a tail?', groupA: 'Tail 🐒', groupB: 'No Tail 🐸', items: [{ emoji: '🐕', group: 'A' }, { emoji: '🐸', group: 'B' }, { emoji: '🐱', group: 'A' }, { emoji: '🦀', group: 'B' }, { emoji: '🐒', group: 'A' }, { emoji: '🐙', group: 'B' }] },
  { question: 'Can it be found on a farm?', groupA: 'Farm 🚜', groupB: 'Wild 🌲', items: [{ emoji: '🐄', group: 'A' }, { emoji: '🦁', group: 'B' }, { emoji: '🐓', group: 'A' }, { emoji: '🐻', group: 'B' }, { emoji: '🐖', group: 'A' }, { emoji: '🦊', group: 'B' }] },
  { question: 'Does it have wings?', groupA: 'Wings 🦅', groupB: 'No Wings 🐕', items: [{ emoji: '🦋', group: 'A' }, { emoji: '🐍', group: 'B' }, { emoji: '🐝', group: 'A' }, { emoji: '🐘', group: 'B' }, { emoji: '🦜', group: 'A' }, { emoji: '🐟', group: 'B' }] },
  { question: 'Is it an insect?', groupA: 'Insect 🐛', groupB: 'Not Insect 🐕', items: [{ emoji: '🐜', group: 'A' }, { emoji: '🐶', group: 'B' }, { emoji: '🐝', group: 'A' }, { emoji: '🐱', group: 'B' }, { emoji: '🦗', group: 'A' }, { emoji: '🐟', group: 'B' }] },
  { question: 'Does it live in a cold place?', groupA: 'Cold ❄️', groupB: 'Warm ☀️', items: [{ emoji: '🐧', group: 'A' }, { emoji: '🦁', group: 'B' }, { emoji: '🦭', group: 'A' }, { emoji: '🐒', group: 'B' }, { emoji: '🐻‍❄️', group: 'A' }, { emoji: '🦎', group: 'B' }] },
  { question: 'Is it dangerous?', groupA: 'Dangerous ⚠️', groupB: 'Friendly 😊', items: [{ emoji: '🦈', group: 'A' }, { emoji: '🐰', group: 'B' }, { emoji: '🐊', group: 'A' }, { emoji: '🐹', group: 'B' }, { emoji: '🦁', group: 'A' }, { emoji: '🐶', group: 'B' }] },
  { question: 'Can it climb trees?', groupA: 'Climber 🌲', groupB: 'Ground 🏜️', items: [{ emoji: '🐒', group: 'A' }, { emoji: '🐘', group: 'B' }, { emoji: '🐱', group: 'A' }, { emoji: '🐄', group: 'B' }, { emoji: '🐿️', group: 'A' }, { emoji: '🦈', group: 'B' }] },
]

export default function AnimalSort({ onComplete, level = 1 }: Props) {
  const count = Math.min(4 + Math.floor(level / 3), 15)
  const shuffled = useMemo(() => [...ALL_ROUNDS].sort(() => Math.random() - 0.5).slice(0, count), [level, count])
  const total = shuffled.length
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [sorted, setSorted] = useState<Record<number, 'A' | 'B'>>({})
  const [checked, setChecked] = useState(false)
  const q = shuffled[round]

  const handleSort = useCallback((idx: number, group: 'A' | 'B') => {
    if (checked) return
    setSorted(s => ({ ...s, [idx]: group }))
  }, [checked])

  const handleCheck = useCallback(() => {
    if (Object.keys(sorted).length < q.items.length) return
    setChecked(true)
    const correct = q.items.filter((item, i) => sorted[i] === item.group).length
    const pts = Math.round((correct / q.items.length) * (50 + level * 5))
    const newScore = score + pts

    setTimeout(() => {
      if (round + 1 >= total) onComplete(newScore)
      else { setRound(r => r + 1); setSorted({}); setChecked(false) }
    }, 1500)

    setScore(newScore)
  }, [sorted, q, round, total, score, level, onComplete])

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
              <span key={i} className={`text-2xl px-2 py-1 rounded-xl ${checked ? (item.group === 'A' ? 'bg-green-200' : 'bg-red-200') : 'bg-white'}`}>{item.emoji}</span>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
          <div className="font-bold text-red-500 mb-2">{q.groupB}</div>
          <div className="min-h-[60px] flex flex-wrap gap-2 justify-center">
            {q.items.map((item, i) => sorted[i] === 'B' && (
              <span key={i} className={`text-2xl px-2 py-1 rounded-xl ${checked ? (item.group === 'B' ? 'bg-green-200' : 'bg-red-200') : 'bg-white'}`}>{item.emoji}</span>
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
                <button onClick={() => handleSort(i, 'A')} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-0.5 rounded-full transition-colors font-medium">{q.groupA.split(' ')[0]}</button>
                <button onClick={() => handleSort(i, 'B')} className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-0.5 rounded-full transition-colors font-medium">{q.groupB.split(' ')[0]}</button>
              </div>
            </div>
          )
        })}
      </div>

      {Object.keys(sorted).length === q.items.length && !checked && (
        <button onClick={handleCheck} className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">Check! ✅</button>
      )}
    </div>
  )
}
