'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string
  benefits: string[]; rules: string[]; gameType: string; gridSize: number; timeLimit: number; maxLevel: number
}

interface Props {
  game: Game
  onComplete: (score: number, level: number, accuracy: number, moves: number) => void
}

const WORD_LISTS: Record<string, string[]> = {
  beginner: ['apple', 'blue', 'chair', 'dance', 'eagle', 'fish', 'green', 'house', 'island', 'jacket', 'kite', 'lemon'],
  intermediate: ['abstract', 'balance', 'cascade', 'derive', 'eclipse', 'fracture', 'glimpse', 'horizon', 'ignite', 'journal', 'kinetic', 'lattice', 'memoir', 'nucleus'],
  advanced: ['ambiguous', 'Byzantine', 'clandestine', 'dilemma', 'ephemeral', 'furtive', 'gregarious', 'hypothesis', 'insidious', 'juxtapose', 'kaleidoscope', 'labyrinth'],
}

const CARD_COLORS = [
  'border-[#593CC8]', 'border-[#5DEAEA]', 'border-[#ABF263]', 'border-pink-400',
  'border-orange-400', 'border-yellow-400', 'border-red-400', 'border-indigo-400',
]

type Phase = 'study' | 'recall' | 'results'

export default function WordMemoryGame({ game, onComplete }: Props) {
  const difficulty = game.difficulty as keyof typeof WORD_LISTS
  const wordList = WORD_LISTS[difficulty] || WORD_LISTS.beginner
  const wordCount = difficulty === 'advanced' ? 12 : difficulty === 'intermediate' ? 14 : 12
  const words = wordList.slice(0, wordCount)

  const [phase, setPhase] = useState<Phase>('study')
  const [studyTime, setStudyTime] = useState(30)
  const [recallTime, setRecallTime] = useState(60)
  const [input, setInput] = useState('')
  const [recalled, setRecalled] = useState<string[]>([])
  const [wrongFlash, setWrongFlash] = useState(false)
  const [startTime] = useState(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)

  // Study countdown
  useEffect(() => {
    if (phase !== 'study') return
    if (studyTime <= 0) { setPhase('recall'); return }
    const t = setTimeout(() => setStudyTime(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, studyTime])

  // Recall countdown
  useEffect(() => {
    if (phase !== 'recall') return
    if (recallTime <= 0) { setPhase('results'); return }
    const t = setTimeout(() => setRecallTime(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, recallTime])

  // Focus input when recall starts
  useEffect(() => {
    if (phase === 'recall') inputRef.current?.focus()
  }, [phase])

  const handleSubmitWord = useCallback(() => {
    const word = input.trim().toLowerCase()
    if (!word) return
    setInput('')

    const isCorrect = words.map(w => w.toLowerCase()).includes(word)
    const alreadyFound = recalled.includes(word)

    if (isCorrect && !alreadyFound) {
      setRecalled(prev => [...prev, word])
    } else {
      setWrongFlash(true)
      setTimeout(() => setWrongFlash(false), 600)
    }
  }, [input, words, recalled])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSubmitWord()
    }
  }

  const handleFinish = useCallback(() => {
    const correct = recalled.length
    const total = words.length
    const timePenalty = Math.max(0, (60 - recallTime) * 2)
    const score = Math.round((correct / total) * 1000 - timePenalty)
    const accuracy = Math.round((correct / total) * 100)
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    onComplete(Math.max(0, score), 1, accuracy, correct)
    void elapsed
  }, [recalled, words, recallTime, startTime, onComplete])

  useEffect(() => {
    if (phase === 'results') handleFinish()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  if (phase === 'study') {
    const progress = (studyTime / 30) * 100
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Memorize these words!</h2>
          <p className="text-[#6B7280] text-sm mt-1">You have {studyTime} seconds</p>
        </div>
        {/* Timer bar */}
        <div className="w-full max-w-lg bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, backgroundColor: studyTime > 10 ? '#5DEAEA' : '#ef4444' }}
          />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg w-full">
          {words.map((word, i) => (
            <div
              key={word}
              className={`bg-white border-2 ${CARD_COLORS[i % CARD_COLORS.length]} rounded-xl px-3 py-3 text-center font-semibold text-[#1f2937] text-sm shadow-sm`}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'recall') {
    const progress = (recallTime / 60) * 100
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Recall the words!</h2>
          <p className="text-[#6B7280] text-sm mt-1">Type a word and press Enter or Space</p>
        </div>
        <div className="w-full max-w-lg bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, backgroundColor: recallTime > 15 ? '#ABF263' : '#ef4444' }}
          />
        </div>
        <div className="text-sm font-semibold text-[#593CC8]">
          {recalled.length} / {words.length} words found • {recallTime}s left
        </div>
        <div className="flex gap-2 w-full max-w-lg">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a word..."
            className={`flex-1 border-2 rounded-xl px-4 py-3 text-[#1f2937] focus:outline-none transition-colors ${
              wrongFlash ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#593CC8] bg-white'
            }`}
          />
          <button
            onClick={handleSubmitWord}
            className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-5 py-3 rounded-xl font-semibold transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 max-w-lg w-full justify-center min-h-[60px]">
          {recalled.map(word => (
            <span key={word} className="bg-[#ABF263]/30 border border-[#ABF263] text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {word}
            </span>
          ))}
        </div>
        <button
          onClick={() => setPhase('results')}
          className="text-sm text-[#6B7280] hover:text-[#593CC8] underline transition-colors"
        >
          I&apos;m done
        </button>
      </div>
    )
  }

  // Results phase — rendered briefly before onComplete fires
  const correct = recalled.length
  const total = words.length
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-[#593CC8]">Results</h2>
      <p className="text-[#6B7280]">You recalled <strong className="text-[#593CC8]">{correct}</strong> of <strong className="text-[#593CC8]">{total}</strong> words</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg w-full">
        {words.map((word, i) => {
          const found = recalled.includes(word.toLowerCase())
          return (
            <div
              key={word}
              className={`border-2 rounded-xl px-3 py-3 text-center font-semibold text-sm shadow-sm ${
                found
                  ? 'bg-[#ABF263]/20 border-[#ABF263] text-green-700'
                  : 'bg-red-50 border-red-300 text-red-500'
              }`}
            >
              {word}
            </div>
          )
          void i
        })}
      </div>
    </div>
  )
}
