import Link from 'next/link'

export default function Home() {
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
        <section className="px-4 pt-24 pb-20 bg-gradient-to-b from-[#EEF2FF] to-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-4">Cognitive Training Lab</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1f2937] tracking-tight leading-[1.1] mb-4">
              Train recall. Sharpen pattern<br />recognition. Measure progress.
            </h1>
            <p className="text-[#6B7280] text-lg max-w-xl mb-14">
              Structured exercises for working memory, sequencing, and spatial reasoning. No fluff — just measurable cognitive work.
            </p>

            {/* 3 Training Module Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
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

        {/* SECTION 3: Training Modules */}
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

        {/* SECTION 4: Research Backing */}
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

        {/* SECTION 5: CTA */}
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
