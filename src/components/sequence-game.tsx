'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6']

interface Props {
  gridSize: number
  onComplete: (score: number, level: number, time: number) => void
}

export default function SequenceGame({ gridSize, onComplete }: Props) {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [phase, setPhase] = useState<'watching' | 'playing' | 'correct' | 'wrong'>('watching')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const startTimeRef = useRef(Date.now())
  const cells = gridSize * gridSize

  const playSequence = useCallback(async (seq: number[]) => {
    setPhase('watching')
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setActiveCell(seq[i])
      await new Promise(r => setTimeout(r, 500))
      setActiveCell(null)
    }
    await new Promise(r => setTimeout(r, 300))
    setPhase('playing')
  }, [])

  const startRound = useCallback(() => {
    const newStep = Math.floor(Math.random() * cells)
    const newSeq = [...sequence, newStep]
    setSequence(newSeq)
    setPlayerInput([])
    playSequence(newSeq)
  }, [sequence, cells, playSequence])

  useEffect(() => {
    startTimeRef.current = Date.now()
    const initial = [Math.floor(Math.random() * cells)]
    setSequence(initial)
    setPlayerInput([])
    playSequence(initial)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCellClick = (idx: number) => {
    if (phase !== 'playing') return
    const newInput = [...playerInput, idx]
    setPlayerInput(newInput)
    setActiveCell(idx)
    setTimeout(() => setActiveCell(null), 200)

    const step = newInput.length - 1
    if (newInput[step] !== sequence[step]) {
      setPhase('wrong')
      const time = Math.round((Date.now() - startTimeRef.current) / 1000)
      setTimeout(() => onComplete(score, level, time), 1500)
      return
    }

    if (newInput.length === sequence.length) {
      setPhase('correct')
      const roundScore = level * 100
      setScore(s => s + roundScore)
      setLevel(l => l + 1)
      setTimeout(() => startRound(), 1000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-6 text-sm text-gray-400">
        <span>Level: <strong className="text-indigo-400">{level}</strong></span>
        <span>Score: <strong className="text-indigo-400">{score}</strong></span>
        <span className={`font-medium ${phase === 'watching' ? 'text-yellow-400' : phase === 'correct' ? 'text-green-400' : phase === 'wrong' ? 'text-red-400' : 'text-indigo-400'}`}>
          {phase === 'watching' ? 'Watch...' : phase === 'playing' ? 'Your turn!' : phase === 'correct' ? 'Correct!' : 'Game Over'}
        </span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
        {Array.from({ length: cells }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={phase !== 'playing'}
            className={`w-20 h-20 rounded-xl transition-all duration-200 ${
              activeCell === i ? 'scale-110 shadow-lg shadow-indigo-500/50' : 'hover:scale-105'
            } ${phase !== 'playing' && phase !== 'watching' ? 'opacity-60' : ''}`}
            style={{
              backgroundColor: activeCell === i ? COLORS[i % COLORS.length] : '#374151',
              border: `2px solid ${activeCell === i ? COLORS[i % COLORS.length] : '#4b5563'}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}