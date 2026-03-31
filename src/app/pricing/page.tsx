'use client'
import Link from 'next/link'
import { useState } from 'react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with core memory games',
    features: [
      '5 memory games',
      'Beginner difficulty',
      'Basic progress tracking',
      'Daily stats dashboard',
      'Community leaderboard',
    ],
    limitations: ['No AI Coach', 'Limited game modes', 'No advanced difficulty'],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'Unlock your full cognitive potential',
    features: [
      'All memory games unlocked',
      'All difficulty levels',
      'AI Memory Coach (unlimited)',
      'Personalized training plans',
      'Advanced analytics & insights',
      'Memory technique library',
      'Priority support',
      'Daily quests & bonus XP',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    href: '/signup',
    highlighted: true,
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-indigo-500/20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              MF
            </div>
            <span className="text-white font-semibold text-lg">MemoryForge</span>
          </Link>
          <Link
            href="/login"
            className="text-gray-300 hover:text-white text-sm transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start training your memory for free. Upgrade to Pro when you are ready for personalized AI coaching and advanced training.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                annual ? 'bg-indigo-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-500'}`}>
              Annual <span className="text-green-400 text-xs font-medium">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gray-900 border-2 border-indigo-500 relative'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price === '$0'
                    ? '$0'
                    : annual
                    ? '$3.99'
                    : plan.price}
                </span>
                <span className="text-gray-400 text-sm">
                  {plan.price === '$0' ? ' forever' : annual ? '/month (billed yearly)' : plan.period}
                </span>
              </div>
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-medium transition-colors text-sm ${
                  plan.highlighted
                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                }`}
              >
                {plan.cta}
              </Link>
              <div className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{f}</span>
                  </div>
                ))}
                {plan.limitations.map((l) => (
                  <div key={l} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500 text-sm">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your Pro subscription at any time. You will keep access until the end of your billing period.',
              },
              {
                q: 'Is the free plan really free?',
                a: 'Absolutely. The free plan includes 5 core memory games and basic tracking with no credit card required.',
              },
              {
                q: 'What does the AI Coach do?',
                a: 'The AI Coach analyzes your performance data and provides personalized memory training advice, technique recommendations, and progress insights.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
