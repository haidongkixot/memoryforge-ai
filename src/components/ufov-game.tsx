'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string
  benefits: string[]; rules: string[]; gameType: string; gridSize: number; timeLimit: number; maxLevel: number
}

interface Props {
  game: Game
  onComplete: (score: number, level: number, accuracy: number, moves: number) => void
}

const SHAPES = ['circle', 'square', 'triangle'] as const
type Shape = typeof SHAPES[number]

// 8 clock positions (12, 1:30, 3, 4:30, 6, 7:30, 9, 10:30)
const PERIPHERAL_POSITIONS = [
  { angle: 0, label: '12' },
  { angle: 45, label: '1:30' },
  { angle: 90, label: '3' },
  { angle: 135, label: '4:30' },
  { angle: 180, label: '6' },
  { angle: 225, label: '7:30' },
  { angle: 270, label: '9' },
  { angle: 315, label: '10:30' },
]

const TOTAL_TRIALS = 20
const FLASH_DURATIONS = [500, 400, 300, 200] // ms per 5-trial block
const BLANK_DURATION = 1000

type Phase = 'ready' | 'flash' | 'respond_shape' | 'respond_position' | 'blank' | 'results'

interface TrialResult {
  shapeCorrect: boolean
  positionCorrect: boolean
  reactionMs: number
}

function getPeripheralXY(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
}

function randomShape(): Shape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

function randomPosition(): number {
  return Math.floor(Math.random() * PERIPHERAL_POSITIONS.length)
}

