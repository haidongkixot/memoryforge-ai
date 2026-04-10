'use client'
import { useState, useCallback, useEffect, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

const BLOCK_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899']

export default function TowerBuilder({ onComplete, level = 1 }: Props) {
  const maxHeight = Math.min(8 + Math.floor(level / 4), 15)
  const lives = level <= 10 ? 3 : level <= 20 ? 2 : 1
  const blockCount = maxHeight + 10 + Math.floor(level / 2)
  const maxBlockVal = level <= 10 ? 9 : level <= 20 ? 12 : 15

  const [tower, setTower] = useState<number[]>([])
  const [incoming, setIncoming] = useState<number>(0)
  const [score, setScore] = useState(0)
  const [livesLeft, setLivesLeft] = useState(lives)
  const [gameOver, setGameOver] = useState(false)
  const [queue, setQueue] = useState<number[]>([])

  useEffect(() => {
    const initial = Array.from({ length: blockCount }, () => Math.floor(Math.random() * maxBlockVal) + 1)
    setQueue(initial)
    setIncoming(initial[0])
  }, [blockCount, maxBlockVal])

  const nextBlock = useCallback((currentQueue: number[]) => {
    const next = currentQueue.slice(1)
    if (next.length === 0) {
      setGameOver(true)
      return
    }
    setQueue(next)
    setIncoming(next[0])
  }, [])

  const handlePlace = useCallback(() => {
    if (gameOver) return

    const topVal = tower.length > 0 ? tower[tower.length - 1] : 0
    if (incoming < topVal) {
      setLivesLeft(l => {
        const newLives = l - 1
        if (newLives <= 0) {
          setGameOver(true)
          setTimeout(() => onComplete(score), 500)
        }
        return newLives
      })
      nextBlock(queue)
      return
    }

    const newTower = [...tower, incoming]
    setTower(newTower)

    const heightBonus = newTower.length * (10 + Math.floor(level / 2))
    const newScore = score + heightBonus
    setScore(newScore)

    if (newTower.length >= maxHeight) {
      setGameOver(true)
      setTimeout(() => onComplete(newScore + 100 + level * 10), 500)
      return
    }

    nextBlock(queue)
  }, [incoming, tower, score, gameOver, queue, nextBlock, maxHeight, level, onComplete])

  const handleSkip = useCallback(() => {
    if (gameOver) return
    nextBlock(queue)
  }, [gameOver, queue, nextBlock])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') handlePlace()
      if (e.key === 's' || e.key === 'S') handleSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handlePlace, handleSkip])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Height: {tower.length}/{maxHeight}</span>
        <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full font-semibold">
          {'❤️'.repeat(livesLeft)}{'🖤'.repeat(lives - livesLeft)}
        </span>
      </div>

      <p className="text-[#6B7280] text-sm text-center">
        Stack blocks in ascending order! Each block must be ≥ the one below.
      </p>

      {!gameOver && (
        <div className="text-center">
          <div className="text-xs text-[#6B7280] mb-1 font-semibold">Next Block</div>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg animate-bounce"
            style={{ backgroundColor: BLOCK_COLORS[incoming % BLOCK_COLORS.length] }}>
            {incoming}
          </div>
        </div>
      )}

      <div className="relative w-32 min-h-[200px] flex flex-col-reverse items-center bg-gray-50 rounded-xl border-2 border-gray-200 p-2 gap-1">
        <div className="w-full h-2 bg-gray-300 rounded-full" />

        {tower.length === 0 && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-[#9CA3AF] text-sm">Empty tower</div>
        )}

        {tower.map((val, i) => {
          const width = 50 + val * 3
          return (
            <div key={i}
              className="h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all"
              style={{
                width: `${width}%`,
                backgroundColor: BLOCK_COLORS[val % BLOCK_COLORS.length],
              }}>
              {val}
            </div>
          )
        })}
      </div>

      {!gameOver ? (
        <div className="flex gap-3">
          <button onClick={handlePlace}
            className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
            Place! ⬇️
          </button>
          <button onClick={handleSkip}
            className="border-2 border-gray-300 text-gray-500 px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all">
            Skip ⏭️
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-xl font-bold text-green-500">
            {tower.length >= maxHeight ? 'Max tower! 🏗️🎉' : `Tower height: ${tower.length}! 🏗️`}
          </div>
        </div>
      )}
    </div>
  )
}
