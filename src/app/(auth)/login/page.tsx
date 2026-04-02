'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) { setError('Invalid credentials'); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-[0_6px_20px_rgba(156,163,175,0.08)]">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#6366f1] flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">MF</div>
        <h1 className="text-2xl font-bold text-[#1f2937]">Welcome Back</h1>
        <p className="text-[#6B7280] text-sm mt-1">Sign in to continue training</p>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-[#4B5563] font-medium">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#1f2937] focus:border-[#6366f1] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm text-[#4B5563] font-medium">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[#1f2937] focus:border-[#6366f1] focus:outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#6366f1] hover:bg-[#5558e6] disabled:opacity-50 text-white py-2.5 rounded-full font-semibold transition-colors shadow-[0_4px_15px_rgba(99,102,241,0.25)]">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-[#6B7280] text-sm mt-4">
        New here? <Link href="/signup" className="text-[#6366f1] hover:underline font-medium">Create account</Link>
      </p>
    </div>
  )
}
