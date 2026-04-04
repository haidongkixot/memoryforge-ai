'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string
  benefits: string[]; rules: string[]; gameType: string; gridSize: number; timeLimit: number; maxLevel: number
}

interface Props {
  game: Game
  onComplete: (score: number, level: number, accuracy: number, moves: number) => void
}

interface WordItem {
  word: string
  definition: string
  box: number // 1, 2, or 3
}

const DEFAULT_PAIRS: [string, string][] = [
  ['Ephemeral', 'Short-lived'],
  ['Ubiquitous', 'Found everywhere'],
  ['Pragmatic', 'Practical'],
  ['Resilient', 'Quick to recover'],
  ['Ambiguous', 'Open to interpretation'],
  ['Benevolent', 'Kind and generous'],
  ['Cacophony', 'Harsh sounds'],
  ['Diligent', 'Hardworking'],
  ['Eloquent', 'Fluent speaker'],
  ['Fortuitous', 'Lucky'],
]

const TOTAL_ROUNDS = 4

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct: string, pool: string[], count: number): string[] {
  const others = pool.filter(d => d !== correct)
  return shuffle(others).slice(0, count)
}

type Phase = 'playing' | 'round_summary' | 'results'

export default function SpacedReviewGame({ game, onComplete }: Props) {
  const [items, setItems] = useState<WordItem[]>([])
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>('playing')
  const [queue, setQueue] = useState<number[]>([]) // indices into items
  const [currentIdx, setCurrentIdx] = useState(0) // index into queue
  const [options, setOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [correctThisRound, setCorrectThisRound] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const startTimeRef = useRef(Date.now())

  // Initialize items
  useEffect(() => {
    const wordItems: WordItem[] = DEFAULT_PAIRS.map(([word, definition]) => ({
      word, definition, box: 1,
    }))
    setItems(wordItems)
  }, [])

  // Build queue for current round
  useEffect(() => {
    if (items.length === 0) return
    const q: number[] = []
    items.forEach((item, i) => {
      // Box 1: every round, Box 2: every 2nd round, Box 3: every 4th round
      if (item.box === 1) q.push(i)
      else if (item.box === 2 && round % 2 === 0) q.push(i)
      else if (item.box === 3 && round % 4 === 0) q.push(i)
    })
    // If queue empty (all items in box 3 and not a review round), review box 3 anyway
    if (q.length === 0) {
      items.forEach((item, i) => { if (item.box === 3) q.push(i) })
    }
    setQueue(shuffle(q))
    setCurrentIdx(0)
    setCorrectThisRound(0)
    setFeedback(null)
  }, [round, items.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Generate options when question changes
  useEffect(() => {
    if (items.length === 0 || queue.length === 0 || currentIdx >= queue.length) return
    const item = items[queue[currentIdx]]
    const allDefs = DEFAULT_PAIRS.map(p => p[1])
    const distractors = pickDistractors(item.definition, allDefs, 3)
    setOptions(shuffle([item.definition, ...distractors]))
    setFeedback(null)
  }, [currentIdx, queue, items])

  const handleAnswer = useCallback((answer: string) => {
    if (feedback !== null || phase !== 'playing' || queue.length === 0) return
    const itemIdx = queue[currentIdx]
    const item = items[itemIdx]
    const isCorrect = answer === item.definition

    setFeedback(isCorrect ? 'correct' : 'wrong')
    setTotalAnswered(prev => prev + 1)

    // Update box
    setItems(prev => {
      const next = [...prev]
      if (isCorrect) {
        next[itemIdx] = { ...next[itemIdx], box: Math.min(next[itemIdx].box + 1, 3) }
      } else {
        next[itemIdx] = { ...next[itemIdx], box: 1 }
      }
      return next
    })

    if (isCorrect) {
      setCorrectThisRound(c => c + 1)
      setTotalCorrect(c => c + 1)
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1
      if (nextIdx >= queue.length) {
        // End of round
        if (round >= TOTAL_ROUNDS) {
          setPhase('results')
        } else {
          setPhase('round_summary')
        }
      } else {
        setCurrentIdx(nextIdx)
      }
    }, 700)
  }, [feedback, phase, queue, currentIdx, items, round])

  const handleNextRound = () => {
    setRound(r => r + 1)
    setPhase('playing')
  }

  // Compute final score based on box distribution
  const computeScore = () => {
    let score = 0
    items.forEach(item => {
      if (item.box === 3) score += 100
      else if (item.box === 2) score += 50
      else score += 25
    })
    return score
  }

  // Report on results
  useEffect(() => {
    if (phase !== 'results') return
    const score = computeScore()
    const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000)
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    onComplete(score, 1, accuracy, totalAnswered)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const boxCounts = { 1: 0, 2: 0, 3: 0 }
  items.forEach(item => { boxCounts[item.box as 1 | 2 | 3]++ })

  // Box visualization
  const renderBoxes = () => (
    <div className="flex justify-center gap-4 text-center">
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 min-w-[70px]">
        <div className="text-lg font-bold text-red-600">{boxCounts[1]}</div>
        <div className="text-xs text-red-500">Box 1</div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 min-w-[70px]">
        <div className="text-lg font-bold text-yellow-600">{boxCounts[2]}</div>
        <div className="text-xs text-yellow-500">Box 2</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 min-w-[70px]">
        <div className="text-lg font-bold text-green-600">{boxCounts[3]}</div>
        <div className="text-xs text-green-500">Box 3</div>
      </div>
    </div>
  )

  if (phase === 'round_summary') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-lg font-semibold text-[#593CC8]">Round {round} Complete</h3>
        <p className="text-sm text-[#6B7280]">
          {correctThisRound} / {queue.length} correct this round
        </p>
        {renderBoxes()}
        <button onClick={handleNextRound}
          className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-[0_4px_15px_rgba(89,60,200,0.25)]">
          Start Round {round + 1}
        </button>
      </div>
    )
  }

  if (phase === 'results') {
    const score = computeScore()
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold text-[#593CC8]">Spaced Review Results</h3>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-[#593CC8]">{score}</div>
            <div className="text-xs text-[#6B7280]">Score</div>
          </div>
          <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-[#593CC8]">{accuracy}%</div>
            <div className="text-xs text-[#6B7280]">Accuracy</div>
          </div>
          <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-[#593CC8]">{totalAnswered}</div>
            <div className="text-xs text-[#6B7280]">Answers</div>
          </div>
        </div>
        <div className="text-sm font-medium text-[#593CC8]">Final Box Distribution</div>
        {renderBoxes()}
        <div className="bg-[#F8F9FE] rounded-xl p-4 max-w-md mx-auto text-left space-y-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-[#4B5563]">{item.word}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.box === 3 ? 'bg-green-100 text-green-700' :
                item.box === 2 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>Box {item.box}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Playing phase
  if (queue.length === 0 || currentIdx >= queue.length) {
    return <div className="text-center text-[#6B7280]">Loading...</div>
  }

  const currentItem = items[queue[currentIdx]]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-[#6B7280]">
        <span>Round {round} / {TOTAL_ROUNDS}</span>
        <span>{currentIdx + 1} / {queue.length} this round</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#593CC8] rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / queue.length) * 100}%` }} />
      </div>

      {/* Box status */}
      {renderBoxes()}

      {/* Word prompt */}
      <div className="text-center py-4">
        <div className="text-3xl font-bold text-[#593CC8]">{currentItem.word}</div>
        <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
          currentItem.box === 3 ? 'bg-green-100 text-green-700' :
          currentItem.box === 2 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>Box {currentItem.box}</div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isCorrectOption = opt === currentItem.definition
          let btnClass = 'border-gray-200 hover:border-[#593CC8] hover:bg-[#F8F9FE] text-[#4B5563]'
          if (feedback === 'correct' && isCorrectOption) btnClass = 'border-green-400 bg-green-50 text-green-700'
          if (feedback === 'wrong' && isCorrectOption) btnClass = 'border-green-400 bg-green-50 text-green-700'
          if (feedback === 'wrong' && !isCorrectOption) btnClass = 'border-gray-200 text-[#6B7280] opacity-50'

          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={feedback !== null}
              className={`border-2 rounded-xl p-4 text-left font-medium transition-all ${btnClass}`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
