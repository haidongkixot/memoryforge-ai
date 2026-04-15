import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import InviteTracker from './invite-tracker'

interface Props {
  params: Promise<{ code: string }>
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params

  const referralCode = await prisma.referralCode.findUnique({
    where: { code },
    include: {
      user: { select: { name: true } },
    },
  })

  // If invalid code, show generic landing
  if (!referralCode) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-16 h-16 bg-[#593CC8] rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">🧠</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">MemoryForge AI</h1>
            <p className="text-[#4B4C4D] mt-3 text-lg">
              Train your brain, sharpen your mind
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 bg-[#593CC8] hover:bg-[#4a32ab] text-white font-semibold rounded-full shadow-sm transition"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    )
  }

  const referrerName = referralCode.user.name || 'A friend'

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="w-16 h-16 bg-[#593CC8] rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">🧠</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[1.5rem] p-8 space-y-6 shadow-sm">
          <div className="space-y-3">
            <p className="text-[#593CC8] font-medium text-sm uppercase tracking-wide">
              You&apos;ve been invited
            </p>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              {referrerName} invited you to MemoryForge AI
            </h1>
            <p className="text-[#4B4C4D] text-base leading-relaxed">
              Start your brain training journey with a <span className="font-semibold text-[#593CC8]">14-day extended trial</span>.
              Discover science-backed memory games that sharpen focus, boost recall, and track your Brain Age over time.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#593CC8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#4B4C4D] text-sm">9 science-backed memory games</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#593CC8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#4B4C4D] text-sm">Spaced repetition and N-Back training</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#593CC8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#4B4C4D] text-sm">Track your Brain Age over time</p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/signup?ref=${code}`}
            className="block w-full py-3.5 bg-[#593CC8] hover:bg-[#4a32ab] text-white font-semibold rounded-full shadow-sm transition text-center"
          >
            Accept Invitation
          </Link>

          <p className="text-xs text-[#8A8785]">
            Free to join. No credit card required.
          </p>
        </div>
      </div>

      {/* Track the click */}
      <InviteTracker code={code} />
    </div>
  )
}
