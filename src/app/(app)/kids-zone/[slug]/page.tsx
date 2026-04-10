'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

// Kids game components
import EmojiPattern from '@/components/kids/emoji-pattern'
import ColorMixer from '@/components/kids/color-mixer'
import AnimalSort from '@/components/kids/animal-sort'
import ShapeBuilder from '@/components/kids/shape-builder'
import StorySequence from '@/components/kids/story-sequence'
import OddOneOut from '@/components/kids/odd-one-out'
import MirrorMatch from '@/components/kids/mirror-match'
import NumberNinja from '@/components/kids/number-ninja'
import WordScramble from '@/components/kids/word-scramble'
import MazeRunner from '@/components/kids/maze-runner'
import TreasureMap from '@/components/kids/treasure-map'
import CodeBreaker from '@/components/kids/code-breaker'
import BalanceScale from '@/components/kids/balance-scale'
import SpotDifference from '@/components/kids/spot-difference'
import RhythmRepeat from '@/components/kids/rhythm-repeat'
import PixelArtist from '@/components/kids/pixel-artist'
import WordChain from '@/components/kids/word-chain'
import GuessRule from '@/components/kids/guess-rule'
import TowerBuilder from '@/components/kids/tower-builder'
import EmotionDetective from '@/components/kids/emotion-detective'

interface Game {
  id: string; name: string; slug: string; description: string
  benefits: string[]; rules: string[]; gameType: string; maxLevel: number
}

const MAX_LEVEL = 30
const CHEERS = ['Amazing! 🌟', 'Super Star! ⭐', 'Brilliant! 🎉', 'Wonderful! 🏆', 'You Rock! 🚀', 'Fantastic! 💫', 'Genius! 🧠', 'Incredible! 🌈']
const GAME_ICONS: Record<string, string> = {
  'emoji-pattern': '🔮', 'color-mixer': '🎨', 'animal-sort': '🦁', 'shape-builder': '🔷',
  'story-sequence': '📖', 'odd-one-out': '🔍', 'mirror-match': '🪞', 'number-ninja': '🥷',
  'word-scramble': '🔤', 'maze-runner': '🏃', 'treasure-map': '🗺️', 'code-breaker': '🔐',
  'balance-scale': '⚖️', 'spot-difference': '👀', 'rhythm-repeat': '🥁', 'pixel-artist': '🖼️',
  'word-chain': '🔗', 'guess-rule': '🧩', 'tower-builder': '🏗️', 'emotion-detective': '😊',
}

function tierLabel(level: number) {
  if (level <= 10) return { text: 'Easy', color: 'text-green-500', bg: 'bg-green-50' }
  if (level <= 20) return { text: 'Medium', color: 'text-amber-500', bg: 'bg-amber-50' }
  return { text: 'Hard', color: 'text-red-500', bg: 'bg-red-50' }
}

