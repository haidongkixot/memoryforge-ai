'use client'
import { useState, useEffect, useCallback } from 'react'

interface Card {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

const EMOJIS = ['🧠', '⚡', '🎯', '🔮', '💡', '🌟', '🎪', '🎨', '🚀', '🌈', '🔥', '💎', '🌊', '🎵', '🦋', '🍀', '🎲', '🎭']

interface Props {
  gridSize: number
  onComplete: (score: number, moves: number, time: number) => void
  level: number
}

export default function MemoryGrid({ gridSize, onComplete, level }: Props) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [startTime] = useState(Date.now())
  const [locked, setLocked] = useState(false)

  const initGame = useCallback(() => {
    const pairCount = Math.floor((gridSize * gridSize) / 2)
    const selected = EMOJIS.slice(0, pairCount)
    const pairs = [...selected, ...selected]
    const shuffled = pairs.sort(() => Math.random() - 0.5)
    setCards(shuffled.map((v, i) => ({ id: i, value: v, flipped: false, matched: false })))
    setFlippedIds([])
    setMoves(0)
    setLocked(false)
  }, [gridSize])

  useEffect(() => { initGame() }, [initGame, level])

  const flipCard = (id: number) => {
    if (locked) return
    const card = cards[id]
    if (card.flipped || card.matched) return

    const newCards = [...cards]
    newCards[id] = { ...card, flipped: true }
    const newFlipped = [...flippedIds, id]
    setCards(newCards)
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [first, second] = newFlipped
      if (newCards[first].value === newCards[second].value) {
        newCards[first] = { ...newCards[first], matched: true }
        newCards[second] = { ...newCards[second], matched: true }
        setCards([...newCards])
        setFlippedIds([])
        setLocked(false)
        if (newCards.every(c => c.matched)) {
          const time = Math.round((Date.now() - startTime) / 1000)
          const score = Math.max(100, 1000 - moves * 10 - time * 2)
          onComplete(score, moves + 1, time)
        }
      } else {
        setTimeout(() => {
          newCards[first] = { ...newCards[first], flipped: false }
          newCards[second] = { ...newCards[second], flipped: false }
          setCards([...newCards])
          setFlippedIds([])
          setLocked(false)
        }, 800)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm text-gray-400">
        <span>Moves: <strong className="text-indigo-400">{moves}</strong></span>
        <span>Pairs: <strong className="text-indigo-400">{cards.filter(c => c.matched).length / 2}/{Math.floor(cards.length / 2)}</strong></span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, maxWidth: gridSize * 80 }}
      >
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl text-2xl flex items-center justify-center transition-all duration-300 ${
              card.matched ? 'bg-indigo-500/30 border-2 border-indigo-400 scale-95' :
              card.flipped ? 'bg-indigo-600 border-2 border-indigo-400 scale-105' :
              'bg-gray-700 border-2 border-gray-600 hover:border-indigo-400/50 hover:bg-gray-600 cursor-pointer'
            }`}
          >
            {(card.flipped || card.matched) ? card.value : '?'}
          </button>
        ))}
      </div>
    </div>
  )
}