import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - MemoryForge AI',
  description: 'Learn about MemoryForge AI, the cognitive training platform with 10+ science-backed memory games.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/illustrations/memoryforge-about-generations-puzzle-together-v1.png"
              alt="Generations solving a puzzle together — memory training across every age"
              width={500}
              height={400}
              priority
              className="w-auto h-64 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#593CC8] mb-4">
            About <span className="text-[#5DEAEA]">MemoryForge AI</span>
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Train your brain with AI-powered cognitive games designed to sharpen memory, focus, and mental agility.
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#593CC8] mb-4">What is MemoryForge?</h2>
            <p className="text-[#1f2937] leading-relaxed mb-4">
              MemoryForge AI is a cognitive training platform that combines neuroscience-backed techniques with artificial intelligence to help you build a stronger memory. With 10+ carefully designed games spanning pattern recognition, spatial memory, verbal recall, sequence mastery, and more, MemoryForge adapts to your unique cognitive profile.
            </p>
            <p className="text-[#1f2937] leading-relaxed">
              Our spaced repetition engine ensures you train at optimal intervals, maximizing retention while minimizing wasted effort. Whether you are a student preparing for exams, a professional sharpening your edge, or anyone who wants to keep their mind in peak condition, MemoryForge meets you where you are.
            </p>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="grid md:grid-cols-[200px,1fr] gap-6 items-center mb-6">
              <div className="bg-[#FFF8F2] rounded-xl p-2 flex justify-center">
                <Image
                  src="/illustrations/memoryforge-about-writing-by-hand-v1.png"
                  alt="Writing by hand — a proven way to encode and retain new information"
                  width={220}
                  height={220}
                  className="w-44 h-44 object-contain"
                />
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                We believe in evidence-based methods &mdash; from handwriting and active recall to spaced repetition &mdash; combined with thoughtful AI to keep training personal.
              </p>
            </div>
            <h2 className="text-2xl font-bold text-[#593CC8] mb-4">Key Features</h2>
            <ul className="space-y-3 text-[#1f2937]">
              <li className="flex items-start gap-3">
                <span className="text-[#5DEAEA] mt-1">&#9679;</span>
                <span><strong className="text-[#593CC8]">10+ Cognitive Games</strong> &mdash; Pattern matching, n-back, word recall, spatial puzzles, speed math, and more.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5DEAEA] mt-1">&#9679;</span>
                <span><strong className="text-[#593CC8]">AI-Powered Coaching</strong> &mdash; Personalized recommendations based on your performance data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5DEAEA] mt-1">&#9679;</span>
                <span><strong className="text-[#593CC8]">Spaced Repetition</strong> &mdash; Science-backed scheduling to optimize long-term memory retention.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5DEAEA] mt-1">&#9679;</span>
                <span><strong className="text-[#593CC8]">Progress Tracking</strong> &mdash; Detailed analytics showing your cognitive growth over time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5DEAEA] mt-1">&#9679;</span>
                <span><strong className="text-[#593CC8]">Quests &amp; Leaderboard</strong> &mdash; Gamified challenges to keep you motivated and competing.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#593CC8] mb-4">Part of HumanOS</h2>
            <p className="text-[#1f2937] leading-relaxed mb-4">
              MemoryForge AI is part of the <strong className="text-[#593CC8]">HumanOS ecosystem</strong> &mdash; a suite of AI-powered tools designed to optimize every dimension of human performance. From breathing and habit-building to focus, relationships, and cognitive fitness, HumanOS helps you become the best version of yourself.
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
                  className="bg-[#F8F9FE] border border-gray-100 hover:border-[#593CC8]/40 rounded-lg p-3 text-center text-sm text-[#6B7280] hover:text-[#593CC8] transition-all"
                >
                  {app.name}
                </a>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#593CC8] mb-4">Built by PeeTeeAI</h2>
            <p className="text-[#1f2937] leading-relaxed mb-4">
              MemoryForge AI is built and maintained by <strong className="text-[#593CC8]">PeeTeeAI</strong>, the company behind the HumanOS ecosystem. We are on a mission to make AI-powered personal development accessible to everyone.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="/contact"
                className="bg-[#593CC8] hover:bg-[#4a30a8] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/library"
                className="border border-[#593CC8]/40 text-[#593CC8] hover:bg-[#593CC8]/10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
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
