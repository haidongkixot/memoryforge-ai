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

type Phase = 'study' | 'recall' | 'results'

function randomMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1)
  )
}

export default function NumberMatrixGame({ game, onComplete }: Props) {
  const size = Math.min(Math.max(game.gridSize || 3, 2), 5)
  const [matrix] = useState<number[][]>(() => randomMatrix(size))
  const [phase, setPhase] = useState<Phase>('study')
  const [studyTime, setStudyTime] = useState(20)
  const [playerMatrix, setPlayerMatrix] = useState<string[][]>(() =>
    Array.from({ length: size }, () => Array(size).fill(''))
  )
  const [cellState, setCellState] = useState<('idle' | 'correct' | 'wrong')[][]>(() =>
    Array.from({ length: size }, () => Array(size).fill('idle'))
  )

  // Study countdown
  useEffect(() => {
    if (phase !== 'study') return
    if (studyTime <= 0) { setPhase('recall'); return }
    const t = setTimeout(() => setStudyTime(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, studyTime])

  const handleCellChange = (row: number, col: number, val: string) => {
    if (phase !== 'recall') return
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = playerMatrix.map(r => [...r])
    next[row][col] = digit
    setPlayerMatrix(next)

    // Auto-check cell immediately
    if (digit) {
      const states = cellState.map(r => [...r])
      if (parseInt(digit) === matrix[row][col]) {
        states[row][col] = 'correct'
      } else {
        states[row][col] = 'wrong'
        setTimeout(() => {
          setCellState(prev => {
            const s = prev.map(r => [...r])
            s[row][col] = 'idle'
            return s
          })
          setPlayerMatrix(prev => {
            const p = prev.map(r => [...r])
            p[row][col] = ''
            return p
          })
        }, 800)
      }
      setCellState(states)
    } else {
      const states = cellState.map(r => [...r])
      states[row][col] = 'idle'
      setCellState(states)
    }
  }

  const handleCheck = useCallback(() => {
    const states = matrix.map((row, r) =>
      row.map((cell, c) => {
        const val = parseInt(playerMatrix[r][c])
        return val === cell ? 'correct' : 'wrong'
      })
    ) as ('correct' | 'wrong')[][]
    setCellState(states)
    setPhase('results')

    const total = size * size
    const correct = states.flat().filter(s => s === 'correct').length
    const accuracy = Math.round((correct / total) * 100)
    const score = Math.round((correct / total) * 1000)
    onComplete(score, 1, accuracy, 0)
  }, [matrix, playerMatrix, size, onComplete])

  const progress = (studyTime / 20) * 100

  if (phase === 'study') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#593CC8]">Memorize the number positions!</h2>
          <p className="text-[#6B7280] text-sm mt-1">{studyTime} seconds remaining</p>
        </div>
        <div className="w-full max-w-sm bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, backgroundColor: studyTime > 7 ? '#5DEAEA' : '#ef4444' }}
          />
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
          {matrix.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-[#593CC8]/30 rounded-xl flex items-center justify-center text-3xl font-bold text-[#593CC8] shadow-sm"
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#593CC8]">
          {phase === 'recall' ? 'Fill in the numbers!' : 'Results'}
        </h2>
        {phase === 'recall' && (
          <p className="text-[#6B7280] text-sm mt-1">Type each number from memory</p>
        )}
      </div>

      <div className="flex gap-8 flex-wrap justify-center">
        {/* Player grid */}
        <div>
          {phase === 'results' && <p className="text-center text-sm font-semibold text-[#6B7280] mb-2">Your Answer</p>}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {matrix.map((row, r) =>
              row.map((_, c) => {
                const state = cellState[r][c]
                return (
                  <input
                    key={`${r}-${c}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={playerMatrix[r][c]}
                    onChange={e => handleCellChange(r, c, e.target.value)}
                    disabled={phase === 'results'}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-center text-2xl font-bold transition-all border-2 focus:outline-none ${
                      state === 'correct'
                        ? 'bg-[#ABF263]/20 border-[#ABF263] text-green-700'
                        : state === 'wrong'
                        ? 'bg-red-50 border-red-400 text-red-500'
                        : 'bg-white border-gray-200 text-[#1f2937] focus:border-[#593CC8]'
                    }`}
                  />
                )
              })
            )}
          </div>
        </div>

        {/* Original grid (results only) */}
        {phase === 'results' && (
          <div>
            <p className="text-center text-sm font-semibold text-[#6B7280] mb-2">Original</p>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {matrix.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`orig-${r}-${c}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-[#593CC8]/30 rounded-xl flex items-center justify-center text-2xl font-bold text-[#593CC8] shadow-sm"
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {phase === 'recall' && (
        <button
          onClick={handleCheck}
          className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-[0_4px_15px_rgba(89,60,200,0.25)]"
        >
          Check My Answers
        </button>
      )}
    </div>
  )
}
