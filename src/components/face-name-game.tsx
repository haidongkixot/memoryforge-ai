'use client'
import { useState, useEffect, useCallback } from 'react'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string
  benefits: string[]; rules: string[]; gameType: string; gridSize: number; timeLimit: number; maxLevel: number
}

interface Props {
  game: Game
  onComplete: (score: number, level: number, accuracy: number, moves: number) => void
}

interface FacePerson {
  emoji: string
  name: string
  job: string
}

const FALLBACK_FACES: FacePerson[] = [
  { emoji: '😊', name: 'Sarah Chen', job: 'Teacher' },
  { emoji: '😎', name: 'Marcus Lee', job: 'Chef' },
  { emoji: '🤔', name: 'Emma Park', job: 'Doctor' },
  { emoji: '😄', name: 'David Kim', job: 'Engineer' },
  { emoji: '🙂', name: 'Aisha Johnson', job: 'Artist' },
  { emoji: '😁', name: 'Lucas Brown', job: 'Writer' },
  { emoji: '😍', name: 'Priya Patel', job: 'Musician' },
  { emoji: '🤗', name: 'Carlos Rivera', job: 'Pilot' },
]

const EMOJI_BG_COLORS = [
  'bg-purple-50 border-purple-200',
  'bg-cyan-50 border-cyan-200',
  'bg-lime-50 border-lime-200',
  'bg-pink-50 border-pink-200',
  'bg-orange-50 border-orange-200',
  'bg-yellow-50 border-yellow-200',
  'bg-indigo-50 border-indigo-200',
  'bg-teal-50 border-teal-200',
]

type Phase = 'study' | 'quiz'

interface QuizQuestion {
  face: FacePerson
  choices: string[]
  correct: string
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildQuestions(studiedFaces: FacePerson[]): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  // 2 rounds
  for (let round = 0; round < 2; round++) {
    for (const face of shuffle(studiedFaces)) {
      const distractors = studiedFaces
        .filter(f => f.name !== face.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(f => f.name)
      const choices = shuffle([face.name, ...distractors])
      questions.push({ face, choices, correct: face.name })
    }
  }
  return questions
}

export default function FaceNameGame({ game, onComplete }: Props) {
  const faceCount = game.difficulty === 'advanced' ? 8 : game.difficulty === 'intermediate' ? 7 : 6
  const [studiedFaces, setStudiedFaces] = useState<FacePerson[]>(() => FALLBACK_FACES.slice(0, faceCount))
  const [phase, setPhase] = useState<Phase>('study')

  // Fetch dynamic content from DB, fallback to hardcoded
  useEffect(() => {
    fetch(`/api/game-content?gameId=${game.id}&contentType=face_data&difficulty=${game.difficulty}`)
      .then(r => r.json())
      .then(data => {
        if (data?.content?.faces?.length) {
          const faces: FacePerson[] = data.content.faces
          setStudiedFaces(faces.slice(0, faceCount))
        }
      })
      .catch(() => {})
  }, [game.id, game.difficulty, faceCount])
  const [studyTime, setStudyTime] = useState(30)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [startTime] = useState(Date.now())

  // Study countdown
  useEffect(() => {
    if (phase !== 'study') return
    if (studyTime <= 0) {
      setQuestions(buildQuestions(studiedFaces))
      setPhase('quiz')
      return
    }
    const t = setTimeout(() => setStudyTime(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, studyTime, studiedFaces])

  const handleAnswer = useCallback((choice: string) => {
    if (feedback !== null) return
    const q = questions[qIndex]
    const isCorrect = choice === q.correct

    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    }

    setTimeout(() => {
      setFeedback(null)
      if (qIndex + 1 >= questions.length) {
        // Done
        const total = questions.length
        const accuracy = Math.round(((isCorrect ? correct + 1 : correct) / total) * 100)
        const finalScore = Math.round(((isCorrect ? correct + 1 : correct) / total) * 1000)
        const elapsed = Math.round((Date.now() - startTime) / 1000)
        onComplete(finalScore, 1, accuracy, elapsed)
      } else {
        setQIndex(i => i + 1)
      }
    }, 700)
  }, [feedback, questions, qIndex, correct, startTime, onComplete])

  const progress = (studyTime / 30) * 100

  if (phase === 'study') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Remember these faces and names!</h2>
          <p className="text-[#6B7280] text-sm mt-1">{studyTime} seconds to memorize</p>
        </div>
        <div className="w-full max-w-lg bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, backgroundColor: studyTime > 10 ? '#5DEAEA' : '#ef4444' }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg w-full">
          {studiedFaces.map((face, i) => (
            <div
              key={face.name}
              className={`border-2 ${EMOJI_BG_COLORS[i % EMOJI_BG_COLORS.length]} rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm`}
            >
              <span className="text-5xl">{face.emoji}</span>
              <span className="font-semibold text-[#1f2937] text-sm text-center">{face.name}</span>
              <span className="text-[#6B7280] text-xs">{face.job}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Quiz phase
  const q = questions[qIndex]
  if (!q) return null
  const quizProgress = ((qIndex) / questions.length) * 100

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#593CC8]">Who is this?</h2>
        <p className="text-[#6B7280] text-sm mt-1">
          Question {qIndex + 1} of {questions.length} • Score: {score}
        </p>
      </div>
      <div className="w-full max-w-lg bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[#593CC8] rounded-full transition-all duration-300"
          style={{ width: `${quizProgress}%` }}
        />
      </div>
      {/* Face display */}
      <div className={`border-2 rounded-2xl p-8 flex flex-col items-center gap-2 shadow-sm transition-all ${
        feedback === 'correct' ? 'bg-[#ABF263]/20 border-[#ABF263]' :
        feedback === 'wrong' ? 'bg-red-50 border-red-300' :
        'bg-white border-gray-100'
      }`}>
        <span className="text-8xl">{q.face.emoji}</span>
        <span className="text-[#6B7280] text-sm mt-1">{q.face.job}</span>
      </div>
      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {q.choices.map(choice => (
          <button
            key={choice}
            onClick={() => handleAnswer(choice)}
            disabled={feedback !== null}
            className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all ${
              feedback !== null && choice === q.correct
                ? 'bg-[#ABF263]/30 border-[#ABF263] text-green-700'
                : feedback !== null && choice !== q.correct
                ? 'bg-gray-50 border-gray-200 text-gray-400'
                : 'bg-white border-gray-200 hover:border-[#593CC8]/50 hover:bg-[#593CC8]/5 text-[#1f2937] cursor-pointer'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
