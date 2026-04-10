'use client'
import { useState, useCallback, useRef, useEffect } from 'react'

interface Props { onComplete: (score: number) => void }

const PADS = [
  { color: '#EF4444', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.7)]', label: '🔴' },
  { color: '#3B82F6', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.7)]', label: '🔵' },
  { color: '#22C55E', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.7)]', label: '🟢' },
  { color: '#EAB308', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.7)]', label: '🟡' },
]

export default function RhythmRepeat({ onComplete }: Props) {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [phase, setPhase] = useState<'ready' | 'showing' | 'input' | 'correct' | 'wrong'>('ready')
  const [activePad, setActivePad] = useState<number | null>(null)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const isAnimating = useRef(false)

  const playSequence = useCallback(async (seq: number[]) => {
    isAnimating.current = true
    setPhase('showing')
    await new Promise(r => setTimeout(r, 500))

    for (let i = 0; i < seq.length; i++) {
      setActivePad(seq[i])
      await new Promise(r => setTimeout(r, 500))
      setActivePad(null)
      await new Promise(r => setTimeout(r, 200))
    }

    isAnimating.current = false
    setPhase('input')
  }, [])

  const startGame = useCallback(() => {
    const first = [Math.floor(Math.random() * 4)]
    setSequence(first)
    setPlayerInput([])
    setLevel(1)
    setScore(0)
    playSequence(first)
  }, [playSequence])

  const handlePadClick = useCallback((padIdx: number) => {
    if (phase !== 'input') return

    setActivePad(padIdx)
    setTimeout(() => setActivePad(null), 200)

    const newInput = [...playerInput, padIdx]
    setPlayerInput(newInput)

    const step = newInput.length - 1
    if (newInput[step] !== sequence[step]) {
      setPhase('wrong')
      setTimeout(() => onComplete(score), 1500)
      return
    }

    if (newInput.length === sequence.length) {
      setPhase('correct')
      const roundScore = level * 50
      const newScore = score + roundScore
      setScore(newScore)
      setLevel(l => l + 1)

      setTimeout(() => {
        const nextStep = Math.floor(Math.random() * 4)
        const newSeq = [...sequence, nextStep]
        setSequence(newSeq)
        setPlayerInput([])
        playSequence(newSeq)
      }, 1000)
    }
  }, [phase, playerInput, sequence, level, score, playSequence, onComplete])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-semibold">Level {level}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className={`px-3 py-1 rounded-full font-semibold ${
          phase === 'showing' ? 'bg-yellow-50 text-yellow-600' :
          phase === 'input' ? 'bg-green-50 text-green-600' :
          phase === 'correct' ? 'bg-green-50 text-green-600' :
          phase === 'wrong' ? 'bg-red-50 text-red-500' :
          'bg-gray-50 text-gray-500'
        }`}>
          {phase === 'ready' ? 'Ready?' : phase === 'showing' ? 'Watch...' : phase === 'input' ? 'Your turn!' : phase === 'correct' ? 'Nice!' : 'Game Over'}
        </span>
      </div>

      {phase === 'ready' && (
        <div className="text-center py-4">
          <p className="text-[#6B7280] mb-4">Watch the colors light up, then repeat the pattern!</p>
          <button onClick={startGame}
            className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
            Start! 🥁
          </button>
        </div>
      )}

      {phase !== 'ready' && (
        <>
          {/* Sequence indicator */}
          <div className="flex gap-1">
            {sequence.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${
                i < playerInput.length ? 'bg-green-400' : 'bg-gray-200'
              }`} />
            ))}
          </div>

          {/* Pads */}
          <div className="grid grid-cols-2 gap-4">
            {PADS.map((pad, i) => (
              <button key={i}
                onClick={() => handlePadClick(i)}
                disabled={phase !== 'input'}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl transition-all duration-150 active:scale-95 ${
                  activePad === i ? `scale-110 ${pad.glow}` : 'hover:scale-105'
                } ${phase !== 'input' && phase !== 'showing' ? 'opacity-70' : ''}`}
                style={{
                  backgroundColor: activePad === i ? pad.color : `${pad.color}44`,
                  border: `3px solid ${pad.color}`,
                }}
              >
                <span className="text-3xl">{pad.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'wrong' && (
        <div className="text-center">
          <div className="text-xl font-bold text-red-400 mb-1">Oops! 😅</div>
          <div className="text-[#6B7280]">You reached level {level}! Amazing effort!</div>
        </div>
      )}
    </div>
  )
}
