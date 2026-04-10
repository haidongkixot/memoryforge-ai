'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

interface CodeQ { encoded: string; answer: string; hint: string }

// A=1, B=2, ..., Z=26
function encode(word: string): string {
  return word.split('').map(c => c.charCodeAt(0) - 64).join(' - ')
}

const WORDS = ['CAT', 'DOG', 'SUN', 'BEE', 'HAT', 'RED', 'BIG', 'CUP', 'FUN', 'MAP', 'RUN', 'ZIP']

const QUESTIONS: CodeQ[] = WORDS.map(w => ({
  encoded: encode(w),
  answer: w,
  hint: `${w.length} letters, starts with ${w[0]}`,
}))

const ALPHABET_CHART = 'A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9  J=10  K=11  L=12  M=13  N=14  O=15  P=16  Q=17  R=18  S=19  T=20  U=21  V=22  W=23  X=24  Y=25  Z=26'

export default function CodeBreaker({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [showChart, setShowChart] = useState(false)
  const [shuffled] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10))
  const total = shuffled.length

  const handleSubmit = useCallback(() => {
    if (feedback !== null || !input.trim()) return
    const correct = input.toUpperCase().trim() === shuffled[round].answer
    const pts = correct ? (showChart ? 50 : 100) : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setInput(''); setFeedback(null); setShowChart(false) }
    }, 1200)
  }, [input, round, total, feedback, score, shuffled, showChart, onComplete])

  const q = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Code {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <div className="text-center">
        <p className="text-[#6B7280] font-medium mb-1">Crack the code! Each number = a letter</p>
        <p className="text-xs text-[#9CA3AF]">A=1, B=2, C=3 ... Z=26</p>
      </div>

      {/* Encoded message */}
      <div className="bg-gray-900 text-green-400 font-mono text-3xl sm:text-4xl px-8 py-5 rounded-2xl tracking-wider shadow-lg">
        {q.encoded}
      </div>

      {/* Hint */}
      <p className="text-sm text-[#9CA3AF]">💡 {q.hint}</p>

      {/* Alphabet chart toggle */}
      {showChart ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-xs text-yellow-700 font-mono max-w-md text-center">
          {ALPHABET_CHART}
        </div>
      ) : (
        <button onClick={() => setShowChart(true)}
          className="text-xs border border-yellow-300 text-yellow-600 px-4 py-1.5 rounded-full hover:bg-yellow-50 transition-colors font-semibold">
          Show Alphabet Chart 📜
        </button>
      )}

      {/* Input */}
      <div className="flex gap-2 w-full max-w-sm">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Type the word..."
          className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center text-[#1f2937] focus:border-green-400 focus:outline-none uppercase tracking-widest"
          disabled={feedback !== null}
        />
      </div>

      {feedback === null && (
        <button onClick={handleSubmit}
          className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-8 py-2.5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
          Decode! 🔓
        </button>
      )}

      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Code cracked! 🔐✨' : `The word was: ${q.answer}`}
        </div>
      )}
    </div>
  )
}
