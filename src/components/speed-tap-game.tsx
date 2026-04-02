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

const GLOW_COLORS = [
  { bg: 'bg-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.8)]', border: 'border-cyan-300' },
  { bg: 'bg-lime-400', glow: 'shadow-[0_0_20px_rgba(163,230,53,0.8)]', border: 'border-lime-300' },
  { bg: 'bg-purple-400', glow: 'shadow-[0_0_20px_rgba(192,132,252,0.8)]', border: 'border-purple-300' },
  { bg: 'bg-orange-400', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.8)]', border: 'border-orange-300' },
]

function randomOtherIndex(current: number, total: number): number {
  let next: number
  do { next = Math.floor(Math.random() * total) } while (next === current)
  return next
}

function getPoints(ms: number): number {
  if (ms < 300) return 100
  if (ms < 500) return 75
  if (ms < 800) return 50
  return 25
}

export default function SpeedTapGame({ game, onComplete }: Props) {
  const size = Math.min(Math.max(game.gridSize || 4, 3), 5)
  const totalCells = size * size
  const timeLimit = game.timeLimit || 60

  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [started, setStarted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(() => Math.floor(Math.random() * totalCells))
  const [activeColor, setActiveColor] = useState(0)
  const [score, setScore] = useState(0)
  const [tapCount, setTapCount] = useState(0)
  const [hitCount, setHitCount] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [wrongFlash, setWrongFlash] = useState<number | null>(null)
  const litAt = useRef<number>(Date.now())

  const nextTarget = useCallback(() => {
    setActiveIndex(prev => {
      const next = randomOtherIndex(prev, totalCells)
      return next
    })
    setActiveColor(Math.floor(Math.random() * GLOW_COLORS.length))
    litAt.current = Date.now()
  }, [totalCells])

  // Timer
  useEffect(() => {
    if (!started) return
    if (timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [started, timeLeft])

  // Game over
  useEffect(() => {
    if (!started || timeLeft > 0) return
    const accuracy = tapCount > 0 ? Math.round((hitCount / tapCount) * 100) : 0
    onComplete(score, 1, accuracy, tapCount)
  }, [timeLeft, started, score, hitCount, tapCount, onComplete])

  const handleTap = useCallback((idx: number) => {
    if (!started || timeLeft <= 0) return
    setTapCount(t => t + 1)

    if (idx === activeIndex) {
      const ms = Date.now() - litAt.current
      const pts = getPoints(ms)
      setScore(s => s + pts)
      setHitCount(h => h + 1)
      setReactionTimes(rt => [...rt.slice(-19), ms])
      nextTarget()
    } else {
      setScore(s => Math.max(0, s - 10))
      setWrongFlash(idx)
      setTimeout(() => setWrongFlash(null), 300)
    }
  }, [started, timeLeft, activeIndex, nextTarget])

  const handleStart = () => {
    litAt.current = Date.now()
    setStarted(true)
  }

  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0

  const timerProgress = (timeLeft / timeLimit) * 100
  const color = GLOW_COLORS[activeColor]

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Speed Tap</h2>
          <p className="text-[#6B7280] mt-2">Tap the glowing circle as fast as you can!</p>
          <p className="text-[#6B7280] text-sm mt-1">Faster taps = more points • Wrong taps lose 10 pts</p>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
          {Array.from({ length: totalCells }).map((_, i) => (
            <div
              key={i}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 border-2 border-gray-200"
            />
          ))}
        </div>
        <button
          onClick={handleStart}
          className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-[0_4px_15px_rgba(89,60,200,0.25)]"
        >
          Start!
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Stats bar */}
      <div className="flex gap-6 text-sm text-[#6B7280] flex-wrap justify-center">
        <span>Score: <strong className="text-[#593CC8]">{score}</strong></span>
        <span>Hits: <strong className="text-[#ABF263]">{hitCount}</strong></span>
        <span>Avg: <strong className="text-[#5DEAEA]">{avgReaction > 0 ? `${avgReaction}ms` : '--'}</strong></span>
        <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-[#593CC8]'}`}>{timeLeft}s</span>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-md bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${timerProgress}%`, backgroundColor: timeLeft > 15 ? '#5DEAEA' : '#ef4444' }}
        />
      </div>

      {/* Grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const isActive = i === activeIndex
          const isWrong = i === wrongFlash
          return (
            <button
              key={i}
              onClick={() => handleTap(i)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 transition-all duration-150 ${
                isActive
                  ? `${color.bg} ${color.glow} ${color.border} scale-110`
                  : isWrong
                  ? 'bg-red-200 border-red-400 scale-95'
                  : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
              }`}
            />
          )
        })}
      </div>

      {/* Reaction time mini-bars */}
      {reactionTimes.length > 0 && (
        <div className="flex items-end gap-0.5 h-8 mt-2">
          {reactionTimes.slice(-15).map((ms, i) => {
            const pct = Math.min(ms / 1000, 1)
            const barColor = ms < 300 ? '#ABF263' : ms < 500 ? '#5DEAEA' : ms < 800 ? '#f59e0b' : '#ef4444'
            return (
              <div
                key={i}
                className="w-4 rounded-t-sm transition-all"
                style={{ height: `${Math.max(8, pct * 32)}px`, backgroundColor: barColor }}
                title={`${ms}ms`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
