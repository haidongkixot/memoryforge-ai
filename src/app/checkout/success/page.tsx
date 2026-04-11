/**
 * MemoryForge — Checkout success landing.
 *
 * Post-checkout landing reached via Stripe success_url. The Stripe webhook
 * syncs the subscription to the DB. This page is purely celebratory +
 * provides next-step CTAs.
 */

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Welcome — Payment received | MemoryForge AI',
}

const CONFETTI_COUNT = 18

export default function CheckoutSuccessPage() {
  const dots = Array.from({ length: CONFETTI_COUNT }, (_, i) => i)

  return (
    <div className="min-h-screen bg-[#F8F9FE] relative overflow-hidden">
      {/* Blue glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(59,130,246,0.12), transparent 60%)',
        }}
      />

      {/* CSS-only confetti */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden"
      >
        {dots.map((i) => {
          const left = (i * 53) % 100
          const delay = (i * 0.17) % 2.4
          const duration = 1.6 + ((i * 0.31) % 1.2)
          const colors = [
            'bg-blue-400',
            'bg-sky-400',
            'bg-indigo-400',
            'bg-amber-400',
          ]
          const color = colors[i % colors.length]
          return (
            <span
              key={i}
              className={`absolute top-0 w-2 h-2 rounded-sm ${color} opacity-80 animate-bounce`}
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                transform: `rotate(${(i * 37) % 360}deg)`,
              }}
            />
          )
        })}
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Checkmark */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 border border-blue-300 mb-6">
          <svg
            className="w-10 h-10 text-[#3b82f6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12.5l4.5 4.5L19 7"
            />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#1f2937] tracking-tight">
          Your memory training just leveled up!
        </h1>
        <p className="mt-4 text-lg text-[#6B7280] max-w-xl mx-auto">
          Your payment was received and your Pro upgrade is being activated right
          now. Your new plan will be live within a few seconds.
        </p>
        <p className="mt-2 text-sm text-[#9CA3AF] max-w-md mx-auto">
          (If your plan doesn&apos;t appear immediately, refresh the dashboard
          &mdash; our webhook handles the sync.)
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors"
          >
            Go to dashboard
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white hover:bg-gray-50 text-[#1f2937] border border-gray-200 transition-colors"
          >
            View plans
          </Link>
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 text-left">
          <h2 className="text-sm font-semibold text-[#1f2937] uppercase tracking-wider mb-3">
            What&apos;s next
          </h2>
          <ul className="space-y-3 text-sm text-[#4B5563]">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[#3b82f6] font-semibold">1.</span>
              <span>
                Try your newly unlocked{' '}
                <Link
                  href="/games"
                  className="text-[#3b82f6] hover:text-[#2563eb] underline-offset-2 hover:underline"
                >
                  advanced memory games
                </Link>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[#3b82f6] font-semibold">2.</span>
              <span>
                Chat with your{' '}
                <Link
                  href="/coach"
                  className="text-[#3b82f6] hover:text-[#2563eb] underline-offset-2 hover:underline"
                >
                  AI Memory Coach
                </Link>{' '}
                for personalized training advice.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[#3b82f6] font-semibold">3.</span>
              <span>
                Explore the{' '}
                <Link
                  href="/academy"
                  className="text-[#3b82f6] hover:text-[#2563eb] underline-offset-2 hover:underline"
                >
                  Academy
                </Link>{' '}
                for deep cognitive science knowledge.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
