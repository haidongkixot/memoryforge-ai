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

const PAIRS = [
  { emoji: '\u{1F3D4}\uFE0F', word: 'Summit' },
  { emoji: '\u{1F30A}', word: 'Cascade' },
  { emoji: '\u{1F511}', word: 'Cipher' },
  { emoji: '\u{1F3AD}', word: 'Persona' },
  { emoji: '\u{1F33F}', word: 'Verdant' },
  { emoji: '\u26A1', word: 'Surge' },
  { emoji: '\u{1F3AA}', word: 'Carnival' },
  { emoji: '\u{1F9CA}', word: 'Glacier' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct: string, pool: string[], count: number): string[] {
  const others = pool.filter(w => w !== correct)
  return shuffle(others).slice(0, count)
}

type Phase = 'study' | 'test' | 'results'
type TestMode = 'emoji_to_word' | 'word_to_emoji'

interface Trial {
  pairIndex: number
  mode: TestMode
}

interface TrialResult {
  pairIndex: number
  mode: TestMode
  correct: boolean
  timeMs: number
}

export default function DualCodeGame({ game, onComplete }: Props) {
  const STUDY_TIME = 20
  const [phase, setPhase] = useState<Phase>('study')
  const [studyTimeLeft, setStudyTimeLeft] = useState(STUDY_TIME)

  // Test state
  const [trials, setTrials] = useState<Trial[]>([])
  const [currentTrial, setCurrentTrial] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [results, setResults] = useState<TrialResult[]>([])
  const trialStartRef = useRef(Date.now())
  const startTimeRef = useRef(Date.now())

  // Build trials on mount: each pair tested twice, alternating modes
  useEffect(() => {
    const t: Trial[] = []
    const indices = shuffle(PAIRS.map((_, i) => i))
    for (let i = 0; i < PAIRS.length; i++) {
      t.push({ pairIndex: indices[i], mode: i % 2 === 0 ? 'emoji_to_word' : 'word_to_emoji' })
    }
    const indices2 = shuffle(PAIRS.map((_, i) => i))
    for (let i = 0; i < PAIRS.length; i++) {
      t.push({ pairIndex: indices2[i], mode: i % 2 === 0 ? 'word_to_emoji' : 'emoji_to_word' })
    }
    setTrials(t)
  }, [])

  // Study timer
  useEffect(() => {
    if (phase !== 'study') return
    if (studyTimeLeft <= 0) {
      setPhase('test')
      startTimeRef.current = Date.now()
      trialStartRef.current = Date.now()
      return
    }
    const id = setTimeout(() => setStudyTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, studyTimeLeft])

  // Generate options when trial changes
  useEffect(() => {
    if (phase !== 'test' || trials.length === 0 || currentTrial >= trials.length) return
    const trial = trials[currentTrial]
    const pair = PAIRS[trial.pairIndex]
    if (trial.mode === 'emoji_to_word') {
      const distractors = pickDistractors(pair.word, PAIRS.map(p => p.word), 3)
      setOptions(shuffle([pair.word, ...distractors]))
    } else {
      const distractors = pickDistractors(pair.emoji, PAIRS.map(p => p.emoji), 3)
      setOptions(shuffle([pair.emoji, ...distractors]))
    }
    trialStartRef.current = Date.now()
    setFeedback(null)
  }, [phase, currentTrial, trials])

  const handleAnswer = useCallback((answer: string) => {
    if (feedback !== null || phase !== 'test') return
    const trial = trials[currentTrial]
    const pair = PAIRS[trial.pairIndex]
    const correctAnswer = trial.mode === 'emoji_to_word' ? pair.word : pair.emoji
    const isCorrect = answer === correctAnswer
    const timeMs = Date.now() - trialStartRef.current

    setFeedback(isCorrect ? 'correct' : 'wrong')
    setResults(prev => [...prev, { pairIndex: trial.pairIndex, mode: trial.mode, correct: isCorrect, timeMs }])

    setTimeout(() => {
      const next = currentTrial + 1
      if (next >= trials.length) {
        setPhase('results')
      } else {
        setCurrentTrial(next)
      }
    }, 600)
  }, [feedback, phase, trials, currentTrial])

  // Compute final results
  const correctCount = results.filter(r => r.correct).length
  const totalTrials = trials.length || 16
  const accuracy = totalTrials > 0 ? Math.round((correctCount / totalTrials) * 100) : 0
  const baseScore = correctCount * 50
  const speedBonus = results.filter(r => r.correct && r.timeMs < 3000).length * 25
  const totalScore = baseScore + speedBonus
  const totalTime = phase === 'results' ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0
  const missedPairs = Array.from(new Set(results.filter(r => !r.correct).map(r => r.pairIndex)))

  // Auto-report on results
  useEffect(() => {
    if (phase === 'results') {
      onComplete(totalScore, 1, accuracy, totalTrials)
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Study phase
  if (phase === 'study') {
    const pct = (studyTimeLeft / STUDY_TIME) * 100
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#593CC8] mb-1">Study Phase</h3>
          <p className="text-sm text-[#6B7280]">Memorize each emoji-word pair</p>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#593CC8] to-[#5DEAEA] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${pct}%` }} />
        </div>
        <div className="text-center text-sm text-[#6B7280]">{studyTimeLeft}s remaining</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PAIRS.map((pair, i) => (
            <div key={i} className="bg-[#F8F9FE] border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-2">{pair.emoji}</div>
              <div className="text-sm font-semibold text-[#4B5563]">{pair.word}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Test phase
  if (phase === 'test' && trials.length > 0 && currentTrial < trials.length) {
    const trial = trials[currentTrial]
    const pair = PAIRS[trial.pairIndex]
    const prompt = trial.mode === 'emoji_to_word' ? pair.emoji : pair.word
    const isEmojiOptions = trial.mode === 'word_to_emoji'

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">
            {trial.mode === 'emoji_to_word' ? 'Which word?' : 'Which emoji?'}
          </span>
          <span className="text-sm font-medium text-[#593CC8]">
            {currentTrial + 1} / {trials.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#593CC8] rounded-full transition-all duration-300"
            style={{ width: `${((currentTrial + 1) / trials.length) * 100}%` }} />
        </div>
        <div className="text-center py-6">
          <div className={isEmojiOptions ? 'text-2xl font-bold text-[#593CC8]' : 'text-6xl'}>
            {prompt}
          </div>
        </div>
        <div className={`grid ${isEmojiOptions ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
          {options.map((opt, i) => {
            const correctAnswer = trial.mode === 'emoji_to_word' ? pair.word : pair.emoji
            const isCorrectOption = opt === correctAnswer
            let btnClass = 'border-gray-200 hover:border-[#593CC8] hover:bg-[#F8F9FE] text-[#4B5563]'
            if (feedback === 'correct' && isCorrectOption) btnClass = 'border-green-400 bg-green-50 text-green-700'
            if (feedback === 'wrong' && isCorrectOption) btnClass = 'border-green-400 bg-green-50 text-green-700'
            if (feedback === 'wrong' && !isCorrectOption) btnClass = 'border-gray-200 text-[#6B7280] opacity-50'

            return (
              <button key={i} onClick={() => handleAnswer(opt)} disabled={feedback !== null}
                className={`border-2 rounded-xl p-4 font-medium transition-all ${btnClass} ${isEmojiOptions ? 'text-3xl' : 'text-base'}`}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Results phase
  return (
    <div className="space-y-6 text-center">
      <h3 className="text-xl font-bold text-[#593CC8]">Dual-Code Results</h3>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-[#593CC8]">{totalScore}</div>
          <div className="text-xs text-[#6B7280]">Score</div>
        </div>
        <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-[#593CC8]">{accuracy}%</div>
          <div className="text-xs text-[#6B7280]">Accuracy</div>
        </div>
        <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-[#593CC8]">{totalTime}s</div>
          <div className="text-xs text-[#6B7280]">Time</div>
        </div>
      </div>
      {speedBonus > 0 && (
        <div className="text-sm text-[#ABF263] font-medium">Speed bonus: +{speedBonus} pts</div>
      )}
      {missedPairs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-sm mx-auto">
          <div className="text-sm font-semibold text-red-600 mb-2">Missed Pairs</div>
          <div className="flex flex-wrap justify-center gap-3">
            {missedPairs.map(idx => (
              <span key={idx} className="text-sm text-red-700">
                {PAIRS[idx].emoji} {PAIRS[idx].word}
              </span>
            ))}
          </div>
        </div>
      )}
      {missedPairs.length === 0 && (
        <div className="text-sm text-green-600 font-medium">Perfect! All pairs recalled correctly.</div>
      )}
    </div>
  )
}
