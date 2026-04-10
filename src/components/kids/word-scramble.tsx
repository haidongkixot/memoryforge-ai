'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

const WORDS = [
  { word: 'APPLE', hint: '🍎 A red fruit' },
  { word: 'HOUSE', hint: '🏠 You live here' },
  { word: 'WATER', hint: '💧 You drink this' },
  { word: 'HAPPY', hint: '😊 A feeling of joy' },
  { word: 'TIGER', hint: '🐯 A big striped cat' },
  { word: 'MUSIC', hint: '🎵 You hear this' },
  { word: 'CLOUD', hint: '☁️ In the sky' },
  { word: 'BEACH', hint: '🏖️ Sand and waves' },
  { word: 'GREEN', hint: '🟢 A color of grass' },
  { word: 'LIGHT', hint: '💡 The opposite of dark' },
  { word: 'PLANT', hint: '🌱 It grows in soil' },
  { word: 'SMILE', hint: '😄 What you do when happy' },
  { word: 'DREAM', hint: '💭 You have this when sleeping' },
  { word: 'BRAIN', hint: '🧠 Your thinking organ' },
  { word: 'SPACE', hint: '🚀 Where stars live' },
]

function scramble(word: string): string {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('') === word ? scramble(word) : arr.join('')
}

export default function WordScramble({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [showHint, setShowHint] = useState(false)
  const [shuffled] = useState(() =>
    [...WORDS].sort(() => Math.random() - 0.5).slice(0, 10).map(w => ({
      ...w,
      scrambled: scramble(w.word),
    }))
  )
  const total = shuffled.length

  const handleSubmit = useCallback(() => {
    if (feedback !== null || !input.trim()) return
    const correct = input.toUpperCase().trim() === shuffled[round].word
    const pts = correct ? (showHint ? 50 : 100) : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setInput(''); setFeedback(null); setShowHint(false) }
    }, 1200)
  }, [input, round, total, feedback, score, shuffled, showHint, onComplete])

  const w = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Word {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium">Unscramble the letters to make a word!</p>

      {/* Scrambled letters */}
      <div className="flex gap-2 justify-center">
        {w.scrambled.split('').map((letter, i) => (
          <span key={i}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-md">
            {letter}
          </span>
        ))}
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-yellow-700 text-sm">
          💡 Hint: {w.hint}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 w-full max-w-sm">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Type the word..."
          maxLength={w.word.length}
          className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center text-[#1f2937] focus:border-purple-400 focus:outline-none uppercase tracking-widest"
          disabled={feedback !== null}
        />
      </div>

      <div className="flex gap-3">
        {!showHint && feedback === null && (
          <button onClick={() => setShowHint(true)}
            className="border-2 border-yellow-300 text-yellow-600 px-5 py-2 rounded-full font-semibold hover:bg-yellow-50 transition-colors text-sm">
            Hint 💡
          </button>
        )}
        {feedback === null && (
          <button onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-2.5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
            Check! ✅
          </button>
        )}
      </div>

      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Word genius! 📚' : `The word was: ${w.word}`}
        </div>
      )}
    </div>
  )
}
