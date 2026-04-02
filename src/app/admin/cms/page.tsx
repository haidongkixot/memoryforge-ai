'use client'
import { useEffect, useState } from 'react'

const SITE_CONTENT_KEYS = [
  { key: 'hero_title', label: 'Hero Title', placeholder: 'Train recall. Sharpen pattern recognition. Measure progress.' },
  { key: 'hero_description', label: 'Hero Description', placeholder: 'Structured exercises for working memory...' },
  { key: 'stats_users', label: 'Stat: Active Users', placeholder: '9,000+' },
  { key: 'stats_sessions', label: 'Stat: Training Sessions', placeholder: '120,000+' },
  { key: 'stats_games', label: 'Stat: Cognitive Games', placeholder: '8' },
]

export default function AdminCmsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Blog / CMS</h1>
        <p className="text-gray-400 text-sm mt-1">Content management and blog posts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold text-white mb-2">Content Management</h2>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">Blog CMS requires the BlogPost model. Add it to the schema and migrate to enable content creation.</p>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-left max-w-sm mx-auto">
          <p className="text-xs text-gray-400 font-mono">npx prisma migrate dev --name add-blog-cms</p>
        </div>
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
