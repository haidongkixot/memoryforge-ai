'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useMemo, useState } from 'react'

interface ConnectedAccount {
  id: string
  provider: string
  providerAccountId: string
}

interface ProfileUser {
  id: string
  name: string | null
  email: string
  plan: string
  hasPassword: boolean
  accounts: ConnectedAccount[]
}

function initialOf(name: string | null, email: string) {
  const src = (name?.trim() || email).trim()
  return (src[0] ?? '?').toUpperCase()
}

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const router = useRouter()

  // Display name
  const [name, setName] = useState(user.name ?? '')
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteErr, setDeleteErr] = useState('')

  const initial = useMemo(() => initialOf(user.name, user.email), [user.name, user.email])

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    setNameMsg(null)
    if (!name.trim()) {
      setNameMsg({ kind: 'err', text: 'Name cannot be empty' })
      return
    }
    setSavingName(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error ?? 'Failed to save')
      setNameMsg({ kind: 'ok', text: 'Saved.' })
      router.refresh()
    } catch (err) {
      setNameMsg({ kind: 'err', text: (err as Error).message })
    } finally {
      setSavingName(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg(null)
    if (newPassword.length < 8) {
      setPwMsg({ kind: 'err', text: 'New password must be at least 8 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ kind: 'err', text: 'New passwords do not match' })
      return
    }
    setSavingPw(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error ?? 'Failed to change password')
      setPwMsg({ kind: 'ok', text: 'Password updated.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwMsg({ kind: 'err', text: (err as Error).message })
    } finally {
      setSavingPw(false)
    }
  }

  async function confirmDelete() {
    setDeleteErr('')
    if (deleteConfirm !== 'DELETE') {
      setDeleteErr('Type DELETE to confirm')
      return
    }
    setDeleting(true)
    try {
      const res = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE' }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error ?? 'Failed to delete account')
      await signOut({ callbackUrl: '/' })
    } catch (err) {
      setDeleteErr((err as Error).message)
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/settings" className="text-sm text-[#6B7280] hover:text-[#593CC8] transition">
        &larr; Back to Settings
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366f1] to-[#593CC8] flex items-center justify-center text-white font-bold text-2xl shadow-[0_4px_15px_rgba(99,102,241,0.25)]">
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#593CC8] truncate">
            {user.name?.trim() || 'Your profile'}
          </h1>
          <p className="text-[#6B7280] text-sm truncate">{user.email}</p>
        </div>
      </div>

      {/* Display name */}
      <form
        onSubmit={saveName}
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <h2 className="text-lg font-semibold text-[#593CC8]">Display name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder="Your name"
          className="w-full px-4 py-2.5 bg-[#F8F9FE] border border-[#E0E7FF] rounded-2xl text-sm text-[#1f2937] focus:outline-none focus:border-[#593CC8] focus:ring-2 focus:ring-[#593CC8]/20"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={savingName}
            className="px-4 py-2 bg-[#593CC8] hover:bg-[#4a30a8] disabled:opacity-50 text-white font-medium rounded-2xl transition text-sm"
          >
            {savingName ? 'Saving…' : 'Save'}
          </button>
          {nameMsg && (
            <span
              className={`text-sm ${nameMsg.kind === 'ok' ? 'text-green-600' : 'text-red-600'}`}
            >
              {nameMsg.text}
            </span>
          )}
        </div>
      </form>

      {/* Email */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold text-[#593CC8]">Email</h2>
        <p className="text-sm text-[#1f2937]">{user.email}</p>
        <p className="text-xs text-[#6B7280]">
          Email changes aren&apos;t supported yet. Contact support if you need to update it.
        </p>
      </div>

      {/* Plan */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-[#593CC8]">Plan</h2>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              user.plan === 'pro'
                ? 'bg-purple-50 text-purple-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {user.plan === 'pro' ? 'Pro' : 'Free'}
          </span>
          {user.plan === 'free' && (
            <Link
              href="/pricing"
              className="text-sm text-[#593CC8] hover:text-[#4a30a8] font-semibold"
            >
              Upgrade &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Password */}
      {user.hasPassword && (
        <form
          onSubmit={changePassword}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h2 className="text-lg font-semibold text-[#593CC8]">Change password</h2>
          <div className="space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              autoComplete="current-password"
              className="w-full px-4 py-2.5 bg-[#F8F9FE] border border-[#E0E7FF] rounded-2xl text-sm text-[#1f2937] focus:outline-none focus:border-[#593CC8] focus:ring-2 focus:ring-[#593CC8]/20"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-[#F8F9FE] border border-[#E0E7FF] rounded-2xl text-sm text-[#1f2937] focus:outline-none focus:border-[#593CC8] focus:ring-2 focus:ring-[#593CC8]/20"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-[#F8F9FE] border border-[#E0E7FF] rounded-2xl text-sm text-[#1f2937] focus:outline-none focus:border-[#593CC8] focus:ring-2 focus:ring-[#593CC8]/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={savingPw}
              className="px-4 py-2 bg-[#593CC8] hover:bg-[#4a30a8] disabled:opacity-50 text-white font-medium rounded-2xl transition text-sm"
            >
              {savingPw ? 'Saving…' : 'Update password'}
            </button>
            {pwMsg && (
              <span
                className={`text-sm ${pwMsg.kind === 'ok' ? 'text-green-600' : 'text-red-600'}`}
              >
                {pwMsg.text}
              </span>
            )}
          </div>
        </form>
      )}

      {/* Connected accounts */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#593CC8]">Connected accounts</h2>
        {user.accounts.length === 0 ? (
          <p className="text-sm text-[#6B7280]">No external accounts connected.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {user.accounts.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1f2937] capitalize">{a.provider}</p>
                  <p className="text-xs text-[#6B7280] truncate">{a.providerAccountId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-red-600">Danger zone</h2>
        <p className="text-sm text-[#4B5563]">
          Deleting your account is permanent. All your progress, sessions, and data will be removed.
        </p>
        {!deleteOpen ? (
          <button
            onClick={() => setDeleteOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition text-sm"
          >
            Delete account
          </button>
        ) : (
          <div className="space-y-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-700">
              Type <span className="font-mono font-bold">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 bg-white border border-red-300 rounded-2xl text-sm text-[#1f2937] focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
            {deleteErr && <p className="text-sm text-red-600">{deleteErr}</p>}
            <div className="flex items-center gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting || deleteConfirm !== 'DELETE'}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-2xl transition text-sm"
              >
                {deleting ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button
                onClick={() => {
                  setDeleteOpen(false)
                  setDeleteConfirm('')
                  setDeleteErr('')
                }}
                disabled={deleting}
                className="px-4 py-2 text-[#6B7280] hover:text-[#1f2937] text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
