'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface Props { onComplete: (score: number) => void }

interface MathQ { question: string; answer: number; opts: number[] }

function genQuestion(round: number): MathQ {
  const maxNum = round < 5 ? 10 : round < 10 ? 20 : 50
  const ops = round < 5 ? ['+', '-'] : ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]

  let a: number, b: number, answer: number

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * maxNum) + 1
      b = Math.floor(Math.random() * maxNum) + 1
      answer = a + b
      break
    case '-':
      a = Math.floor(Math.random() * maxNum) + 2
      b = Math.floor(Math.random() * a) + 1
      answer = a - b
      break
    case '×':
      a = Math.floor(Math.random() * 10) + 1
      b = Math.floor(Math.random() * 10) + 1
      answer = a * b
      break
    default:
      a = 1; b = 1; answer = 2
  }

  const opts = new Set<number>([answer])
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5
    const wrong = answer + (offset === 0 ? 1 : offset)
    if (wrong >= 0) opts.add(wrong)
  }

  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    opts: Array.from(opts).sort(() => Math.random() - 0.5),
  }
}

export default function NumberNinja({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [questions] = useState(() => Array.from({ length: 15 }, (_, i) => genQuestion(i)))
  const total = questions.length
  const startRef = useRef(Date.now())

  useEffect(() => {
    if (feedback !== null) return
    if (timeLeft <= 0) {
      setFeedback(false)
      setTimeout(() => {
        if (round + 1 >= total) onComplete(score)
        else { setRound(r => r + 1); setFeedback(null); setTimeLeft(10); startRef.current = Date.now() }
      }, 800)
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, feedback, round, total, score, onComplete])

  const handlePick = useCallback((opt: number) => {
    if (feedback !== null) return
    const correct = opt === questions[round].answer
    const speed = Math.max(0, 10 - Math.round((Date.now() - startRef.current) / 1000))
    const pts = correct ? 50 + speed * 5 : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setFeedback(null); setTimeLeft(10); startRef.current = Date.now() }
    }, 800)
  }, [round, total, feedback, score, questions, onComplete])

  const q = questions[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Q {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className={`px-3 py-1 rounded-full font-bold ${timeLeft <= 3 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / 10) * 100}%`, backgroundColor: timeLeft > 3 ? '#22C55E' : '#EF4444' }} />
      </div>

      <div className="text-center py-4">
        <span className="text-2xl">🥷</span>
        <h3 className="text-4xl font-extrabold text-[#1f2937] mt-2">{q.question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {q.opts.map((opt, i) => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-cyan-400 hover:bg-cyan-50'
          if (feedback !== null) {
            if (opt === q.answer) cls = 'bg-green-100 border-2 border-green-400 scale-105'
            else cls = 'bg-gray-100 border-2 border-gray-200 opacity-50'
          }
          return (
            <button key={i} onClick={() => handlePick(opt)}
              className={`${cls} rounded-2xl py-5 text-2xl font-bold text-[#1f2937] transition-all active:scale-95`}>
              {opt}
            </button>
          )
        })}
      </div>

      {feedback !== null && (
        <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
          {feedback ? 'Quick thinking! ⚡' : `Answer: ${q.answer}`}
        </div>
      )}
    </div>
  )
}
