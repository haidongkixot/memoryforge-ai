'use client'

import { useState, useEffect, useCallback } from 'react'

interface WordPair {
  target: string
  answer: string
  distractors: string[]
}

const FALLBACK_PAIRS: WordPair[] = [
  { target: 'Ocean', answer: 'Wave', distractors: ['Mountain', 'Desert', 'Forest'] },
  { target: 'Piano', answer: 'Music', distractors: ['Painting', 'Sculpture', 'Dance'] },
  { target: 'Doctor', answer: 'Hospital', distractors: ['School', 'Library', 'Stadium'] },
  { target: 'Night', answer: 'Moon', distractors: ['Flower', 'River', 'Cloud'] },
  { target: 'Winter', answer: 'Snow', distractors: ['Sand', 'Leaf', 'Rain'] },
  { target: 'Book', answer: 'Library', distractors: ['Kitchen', 'Garage', 'Garden'] },
  { target: 'Fire', answer: 'Smoke', distractors: ['Ice', 'Wind', 'Earth'] },
  { target: 'Crown', answer: 'King', distractors: ['Chef', 'Pilot', 'Artist'] },
  { target: 'Telescope', answer: 'Stars', distractors: ['Trees', 'Rocks', 'Waves'] },
  { target: 'Pencil', answer: 'Paper', distractors: ['Glass', 'Metal', 'Clay'] },
  { target: 'Bee', answer: 'Honey', distractors: ['Milk', 'Juice', 'Water'] },
  { target: 'Camera', answer: 'Photo', distractors: ['Song', 'Story', 'Recipe'] },
  { target: 'Lock', answer: 'Key', distractors: ['Rope', 'Chain', 'Wire'] },
  { target: 'Compass', answer: 'Direction', distractors: ['Speed', 'Weight', 'Color'] },
  { target: 'Thunder', answer: 'Lightning', distractors: ['Rainbow', 'Sunset', 'Breeze'] },
  { target: 'Nest', answer: 'Bird', distractors: ['Fish', 'Cat', 'Horse'] },
  { target: 'Brush', answer: 'Paint', distractors: ['Glue', 'Tape', 'Nail'] },
  { target: 'Anchor', answer: 'Ship', distractors: ['Plane', 'Train', 'Car'] },
  { target: 'Seed', answer: 'Plant', distractors: ['Rock', 'Sand', 'Mud'] },
  { target: 'Clock', answer: 'Time', distractors: ['Space', 'Sound', 'Light'] },
  { target: 'Helmet', answer: 'Safety', distractors: ['Beauty', 'Comfort', 'Speed'] },
  { target: 'Map', answer: 'Journey', distractors: ['Recipe', 'Puzzle', 'Game'] },
  { target: 'Stethoscope', answer: 'Heartbeat', distractors: ['Footstep', 'Whisper', 'Echo'] },
  { target: 'Feather', answer: 'Light', distractors: ['Heavy', 'Dark', 'Loud'] },
  { target: 'Diamond', answer: 'Precious', distractors: ['Common', 'Cheap', 'Rough'] },
  { target: 'Volcano', answer: 'Eruption', distractors: ['Erosion', 'Flood', 'Drought'] },
  { target: 'Magnifying', answer: 'Glass', distractors: ['Plastic', 'Wood', 'Stone'] },
  { target: 'Bread', answer: 'Butter', distractors: ['Ketchup', 'Mustard', 'Vinegar'] },
  { target: 'Stage', answer: 'Performance', distractors: ['Storage', 'Parking', 'Shipping'] },
  { target: 'Thread', answer: 'Needle', distractors: ['Hammer', 'Wrench', 'Drill'] },
]

interface Props {
  game: { id: string; name: string; gameType: string; timeLimit: number; gridSize: number; difficulty: string }
  onComplete: (score: number, level: number, accuracy: number, moves: number) => void
}

const TOTAL_ROUNDS = 20
const SECONDS_PER_ROUND = 15

