'use client'
import { useEffect, useState } from 'react'

interface Config {
  id: string
  contentType: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  isActive: boolean
}

const MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']

export default function AIConfigPage() {
  const [configs, setConfigs] = useState<Config[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/ai-config').then(r => r.json()).then(setConfigs).finally(() => setLoading(false))
  }, [])

  function updateConfig(contentType: string, field: string, value: any) {
    setConfigs(prev => prev.map(c => c.contentType === contentType ? { ...c, [field]: value } : c))
  }

  async function saveConfig(config: Config) {
    setSaving(config.contentType)
    await fetch('/api/admin/ai-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    setSaving(null)
    setSaved(config.contentType)
    setTimeout(() => setSaved(null), 2000)
  }

  async function resetDefaults(config: Config) {
    const defaults = { model: 'gpt-4o-mini', temperature: 0.9, maxTokens: 1000, isActive: true }
    const updated = { ...config, ...defaults }
    updateConfig(config.contentType, 'model', defaults.model)
    updateConfig(config.contentType, 'temperature', defaults.temperature)
    updateConfig(config.contentType, 'maxTokens', defaults.maxTokens)
    updateConfig(config.contentType, 'isActive', defaults.isActive)
    await saveConfig(updated)
  }

  if (loading) return <div className="p-8 text-gray-400">Loading AI configurations...</div>

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Configuration</h1>
        <p className="text-gray-400 text-sm mt-1">Manage AI generation settings per content type</p>
      </div>

      {configs.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-xl font-bold text-white mb-2">No AI Configs Yet</h2>
          <p className="text-gray-400 max-w-sm mx-auto">Run the seed script to create default AI configurations for each content type.</p>
        </div>
      )}

      <div className="space-y-6">
        {configs.map(config => (
          <div key={config.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{config.contentType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
                <p className="text-xs text-gray-500 font-mono">{config.contentType}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-400">{config.isActive ? 'Active' : 'Disabled'}</span>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${config.isActive ? 'bg-green-600' : 'bg-gray-700'}`}
                  onClick={() => updateConfig(config.contentType, 'isActive', !config.isActive)}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${config.isActive ? 'left-5' : 'left-0.5'}`} />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                <select
                  value={config.model}
                  onChange={e => updateConfig(config.contentType, 'model', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Temperature: {config.temperature.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={e => updateConfig(config.contentType, 'temperature', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>1</span><span>2</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Tokens</label>
                <input
                  type="number"
                  value={config.maxTokens}
                  onChange={e => updateConfig(config.contentType, 'maxTokens', parseInt(e.target.value) || 1000)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">System Prompt</label>
              <textarea
                value={config.systemPrompt}
                onChange={e => updateConfig(config.contentType, 'systemPrompt', e.target.value)}
                rows={3}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-y"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => resetDefaults(config)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Reset Defaults
              </button>
              <button
                onClick={() => saveConfig(config)}
                disabled={saving === config.contentType}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {saved === config.contentType ? 'Saved!' : saving === config.contentType ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
