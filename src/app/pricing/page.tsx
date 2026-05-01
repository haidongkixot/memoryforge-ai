'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const plans = [
  {
    name: 'Free',
    slug: 'free',
    price: '$0',
    period: 'forever',
    description: 'Get started with core memory games',
    features: [
      '5 Beginner games',
      '2 Academy chapters',
      'Basic brain training',
      'Daily stats dashboard',
      'Community leaderboard',
    ],
    limitations: ['No AI Coach', 'No intermediate or advanced games', 'Limited Academy access'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: '$4.99',
    period: '/month',
    description: 'Unlock your full cognitive potential',
    features: [
      'All 12+ games unlocked',
      'All difficulty levels (Beginner, Intermediate, Advanced)',
      'All Academy chapters',
      'AI Memory Coach (unlimited)',
      'AI content generation',
      'Advanced training plans',
      'Advanced analytics & insights',
      'Priority support',
      'Daily quests & bonus XP',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  async function handlePayPalCheckout(slug: string) {
    setLoadingSlug(`paypal-${slug}`)
    try {
      const res = await fetch('/api/billing/paypal/create-subscription', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceSlug: slug, interval: annual ? 'yearly' : 'monthly' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'PayPal unavailable')
    } catch { alert('Network error') }
    finally { setLoadingSlug(null) }
  }

  async function handleCheckout(slug: string) {
    setLoadingSlug(slug)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceSlug: slug,
          interval: annual ? 'yearly' : 'monthly',
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoadingSlug(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <nav className="border-b border-gray-100 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#593CC8] flex items-center justify-center text-white font-bold text-sm">
              MF
            </div>
            <span className="text-[#593CC8] font-semibold text-lg">MemoryForge</span>
          </Link>
          <Link
            href="/login"
            className="text-[#6B7280] hover:text-[#593CC8] text-sm transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/illustrations/memoryforge-pricing-musician-memorizes-piece-v1.png"
              alt="Musician memorizing a piece — committed practice that builds mastery"
              width={500}
              height={400}
              priority
              className="w-auto h-64 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#593CC8] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Start training your memory for free. Upgrade to Pro when you are ready for personalized AI coaching and advanced training.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${!annual ? 'text-[#1f2937]' : 'text-[#6B7280]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                annual ? 'bg-[#593CC8]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                  annual ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-[#1f2937]' : 'text-[#6B7280]'}`}>
              Annual <span className="text-[#ABF263] text-xs font-bold bg-[#ABF263]/20 px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 relative ${
                plan.highlighted
                  ? 'bg-white border-2 border-[#593CC8] shadow-md'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#593CC8] text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#593CC8]">{plan.name}</h2>
                <p className="text-[#6B7280] text-sm mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#1f2937]">
                  {plan.price === '$0'
                    ? '$0'
                    : annual
                    ? '$3.99'
                    : plan.price}
                </span>
                <span className="text-[#6B7280] text-sm">
                  {plan.price === '$0' ? ' forever' : annual ? '/month (billed yearly)' : plan.period}
                </span>
              </div>
              {plan.slug === 'free' ? (
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 rounded-full font-semibold transition-colors text-sm bg-[#F8F9FE] hover:bg-gray-100 text-[#1f2937] border border-gray-200"
                >
                  {plan.cta}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => handleCheckout(plan.slug)}
                    disabled={loadingSlug === plan.slug}
                    className="block w-full text-center py-3 rounded-full font-semibold transition-colors text-sm disabled:opacity-60 bg-[#593CC8] hover:bg-[#4a30a8] text-white shadow-[0_4px_15px_rgba(89,60,200,0.25)]"
                  >
                    {loadingSlug === plan.slug ? 'Redirecting...' : plan.cta}
                  </button>
                  <button
                    onClick={() => handlePayPalCheckout(plan.slug)}
                    disabled={loadingSlug !== null}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-[#F8F9FE] text-[#003087] text-sm font-semibold transition disabled:opacity-50"
                  >
                    {loadingSlug === `paypal-${plan.slug}` ? 'Redirecting...' : (
                      <>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#009CDE]" aria-hidden="true">
                          <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z"/>
                          <path d="M9.738 6.145c.24-.394.63-.696 1.086-.812.234-.06.48-.09.73-.09h5.245c.622 0 1.2.033 1.73.1a6.7 6.7 0 0 1 1.017.228c.29.09.557.203.8.34.257-1.632-.002-2.743-.887-3.75C18.392.947 16.524.5 14.073.5H7.02a.96.96 0 0 0-.949.812L3.082 17.43a.578.578 0 0 0 .57.668H7.42L9.738 6.145z"/>
                        </svg>
                        Pay with PayPal
                      </>
                    )}
                  </button>
                </>
              )}
              <div className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#5DEAEA] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#1f2937] text-sm">{f}</span>
                  </div>
                ))}
                {plan.limitations.map((l) => (
                  <div key={l} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-[#6B7280] text-sm">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-[#593CC8] mb-4">Frequently Asked Questions</h3>
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your Pro subscription at any time. You will keep access until the end of your billing period.',
              },
              {
                q: 'Is the free plan really free?',
                a: 'Absolutely. The free plan includes 5 beginner-level memory games, 2 Academy chapters, and basic progress tracking -- no credit card required.',
              },
              {
                q: 'What does the AI Coach do?',
                a: 'The AI Coach analyzes your performance data and provides personalized memory training advice, technique recommendations, and progress insights.',
              },
              {
                q: 'What games are included in each plan?',
                a: 'Free includes all Beginner-level games. Pro unlocks Intermediate and Advanced difficulty games plus all 12+ training games in the library.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-[#593CC8] font-semibold mb-2">{faq.q}</h4>
                <p className="text-[#6B7280] text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
