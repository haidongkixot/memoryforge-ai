'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const WORDS_SHORT = [
  { word: 'CAT', hint: '🐱 A furry pet' }, { word: 'DOG', hint: '🐶 Man\'s best friend' },
  { word: 'SUN', hint: '☀️ Bright in sky' }, { word: 'CUP', hint: '🥤 You drink from it' },
  { word: 'HAT', hint: '🎩 Wear on head' }, { word: 'BEE', hint: '🐝 Makes honey' },
  { word: 'MAP', hint: '🗺️ Shows directions' }, { word: 'RUN', hint: '🏃 Move fast' },
  { word: 'BIG', hint: '📏 Not small' }, { word: 'RED', hint: '🔴 A color' },
]

const WORDS_MEDIUM = [
  { word: 'APPLE', hint: '🍎 A red fruit' }, { word: 'HOUSE', hint: '🏠 You live here' },
  { word: 'WATER', hint: '💧 You drink this' }, { word: 'HAPPY', hint: '😊 A feeling of joy' },
  { word: 'TIGER', hint: '🐯 A big striped cat' }, { word: 'MUSIC', hint: '🎵 You hear this' },
  { word: 'CLOUD', hint: '☁️ In the sky' }, { word: 'BEACH', hint: '🏖️ Sand and waves' },
  { word: 'GREEN', hint: '🟢 A color of grass' }, { word: 'LIGHT', hint: '💡 The opposite of dark' },
  { word: 'PLANT', hint: '🌱 It grows in soil' }, { word: 'SMILE', hint: '😄 What you do when happy' },
  { word: 'DREAM', hint: '💭 You have this sleeping' }, { word: 'BRAIN', hint: '🧠 Your thinking organ' },
  { word: 'SPACE', hint: '🚀 Where stars live' },
]

const WORDS_LONG = [
  { word: 'PLANET', hint: '🌍 Earth is one' }, { word: 'JUNGLE', hint: '🌴 Dense forest' },
  { word: 'CASTLE', hint: '🏰 Where kings live' }, { word: 'MONKEY', hint: '🐵 Swings in trees' },
  { word: 'ROCKET', hint: '🚀 Goes to space' }, { word: 'GARDEN', hint: '🌻 Flowers grow here' },
  { word: 'DRAGON', hint: '🐉 Mythical beast' }, { word: 'BRIDGE', hint: '🌉 Crosses a river' },
  { word: 'FROZEN', hint: '❄️ Turned to ice' }, { word: 'SCHOOL', hint: '🏫 Where you learn' },
  { word: 'PIRATE', hint: '🏴‍☠️ Sails the seas' }, { word: 'FOREST', hint: '🌲 Full of trees' },
  { word: 'ISLAND', hint: '🏝️ Land in water' }, { word: 'KNIGHT', hint: '⚔️ Wears armor' },
  { word: 'PURPLE', hint: '🟣 A royal color' },
]

function scramble(word: string): string {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('') === word ? scramble(word) : arr.join('')
}

export default function WordScramble({ onComplete, level = 1 }: Props) {
  const rounds = Math.min(6 + Math.floor(level / 3), 15)
  const wordPool = level <= 10 ? WORDS_SHORT : level <= 20 ? WORDS_MEDIUM : WORDS_LONG

  const shuffled = useMemo(() =>
    [...wordPool].sort(() => Math.random() - 0.5).slice(0, rounds).map(w => ({
      ...w,
      scrambled: scramble(w.word),
    })), [level, rounds])

  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const [showHint, setShowHint] = useState(false)
  const total = shuffled.length

  const handleSubmit = useCallback(() => {
    if (feedback !== null || !input.trim()) return
    const correct = input.toUpperCase().trim() === shuffled[round].word
    const pts = correct ? (showHint ? Math.round((50 + level * 5) / 2) : 50 + level * 5) : 0
    setScore(s => s + pts)
    setFeedback(correct)

    setTimeout(() => {
      if (round + 1 >= total) onComplete(score + pts)
      else { setRound(r => r + 1); setInput(''); setFeedback(null); setShowHint(false) }
    }, 1200)
  }, [input, round, total, feedback, score, shuffled, showHint, level, onComplete])

  const w = shuffled[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Word {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <p className="text-[#6B7280] font-medium">Unscramble the letters to make a word!</p>

      <div className="flex gap-2 justify-center">
        {w.scrambled.split('').map((letter, i) => (
          <span key={i}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-md">
            {letter}
          </span>
        ))}
      </div>

      {showHint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-yellow-700 text-sm">
          💡 Hint: {w.hint}
        </div>
      )}

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
