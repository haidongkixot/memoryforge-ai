'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

interface EmoQ { scenario: string; answer: string; opts: string[]; explanation: string }

const QUESTIONS: EmoQ[] = [
  { scenario: '🎂 Your friend got a birthday surprise!', answer: '😊', opts: ['😊', '😢', '😡', '😨'], explanation: 'Surprises make us happy!' },
  { scenario: '🧸 Someone broke your favorite toy', answer: '😢', opts: ['😊', '😢', '😡', '😴'], explanation: 'It\'s okay to feel sad' },
  { scenario: '🏆 You won the spelling bee!', answer: '🤩', opts: ['🤩', '😨', '😢', '😡'], explanation: 'Winning feels exciting!' },
  { scenario: '🐕 A big dog is barking at you', answer: '😨', opts: ['😊', '😴', '😨', '🤩'], explanation: 'Feeling scared is natural' },
  { scenario: '😴 It\'s way past your bedtime', answer: '🥱', opts: ['😡', '🥱', '🤩', '😊'], explanation: 'Your body needs rest!' },
  { scenario: '🍫 Someone ate your snack without asking', answer: '😡', opts: ['😊', '😢', '😡', '🥱'], explanation: 'That would make anyone upset' },
  { scenario: '🎢 You\'re about to ride a roller coaster', answer: '😨', opts: ['😨', '😢', '🥱', '😡'], explanation: 'Exciting but a little scary!' },
  { scenario: '📚 Your friend shared their book with you', answer: '🥰', opts: ['😡', '🥰', '😨', '😢'], explanation: 'Sharing makes us feel warm!' },
  { scenario: '🌧️ The picnic was canceled due to rain', answer: '😞', opts: ['🤩', '😞', '😡', '🥱'], explanation: 'Disappointed when plans change' },
  { scenario: '🎨 You finished painting a beautiful picture', answer: '😊', opts: ['😊', '😨', '😢', '😡'], explanation: 'Creating art feels great!' },
  { scenario: '👋 Your best friend is moving away', answer: '😢', opts: ['😊', '😢', '🤩', '😡'], explanation: 'Missing friends makes us sad' },
  { scenario: '🧪 You have a big test tomorrow', answer: '😰', opts: ['😊', '🥱', '😰', '🤩'], explanation: 'Tests can be nerve-wracking' },
]

export default function EmotionDetective({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [shuffled] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10))
  const total = shuffled.length

  const handlePick = useCallback((opt: string) => {
    if (feedback !== null) return
    const correct = opt === shuffled[round].answer
    const pts = correct ? 100 : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setFeedback(null) }
    }, 2000)
  }, [round, total, feedback, score, shuffled, onComplete])

  const q = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Case {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <div className="text-center">
        <p className="text-[#6B7280] font-medium mb-2">How would this make you feel?</p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl px-6 py-5 max-w-md">
          <p className="text-xl font-semibold text-[#1f2937]">{q.scenario}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {q.opts.map(opt => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:scale-105'
          if (feedback !== null) {
            if (opt === q.answer) cls = 'bg-green-100 border-2 border-green-400 scale-110'
            else cls = 'bg-gray-100 border-2 border-gray-200 opacity-50'
          }
          return (
            <button key={opt} onClick={() => handlePick(opt)}
              className={`${cls} rounded-2xl py-5 text-5xl transition-all active:scale-95`}>
              {opt}
            </button>
          )
        })}
      </div>

      {feedback !== null && (
        <div className="text-center max-w-md">
          <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
            {feedback ? 'Great empathy! 💛' : `The answer was ${q.answer}`}
          </div>
          <p className="text-sm text-[#6B7280] mt-1">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}