export default function KidsPlayPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [phase, setPhase] = useState<'info' | 'playing' | 'complete'>('info')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [cheer, setCheer] = useState(() => CHEERS[Math.floor(Math.random() * CHEERS.length)])
  const [gameKey, setGameKey] = useState(0) // force remount on level change

  useEffect(() => {
    fetch(`/api/exercises?slug=${params.slug}`)
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json() })
      .then(d => { if (d && !d.error) setGame(d) })
      .catch(() => {})
  }, [params.slug])

  const handleComplete = (finalScore: number) => {
    setScore(finalScore)
    setTotalScore(t => t + finalScore)
    setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)])
    setPhase('complete')
  }

  const handleNextLevel = () => {
    const next = Math.min(level + 1, MAX_LEVEL)
    setLevel(next)
    setScore(0)
    setGameKey(k => k + 1)
    setPhase('playing')
  }

  const handleReplay = () => {
    setScore(0)
    setGameKey(k => k + 1)
    setPhase('playing')
  }

  const handlePickLevel = (lv: number) => {
    setLevel(lv)
    setScore(0)
    setGameKey(k => k + 1)
    setPhase('playing')
  }

  const renderGame = () => {
    if (!game) return null
    const props = { onComplete: handleComplete, level, key: gameKey }
    switch (game.gameType) {
      case 'kids_pattern': return <EmojiPattern {...props} />
      case 'kids_color_mix': return <ColorMixer {...props} />
      case 'kids_animal_sort': return <AnimalSort {...props} />
      case 'kids_shape_builder': return <ShapeBuilder {...props} />
      case 'kids_story_sequence': return <StorySequence {...props} />
      case 'kids_odd_one_out': return <OddOneOut {...props} />
      case 'kids_mirror_match': return <MirrorMatch {...props} />
      case 'kids_number_ninja': return <NumberNinja {...props} />
      case 'kids_word_scramble': return <WordScramble {...props} />
      case 'kids_maze': return <MazeRunner {...props} />
      case 'kids_treasure_map': return <TreasureMap {...props} />
      case 'kids_code_breaker': return <CodeBreaker {...props} />
      case 'kids_balance': return <BalanceScale {...props} />
      case 'kids_spot_diff': return <SpotDifference {...props} />
      case 'kids_rhythm': return <RhythmRepeat {...props} />
      case 'kids_pixel_art': return <PixelArtist {...props} />
      case 'kids_word_chain': return <WordChain {...props} />
      case 'kids_guess_rule': return <GuessRule {...props} />
      case 'kids_tower': return <TowerBuilder {...props} />
      case 'kids_emotion': return <EmotionDetective {...props} />
      default: return <div className="text-center text-gray-400">Game not found</div>
    }
  }

  if (!game) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-2xl animate-bounce">🎮 Loading...</div>
    </div>
  )

  const icon = GAME_ICONS[game.slug] || '🎮'
  const tier = tierLabel(level)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {phase === 'info' && (
        <div className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-6xl block mb-3">{icon}</span>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{game.name}</h1>
            <p className="text-[#6B7280] mt-2 text-lg">{game.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase mb-2">📋 How to Play</h3>
              <ul className="space-y-1">
                {(game.rules ?? []).map((r, i) => <li key={i} className="text-[#4B5563] text-sm flex items-start gap-2"><span className="text-blue-400">•</span>{r}</li>)}
              </ul>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-green-600 uppercase mb-2">🧠 Skills You Train</h3>
              <ul className="space-y-1">
                {(game.benefits ?? []).map((b, i) => <li key={i} className="text-[#4B5563] text-sm flex items-start gap-2"><span className="text-green-400">✓</span>{b}</li>)}
              </ul>
            </div>
          </div>

          {/* Level selector */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#6B7280] uppercase mb-3 text-center">Choose Your Level</h3>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-lg mx-auto">
              {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map(lv => {
                const t = tierLabel(lv)
                const isSelected = lv === level
                return (
                  <button key={lv} onClick={() => setLevel(lv)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-white scale-110 shadow-md'
                        : `${t.bg} ${t.color} hover:scale-105`
                    }`}>
                    {lv}
                  </button>
                )
              })}
            </div>
            <div className="text-center mt-2">
              <span className={`text-sm font-semibold ${tier.color}`}>
                Level {level} — {tier.text} {level <= 10 ? '🟢' : level <= 20 ? '🟡' : '🔴'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => { setGameKey(k => k + 1); setPhase('playing') }}
              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white px-10 py-4 rounded-full text-xl font-extrabold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Let&apos;s Go! 🚀
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div className="bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <h2 className="text-lg font-bold text-[#1f2937]">{game.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${tier.bg} ${tier.color}`}>
                Lv.{level} {tier.text}
              </span>
            </div>
          </div>
          {renderGame()}
        </div>
      )}

      {phase === 'complete' && (
        <div className="bg-white border-2 border-orange-200 rounded-3xl p-8 text-center shadow-sm">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            {cheer}
          </h2>
          <p className="text-[#6B7280] text-lg mb-2">Level {level} Complete!</p>

          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl px-6 py-4">
              <div className="text-4xl font-extrabold text-white">{score}</div>
              <div className="text-white/80 text-xs font-semibold mt-1">This Level ⭐</div>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl px-6 py-4">
              <div className="text-4xl font-extrabold text-white">{totalScore}</div>
              <div className="text-white/80 text-xs font-semibold mt-1">Total Score 🏆</div>
            </div>
          </div>

          {/* Level progress bar */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
              <span>Level Progress</span>
              <span>{level}/{MAX_LEVEL}</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400 transition-all duration-500"
                style={{ width: `${(level / MAX_LEVEL) * 100}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['⭐', '🌟', '💫', '✨', '🏆'].slice(0, Math.min(5, Math.ceil(score / 200))).map((star, i) => (
              <span key={i} className="text-4xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{star}</span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {level < MAX_LEVEL && (
              <button onClick={handleNextLevel}
                className="bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                Next Level! ⬆️ Lv.{level + 1}
              </button>
            )}
            {level >= MAX_LEVEL && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg">
                🏆 All 30 Levels Complete! 🏆
              </div>
            )}
            <button onClick={handleReplay}
              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Replay Lv.{level} 🔄
            </button>
            <button onClick={() => router.push('/kids-zone')}
              className="border-2 border-orange-300 hover:border-orange-400 text-orange-500 hover:text-orange-600 px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95">
              More Games 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
