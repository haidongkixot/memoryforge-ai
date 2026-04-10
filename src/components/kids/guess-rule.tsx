'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

interface RuleQ {
  groupA: string[]
  groupB: string[]
  testItem: string
  correctGroup: 'A' | 'B'
  rule: string
}

const PUZZLES: RuleQ[] = [
  { groupA: ['🐶', '🐱', '🐰'], groupB: ['🐟', '🐍', '🦎'], testItem: '🐹', correctGroup: 'A', rule: 'Has fur vs no fur!' },
  { groupA: ['🍎', '🍓', '🌹'], groupB: ['🍌', '🌻', '⭐'], testItem: '🍒', correctGroup: 'A', rule: 'Red things vs yellow things!' },
  { groupA: ['✈️', '🦅', '🦋'], groupB: ['🚗', '🐢', '🐍'], testItem: '🐝', correctGroup: 'A', rule: 'Things that fly vs things that don\'t!' },
  { groupA: ['🔵', '🌊', '🧊'], groupB: ['🔴', '🔥', '🌹'], testItem: '💎', correctGroup: 'A', rule: 'Blue/cold things vs red/hot things!' },
  { groupA: ['1️⃣', '3️⃣', '5️⃣'], groupB: ['2️⃣', '4️⃣', '6️⃣'], testItem: '7️⃣', correctGroup: 'A', rule: 'Odd numbers vs even numbers!' },
  { groupA: ['🍕', '🍔', '🌮'], groupB: ['🎸', '🥁', '🎹'], testItem: '🍟', correctGroup: 'A', rule: 'Food vs musical instruments!' },
  { groupA: ['⚽', '🏀', '🎾'], groupB: ['📏', '📐', '✏️'], testItem: '🏐', correctGroup: 'A', rule: 'Balls vs school supplies!' },
  { groupA: ['🌸', '🌻', '🌷'], groupB: ['🌲', '🌴', '🌵'], testItem: '🌺', correctGroup: 'A', rule: 'Flowers vs trees!' },
  { groupA: ['🐘', '🦒', '🐋'], groupB: ['🐜', '🐞', '🐛'], testItem: '🦏', correctGroup: 'A', rule: 'Big animals vs tiny animals!' },
  { groupA: ['☀️', '🌙', '⭐'], groupB: ['🏠', '🏫', '🏰'], testItem: '🌍', correctGroup: 'A', rule: 'Things in the sky vs buildings!' },
  { groupA: ['👶', '🧒', '👦'], groupB: ['👴', '👵', '🧓'], testItem: '👧', correctGroup: 'A', rule: 'Young people vs old people!' },
  { groupA: ['🥶', '❄️', '🧊'], groupB: ['🥵', '🔥', '☀️'], testItem: '🌨️', correctGroup: 'A', rule: 'Cold things vs hot things!' },
  { groupA: ['🎨', '🖌️', '🖍️'], groupB: ['🔨', '🔧', '🪛'], testItem: '✏️', correctGroup: 'A', rule: 'Art supplies vs tools!' },
  { groupA: ['🌊', '🏊', '🐟'], groupB: ['🏔️', '🧗', '🦅'], testItem: '🐙', correctGroup: 'A', rule: 'Water things vs mountain things!' },
  { groupA: ['🍫', '🍭', '🍬'], groupB: ['🥦', '🥕', '🥒'], testItem: '🧁', correctGroup: 'A', rule: 'Sweet treats vs vegetables!' },
  { groupA: ['📱', '💻', '📺'], groupB: ['📚', '📝', '📏'], testItem: '🎮', correctGroup: 'A', rule: 'Electronics vs paper items!' },
  { groupA: ['🌅', '🌄', '🏖️'], groupB: ['🌃', '🌆', '🏙️'], testItem: '☀️', correctGroup: 'A', rule: 'Daytime vs nighttime scenes!' },
  { groupA: ['🎵', '🎶', '🎤'], groupB: ['🔇', '🤫', '😶'], testItem: '🎺', correctGroup: 'A', rule: 'Sounds vs silence!' },
]

export default function GuessRule({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const shuffled = useMemo(() => [...PUZZLES].sort(() => Math.random() - 0.5).slice(0, rounds), [level, rounds])
  const total = shuffled.length

  const handlePick = useCallback((group: 'A' | 'B') => {
    if (feedback !== null) return
    const correct = group === shuffled[round].correctGroup
    const pts = correct ? 50 + level * 5 : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setFeedback(null) }
    }, 2000)
  }, [round, total, feedback, score, shuffled, level, onComplete])

  const q = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Puzzle {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium text-center">Figure out the rule! Where does the new item belong?</p>

      <div className="flex gap-4 w-full max-w-md">
        <button onClick={() => handlePick('A')}
          className={`flex-1 border-2 rounded-2xl p-4 text-center transition-all active:scale-95 ${
            feedback !== null && q.correctGroup === 'A' ? 'border-green-400 bg-green-50' :
            feedback !== null ? 'border-gray-200 bg-gray-50 opacity-60' :
            'border-blue-200 bg-blue-50 hover:border-blue-400'
          }`}>
          <div className="text-xs font-semibold text-blue-600 mb-2">Group A</div>
          <div className="flex gap-1 justify-center text-2xl flex-wrap">
            {q.groupA.map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </button>
        <button onClick={() => handlePick('B')}
          className={`flex-1 border-2 rounded-2xl p-4 text-center transition-all active:scale-95 ${
            feedback !== null && q.correctGroup === 'B' ? 'border-green-400 bg-green-50' :
            feedback !== null ? 'border-gray-200 bg-gray-50 opacity-60' :
            'border-pink-200 bg-pink-50 hover:border-pink-400'
          }`}>
          <div className="text-xs font-semibold text-pink-600 mb-2">Group B</div>
          <div className="flex gap-1 justify-center text-2xl flex-wrap">
            {q.groupB.map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </button>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-8 py-4 text-center">
        <div className="text-xs text-yellow-600 font-semibold mb-1">Where does this belong?</div>
        <span className="text-5xl">{q.testItem}</span>
      </div>

      {feedback !== null && (
        <div className="text-center">
          <div className={`text-lg font-bold ${feedback ? 'text-green-500' : 'text-red-400'}`}>
            {feedback ? 'You figured it out! 🧩' : 'Not quite!'}
          </div>
          <div className="text-sm text-[#6B7280] mt-1">Rule: {q.rule}</div>
        </div>
      )}
    </div>
  )
}
