'use client'
import { useState, useCallback, useEffect } from 'react'

interface Props { onComplete: (score: number) => void }

// Simple 7x7 mazes: 0=path, 1=wall, 2=start, 3=end
const MAZES = [
  [
    [2,0,1,1,1,1,1],
    [1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0],
    [1,1,1,1,1,1,3],
  ],
  [
    [2,0,0,1,1,1,1],
    [1,1,0,0,0,0,1],
    [1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,0,1,1,1],
    [1,0,1,0,0,0,3],
    [1,0,1,1,1,1,1],
  ],
  [
    [1,1,1,2,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,0,1,1,1],
    [1,1,1,3,1,1,1],
  ],
  [
    [2,0,1,1,1,1,1],
    [0,0,0,0,0,0,1],
    [1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0],
    [1,1,1,1,1,1,3],
  ],
  [
    [1,1,2,1,1,1,1],
    [1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1],
    [1,1,1,3,1,0,1],
  ],
]

function findCell(maze: number[][], val: number): [number, number] {
  for (let r = 0; r < maze.length; r++)
    for (let c = 0; c < maze[r].length; c++)
      if (maze[r][c] === val) return [r, c]
  return [0, 0]
}

export default function MazeRunner({ onComplete }: Props) {
  const [mazeIdx, setMazeIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [shuffled] = useState(() => [...MAZES].sort(() => Math.random() - 0.5))
  const total = shuffled.length
  const maze = shuffled[mazeIdx]
  const start = findCell(maze, 2)
  const [pos, setPos] = useState<[number, number]>(start)
  const [path, setPath] = useState<Set<string>>(new Set([`${start[0]},${start[1]}`]))
  const [won, setWon] = useState(false)

  useEffect(() => {
    const s = findCell(shuffled[mazeIdx], 2)
    setPos(s)
    setPath(new Set([`${s[0]},${s[1]}`]))
    setWon(false)
    setMoves(0)
  }, [mazeIdx, shuffled])

  const move = useCallback((dr: number, dc: number) => {
    if (won) return
    const nr = pos[0] + dr
    const nc = pos[1] + dc
    if (nr < 0 || nr >= 7 || nc < 0 || nc >= 7) return
    if (maze[nr][nc] === 1) return

    setPos([nr, nc])
    setMoves(m => m + 1)
    setPath(p => new Set(p).add(`${nr},${nc}`))

    if (maze[nr][nc] === 3) {
      setWon(true)
      const pts = Math.max(50, 150 - moves * 3)
      const newScore = score + pts
      setScore(newScore)
      setTimeout(() => {
        if (mazeIdx + 1 >= total) onComplete(newScore)
        else setMazeIdx(m => m + 1)
      }, 1500)
    }
  }, [pos, maze, won, moves, score, mazeIdx, total, onComplete])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(-1, 0)
      else if (e.key === 'ArrowDown') move(1, 0)
      else if (e.key === 'ArrowLeft') move(0, -1)
      else if (e.key === 'ArrowRight') move(0, 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Maze {mazeIdx + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full font-semibold">Moves: {moves}</span>
      </div>

      <p className="text-[#6B7280] text-sm">Navigate to the exit! Use arrows or buttons below.</p>

      {/* Maze grid */}
      <div className="grid gap-0.5 bg-gray-200 p-1 rounded-xl" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {maze.map((row, r) => row.map((cell, c) => {
          const isPlayer = pos[0] === r && pos[1] === c
          const isPath = path.has(`${r},${c}`)
          const isEnd = cell === 3
          const isWall = cell === 1

          let bg = isWall ? '#374151' : '#F3F4F6'
          if (isPath && !isPlayer) bg = '#BFDBFE'
          if (isPlayer) bg = '#3B82F6'
          if (isEnd) bg = won ? '#22C55E' : '#F97316'

          return (
            <div key={`${r}-${c}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-lg transition-all"
              style={{ backgroundColor: bg }}
              onClick={() => {
                if (Math.abs(r - pos[0]) + Math.abs(c - pos[1]) === 1) move(r - pos[0], c - pos[1])
              }}
            >
              {isPlayer && '🏃'}
              {isEnd && !isPlayer && (won ? '🎉' : '🏁')}
            </div>
          )
        }))}
      </div>

      {/* Touch controls */}
      <div className="grid grid-cols-3 gap-2 w-36">
        <div />
        <button onClick={() => move(-1, 0)} className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-xl active:scale-90 transition-all">⬆️</button>
        <div />
        <button onClick={() => move(0, -1)} className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-xl active:scale-90 transition-all">⬅️</button>
        <div className="bg-gray-100 rounded-xl p-2 text-center text-sm text-gray-400">🏃</div>
        <button onClick={() => move(0, 1)} className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-xl active:scale-90 transition-all">➡️</button>
        <div />
        <button onClick={() => move(1, 0)} className="bg-gray-200 hover:bg-gray-300 rounded-xl p-2 text-xl active:scale-90 transition-all">⬇️</button>
        <div />
      </div>

      {won && <div className="text-xl font-bold text-green-500">Maze solved! 🎉</div>}
    </div>
  )
}
