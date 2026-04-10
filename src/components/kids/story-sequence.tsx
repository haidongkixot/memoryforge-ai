'use client'
import { useState, useCallback, useMemo } from 'react'

interface Props { onComplete: (score: number) => void; level?: number }
interface Story { title: string; panels: { emoji: string; text: string }[] }

const ALL_STORIES: Story[] = [
  { title: 'Making a Sandwich', panels: [{ emoji: '🍞', text: 'Get bread' }, { emoji: '🧈', text: 'Spread butter' }, { emoji: '🧀', text: 'Add cheese' }, { emoji: '🔪', text: 'Cut in half' }] },
  { title: 'Growing a Plant', panels: [{ emoji: '🌱', text: 'Plant seed' }, { emoji: '💧', text: 'Water it' }, { emoji: '☀️', text: 'Give sunlight' }, { emoji: '🌸', text: 'It blooms!' }] },
  { title: 'Going to School', panels: [{ emoji: '⏰', text: 'Wake up' }, { emoji: '🪥', text: 'Brush teeth' }, { emoji: '🎒', text: 'Pack bag' }, { emoji: '🚌', text: 'Catch bus' }] },
  { title: 'Building a Snowman', panels: [{ emoji: '❄️', text: 'Snow falls' }, { emoji: '⛏️', text: 'Roll snowballs' }, { emoji: '⛄', text: 'Stack them' }, { emoji: '🥕', text: 'Add nose' }] },
  { title: 'Baking a Cake', panels: [{ emoji: '🥚', text: 'Mix ingredients' }, { emoji: '🫗', text: 'Pour in pan' }, { emoji: '🔥', text: 'Bake it' }, { emoji: '🎂', text: 'Decorate' }] },
  { title: 'A Rainy Day', panels: [{ emoji: '☁️', text: 'Clouds gather' }, { emoji: '🌧️', text: 'Rain starts' }, { emoji: '🌈', text: 'Rainbow!' }, { emoji: '☀️', text: 'Sun out' }] },
  { title: 'Reading a Book', panels: [{ emoji: '📚', text: 'Go to library' }, { emoji: '🔍', text: 'Choose book' }, { emoji: '📖', text: 'Read story' }, { emoji: '😊', text: 'Feel happy!' }] },
  { title: 'Playing a Game', panels: [{ emoji: '🎮', text: 'Turn on game' }, { emoji: '👾', text: 'Fight boss' }, { emoji: '⭐', text: 'Collect stars' }, { emoji: '🏆', text: 'You win!' }] },
  { title: 'Painting a Picture', panels: [{ emoji: '🎨', text: 'Get paints' }, { emoji: '🖌️', text: 'Paint sky' }, { emoji: '🌲', text: 'Add trees' }, { emoji: '🖼️', text: 'Hang up art' }] },
  { title: 'Going Swimming', panels: [{ emoji: '👙', text: 'Put on suit' }, { emoji: '🏊', text: 'Jump in pool' }, { emoji: '🤿', text: 'Swim around' }, { emoji: '🛟', text: 'Dry off' }] },
  { title: 'Birthday Party', panels: [{ emoji: '🎈', text: 'Blow balloons' }, { emoji: '🎁', text: 'Open gifts' }, { emoji: '🎂', text: 'Eat cake' }, { emoji: '🎉', text: 'Have fun!' }] },
  { title: 'Going Camping', panels: [{ emoji: '🚗', text: 'Drive there' }, { emoji: '⛺', text: 'Set up tent' }, { emoji: '🔥', text: 'Build campfire' }, { emoji: '🌌', text: 'Watch stars' }] },
  { title: 'Making Friends', panels: [{ emoji: '👋', text: 'Say hello' }, { emoji: '🗣️', text: 'Start talking' }, { emoji: '🤝', text: 'Shake hands' }, { emoji: '😄', text: 'Become friends' }] },
  { title: 'Cooking Pasta', panels: [{ emoji: '🫗', text: 'Boil water' }, { emoji: '🍝', text: 'Add pasta' }, { emoji: '🍅', text: 'Make sauce' }, { emoji: '🧀', text: 'Add cheese' }] },
  { title: 'Going to the Moon', panels: [{ emoji: '🚀', text: 'Launch rocket' }, { emoji: '🌍', text: 'Leave Earth' }, { emoji: '🌕', text: 'Reach Moon' }, { emoji: '👨‍🚀', text: 'Walk on Moon' }] },
  { title: 'Making Lemonade', panels: [{ emoji: '🍋', text: 'Squeeze lemons' }, { emoji: '💧', text: 'Add water' }, { emoji: '🍬', text: 'Add sugar' }, { emoji: '🥤', text: 'Stir & serve' }] },
  { title: 'Building a Sandcastle', panels: [{ emoji: '🏖️', text: 'Go to beach' }, { emoji: '🪣', text: 'Fill bucket' }, { emoji: '🏰', text: 'Build castle' }, { emoji: '🐚', text: 'Decorate it' }] },
  { title: 'Flying a Kite', panels: [{ emoji: '🪁', text: 'Get kite' }, { emoji: '💨', text: 'Wait for wind' }, { emoji: '🏃', text: 'Run with it' }, { emoji: '🎐', text: 'It flies!' }] },
  { title: 'Planting Vegetables', panels: [{ emoji: '🌱', text: 'Dig holes' }, { emoji: '🥕', text: 'Plant seeds' }, { emoji: '💧', text: 'Water daily' }, { emoji: '🥦', text: 'Harvest!' }] },
  { title: 'Making a Snowball Fight', panels: [{ emoji: '❄️', text: 'Fresh snow' }, { emoji: '⚪', text: 'Make snowballs' }, { emoji: '🤾', text: 'Throw them!' }, { emoji: '😂', text: 'Laugh together' }] },
  { title: 'Going to the Zoo', panels: [{ emoji: '🎟️', text: 'Buy tickets' }, { emoji: '🦁', text: 'See lions' }, { emoji: '🐘', text: 'Feed elephants' }, { emoji: '📸', text: 'Take photos' }] },
  { title: 'Learning to Ride', panels: [{ emoji: '🚲', text: 'Get bike' }, { emoji: '🧑‍🏫', text: 'Dad helps' }, { emoji: '🤕', text: 'Fall down' }, { emoji: '🎉', text: 'Ride alone!' }] },
  { title: 'Morning Routine', panels: [{ emoji: '🌅', text: 'Sunrise' }, { emoji: '🥣', text: 'Eat breakfast' }, { emoji: '🧥', text: 'Get dressed' }, { emoji: '🚶', text: 'Head out' }] },
  { title: 'Science Experiment', panels: [{ emoji: '🧪', text: 'Mix chemicals' }, { emoji: '🔥', text: 'Heat it up' }, { emoji: '💥', text: 'Reaction!' }, { emoji: '📝', text: 'Write notes' }] },
]