export default function UFOVGame({ game, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [trial, setTrial] = useState(0)
  const [targetShape, setTargetShape] = useState<Shape>('circle')
  const [targetPosition, setTargetPosition] = useState(0)
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [results, setResults] = useState<TrialResult[]>([])
  const [showFlash, setShowFlash] = useState(false)
  const respondStartRef = useRef(Date.now())
  const startTimeRef = useRef(Date.now())

  const flashDuration = FLASH_DURATIONS[Math.min(Math.floor(trial / 5), FLASH_DURATIONS.length - 1)]

  const startTrial = useCallback(() => {
    const shape = randomShape()
    const pos = randomPosition()
    setTargetShape(shape)
    setTargetPosition(pos)
    setSelectedShape(null)
    setSelectedPosition(null)
    setShowFlash(true)
    setPhase('flash')
  }, [])

  // Flash timer
  useEffect(() => {
    if (phase !== 'flash') return
    const id = setTimeout(() => {
      setShowFlash(false)
      setPhase('respond_shape')
      respondStartRef.current = Date.now()
    }, flashDuration)
    return () => clearTimeout(id)
  }, [phase, flashDuration])

  // Start game
  const handleStart = () => {
    startTimeRef.current = Date.now()
    startTrial()
  }

  // After selecting shape, go to position
  const handleShapeSelect = (shape: Shape) => {
    if (phase !== 'respond_shape') return
    setSelectedShape(shape)
    setPhase('respond_position')
  }

  // After selecting position, score and next
  const handlePositionSelect = (posIdx: number) => {
    if (phase !== 'respond_position') return
    setSelectedPosition(posIdx)
    const reactionMs = Date.now() - respondStartRef.current
    const shapeCorrect = selectedShape === targetShape
    const positionCorrect = posIdx === targetPosition

    const result: TrialResult = { shapeCorrect, positionCorrect, reactionMs }
    const newResults = [...results, result]
    setResults(newResults)

    // Brief blank then next trial or results
    setPhase('blank')
    setTimeout(() => {
      const nextTrial = trial + 1
      if (nextTrial >= TOTAL_TRIALS) {
        setTrial(nextTrial)
        setPhase('results')
      } else {
        setTrial(nextTrial)
        startTrial()
      }
    }, BLANK_DURATION)
  }

  // Report on results
  useEffect(() => {
    if (phase !== 'results') return
    const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000)
    const bothCorrect = results.filter(r => r.shapeCorrect && r.positionCorrect).length
    const oneCorrect = results.filter(r => (r.shapeCorrect || r.positionCorrect) && !(r.shapeCorrect && r.positionCorrect)).length
    const score = bothCorrect * 50 + oneCorrect * 25
    const accuracy = Math.round((bothCorrect / TOTAL_TRIALS) * 100)
    onComplete(score, 1, accuracy, TOTAL_TRIALS)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderShape = (shape: Shape, size: number, color: string) => {
    if (shape === 'circle') return <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: color }} />
    if (shape === 'square') return <div style={{ width: size, height: size, borderRadius: 4, backgroundColor: color }} />
    // triangle
    return (
      <div style={{ width: 0, height: 0, borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${color}` }} />
    )
  }

  // Ready screen
  if (phase === 'ready') {
    return (
      <div className="text-center space-y-6 py-8">
        <h3 className="text-lg font-semibold text-[#593CC8]">Useful Field of View</h3>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          A shape will flash in the center and a target will light up on the ring.
          Identify <strong>both</strong> the center shape and the peripheral position.
          Display time decreases every 5 trials!
        </p>
        <button onClick={handleStart}
          className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-[0_4px_15px_rgba(89,60,200,0.25)]">
          Begin
        </button>
      </div>
    )
  }

  // Results screen
  if (phase === 'results') {
    const bothCorrect = results.filter(r => r.shapeCorrect && r.positionCorrect).length
    const oneCorrect = results.filter(r => (r.shapeCorrect || r.positionCorrect) && !(r.shapeCorrect && r.positionCorrect)).length
    const noneCorrect = results.filter(r => !r.shapeCorrect && !r.positionCorrect).length
    const score = bothCorrect * 50 + oneCorrect * 25
    const avgReaction = Math.round(results.reduce((s, r) => s + r.reactionMs, 0) / results.length)

    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold text-[#593CC8]">UFOV Results</h3>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-[#593CC8]">{score}</div>
            <div className="text-xs text-[#6B7280]">Score</div>
          </div>
          <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-[#593CC8]">{Math.round((bothCorrect / TOTAL_TRIALS) * 100)}%</div>
            <div className="text-xs text-[#6B7280]">Both Correct</div>
          </div>
          <div className="bg-[#F8F9FE] rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-[#593CC8]">{avgReaction}ms</div>
            <div className="text-xs text-[#6B7280]">Avg Reaction</div>
          </div>
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <span className="text-green-600">Both: {bothCorrect}</span>
          <span className="text-yellow-600">One: {oneCorrect}</span>
          <span className="text-red-600">None: {noneCorrect}</span>
        </div>
      </div>
    )
  }

  // Game area (flash, respond_shape, respond_position, blank)
  const RING_RADIUS = 120
  const CONTAINER_SIZE = 300

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm text-[#6B7280]">
        <span>Trial {trial + 1} / {TOTAL_TRIALS}</span>
        <span>Flash: {flashDuration}ms</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#593CC8] rounded-full transition-all duration-300"
          style={{ width: `${((trial + 1) / TOTAL_TRIALS) * 100}%` }} />
      </div>

      {/* UFOV ring area */}
      <div className="flex justify-center py-4">
        <div className="relative" style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
          {/* Center target */}
          <div className="absolute flex items-center justify-center"
            style={{ left: CONTAINER_SIZE / 2 - 30, top: CONTAINER_SIZE / 2 - 30, width: 60, height: 60 }}>
            <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
              {showFlash && renderShape(targetShape, 32, '#593CC8')}
            </div>
          </div>

          {/* Peripheral positions */}
          {PERIPHERAL_POSITIONS.map((pos, i) => {
            const { x, y } = getPeripheralXY(pos.angle, RING_RADIUS)
            const isTarget = i === targetPosition
            const isFlashing = showFlash && isTarget
            const isClickable = phase === 'respond_position'
            const isSelected = selectedPosition === i

            return (
              <button key={i}
                onClick={() => isClickable && handlePositionSelect(i)}
                disabled={!isClickable}
                className={`absolute w-10 h-10 rounded-full border-2 transition-all duration-150 flex items-center justify-center text-xs font-medium
                  ${isFlashing
                    ? 'bg-[#5DEAEA] border-[#5DEAEA] shadow-[0_0_16px_rgba(93,234,234,0.8)] scale-125'
                    : isClickable
                      ? 'bg-white border-gray-300 hover:border-[#593CC8] hover:bg-[#F8F9FE] cursor-pointer'
                      : 'bg-gray-50 border-gray-200'
                  }
                  ${isSelected ? 'ring-2 ring-[#593CC8]' : ''}
                `}
                style={{
                  left: CONTAINER_SIZE / 2 + x - 20,
                  top: CONTAINER_SIZE / 2 + y - 20,
                }}>
                {isClickable && <span className="text-[#6B7280]">{i + 1}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Response areas */}
      {phase === 'respond_shape' && (
        <div className="space-y-3 text-center">
          <p className="text-sm font-medium text-[#593CC8]">What shape was in the center?</p>
          <div className="flex justify-center gap-4">
            {SHAPES.map(shape => (
              <button key={shape} onClick={() => handleShapeSelect(shape)}
                className="flex flex-col items-center gap-2 border-2 border-gray-200 hover:border-[#593CC8] hover:bg-[#F8F9FE] rounded-xl p-4 transition-all min-w-[80px]">
                {renderShape(shape, 28, '#593CC8')}
                <span className="text-xs text-[#6B7280] capitalize">{shape}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'respond_position' && (
        <div className="text-center">
          <p className="text-sm font-medium text-[#5DEAEA]">Click the position that flashed on the ring above</p>
        </div>
      )}

      {phase === 'blank' && (
        <div className="text-center py-4">
          <div className="text-sm text-[#6B7280]">Next trial...</div>
        </div>
      )}
    </div>
  )
}
