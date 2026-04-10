'use client'
import { useState, useCallback } from 'react'

interface Props { onComplete: (score: number) => void }

interface Story { title: string; panels: { emoji: string; text: string }[] }

const STORIES: Story[] = [
  { title: 'Making a Sandwich', panels: [
    { emoji: '🍞', text: 'Get the bread' }, { emoji: '🧈', text: 'Spread butter' },
    { emoji: '🧀', text: 'Add cheese' }, { emoji: '🔪', text: 'Cut in half' },
  ]},
  { title: 'Growing a Plant', panels: [
    { emoji: '🌱', text: 'Plant a seed' }, { emoji: '💧', text: 'Water it daily' },
    { emoji: '☀️', text: 'Give it sunlight' }, { emoji: '🌸', text: 'It blooms!' },
  ]},
  { title: 'Going to School', panels: [
    { emoji: '⏰', text: 'Wake up early' }, { emoji: '🪥', text: 'Brush teeth' },
    { emoji: '🎒', text: 'Pack your bag' }, { emoji: '🚌', text: 'Catch the bus' },
  ]},
  { title: 'Building a Snowman', panels: [
    { emoji: '❄️', text: 'Snow falls down' }, { emoji: '⛏️', text: 'Roll snowballs' },
    { emoji: '⛄', text: 'Stack them up' }, { emoji: '🥕', text: 'Add a carrot nose' },
  ]},
  { title: 'Baking a Cake', panels: [
    { emoji: '🥚', text: 'Mix ingredients' }, { emoji: '🫗', text: 'Pour into pan' },
    { emoji: '🔥', text: 'Bake in oven' }, { emoji: '🎂', text: 'Decorate cake' },
  ]},
  { title: 'A Rainy Day', panels: [
    { emoji: '☁️', text: 'Clouds gather' }, { emoji: '🌧️', text: 'Rain starts' },
    { emoji: '🌈', text: 'Rainbow appears' }, { emoji: '☀️', text: 'Sun comes out' },
  ]},
  { title: 'Reading a Book', panels: [
    { emoji: '📚', text: 'Go to library' }, { emoji: '🔍', text: 'Choose a book' },
    { emoji: '📖', text: 'Read the story' }, { emoji: '😊', text: 'Feel happy!' },
  ]},
  { title: 'Playing a Game', panels: [
    { emoji: '🎮', text: 'Turn on game' }, { emoji: '👾', text: 'Fight the boss' },
    { emoji: '⭐', text: 'Collect stars' }, { emoji: '🏆', text: 'You win!' },
  ]},
]

export default function StorySequence({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [order, setOrder] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [shuffled] = useState(() => [...STORIES].sort(() => Math.random() - 0.5))
  const total = shuffled.length
  const story = shuffled[round]

  const [shuffledPanels] = useState<number[][]>(() =>
    shuffled.map(s => s.panels.map((_, i) => i).sort(() => Math.random() - 0.5))
  )

  const handleSelect = useCallback((idx: number) => {
    if (checked) return
    if (order.includes(idx)) {
      setOrder(o => o.filter(i => i !== idx))
    } else {
      setOrder(o => [...o, idx])
    }
  }, [checked, order])

  const handleCheck = useCallback(() => {
    setChecked(true)
    const correct = order.every((v, i) => shuffledPanels[round][v] === i)
    // Count how many are in the right position
    const rightCount = order.filter((v, i) => shuffledPanels[round][v] === i).length
    const pts = Math.round((rightCount / story.panels.length) * 100)
    const newScore = score + pts

    setTimeout(() => {
      if (round + 1 >= total) onComplete(newScore)
      else { setRound(r => r + 1); setOrder([]); setChecked(false) }
    }, 1800)

    setScore(newScore)
  }, [order, shuffledPanels, round, total, score, story, onComplete])

  const panels = shuffledPanels[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-lg text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Story {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>

      <h3 className="text-xl font-bold text-[#1f2937]">📖 {story.title}</h3>
      <p className="text-[#6B7280]">Tap the panels in the right order (1st to last)!</p>

      {/* Selected order display */}
      <div className="flex gap-2 mb-2">
        {story.panels.map((_, i) => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            i < order.length ? 'bg-orange-400 border-orange-400 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
          }`}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {panels.map((origIdx, displayIdx) => {
          const panel = story.panels[origIdx]
          const selectedPos = order.indexOf(displayIdx)
          const isSelected = selectedPos !== -1
          let cls = 'bg-white border-2 border-gray-200 hover:border-orange-400'
          if (checked) {
            const correctPos = origIdx
            const userPos = selectedPos
            cls = correctPos === userPos ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-300'
          } else if (isSelected) {
            cls = 'bg-orange-50 border-2 border-orange-400'
          }

          return (
            <button key={displayIdx} onClick={() => handleSelect(displayIdx)}
              className={`${cls} rounded-2xl p-4 text-center transition-all active:scale-95 relative`}>
              {isSelected && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-400 text-white rounded-full text-xs font-bold flex items-center justify-center">
                  {selectedPos + 1}
                </span>
              )}
              <span className="text-3xl block mb-1">{panel.emoji}</span>
              <span className="text-sm text-[#4B5563] font-medium">{panel.text}</span>
            </button>
          )
        })}
      </div>

      {order.length === story.panels.length && !checked && (
        <button onClick={handleCheck}
          className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">
          Check Order! ✅
        </button>
      )}
    </div>
  )
}
