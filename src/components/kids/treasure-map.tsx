'use client'
import { useState, useCallback, useEffect, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }

type Dir = 'up' | 'down' | 'left' | 'right'
const DIR_EMOJI: Record<Dir, string> = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' }
const DIR_DELTA: Record<Dir, [number, number]> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }

function genRound(size: number, level: number): { dirs: Dir[]; start: [number, number]; end: [number, number] } {
  const start: [number, number] = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)]
  const allDirs: Dir[] = ['up', 'down', 'left', 'right']
  const dirs: Dir[] = []
  let pos = [...start]

  const steps = Math.min(3 + Math.floor(level / 5), 8)
  for (let i = 0; i < steps; i++) {
    const valid = allDirs.filter(d => {
      const nr = pos[0] + DIR_DELTA[d][0]
      const nc = pos[1] + DIR_DELTA[d][1]
      return nr >= 0 && nr < size && nc >= 0 && nc < size
    })
    const d = valid[Math.floor(Math.random() * valid.length)]
    dirs.push(d)
    pos[0] += DIR_DELTA[d][0]
    pos[1] += DIR_DELTA[d][1]
  }

  return { dirs, start, end: [pos[0], pos[1]] as [number, number] }
}

export default function TreasureMap({ onComplete, level = 1 }: Props) {
  const totalRounds = Math.min(6 + Math.floor(level / 3), 15)
  const size = level <= 10 ? 4 : level <= 20 ? 5 : 6
  const studyBase = level <= 10 ? 3500 : level <= 20 ? 3000 : 2500

  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'study' | 'play' | 'result'>('study')
  const rounds = useMemo(() => Array.from({ length: totalRounds }, () => genRound(size, level)), [level, totalRounds, size])
  const [pos, setPos] = useState<[number, number]>(rounds[0].start)
  const [moveCount, setMoveCount] = useState(0)
  const [trail, setTrail] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (phase !== 'study') return
    const t = setTimeout(() => {
      setPhase('play')
      setPos([...rounds[round].start] as [number, number])
      setTrail(new Set([`${rounds[round].start[0]},${rounds[round].start[1]}`]))
      setMoveCount(0)
    }, studyBase + rounds[round].dirs.length * 400)
    return () => clearTimeout(t)
  }, [phase, round, rounds, studyBase])

  const move = useCallback((dir: Dir) => {
    if (phase !== 'play') return
    const [dr, dc] = DIR_DELTA[dir]
    const nr = pos[0] + dr
    const nc = pos[1] + dc
    if (nr < 0 || nr >= size || nc < 0 || nc >= size) return

    const newPos: [number, number] = [nr, nc]
    setPos(newPos)
    setMoveCount(m => m + 1)
    setTrail(t => new Set(t).add(`${nr},${nc}`))

    const target = rounds[round].end
    if (nr === target[0] && nc === target[1]) {
      setPhase('result')
      const optimal = rounds[round].dirs.length
      const bonus = Math.max(0, (50 + level * 5) - Math.abs(moveCount + 1 - optimal) * 10)
      const newScore = score + bonus
      setScore(newScore)

      setTimeout(() => {
        if (round + 1 >= totalRounds) onComplete(newScore)
        else {
          setRound(r => r + 1)
          setPhase('study')
        }
      }, 1500)
    }
  }, [phase, pos, round, rounds, size, moveCount, score, totalRounds, level, onComplete])

  const r = rounds[round]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-md text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Map {round + 1}/{totalRounds}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      {phase === 'study' && (
        <div className="text-center">
          <p className="text-[#6B7280] font-medium mb-3">Remember the directions to find the treasure!</p>
          <div className="flex gap-2 justify-center bg-yellow-50 px-6 py-4 rounded-2xl border-2 border-yellow-200">
            {r.dirs.map((d, i) => (
              <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                {DIR_EMOJI[d]}
              </span>
            ))}
          </div>
          <p className="text-sm text-yellow-600 mt-2 font-semibold">Memorizing... 🧠</p>
        </div>
      )}

      {(phase === 'play' || phase === 'result') && (
        <>
          <p className="text-[#6B7280] text-sm">Follow the directions to reach the treasure!</p>
          <div className="grid gap-1 bg-amber-100 p-2 rounded-xl" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
            {Array.from({ length: size * size }).map((_, idx) => {
              const row = Math.floor(idx / size)
              const col = idx % size
              const isPlayer = pos[0] === row && pos[1] === col
              const isTreasure = r.end[0] === row && r.end[1] === col
              const isStart = r.start[0] === row && r.start[1] === col
              const isTrail = trail.has(`${row},${col}`)

              let bg = '#FEF3C7'
              if (isTrail) bg = '#FDE68A'
              if (isStart && !isPlayer) bg = '#BBF7D0'
              const cellSize = size <= 4 ? 'w-12 h-12 sm:w-13 sm:h-13' : size <= 5 ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-8 h-8 sm:w-9 sm:h-9'

              return (
                <div key={idx}
                  className={`${cellSize} rounded-lg flex items-center justify-center text-lg`}
                  style={{ backgroundColor: bg }}>
                  {isPlayer && '🧭'}
                  {isTreasure && !isPlayer && '💎'}
                  {isStart && !isPlayer && !isTreasure && '🚩'}
                </div>
              )
            })}
          </div>

          {phase === 'play' && (
            <div className="grid grid-cols-3 gap-2 w-36">
              <div />
              <button onClick={() => move('up')} className="bg-amber-200 hover:bg-amber-300 rounded-xl p-2 text-xl active:scale-90 transition-all">⬆️</button>
              <div />
              <button onClick={() => move('left')} className="bg-amber-200 hover:bg-amber-300 rounded-xl p-2 text-xl active:scale-90 transition-all">⬅️</button>
              <div className="bg-amber-100 rounded-xl p-2 text-center text-lg">🧭</div>
              <button onClick={() => move('right')} className="bg-amber-200 hover:bg-amber-300 rounded-xl p-2 text-xl active:scale-90 transition-all">➡️</button>
              <div />
              <button onClick={() => move('down')} className="bg-amber-200 hover:bg-amber-300 rounded-xl p-2 text-xl active:scale-90 transition-all">⬇️</button>
              <div />
            </div>
          )}

          {phase === 'result' && (
            <div className="text-xl font-bold text-green-500">Treasure found! 💎🎉</div>
          )}
        </>
      )}
    </div>
  )
}
