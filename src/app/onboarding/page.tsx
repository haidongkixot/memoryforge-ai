'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const GOALS = [
  { value: 'sharpen', label: 'Sharpen Memory', icon: '🧠', desc: 'Improve recall speed and accuracy' },
  { value: 'learn', label: 'Learn Faster', icon: '📚', desc: 'Boost learning and retention' },
  { value: 'sharp', label: 'Stay Sharp', icon: '💡', desc: 'Maintain cognitive health' },
  { value: 'fun', label: 'Fun Challenge', icon: '🎮', desc: 'Enjoy brain training games' },
]

const EXPERIENCE = [
  { value: 'beginner', label: 'Beginner', desc: 'New to memory training' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience with brain games' },
  { value: 'advanced', label: 'Advanced', desc: 'Regular cognitive training practice' },
]

const TIMES = [
  { value: '5', label: '5 minutes', desc: 'Quick daily session' },
  { value: '10', label: '10 minutes', desc: 'Balanced training' },
  { value: '20', label: '20 minutes', desc: 'Deep practice' },
  { value: '30', label: '30+ minutes', desc: 'Intensive training' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [experience, setExperience] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [saving, setSaving] = useState(false)

  const steps = [
    { title: 'What is your main goal?', subtitle: 'We will customize your training experience' },
    { title: 'What is your experience level?', subtitle: 'This helps us set the right difficulty' },
    { title: 'How much time per day?', subtitle: 'We will build a plan that fits your schedule' },
  ]

  async function handleFinish() {
    setSaving(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, experience, preferredTime }),
      })
      router.push('/dashboard')
    } catch {
      router.push('/dashboard')
    }
  }

  function canProceed() {
    if (step === 0) return !!goal
    if (step === 1) return !!experience
    if (step === 2) return !!preferredTime
    return false
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-indigo-500' : 'bg-gray-800'
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{steps[step].title}</h1>
          <p className="text-gray-400 mt-2">{steps[step].subtitle}</p>
        </div>

        {/* Step 0: Goal */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  goal === g.value
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{g.icon}</div>
                <div className="text-white font-medium text-sm">{g.label}</div>
                <div className="text-gray-400 text-xs mt-1">{g.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="space-y-3">
            {EXPERIENCE.map((e) => (
              <button
                key={e.value}
                onClick={() => setExperience(e.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  experience === e.value
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="text-white font-medium">{e.label}</div>
                <div className="text-gray-400 text-sm mt-1">{e.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {TIMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setPreferredTime(t.value)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  preferredTime === t.value
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="text-white font-medium">{t.label}</div>
                <div className="text-gray-400 text-xs mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-colors text-sm"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed() || saving}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-colors text-sm"
            >
              {saving ? 'Setting up...' : 'Start Training'}
            </button>
          )}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full text-center text-gray-600 hover:text-gray-400 text-xs mt-6 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
