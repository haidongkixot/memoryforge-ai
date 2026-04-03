'use client'

import { useEffect, useState, useCallback } from 'react'

type Game = {
  id: string
  name: string
  slug: string
  category: string
  difficulty: string
  gameType: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  _count: { gameSessions: number }
}

type GameContent = {
  id: string
  gameId: string
  contentType: string
  content: Record<string, unknown>
  difficulty: string
  label: string
  isActive: boolean
  createdAt: string
  game?: { name: string; slug: string }
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-900/40 text-green-400',
  intermediate: 'bg-yellow-900/40 text-yellow-400',
  advanced: 'bg-red-900/40 text-red-400',
}

const contentTypeLabels: Record<string, string> = {
  word_list: 'Word List',
  word_pair: 'Word Pairs',
  face_data: 'Face Data',
  custom: 'Custom',
}

function ContentPreview({ contentType, content }: { contentType: string; content: Record<string, unknown> }) {
  if (contentType === 'word_list' && Array.isArray((content as { words?: string[] }).words)) {
    const words = (content as { words: string[] }).words
    return (
      <div className="flex flex-wrap gap-1">
        {words.slice(0, 8).map((w) => (
          <span key={w} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{w}</span>
        ))}
        {words.length > 8 && <span className="text-gray-500 text-xs">+{words.length - 8} more</span>}
      </div>
    )
  }
  if (contentType === 'word_pair' && Array.isArray((content as { pairs?: { target: string; answer: string }[] }).pairs)) {
    const pairs = (content as { pairs: { target: string; answer: string }[] }).pairs
    return (
      <div className="flex flex-wrap gap-1">
        {pairs.slice(0, 5).map((p) => (
          <span key={p.target} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
            {p.target} &rarr; {p.answer}
          </span>
        ))}
        {pairs.length > 5 && <span className="text-gray-500 text-xs">+{pairs.length - 5} more</span>}
      </div>
    )
  }
  if (contentType === 'face_data' && Array.isArray((content as { faces?: { emoji: string; name: string }[] }).faces)) {
    const faces = (content as { faces: { emoji: string; name: string }[] }).faces
    return (
      <div className="flex flex-wrap gap-1">
        {faces.slice(0, 5).map((f) => (
          <span key={f.name} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
            {f.emoji} {f.name}
          </span>
        ))}
        {faces.length > 5 && <span className="text-gray-500 text-xs">+{faces.length - 5} more</span>}
      </div>
    )
  }
  return <span className="text-gray-500 text-xs">No preview</span>
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedGame, setExpandedGame] = useState<string | null>(null)
  const [contentPacks, setContentPacks] = useState<GameContent[]>([])
  const [contentLoading, setContentLoading] = useState(false)

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createType, setCreateType] = useState('word_list')
  const [createDifficulty, setCreateDifficulty] = useState('beginner')
  const [createLabel, setCreateLabel] = useState('')
  const [createJson, setCreateJson] = useState('')
  const [createSaving, setCreateSaving] = useState(false)

  // AI generation state
  const [showAiForm, setShowAiForm] = useState(false)
  const [aiType, setAiType] = useState('word_list')
  const [aiDifficulty, setAiDifficulty] = useState('beginner')
  const [aiTheme, setAiTheme] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiResult, setAiResult] = useState<GameContent | null>(null)

  const fetchGames = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/games')
      const data = await res.json()
      setGames(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  const fetchContentPacks = useCallback(async (gameId: string) => {
    setContentLoading(true)
    try {
      const res = await fetch(`/api/admin/game-content?gameId=${gameId}`)
      const data = await res.json()
      setContentPacks(data)
    } catch {
      setContentPacks([])
    } finally {
      setContentLoading(false)
    }
  }, [])

  const toggleActive = async (gameId: string, current: boolean) => {
    setActionLoading(gameId)
    try {
      await fetch('/api/admin/games', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId, isActive: !current }),
      })
      await fetchGames()
    } finally {
      setActionLoading(null)
    }
  }

  const toggleExpand = (gameId: string) => {
    if (expandedGame === gameId) {
      setExpandedGame(null)
      setContentPacks([])
      setShowCreateForm(false)
      setShowAiForm(false)
      setAiResult(null)
    } else {
      setExpandedGame(gameId)
      setShowCreateForm(false)
      setShowAiForm(false)
      setAiResult(null)
      fetchContentPacks(gameId)
    }
  }

  const toggleContentActive = async (contentId: string, current: boolean) => {
    try {
      await fetch('/api/admin/game-content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contentId, isActive: !current }),
      })
      if (expandedGame) fetchContentPacks(expandedGame)
    } catch { /* ignore */ }
  }

  const deleteContentPack = async (contentId: string) => {
    if (!confirm('Delete this content pack?')) return
    try {
      await fetch('/api/admin/game-content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contentId }),
      })
      if (expandedGame) fetchContentPacks(expandedGame)
    } catch { /* ignore */ }
  }

  const handleCreateContent = async () => {
    if (!expandedGame || !createJson.trim()) return
    setCreateSaving(true)
    try {
      const content = JSON.parse(createJson)
      await fetch('/api/admin/game-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: expandedGame,
          contentType: createType,
          content,
          difficulty: createDifficulty,
          label: createLabel || 'Custom Pack',
        }),
      })
      setShowCreateForm(false)
      setCreateJson('')
      setCreateLabel('')
      fetchContentPacks(expandedGame)
    } catch (err) {
      alert('Invalid JSON: ' + String(err))
    } finally {
      setCreateSaving(false)
    }
  }

  const handleAiGenerate = async () => {
    if (!expandedGame) return
    setAiGenerating(true)
    setAiResult(null)
    try {
      const res = await fetch('/api/admin/game-content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: expandedGame,
          contentType: aiType,
          difficulty: aiDifficulty,
          theme: aiTheme,
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert('AI generation error: ' + data.error)
      } else {
        setAiResult(data)
        fetchContentPacks(expandedGame)
      }
    } catch (err) {
      alert('AI generation failed: ' + String(err))
    } finally {
      setAiGenerating(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Games</h1>
        <p className="text-gray-400 text-sm mt-1">{games.length} games in catalog. Click a game to manage content packs.</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-left font-medium">Difficulty</th>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Sessions</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading games...</td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No games found.</td>
                </tr>
              ) : (
                games.map((game) => (
                  <>
                    <tr
                      key={game.id}
                      className={`hover:bg-gray-800/40 transition-colors cursor-pointer ${expandedGame === game.id ? 'bg-gray-800/30' : ''}`}
                      onClick={() => toggleExpand(game.id)}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs">{expandedGame === game.id ? '▼' : '▶'}</span>
                          <div>
                            <p className="font-medium text-white">{game.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{game.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-300 capitalize">{game.category}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                          difficultyColors[game.difficulty] ?? 'bg-gray-800 text-gray-400'
                        }`}>
                          {game.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-400 capitalize">{game.gameType}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          game.isActive ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {game.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-300 font-medium">{game._count.gameSessions}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleActive(game.id, game.isActive) }}
                          disabled={actionLoading === game.id}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                            game.isActive
                              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                              : 'bg-green-900/40 text-green-400 hover:bg-green-900/70'
                          }`}
                        >
                          {actionLoading === game.id ? '...' : game.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded content packs section */}
                    {expandedGame === game.id && (
                      <tr key={`${game.id}-content`}>
                        <td colSpan={7} className="px-6 py-4 bg-gray-950/50">
                          <div className="space-y-4">
                            {/* Header with action buttons */}
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-gray-300">
                                Content Packs for {game.name}
                              </h3>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setShowCreateForm(!showCreateForm); setShowAiForm(false) }}
                                  className="px-3 py-1.5 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded text-xs font-medium transition-colors"
                                >
                                  + Create Content Pack
                                </button>
                                <button
                                  onClick={() => { setShowAiForm(!showAiForm); setShowCreateForm(false) }}
                                  className="px-3 py-1.5 bg-purple-900/40 text-purple-400 hover:bg-purple-900/70 rounded text-xs font-medium transition-colors"
                                >
                                  AI Generate
                                </button>
                              </div>
                            </div>

                            {/* Manual create form */}
                            {showCreateForm && (
                              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
                                <h4 className="text-sm font-medium text-white">Create Content Pack</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-400 block mb-1">Content Type</label>
                                    <select value={createType} onChange={e => setCreateType(e.target.value)}
                                      className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1.5 text-xs">
                                      <option value="word_list">Word List</option>
                                      <option value="word_pair">Word Pairs</option>
                                      <option value="face_data">Face Data</option>
                                      <option value="custom">Custom</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-400 block mb-1">Difficulty</label>
                                    <select value={createDifficulty} onChange={e => setCreateDifficulty(e.target.value)}
                                      className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1.5 text-xs">
                                      <option value="beginner">Beginner</option>
                                      <option value="intermediate">Intermediate</option>
                                      <option value="advanced">Advanced</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-400 block mb-1">Label</label>
                                    <input value={createLabel} onChange={e => setCreateLabel(e.target.value)}
                                      placeholder="e.g. Animals Theme"
                                      className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1.5 text-xs" />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 block mb-1">Content JSON</label>
                                  <textarea value={createJson} onChange={e => setCreateJson(e.target.value)}
                                    rows={6} placeholder='{"words": ["apple", "banana", ...]}'
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-3 py-2 text-xs font-mono" />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={handleCreateContent} disabled={createSaving}
                                    className="px-4 py-1.5 bg-green-900/40 text-green-400 hover:bg-green-900/70 rounded text-xs font-medium disabled:opacity-50">
                                    {createSaving ? 'Saving...' : 'Save'}
                                  </button>
                                  <button onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-1.5 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded text-xs font-medium">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* AI generation form */}
                            {showAiForm && (
                              <div className="bg-gray-900 border border-purple-900/40 rounded-lg p-4 space-y-3">
                                <h4 className="text-sm font-medium text-purple-400">Generate with AI</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-400 block mb-1">Content Type</label>
                                    <select value={aiType} onChange={e => setAiType(e.target.value)}
                                      className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1.5 text-xs">
                                      <option value="word_list">Word List</option>
                                      <option value="word_pair">Word Pairs</option>
                                      <option value="face_data">Face Data</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-400 block mb-1">Difficulty</label>
                                    <select value={aiDifficulty} onChange={e => setAiDifficulty(e.target.value)}
                                      className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1.5 text-xs">
                                      <option value="beginner">Beginner</option>
                                      <option value="intermediate">Intermediate</option>
                                      <option value="advanced">Advanced</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-400 block mb-1">Theme</label>
                                    <input value={aiTheme} onChange={e => setAiTheme(e.target.value)}
                                      placeholder="e.g. Animals, Science, Countries"
                                      className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1.5 text-xs" />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={handleAiGenerate} disabled={aiGenerating}
                                    className="px-4 py-1.5 bg-purple-900/40 text-purple-400 hover:bg-purple-900/70 rounded text-xs font-medium disabled:opacity-50">
                                    {aiGenerating ? 'Generating...' : 'Generate'}
                                  </button>
                                  <button onClick={() => { setShowAiForm(false); setAiResult(null) }}
                                    className="px-4 py-1.5 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded text-xs font-medium">
                                    Cancel
                                  </button>
                                </div>
                                {/* AI result preview */}
                                {aiResult && (
                                  <div className="bg-gray-800 rounded p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-green-400 font-medium">Generated and saved: {aiResult.label}</span>
                                    </div>
                                    <ContentPreview contentType={aiResult.contentType} content={aiResult.content as Record<string, unknown>} />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Content packs table */}
                            {contentLoading ? (
                              <p className="text-gray-500 text-xs">Loading content packs...</p>
                            ) : contentPacks.length === 0 ? (
                              <p className="text-gray-500 text-xs">No content packs for this game. Create one manually or generate with AI.</p>
                            ) : (
                              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-gray-800/40 text-gray-500 uppercase tracking-wide">
                                      <th className="px-4 py-2 text-left font-medium">Label</th>
                                      <th className="px-4 py-2 text-left font-medium">Type</th>
                                      <th className="px-4 py-2 text-left font-medium">Difficulty</th>
                                      <th className="px-4 py-2 text-left font-medium">Preview</th>
                                      <th className="px-4 py-2 text-left font-medium">Created</th>
                                      <th className="px-4 py-2 text-left font-medium">Status</th>
                                      <th className="px-4 py-2 text-left font-medium">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-800">
                                    {contentPacks.map((cp) => (
                                      <tr key={cp.id} className="hover:bg-gray-800/30">
                                        <td className="px-4 py-2 text-gray-300 font-medium">{cp.label}</td>
                                        <td className="px-4 py-2">
                                          <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                                            {contentTypeLabels[cp.contentType] || cp.contentType}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2">
                                          <span className={`px-1.5 py-0.5 rounded text-xs capitalize ${
                                            difficultyColors[cp.difficulty] || 'bg-gray-800 text-gray-400'
                                          }`}>
                                            {cp.difficulty}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 max-w-xs">
                                          <ContentPreview contentType={cp.contentType} content={cp.content} />
                                        </td>
                                        <td className="px-4 py-2 text-gray-500">
                                          {new Date(cp.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">
                                          <button
                                            onClick={() => toggleContentActive(cp.id, cp.isActive)}
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                                              cp.isActive ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'
                                            }`}
                                          >
                                            {cp.isActive ? 'Active' : 'Inactive'}
                                          </button>
                                        </td>
                                        <td className="px-4 py-2">
                                          <button
                                            onClick={() => deleteContentPack(cp.id)}
                                            className="px-2 py-0.5 bg-red-900/30 text-red-400 hover:bg-red-900/60 rounded text-xs font-medium transition-colors"
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
