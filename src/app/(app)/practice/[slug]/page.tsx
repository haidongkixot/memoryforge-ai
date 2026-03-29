'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MemoryGrid from '@/components/memory-grid'
import SequenceGame from '@/components/sequence-game'

interface Game {
  id: string; name: string; slug: string; category: string; difficulty: string; description: string
  benefits: string[]; rules: string[]; gameType: string; gridSize: number; timeLimit: number; maxLevel: number
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [phase, setPhase] = useState<'info' | 'playing' | 'complete'>('info')
  const [level, setLevel] = useState(1)
  const [result, setResult] = useState<{ score: number; moves?: number; time: number; level?: number } | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetch(`/api/exercises?slug=${params.slug}`).then(r => r.json()).then(d => { if (d && !d.error) setGame(d) })
  }, [params.slug])

  const handleComplete = async (score: number, movesOrLevel: number, time: number) => {
    setResult({ score, moves: movesOrLevel, time, level })
    setPhase('complete')

    // Save session
    if (game) {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id, score, level, accuracy: Math.min(100, Math.round(score / 10)),
          duration: time, movesCount: movesOrLevel,
        }),
      }).catch(() => {})

      // Get AI feedback
      fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName: game.name, score, level, accuracy: Math.min(100, Math.round(score / 10)), duration: time }),
      }).then(r => r.json()).then(d => setFeedback(d.feedback)).catch(() => {})
    }
  }

  if (!game) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-400">Loading game...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {phase === 'info' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">{game.name}</h1>
          <p className="text-gray-400 mb-6">{game.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 uppercase mb-2">Rules</h3>
              <ul className="space-y-1">
                {game.rules.map((r, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span>{r}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 uppercase mb-2">Benefits</h3>
              <ul className="space-y-1">
                {game.benefits.map((b, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span>{b}</li>)}
              </ul>
            </div>
          </div>
          <button onClick={() => setPhase('playing')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-medium transition-colors">
            Start Game
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">{game.name}</h2>
          </div>
          {(game.gameType === 'match') && (
            <MemoryGrid gridSize={game.gridSize} level={level} onComplete={handleComplete} />
          )}
          {(game.gameType === 'sequence' || game.gameType === 'nback') && (
            <SequenceGame gridSize={game.gridSize || 3} onComplete={handleComplete} />
          )}
          {!['match', 'sequence', 'nback'].includes(game.gameType) && (
            <MemoryGrid gridSize={Math.min(game.gridSize || 4, 6)} level={level} onComplete={handleComplete} />
          )}
        </div>
      )}

      {phase === 'complete' && result && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Game Complete!</h2>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-400">{result.score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-400">{result.time}s</div>
              <div className="text-xs text-gray-400">Time</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-400">{result.moves || result.level}</div>
              <div className="text-xs text-gray-400">{result.moves ? 'Moves' : 'Level'}</div>
            </div>
          </div>
          {feedback && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6 text-left max-w-lg mx-auto">
              <div className="text-sm font-semibold text-indigo-400 mb-1">AI Coach</div>
              <p className="text-gray-300 text-sm">{feedback}</p>
            </div>
          )}
          <div className="flex justify-center gap-4">
            <button onClick={() => { setPhase('playing'); setLevel(l => l + 1); setResult(null); setFeedback('') }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl transition-colors">
              Play Again
            </button>
            <button onClick={() => router.push('/library')}
              className="border border-gray-700 hover:border-indigo-400 text-gray-300 px-6 py-2.5 rounded-xl transition-colors">
              Other Games
            </button>
          </div>
        </div>
      )}
    </div>
  )
}