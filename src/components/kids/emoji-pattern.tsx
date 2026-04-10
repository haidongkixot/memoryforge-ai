'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const EMOJI_SETS = [
  ['🐶', '🐱', '🐰', '🐸', '🐵'], ['🍎', '🍊', '🍋', '🍇', '🍓'], ['⭐', '🌙', '☀️', '🌍', '💫'],
  ['🔴', '🔵', '🟢', '🟡', '🟣'], ['👆', '👇', '👈', '👉', '🤚'], ['🌸', '🌻', '🌹', '🌺', '🌷'],
  ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], ['🐟', '🐙', '🦀', '🐳', '🦈'], ['🎵', '🎶', '🔔', '🎺', '🥁'],
  ['🚗', '🚌', '🚀', '✈️', '🚂'], ['😊', '😢', '😡', '😴', '🤩'], ['🏠', '🏰', '🏫', '🏥', '⛪'],
  ['🎨', '🖌️', '🎭', '🎪', '🎬'], ['💎', '🔮', '💰', '👑', '🏆'], ['🌈', '☁️', '🌧️', '❄️', '⚡'],
]

function generatePattern(level: number, seed: number) {
  const setIdx = (seed * 7 + level) % EMOJI_SETS.length
  const emojis = EMOJI_SETS[setIdx]
  const seqLen = Math.min(3 + Math.floor(level / 5), 7) // 3→7 items in pattern unit
  const patternLen = level <= 10 ? 5 : level <= 20 ? 6 : 7 // visible sequence length
  const uniqueCount = Math.min(2 + Math.floor(level / 8), 4) // how many unique emojis used

  const base = emojis.slice(0, uniqueCount)
  const pattern: string[] = []
  for (let i = 0; i < patternLen; i++) pattern.push(base[i % base.length])
  const answer = base[patternLen % base.length]

  const opts = [answer]
  const available = emojis.filter(e => !opts.includes(e))
  while (opts.length < 4 && available.length > 0) {
    opts.push(available.splice(Math.floor(Math.random() * available.length), 1)[0])
  }
  while (opts.length < 4) opts.push(emojis[opts.length % emojis.length])

  return { seq: pattern, answer, opts: opts.sort(() => Math.random() - 0.5) }
}

export default function EmojiPattern({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15) // 6→15 rounds
  const puzzles = useMemo(() => Array.from({ length: rounds }, (_, i) => generatePattern(level, i + level * 100)), [level, rounds])
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

  const pattern = puzzles[round]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Round {round + 1}/{rounds}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium">What comes next in the pattern?</p>

      <div className="flex items-center gap-2 bg-gray-50 px-6 py-4 rounded-2xl flex-wrap justify-center">
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
