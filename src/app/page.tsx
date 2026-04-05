import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSiteSettings() {
  try {
    const settings = await prisma.appConfig.findMany({
      where: { key: { in: ['hero_title', 'hero_description', 'stats_users', 'stats_sessions', 'stats_games'] } },
    })
    return Object.fromEntries(
      settings.filter(s => s.value && s.value !== '').map((s) => [s.key, typeof s.value === 'string' ? s.value : JSON.stringify(s.value)])
    )
  } catch {
    return {}
  }
}

export default async function Home() {
  const cms = await getSiteSettings()
  const heroTitle = cms['hero_title'] || 'Train recall. Sharpen pattern recognition. Measure progress.'
  const heroDescription = cms['hero_description'] || 'Structured exercises for working memory, sequencing, and spatial reasoning. No fluff — just measurable cognitive work.'
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#E5E7EB] px-6 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1] flex items-center justify-center text-white font-bold text-sm tracking-tight">MF</div>
            <span className="text-[#1f2937] font-bold text-lg tracking-tight">MemoryForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[#6B7280] hover:text-[#6366f1] text-sm transition-colors font-medium">Sign In</Link>
            <Link href="/signup" className="bg-[#6366f1] hover:bg-[#5558e6] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-[0_4px_15px_rgba(99,102,241,0.25)]">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO */}
        <section className="px-4 pt-20 pb-20 bg-gradient-to-b from-[#EEF2FF] to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero text + module previews */}
              <div>
                <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-4">Cognitive Training Lab</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1f2937] tracking-tight leading-[1.1] mb-4">
                  {heroTitle}
                </h1>
                <p className="text-[#6B7280] text-lg max-w-xl mb-10">
                  {heroDescription}
                </p>

                {/* 3 Training Module Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  {/* Module 1: Sequence Memory */}
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_15px_rgba(99,102,241,0.04)] hover:shadow-md transition-shadow">
                    <div className="flex gap-1.5 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold">7</div>
                      <div className="w-10 h-10 rounded-xl bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold">2</div>
                      <div className="w-10 h-10 rounded-xl bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold">9</div>
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] text-sm font-bold">?</div>
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] text-sm font-bold">?</div>
                    </div>
                    <p className="text-[#6B7280] text-xs font-medium tracking-wide uppercase">Sequence Memory</p>
                  </div>

                  {/* Module 2: Pattern Matrix */}
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_15px_rgba(99,102,241,0.04)] hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-3 gap-1.5 w-fit mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#5DEAEA]" />
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6]" />
                      <div className="w-10 h-10 rounded-xl bg-[#5DEAEA]" />
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6]" />
                      <div className="w-10 h-10 rounded-xl bg-[#5DEAEA]" />
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6]" />
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6]" />
                      <div className="w-10 h-10 rounded-xl bg-[#5DEAEA]" />
                      <div className="w-10 h-10 rounded-xl bg-[#F3F4F6]" />
                    </div>
                    <p className="text-[#6B7280] text-xs font-medium tracking-wide uppercase">Pattern Matrix</p>
                  </div>

                  {/* Module 3: Spatial Recall */}
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_15px_rgba(99,102,241,0.04)] hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-4 gap-1.5 w-fit mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#ABF263]" />
                      <div className="w-8 h-8 rounded-lg bg-[#ABF263]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#ABF263]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#ABF263]/60" />
                      <div className="w-8 h-8 rounded-lg bg-[#ABF263]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                      <div className="w-8 h-8 rounded-lg bg-[#ABF263]" />
                    </div>
                    <p className="text-[#6B7280] text-xs font-medium tracking-wide uppercase">Spatial Recall</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/signup" className="bg-[#6366f1] hover:bg-[#5558e6] text-white px-8 py-3 rounded-full text-base font-bold transition-colors tracking-tight shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.35)]">
                    Take a 2-minute cognitive baseline
                  </Link>
                  <Link href="/library" className="border border-[#E5E7EB] hover:border-[#6366f1]/50 text-[#6B7280] hover:text-[#6366f1] px-8 py-3 rounded-full text-base transition-colors tracking-tight font-medium">
                    Explore training games
                  </Link>
                </div>
              </div>

              {/* Hero image */}
              <div className="relative hidden lg:block">
                <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(99,102,241,0.15)] border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80"
                    alt="Students engaging with educational activities"
                    className="w-full h-[480px] object-cover"
                  />
                </div>
                {/* Floating accent badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 border border-[#E5E7EB]">
                  <p className="text-[#6366f1] font-bold text-xl">82%</p>
                  <p className="text-[#6B7280] text-xs font-medium">Avg memory boost</p>
                </div>
                <div className="absolute -top-4 -right-4 bg-[#ABF263] rounded-2xl shadow-lg px-5 py-3">
                  <p className="text-[#1f2937] font-bold text-xl">10K+</p>
                  <p className="text-[#4B5563] text-xs font-medium">Active students</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="px-4 py-12 bg-[#6366f1]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-[#ABF263] text-4xl font-bold tracking-tight">10,000+</p>
                <p className="text-white/80 text-sm font-medium mt-1">Students trained</p>
              </div>
              <div>
                <p className="text-[#5DEAEA] text-4xl font-bold tracking-tight">500K+</p>
                <p className="text-white/80 text-sm font-medium mt-1">Games played</p>
              </div>
              <div>
                <p className="text-[#ABF263] text-4xl font-bold tracking-tight">4.9/5</p>
                <p className="text-white/80 text-sm font-medium mt-1">Average rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Cognitive Profile */}
        <section className="px-4 py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Your cognitive profile</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-10">What we measure</h2>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
              <div className="space-y-6">
                {/* Working Memory */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#4B5563] text-sm font-medium">Working Memory</span>
                    <span className="text-[#6366f1] text-sm font-semibold">82%</span>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#5DEAEA] rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                {/* Recall Speed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#4B5563] text-sm font-medium">Recall Speed</span>
                    <span className="text-[#6366f1] text-sm font-semibold">64%</span>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#5DEAEA] rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>

                {/* Pattern Recognition */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#4B5563] text-sm font-medium">Pattern Recognition</span>
                    <span className="text-[#6366f1] text-sm font-semibold">91%</span>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#5DEAEA] rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                {/* Focus Span */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#4B5563] text-sm font-medium">Focus Span</span>
                    <span className="text-[#6366f1] text-sm font-semibold">73%</span>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#5DEAEA] rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>
              </div>

              <p className="text-[#9CA3AF] text-xs mt-6 pt-4 border-t border-[#E5E7EB]">
                Sample cognitive baseline — yours is generated from your first session
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Games Preview */}
        <section className="px-4 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Game library</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-3">Pick your challenge</h2>
            <p className="text-[#6B7280] text-base mb-10 max-w-xl">
              Every game is designed around a specific cognitive skill. Start where you are and build up.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* Game Card 1: Brain Training */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#6366f1]/50 transition-all group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=600&q=80"
                    alt="Brain training puzzle game"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#ABF263] text-[#1f2937] text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1">
                    Beginner
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🧩</span>
                    <h3 className="text-[#1f2937] font-semibold tracking-tight">Brain Puzzles</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm">Pattern recognition and logical sequencing challenges to build cognitive flexibility.</p>
                </div>
              </div>

              {/* Game Card 2: Memory Cards */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#5DEAEA]/60 transition-all group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80"
                    alt="Memory card matching game"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#5DEAEA] text-[#1f2937] text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1">
                    Popular
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🃏</span>
                    <h3 className="text-[#1f2937] font-semibold tracking-tight">Flip Memory</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm">Match hidden card pairs using short-term visual memory. Difficulty scales with you.</p>
                </div>
              </div>

              {/* Game Card 3: Kids Playful */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#6366f1]/50 transition-all group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80"
                    alt="Kids playing and learning"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#6366f1] text-white text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1">
                    Ages 6+
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎯</span>
                    <h3 className="text-[#1f2937] font-semibold tracking-tight">Playful Recall</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm">Fun, game-like exercises designed for younger learners building foundational memory skills.</p>
                </div>
              </div>

              {/* Game Card 4: Concentration */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#ABF263]/60 transition-all group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80"
                    alt="Person focusing and concentrating"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#F87171] text-white text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1">
                    Advanced
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎯</span>
                    <h3 className="text-[#1f2937] font-semibold tracking-tight">N-Back Focus</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm">Sustained attention and working memory under pressure — the hardest challenge in our library.</p>
                </div>
              </div>

              {/* Game Card 5: Achievement */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#5DEAEA]/60 transition-all group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                    alt="Team success and achievement"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#ABF263] text-[#1f2937] text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1">
                    Team Mode
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-[#1f2937] font-semibold tracking-tight">Challenge League</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm">Compete with friends and classmates. Weekly leaderboards with memory milestones.</p>
                </div>
              </div>

              {/* Game Card 6: Fun Activity */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#6366f1]/50 transition-all group">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80"
                    alt="Group fun and learning activity"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#5DEAEA] text-[#1f2937] text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1">
                    Group Play
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎮</span>
                    <h3 className="text-[#1f2937] font-semibold tracking-tight">Group Sprint</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm">Real-time multiplayer memory sprints. Play together, grow together.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/library" className="inline-block border border-[#E5E7EB] hover:border-[#6366f1]/50 text-[#6B7280] hover:text-[#6366f1] px-8 py-3 rounded-full text-base transition-colors tracking-tight font-medium">
                Browse all games →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: How It Works */}
        <section className="px-4 py-20 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-12">From zero to sharper in minutes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 rounded-full bg-[#ABF263] flex items-center justify-center text-[#1f2937] text-2xl font-bold shadow-lg mx-auto">1</div>
                </div>
                <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"
                    alt="Student starting their baseline test"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-[#1f2937] font-semibold text-lg mb-2">Take your baseline</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">A 2-minute cognitive snapshot establishes your starting point across 4 key memory dimensions.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 rounded-full bg-[#5DEAEA] flex items-center justify-center text-[#1f2937] text-2xl font-bold shadow-lg mx-auto">2</div>
                </div>
                <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=600&q=80"
                    alt="Practicing memory games daily"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-[#1f2937] font-semibold text-lg mb-2">Train daily</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Pick exercises matched to your weak spots. 10–15 minutes a day is all it takes to see real gains.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto">3</div>
                </div>
                <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                    alt="Achieving memory milestones"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-[#1f2937] font-semibold text-lg mb-2">Track your growth</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Watch your cognitive profile evolve over time. Progress reports show exactly where you're improving.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Training Modules */}
        <section className="px-4 py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Training modules</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-10">Select an exercise</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tile 1: Number Strip */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#6366f1]/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[#1f2937] font-semibold tracking-tight">Number Strip</h3>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-green-600 bg-[#ABF263]/20 rounded-full px-2 py-0.5">Beginner</span>
                </div>
                <div className="flex gap-1.5 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">7</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">2</div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] text-sm font-mono font-bold">_</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">4</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">1</div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] text-sm font-mono font-bold">_</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">8</div>
                </div>
                <p className="text-[#9CA3AF] text-xs mt-3">Fill the missing digits from memory</p>
              </div>

              {/* Tile 2: Pattern Matrix */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#6366f1]/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[#1f2937] font-semibold tracking-tight">Pattern Matrix</h3>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-red-600 bg-[#F87171]/20 rounded-full px-2 py-0.5">Advanced</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 w-fit mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#5DEAEA]" />
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
                </div>
                <p className="text-[#9CA3AF] text-xs mt-3">Memorize this pattern</p>
              </div>

              {/* Tile 3: Flip Memory */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#6366f1]/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[#1f2937] font-semibold tracking-tight">Flip Memory</h3>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-green-600 bg-[#ABF263]/20 rounded-full px-2 py-0.5">Beginner</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 w-fit mb-2">
                  <div className="w-12 h-14 rounded-xl bg-[#6366f1] flex items-center justify-center text-white text-lg font-bold">&Delta;</div>
                  <div className="w-12 h-14 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] text-sm">///</div>
                  <div className="w-12 h-14 rounded-xl bg-[#6366f1] flex items-center justify-center text-white text-lg font-bold">&Omega;</div>
                  <div className="w-12 h-14 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] text-sm">///</div>
                  <div className="w-12 h-14 rounded-xl bg-[#6366f1] flex items-center justify-center text-white text-lg font-bold">&Sigma;</div>
                  <div className="w-12 h-14 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] text-sm">///</div>
                </div>
                <p className="text-[#9CA3AF] text-xs mt-3">Match hidden symbol pairs</p>
              </div>

              {/* Tile 4: N-Back Sequence */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#6366f1]/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[#1f2937] font-semibold tracking-tight">N-Back Sequence</h3>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-red-600 bg-[#F87171]/20 rounded-full px-2 py-0.5">Advanced</span>
                </div>
                <div className="flex gap-1.5 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">M</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">K</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">M</div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] text-sm font-mono font-bold">_</div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-sm font-mono font-bold">K</div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] text-sm font-mono font-bold">_</div>
                </div>
                <div className="flex gap-1.5 mt-1">
                  <div className="w-10 text-center text-[9px] text-[#9CA3AF] font-mono">n-2</div>
                  <div className="w-10 text-center text-[9px] text-[#9CA3AF] font-mono">n-1</div>
                  <div className="w-10 text-center text-[9px] text-[#9CA3AF] font-mono">n</div>
                  <div className="w-10 text-center text-[9px] text-[#6366f1]/60 font-mono">n+1</div>
                  <div className="w-10 text-center text-[9px] text-[#9CA3AF] font-mono">n+2</div>
                  <div className="w-10 text-center text-[9px] text-[#6366f1]/60 font-mono">n+3</div>
                </div>
                <p className="text-[#9CA3AF] text-xs mt-3">Identify repeated items N positions back</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Research Backing */}
        <section className="px-4 py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Evidence base</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-10">Built on cognitive science</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-[#6366f1] pl-5 py-1">
                <h3 className="text-[#1f2937] font-semibold tracking-tight mb-1">Spaced Repetition</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                  Reviewing material at systematically increasing intervals dramatically improves long-term retention compared to massed practice.
                </p>
                <p className="text-[#9CA3AF] text-xs font-mono">Ebbinghaus, 1885; Cepeda et al., 2006</p>
              </div>

              <div className="border-l-4 border-[#5DEAEA] pl-5 py-1">
                <h3 className="text-[#1f2937] font-semibold tracking-tight mb-1">Active Recall</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                  Self-testing produces stronger memory traces than passive review. The retrieval process itself strengthens the memory.
                </p>
                <p className="text-[#9CA3AF] text-xs font-mono">Roediger & Butler, 2011</p>
              </div>

              <div className="border-l-4 border-[#ABF263] pl-5 py-1">
                <h3 className="text-[#1f2937] font-semibold tracking-tight mb-1">Dual N-Back</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                  Adaptive working memory training with dual n-back tasks shows evidence of transfer to fluid intelligence measures.
                </p>
                <p className="text-[#9CA3AF] text-xs font-mono">Jaeggi et al., 2008</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: YouTube Video */}
        <section className="px-4 py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">See it in action</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-4">MemoryForge in action</h2>
            <p className="text-[#6B7280] text-base mb-10 max-w-xl mx-auto">
              Watch how students use MemoryForge to build lasting memory skills with science-backed techniques.
            </p>
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(99,102,241,0.15)] border border-[#E5E7EB]">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/kR8dLM4c3Cg"
                  title="Memory improvement techniques — MemoryForge"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: Testimonials */}
        <section className="px-4 py-20 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Student love</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-12">Students love it</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[#ABF263] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  "My recall speed went up noticeably in just three weeks. The pattern matrix game is genuinely addictive — I do it every morning before class."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop&q=80"
                    alt="Student avatar"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#5DEAEA]"
                  />
                  <div>
                    <p className="text-[#1f2937] text-sm font-semibold">Marcus T.</p>
                    <p className="text-[#9CA3AF] text-xs">University student</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[#ABF263] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  "I use this with my 9-year-old every evening. She loves the card games and I can actually see her improving. The progress tracker is a huge motivator."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&h=80&fit=crop&q=80"
                    alt="Parent avatar"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#ABF263]"
                  />
                  <div>
                    <p className="text-[#1f2937] text-sm font-semibold">Sarah K.</p>
                    <p className="text-[#9CA3AF] text-xs">Parent & educator</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_15px_rgba(99,102,241,0.04)]">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[#ABF263] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  "The N-Back sequence is brutally hard in the best way. My working memory score jumped 18 points in a month. I recommend this to everyone in my study group."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80"
                    alt="Student avatar"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#6366f1]"
                  />
                  <div>
                    <p className="text-[#1f2937] text-sm font-semibold">Aisha R.</p>
                    <p className="text-[#9CA3AF] text-xs">Med school student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Academy */}
        <section className="px-4 py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Academy</p>
            <h2 className="text-3xl font-bold text-[#1f2937] tracking-tight mb-4">Learn the Science</h2>
            <p className="text-[#6B7280] text-base mb-12 max-w-xl">
              Master the research behind memory and cognition with structured Academy lessons.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { title: 'Working Memory', subtitle: 'Your brain\'s RAM -- how it works and how to expand it', icon: '🧠' },
                { title: 'The Forgetting Curve', subtitle: 'Why we forget and how spaced repetition fights back', icon: '📉' },
                { title: 'Sleep, Naps & Memory', subtitle: 'How rest consolidates what you learn into long-term storage', icon: '😴' },
              ].map((ch) => (
                <div key={ch.title} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#6366f1]/50 hover:shadow-md transition-all">
                  <div className="text-3xl mb-4">{ch.icon}</div>
                  <h3 className="text-[#1f2937] font-semibold tracking-tight mb-2">{ch.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{ch.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/academy" className="inline-block border border-[#E5E7EB] hover:border-[#6366f1]/50 text-[#6B7280] hover:text-[#6366f1] px-8 py-3 rounded-full text-base transition-colors tracking-tight font-medium">
                Explore Academy &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 9: CTA */}
        <section className="px-4 py-24 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1f2937] tracking-tight mb-4">
              Your memory is trainable.<br />Start measuring it.
            </h2>
            <p className="text-[#6B7280] text-base mb-8">
              A structured baseline test. No account required to begin.
            </p>
            <Link href="/signup" className="inline-block bg-[#6366f1] hover:bg-[#5558e6] text-white px-10 py-3 rounded-full text-base font-bold transition-colors tracking-tight shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.35)]">
              Begin baseline test
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E5E7EB] py-8 text-center text-[#9CA3AF] text-sm bg-white">
        <p>MemoryForge AI -- Part of the <span className="text-[#6366f1]">HumanOS</span> ecosystem</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} HumanOS. All rights reserved.</p>
      </footer>
    </div>
  )
}
