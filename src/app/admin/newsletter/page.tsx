'use client'

import { useEffect, useState } from 'react'

interface Subscriber {
  id: string
  email: string
  status: string
  source: string | null
  createdAt: string
}

interface Stats {
  total: number
  active: number
  unsubscribed: number
  subscribers: Subscriber[]
}

export default function NewsletterAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'subscribers' | 'compose'>('subscribers')

  // Compose state
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [sending, setSending] = useState(false)
  const [previewResult, setPreviewResult] = useState<any>(null)
  const [sendResult, setSendResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handlePreview() {
    setError('')
    setPreviewResult(null)
    setSendResult(null)
    if (!subject || !html) { setError('Subject and HTML body are required.'); return }
    setSending(true)
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html, previewOnly: true }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Preview failed')
      else setPreviewResult(data)
    } catch (e) { setError('Network error') }
    setSending(false)
  }

  async function handleSend() {
    if (!confirm(`Send to all active subscribers? This cannot be undone.`)) return
    setError('')
    setPreviewResult(null)
    setSendResult(null)
    if (!subject || !html) { setError('Subject and HTML body are required.'); return }
    setSending(true)
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html, previewOnly: false }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Send failed')
      else setSendResult(data)
    } catch (e) { setError('Network error') }
    setSending(false)
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Newsletter</h1>
        <p className="text-gray-500 text-sm mb-6">Manage subscribers and send broadcast emails.</p>

        {/* Stats row */}
        {loading ? (
          <div className="text-gray-400 mb-6">Loading stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Subscribers', value: stats.total },
              { label: 'Active', value: stats.active },
              { label: 'Unsubscribed', value: stats.unsubscribed },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold" style={{ color: '#593CC8' }}>{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['subscribers', 'compose'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-[#593CC8] text-[#593CC8]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'subscribers' ? 'Subscribers' : 'Compose Broadcast'}
            </button>
          ))}
        </div>

        {/* Subscribers tab */}
        {tab === 'subscribers' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Source</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.subscribers.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === 'active'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{s.source ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!stats?.subscribers.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No subscribers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Compose tab */}
        {tab === 'compose' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Email subject line"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#593CC8] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">HTML Body</label>
              <textarea
                value={html}
                onChange={e => setHtml(e.target.value)}
                placeholder="<p>Your email content here...</p>"
                rows={12}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#593CC8] text-sm font-mono resize-y"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
            )}

            {previewResult && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-sm space-y-1">
                <div className="text-purple-700 font-medium">Preview — {previewResult.count} active subscribers would receive this.</div>
                <div className="text-gray-500">Sample recipients: {previewResult.sample?.join(', ') || 'none'}</div>
              </div>
            )}

            {sendResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm space-y-1">
                <div className="text-green-700 font-medium">Broadcast sent! {sendResult.sent} sent, {sendResult.failed} failed (of {sendResult.total} total).</div>
                {sendResult.errors?.length > 0 && (
                  <div className="text-red-500 text-xs mt-1">{sendResult.errors.join(', ')}</div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                disabled={sending}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
              >
                {sending ? 'Working...' : 'Preview'}
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#593CC8' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4b30b0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#593CC8')}
              >
                {sending ? 'Sending...' : 'Send Broadcast'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
