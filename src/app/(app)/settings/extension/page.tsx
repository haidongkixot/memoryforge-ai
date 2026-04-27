'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface PairedExtension {
  id: string
  extensionId: string
  userAgent: string | null
  issuedAt: string
  expiresAt: string
  lastUsedAt: string | null
}

export default function ExtensionSettingsPage() {
  const { data: session, status } = useSession()

  const [code, setCode] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [generating, setGenerating] = useState(false)

  const [paired, setPaired] = useState<PairedExtension[]>([])
  const [loadingList, setLoadingList] = useState(true)

  const [syncGames, setSyncGames] = useState(false)
  const [savingPref, setSavingPref] = useState(false)

  const [error, setError] = useState('')

  // Countdown
  useEffect(() => {
    if (!code || secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [code, secondsLeft])

  useEffect(() => {
    if (secondsLeft === 0 && code) setCode(null)
  }, [secondsLeft, code])

  // Load paired extensions + preferences
  useEffect(() => {
    if (status !== 'authenticated') return
    void refresh()
  }, [status])

  async function refresh() {
    setLoadingList(true)
    try {
      const [listRes, prefRes] = await Promise.all([
        fetch('/api/settings/extension/paired'),
        fetch('/api/settings/extension/preferences'),
      ])
      if (listRes.ok) {
        const j = await listRes.json()
        setPaired(j.tokens ?? [])
      }
      if (prefRes.ok) {
        const j = await prefRes.json()
        setSyncGames(!!j.syncGames)
      }
    } catch {
      setError('Failed to load extension settings.')
    } finally {
      setLoadingList(false)
    }
  }

  async function generateCode() {
    setError('')
    setGenerating(true)
    try {
      const res = await fetch('/api/extension/pair', { method: 'POST' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? 'Failed to generate code')
      }
      const j = await res.json()
      setCode(j.code)
      setSecondsLeft(j.expiresInSeconds ?? 120)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  async function revoke(id: string) {
    setError('')
    try {
      const res = await fetch(`/api/settings/extension/paired/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to revoke')
      await refresh()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function togglePref(next: boolean) {
    setSavingPref(true)
    setError('')
    try {
      const res = await fetch('/api/settings/extension/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncGames: next }),
      })
      if (!res.ok) throw new Error('Failed to save')
      const j = await res.json()
      setSyncGames(!!j.syncGames)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSavingPref(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-32 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          href="/login"
          className="inline-block px-4 py-2 bg-[#593CC8] hover:bg-[#4a30a8] text-white rounded-2xl font-medium"
        >
          Sign in to manage the extension
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/settings" className="text-sm text-[#6B7280] hover:text-[#593CC8] transition">
        ← Back to Settings
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#593CC8]">Chrome Extension</h1>
        <p className="text-[#6B7280] mt-1">
          Pair the MemoryForge browser extension with your account for quick brain-training breaks
          while you work.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Pair flow */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#593CC8]">Pair an extension</h2>
        {!code && (
          <button
            onClick={generateCode}
            disabled={generating}
            className="px-4 py-2.5 bg-[#593CC8] hover:bg-[#4a30a8] disabled:opacity-50 text-white font-medium rounded-2xl transition text-sm"
          >
            {generating ? 'Generating…' : 'Generate Code'}
          </button>
        )}
        {code && (
          <div className="bg-[#F8F9FE] border border-[#E0E7FF] rounded-2xl p-5 text-center space-y-2">
            <p className="text-xs text-[#6B7280] uppercase tracking-wider">Pairing code</p>
            <p className="text-4xl font-mono font-bold text-[#593CC8] tracking-widest">{code}</p>
            <p className="text-xs text-[#6B7280]">
              Expires in {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, '0')}. Enter it in the extension side panel.
            </p>
          </div>
        )}
      </div>

      {/* Paired list */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#593CC8]">Paired extensions</h2>
        {loadingList ? (
          <p className="text-sm text-[#6B7280]">Loading…</p>
        ) : paired.length === 0 ? (
          <p className="text-sm text-[#6B7280]">No extensions paired yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {paired.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1f2937] truncate">
                    {p.userAgent ?? 'Unknown browser'}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Paired {new Date(p.issuedAt).toLocaleString()}
                    {p.lastUsedAt && ` · last used ${new Date(p.lastUsedAt).toLocaleString()}`}
                  </p>
                </div>
                <button
                  onClick={() => revoke(p.id)}
                  className="shrink-0 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#593CC8]">Sync</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={syncGames}
            disabled={savingPref}
            onChange={(e) => togglePref(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#593CC8]"
          />
          <span>
            <span className="block text-sm font-medium text-[#1f2937]">
              Sync games to my account
            </span>
            <span className="block text-xs text-[#6B7280] mt-0.5">
              When on, quick games played in the extension are saved to your MemoryForge progress.
              Off by default — the extension still works locally.
            </span>
          </span>
        </label>
      </div>

      {/* Privacy */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold text-[#593CC8]">Privacy summary</h2>
        <ul className="text-sm text-[#4B5563] space-y-1.5 list-disc pl-5">
          <li>Pairing uses a 6-digit code that expires in 2 minutes and can only be used once.</li>
          <li>Access tokens last 15 minutes and rotate automatically; refresh tokens last 30 days.</li>
          <li>
            Game results are sent to your account <strong>only</strong> when “Sync games” is on.
          </li>
          <li>You can revoke any paired extension at any time from this page.</li>
        </ul>
      </div>
    </div>
  )
}
