'use client'
import { useState, useCallback, useEffect, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

// Procedural maze generation using recursive backtracker
function generateMaze(size: number, seed: number): number[][] {
  const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(1))
  const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  // Simple seeded random
  let s = seed
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 }

  function carve(r: number, c: number) {
    visited[r][c] = true
    grid[r][c] = 0
    const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => rand() - 0.5)
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        grid[r + dr / 2][c + dc / 2] = 0
        carve(nr, nc)
      }
    }
  }

  // Start from (1,1), carve path
  carve(1, 1)
  grid[1][0] = 2 // start
  grid[size - 2][size - 1] = 3 // end
  grid[1][1] = 0
  grid[size - 2][size - 2] = 0

  return grid
}

function findCell(maze: number[][], val: number): [number, number] {
  for (let r = 0; r < maze.length; r++)
    for (let c = 0; c < maze[r].length; c++)
      if (maze[r][c] === val) return [r, c]
  return [0, 0]
}

export default function MazeRunner({ onComplete, level = 1 }: Props) {
  const mazeSize = level <= 10 ? 7 : level <= 20 ? 9 : 11
  const totalMazes = Math.min(4 + Math.floor(level / 5), 10)
  const [mazeIdx, setMazeIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const mazes = useMemo(() =>
    Array.from({ length: totalMazes }, (_, i) => generateMaze(mazeSize, level * 1000 + i * 137)),
    [level, totalMazes, mazeSize])

  const maze = mazes[mazeIdx]
  const start = useMemo(() => findCell(maze, 2), [maze])
  const [pos, setPos] = useState<[number, number]>(start)
  const [path, setPath] = useState<Set<string>>(new Set([`${start[0]},${start[1]}`]))

  useEffect(() => {
    const s = findCell(mazes[mazeIdx], 2)
    setPos(s)
    setPath(new Set([`${s[0]},${s[1]}`]))
    setWon(false)
    setMoves(0)
  }, [mazeIdx, mazes])

  const move = useCallback((dr: number, dc: number) => {
    if (won) return
    const nr = pos[0] + dr
    const nc = pos[1] + dc
    if (nr < 0 || nr >= mazeSize || nc < 0 || nc >= mazeSize) return
    if (maze[nr][nc] === 1) return

    setPos([nr, nc])
    setMoves(m => m + 1)
    setPath(p => new Set(p).add(`${nr},${nc}`))

    if (maze[nr][nc] === 3) {
      setWon(true)
      const pts = Math.max(50 + level * 5, (150 + level * 5) - moves * 3)
      const newScore = score + pts
      setScore(newScore)
      setTimeout(() => {
        if (mazeIdx + 1 >= totalMazes) onComplete(newScore)
        else setMazeIdx(m => m + 1)
      }, 1500)
    }
  }, [pos, maze, won, moves, score, mazeIdx, totalMazes, mazeSize, level, onComplete])

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

  const cellSize = mazeSize <= 7 ? 'w-9 h-9 sm:w-10 sm:h-10' : mazeSize <= 9 ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-5 h-5 sm:w-6 sm:h-6'
  const fontSize = mazeSize <= 7 ? 'text-lg' : mazeSize <= 9 ? 'text-sm' : 'text-xs'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Maze {mazeIdx + 1}/{totalMazes}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
        <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full font-semibold">Moves: {moves}</span>
      </div>

      <p className="text-[#6B7280] text-sm">Navigate to the exit! Use arrows or buttons below.</p>

      <div className="grid gap-0.5 bg-gray-200 p-1 rounded-xl" style={{ gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))` }}>
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
              className={`${cellSize} rounded-md flex items-center justify-center ${fontSize} transition-all`}
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
