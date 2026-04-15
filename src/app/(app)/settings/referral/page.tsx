'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Referral {
  userName: string
  activatedAt: string | null
  rewardGranted: boolean
}

interface ReferralStats {
  code: string | null
  link: string | null
  clicks: number
  referrals: Referral[]
  totalReferred: number
  totalRewarded: number
}

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function init() {
      try {
        await fetch('/api/referral/generate', { method: 'POST' })
        const res = await fetch('/api/referral/stats')
        if (!res.ok) throw new Error('Failed')
        setStats(await res.json())
      } catch {
        setError('Failed to load referral data.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const copyLink = async () => {
    if (!stats?.link) return
    await navigator.clipboard.writeText(stats.link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-1/3" />
      <div className="h-32 bg-gray-100 rounded-2xl" />
    </div>
  )

  if (error) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/settings" className="text-sm text-[#6B7280] hover:text-[#593CC8] transition">← Back to Settings</Link>

      <div>
        <h1 className="text-2xl font-bold text-[#593CC8]">Invite Friends</h1>
        <p className="text-[#6B7280] mt-1">Share MemoryForge and earn 1 free month of Pro for each friend who joins.</p>
      </div>

      {/* Link */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#593CC8]">Your Referral Link</h2>
        {stats?.link && (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#F8F9FE] border border-[#E0E7FF] rounded-2xl px-4 py-3 text-sm text-[#1f2937] truncate font-mono">
              {stats.link}
            </div>
            <button onClick={copyLink} className="shrink-0 px-4 py-3 bg-[#593CC8] hover:bg-[#4a30a8] text-white font-medium rounded-2xl transition text-sm">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#593CC8] mb-4">Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Link Clicks', value: stats?.clicks ?? 0 },
            { label: 'Friends Joined', value: stats?.totalReferred ?? 0 },
            { label: 'Months Earned', value: stats?.totalRewarded ?? 0 },
          ].map(s => (
            <div key={s.label} className="text-center p-4 bg-[#F8F9FE] rounded-2xl">
              <p className="text-2xl font-bold text-[#593CC8]">{s.value}</p>
              <p className="text-xs text-[#6B7280] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referred list */}
      {stats?.referrals && stats.referrals.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#593CC8] mb-4">Referred Friends</h2>
          <div className="divide-y divide-gray-100">
            {stats.referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[#1f2937] font-medium text-sm">{r.userName}</p>
                  {r.activatedAt && <p className="text-xs text-[#6B7280]">{new Date(r.activatedAt).toLocaleDateString()}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.rewardGranted ? 'bg-green-50 text-green-700' : r.activatedAt ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {r.rewardGranted ? 'Rewarded' : r.activatedAt ? 'Activated' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#593CC8]">How It Works</h2>
        {[
          'Share your unique referral link with friends',
          'They sign up and get a 14-day extended free trial',
          'When they complete their first brain training session, you earn 1 free month of Pro',
        ].map((text, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#593CC8] text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
            <p className="text-[#4B5563] text-sm pt-1">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