export default function WordAssociationGame({ game, onComplete }: Props) {
  const [pairsPool, setPairsPool] = useState<WordPair[]>(FALLBACK_PAIRS)
  const [phase, setPhase] = useState<'ready' | 'playing' | 'feedback' | 'results'>('ready')
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [roundTimer, setRoundTimer] = useState(SECONDS_PER_ROUND)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [shuffledPairs, setShuffledPairs] = useState<WordPair[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [results, setResults] = useState<{ target: string; answer: string; userAnswer: string; correct: boolean }[]>([])

  // Fetch dynamic content from DB, fallback to hardcoded
  useEffect(() => {
    fetch(`/api/game-content?gameId=${game.id}&contentType=word_pair&difficulty=${game.difficulty}`)
      .then(r => r.json())
      .then(data => {
        if (data?.content?.pairs?.length) {
          setPairsPool(data.content.pairs)
        }
      })
      .catch(() => {})
  }, [game.id, game.difficulty])

  const startGame = useCallback(() => {
    const shuffled = [...pairsPool].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS)
    setShuffledPairs(shuffled)
    setCurrentRound(0)
    setScore(0)
    setCorrect(0)
    setTotal(0)
    setResults([])
    setSelectedAnswer(null)
    setIsCorrect(null)
    setPhase('playing')
    setRoundStartTime(Date.now())

    const first = shuffled[0]
    setOptions([first.answer, ...first.distractors].sort(() => Math.random() - 0.5))
    setRoundTimer(SECONDS_PER_ROUND)
  }, [pairsPool])

  // Round timer countdown
  useEffect(() => {
    if (phase !== 'playing') return
    if (roundTimer <= 0) {
      handleAnswer(null)
      return
    }
    const interval = setInterval(() => setRoundTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundTimer])

  const handleAnswer = useCallback((answer: string | null) => {
    if (phase !== 'playing') return
    const pair = shuffledPairs[currentRound]
    if (!pair) return

    const wasCorrect = answer === pair.answer
    const elapsed = (Date.now() - roundStartTime) / 1000
    const speedBonus = wasCorrect ? Math.max(0, Math.round((SECONDS_PER_ROUND - elapsed) * 5)) : 0
    const points = wasCorrect ? 50 + speedBonus : 0

    setSelectedAnswer(answer)
    setIsCorrect(wasCorrect)
    setScore(s => s + points)
    setPhase('feedback')

    const newCorrect = wasCorrect ? correct + 1 : correct
    const newTotal = total + 1

    setResults(r => [...r, {
      target: pair.target,
      answer: pair.answer,
      userAnswer: answer ?? '(timeout)',
      correct: wasCorrect,
    }])

    if (wasCorrect) setCorrect(c => c + 1)
    setTotal(t => t + 1)

    setTimeout(() => {
      const nextRound = currentRound + 1
      if (nextRound >= TOTAL_ROUNDS) {
        const accuracy = Math.round((newCorrect / newTotal) * 100)
        setPhase('results')
        onComplete(score + points, 1, accuracy, newTotal)
      } else {
        setCurrentRound(nextRound)
        const nextPair = shuffledPairs[nextRound]
        setOptions([nextPair.answer, ...nextPair.distractors].sort(() => Math.random() - 0.5))
        setSelectedAnswer(null)
        setIsCorrect(null)
        setRoundTimer(SECONDS_PER_ROUND)
        setRoundStartTime(Date.now())
        setPhase('playing')
      }
    }, 1200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, shuffledPairs, currentRound, roundStartTime, correct, total, score, onComplete])

  // Ready screen
  if (phase === 'ready') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-[#1f2937] mb-3">Word Association</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          A word appears -- pick the most closely related word from 4 options.
          Faster correct answers earn bonus points!
        </p>
        <div className="flex gap-4 justify-center text-sm text-gray-400 mb-8">
          <span>{TOTAL_ROUNDS} rounds</span>
          <span>|</span>
          <span>{SECONDS_PER_ROUND}s per round</span>
          <span>|</span>
          <span>50+ pts per correct</span>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-[#593CC8] text-white rounded-full font-semibold hover:bg-[#4a30a8] transition-colors text-lg"
        >
          Start Game
        </button>
      </div>
    )
  }

  // Results screen
  if (phase === 'results') {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-center text-[#1f2937] mb-6">Results</h2>
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#593CC8]">{score}</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500">{correct}/{total}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#5DEAEA]">{accuracy}%</div>
            <div className="text-sm text-gray-500">Accuracy</div>
          </div>
        </div>
        <div className="max-w-lg mx-auto space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm ${
                r.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              <span className="font-medium">{r.target}</span>
              <span className="mx-2">&rarr;</span>
              <span>{r.userAnswer}</span>
              {r.correct ? (
                <span className="text-xs ml-2">correct</span>
              ) : (
                <span className="text-xs ml-2">({r.answer})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Playing / Feedback screen
  const pair = shuffledPairs[currentRound]
  if (!pair) return null

  const timerPct = (roundTimer / SECONDS_PER_ROUND) * 100

  return (
    <div className="py-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Round {currentRound + 1}/{TOTAL_ROUNDS}</span>
        <span>Score: <strong className="text-[#593CC8]">{score}</strong></span>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            roundTimer > 5 ? 'bg-[#5DEAEA]' : 'bg-red-400'
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Target word */}
      <div className="text-center mb-10">
        <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">What word is associated with...</p>
        <h2 className="text-4xl font-bold text-[#593CC8]">{pair.target}</h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let btnClass = 'bg-white border-2 border-gray-200 hover:border-[#593CC8] hover:bg-[#593CC8]/5 text-[#1f2937]'

          if (phase === 'feedback') {
            if (opt === pair.answer) {
              btnClass = 'bg-emerald-500 border-2 border-emerald-500 text-white'
            } else if (opt === selectedAnswer && !isCorrect) {
              btnClass = 'bg-red-500 border-2 border-red-500 text-white'
            } else {
              btnClass = 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
            }
          }

          return (
            <button
              key={opt}
              onClick={() => phase === 'playing' && handleAnswer(opt)}
              disabled={phase === 'feedback'}
              className={`py-4 px-4 rounded-xl font-semibold text-lg transition-all ${btnClass}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Feedback message */}
      {phase === 'feedback' && (
        <div className={`text-center mt-6 text-lg font-semibold ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
          {isCorrect ? 'Correct!' : `The answer was: ${pair.answer}`}
        </div>
      )}
    </div>
  )
}