export default function StorySequence({ onComplete, level = 1 }: Props) {
  const count = Math.min(4 + Math.floor(level / 3), 15)
  const stories = useMemo(() => [...ALL_STORIES].sort(() => Math.random() - 0.5).slice(0, count), [level, count])
  const total = stories.length
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [order, setOrder] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const story = stories[round]

  const shuffledPanels = useMemo(() => stories.map(s => s.panels.map((_, i) => i).sort(() => Math.random() - 0.5)), [stories])

  const handleSelect = useCallback((idx: number) => {
    if (checked) return
    if (order.includes(idx)) setOrder(o => o.filter(i => i !== idx))
    else setOrder(o => [...o, idx])
  }, [checked, order])

  const handleCheck = useCallback(() => {
    setChecked(true)
    const rightCount = order.filter((v, i) => shuffledPanels[round][v] === i).length
    const pts = Math.round((rightCount / story.panels.length) * (50 + level * 5))
    const newScore = score + pts
    setTimeout(() => {
      if (round + 1 >= total) onComplete(newScore)
      else { setRound(r => r + 1); setOrder([]); setChecked(false) }
    }, 1800)
    setScore(newScore)
  }, [order, shuffledPanels, round, total, score, story, level, onComplete])

  const panels = shuffledPanels[round]

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-lg text-sm">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">Story {round + 1}/{total}</span>
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">Score: {score}</span>
      </div>
      <h3 className="text-xl font-bold text-[#1f2937]">📖 {story.title}</h3>
      <p className="text-[#6B7280]">Tap the panels in the right order!</p>
      <div className="flex gap-2 mb-2">
        {story.panels.map((_, i) => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${i < order.length ? 'bg-orange-400 border-orange-400 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>{i + 1}</div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {panels.map((origIdx, displayIdx) => {
          const panel = story.panels[origIdx]
          const selectedPos = order.indexOf(displayIdx)
          const isSelected = selectedPos !== -1
          let cls = 'bg-white border-2 border-gray-200 hover:border-orange-400'
          if (checked) {
            const correctPos = origIdx; const userPos = selectedPos
            cls = correctPos === userPos ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-300'
          } else if (isSelected) cls = 'bg-orange-50 border-2 border-orange-400'
          return (
            <button key={displayIdx} onClick={() => handleSelect(displayIdx)} className={`${cls} rounded-2xl p-4 text-center transition-all active:scale-95 relative`}>
              {isSelected && <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-400 text-white rounded-full text-xs font-bold flex items-center justify-center">{selectedPos + 1}</span>}
              <span className="text-3xl block mb-1">{panel.emoji}</span>
              <span className="text-sm text-[#4B5563] font-medium">{panel.text}</span>
            </button>
          )
        })}
      </div>
      {order.length === story.panels.length && !checked && (
        <button onClick={handleCheck} className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg">Check Order! ✅</button>
      )}
    </div>
  )
}
