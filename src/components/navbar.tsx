'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useUserPlan } from '@/hooks/use-user-plan'

const PLAN_BADGE: Record<string, { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-gray-100 text-gray-500' },
  plus: { label: 'Plus', className: 'bg-blue-50 text-blue-600' },
  pro: { label: 'Pro', className: 'bg-purple-50 text-purple-600' },
}

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const { plan } = useUserPlan()
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.free

  return (
    <nav className="bg-white border-b border-[#E5E7EB] shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1] flex items-center justify-center text-white font-bold text-sm">MF</div>
            <span className="text-[#1f2937] font-bold text-lg">MemoryForge</span>
            <span className="text-[#9CA3AF] text-xs hidden lg:inline ml-1">by PeeTeeAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Dashboard</Link>
            <Link href="/library" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Games</Link>
            <Link href="/quests" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Quests</Link>
            <Link href="/leaderboard" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Leaderboard</Link>
            <Link href="/academy" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Academy</Link>
            <Link href="/kids-zone" className="text-[#F97316] hover:text-[#EA580C] transition-colors text-sm font-bold">For Little Ones</Link>
            <Link href="/coach" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Coach</Link>
            <Link href="/progress" className="text-[#6B7280] hover:text-[#6366f1] transition-colors text-sm font-medium">Progress</Link>
            {session ? (
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>{badge.label}</span>
                {plan === 'free' && (
                  <Link href="/pricing" className="text-xs text-[#6366f1] hover:text-[#4f50d9] font-semibold transition-colors">Upgrade</Link>
                )}
                <button onClick={() => signOut()} className="text-[#6B7280] hover:text-[#6366f1] text-sm font-medium">Sign Out</button>
              </div>
            ) : (
              <Link href="/login" className="bg-[#6366f1] hover:bg-[#5558e6] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-[0_4px_15px_rgba(99,102,241,0.25)]">Sign In</Link>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-[#6B7280]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Dashboard</Link>
            <Link href="/library" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Games</Link>
            <Link href="/quests" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Quests</Link>
            <Link href="/leaderboard" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Leaderboard</Link>
            <Link href="/academy" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Academy</Link>
            <Link href="/kids-zone" className="block text-[#F97316] hover:text-[#EA580C] py-1 font-bold">For Little Ones</Link>
            <Link href="/coach" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Coach</Link>
            <Link href="/progress" className="block text-[#6B7280] hover:text-[#6366f1] py-1 font-medium">Progress</Link>
            {session && (
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>{badge.label}</span>
                {plan === 'free' && (
                  <Link href="/pricing" className="text-xs text-[#6366f1] font-semibold">Upgrade</Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
