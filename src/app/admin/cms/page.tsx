'use client'
import { useEffect, useState } from 'react'

const SITE_CONTENT_KEYS = [
  { key: 'hero_title', label: 'Hero Title', placeholder: 'Train recall. Sharpen pattern recognition. Measure progress.' },
  { key: 'hero_description', label: 'Hero Description', placeholder: 'Structured exercises for working memory...' },
  { key: 'stats_users', label: 'Stat: Active Users', placeholder: '9,000+' },
  { key: 'stats_sessions', label: 'Stat: Training Sessions', placeholder: '120,000+' },
  { key: 'stats_games', label: 'Stat: Cognitive Games', placeholder: '8' },
]

const TONES = ['informative and engaging', 'casual and fun', 'scientific and authoritative', 'motivational', 'beginner-friendly']

export default function AdminCmsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  // AI Blog Generation
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState(TONES[0])
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [genError, setGenError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        const flat: Record<string, string> = {}
        for (const [k, v] of Object.entries(d.settings || {})) {
          flat[k] = typeof v === 'string' ? v : JSON.stringify(v)
        }
        setSettings(flat)
      })
      .catch(() => {})
  }, [])

  async function saveSetting(key: string) {
    setSaving(key)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: settings[key] ?? '' }),
    })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  async function generateBlog() {
    if (!topic.trim()) return
    setGenerating(true)
    setGenError('')
    setPreview(null)
    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setPreview(data)
    } catch (err: any) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Blog / CMS</h1>
        <p className="text-gray-400 text-sm mt-1">Content management and blog posts</p>
      </div>

      {/* AI Blog Generation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="text-lg font-bold text-white">Generate Blog Post</h2>
            <p className="text-sm text-gray-400">Use AI to draft a blog post about memory, brain training, or cognitive science</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. How spaced repetition improves long-term memory"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={generateBlog}
          disabled={generating || !topic.trim()}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Generating...
            </>
          ) : '🤖 Generate Blog Post'}
        </button>

        {genError && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-400">{genError}</div>
        )}

        {preview && (
          <div className="space-y-4 border-t border-gray-800 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              {preview._ai && (
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>{preview._ai.model}</span>
                  <span>{preview._ai.tokensUsed} tokens</span>
                  <span>{preview._ai.durationMs}ms</span>
                </div>
              )}
            </div>
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-5 space-y-3">
              <h4 className="text-xl font-bold text-white">{preview.title}</h4>
              <p className="text-xs text-gray-500 font-mono">/{preview.slug}</p>
              <p className="text-sm text-gray-300 italic">{preview.excerpt}</p>
              <div className="flex gap-2 flex-wrap">
                {preview.tags?.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 rounded-full text-xs">{t}</span>
                ))}
              </div>
              <details className="mt-3">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">Show full body</summary>
                <pre className="mt-2 text-xs text-gray-300 whitespace-pre-wrap max-h-80 overflow-auto bg-gray-900 rounded-lg p-4">{preview.body}</pre>
              </details>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateBlog}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(JSON.stringify(preview, null, 2)); }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Copy JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Site Content */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Site Content</h2>
        <p className="text-gray-400 text-sm mb-6">Edit hero text and front page content. Leave blank to use defaults.</p>
        <div className="space-y-4">
          {SITE_CONTENT_KEYS.map(({ key, label, placeholder }) => (
            <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={settings[key] ?? ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"
                />
                <button
                  onClick={() => saveSetting(key)}
                  disabled={saving === key}
                  className="px-5 py-2 bg-[#6366f1] hover:bg-[#5558dd] text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {saved === key ? 'Saved!' : saving === key ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
