'use client'
import { useState, useCallback, useEffect, useRef } from 'react'

interface Props { onComplete: (score: number) => void }

const WORD_BANK = [
  'APPLE', 'EAGLE', 'EARTH', 'HOUSE', 'EVERY', 'YOUNG', 'GREEN', 'NIGHT', 'TABLE', 'ENTER',
  'TIGER', 'RADIO', 'OCEAN', 'NORTH', 'HEART', 'TRAIN', 'NURSE', 'ELBOW', 'WHALE', 'EXTRA',
  'AMONG', 'GRAPE', 'PHONE', 'EIGHT', 'TOWER', 'RIVER', 'RIGHT', 'TOTAL', 'LEMON', 'NEVER',
  'ROBOT', 'TOOTH', 'HAPPY', 'YOUTH', 'HORSE', 'EVENT', 'THINK', 'KNIFE', 'EARLY', 'YIELD',
]

export default function WordChain({ onComplete }: Props) {
  const [chain, setChain] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const [score, setScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const startWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]

  useEffect(() => {
    if (!started) return
    if (timeLeft <= 0) { onComplete(score); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [started, timeLeft, score, onComplete])

  const handleStart = useCallback(() => {
    setChain([startWord])
    setStarted(true)
    setScore(0)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [startWord])

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return
    const word = input.toUpperCase().trim()
    const lastWord = chain[chain.length - 1]
    const requiredLetter = lastWord[lastWord.length - 1]

    if (word.length < 2) { setError('Too short!'); return }
    if (word[0] !== requiredLetter) { setError(`Must start with "${requiredLetter}"!`); return }
    if (chain.includes(word)) { setError('Already used!'); return }

    setChain(c => [...c, word])
    const pts = word.length * 10
    setScore(s => s + pts)
    setInput('')
    setError('')
  }, [input, chain])

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <p className="text-[#6B7280] font-medium text-center max-w-md">
          Build a chain of words! Each word must start with the last letter of the previous word. Go for 60 seconds!
        </p>
        <div className="text-center">
          <span className="text-4xl font-extrabold text-[#1f2937]">{startWord}</span>
          <p className="text-sm text-[#6B7280] mt-1">Starting word</p>
        </div>
        <button onClick={handleStart}
          className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
          Start Chain! 🔗
        </button>
      </div>
    )
  }

  const lastWord = chain[chain.length - 1]
  const lastLetter = lastWord[lastWord.length - 1]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Words: {chain.length}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className={`px-3 py-1 rounded-full font-bold ${timeLeft <= 10 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / 60) * 100}%`, backgroundColor: timeLeft > 10 ? '#22C55E' : '#EF4444' }} />
      </div>

      {/* Current word / last letter */}
      <div className="text-center">
        <div className="text-3xl font-extrabold text-[#1f2937]">{lastWord}</div>
        <p className="text-sm text-[#6B7280] mt-1">
          Next word must start with <span className="text-xl font-bold text-orange-500">{lastLetter}</span>
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2 w-full max-w-sm">
        <input ref={inputRef} type="text" value={input}
          onChange={e => { setInput(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={`${lastLetter}...`}
          className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-[#1f2937] focus:border-orange-400 focus:outline-none uppercase"
          autoFocus
        />
        <button onClick={handleSubmit}
          className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-5 py-3 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all">
          +
        </button>
      </div>

      {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

      {/* Chain display */}
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {chain.map((word, i) => (
          <span key={i} className="bg-gradient-to-r from-blue-100 to-purple-100 text-[#1f2937] px-3 py-1 rounded-full text-sm font-semibold">
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
