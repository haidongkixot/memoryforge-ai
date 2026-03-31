import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - MemoryForge AI',
  description: 'Learn about MemoryForge AI, the cognitive training platform with 10+ science-backed memory games.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080a14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-indigo-400">MemoryForge AI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Train your brain with AI-powered cognitive games designed to sharpen memory, focus, and mental agility.
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">What is MemoryForge?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              MemoryForge AI is a cognitive training platform that combines neuroscience-backed techniques with artificial intelligence to help you build a stronger memory. With 10+ carefully designed games spanning pattern recognition, spatial memory, verbal recall, sequence mastery, and more, MemoryForge adapts to your unique cognitive profile.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our spaced repetition engine ensures you train at optimal intervals, maximizing retention while minimizing wasted effort. Whether you are a student preparing for exams, a professional sharpening your edge, or anyone who wants to keep their mind in peak condition, MemoryForge meets you where you are.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">10+ Cognitive Games</strong> &mdash; Pattern matching, n-back, word recall, spatial puzzles, speed math, and more.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">AI-Powered Coaching</strong> &mdash; Personalized recommendations based on your performance data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">Spaced Repetition</strong> &mdash; Science-backed scheduling to optimize long-term memory retention.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">Progress Tracking</strong> &mdash; Detailed analytics showing your cognitive growth over time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">Quests &amp; Leaderboard</strong> &mdash; Gamified challenges to keep you motivated and competing.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Part of HumanOS</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              MemoryForge AI is part of the <strong className="text-indigo-400">HumanOS ecosystem</strong> &mdash; a suite of AI-powered tools designed to optimize every dimension of human performance. From breathing and habit-building to focus, relationships, and cognitive fitness, HumanOS helps you become the best version of yourself.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {[
                { name: 'BreathMaster AI', href: 'https://breathmaster-ai.vercel.app' },
                { name: 'HabitOS AI', href: 'https://habitos-ai.vercel.app' },
                { name: 'MemoryForge AI', href: '/' },
                { name: 'HarmonyMap AI', href: 'https://harmonymap-ai.vercel.app' },
                { name: 'FocusFlow AI', href: 'https://focusflow-ai-mauve.vercel.app' },
                { name: 'Seeneyu', href: 'https://seeneyu.com' },
              ].map((app) => (
                <a
                  key={app.name}
                  href={app.href}
                  target={app.href === '/' ? undefined : '_blank'}
                  rel={app.href === '/' ? undefined : 'noopener noreferrer'}
                  className="bg-gray-800/50 border border-gray-700 hover:border-indigo-500/40 rounded-lg p-3 text-center text-sm text-gray-300 hover:text-white transition-all"
                >
                  {app.name}
                </a>
              ))}
            </div>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Built by PeeTeeAI</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              MemoryForge AI is built and maintained by <strong className="text-indigo-400">PeeTeeAI</strong>, the company behind the HumanOS ecosystem. We are on a mission to make AI-powered personal development accessible to everyone.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="/contact"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/library"
                className="border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Try the Games
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
