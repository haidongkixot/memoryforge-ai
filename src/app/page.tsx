import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080a14] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-indigo-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center text-white font-bold text-sm tracking-tight">MF</div>
            <span className="text-white font-semibold text-lg tracking-tight">MemoryForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="px-4 pt-24 pb-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-4">Cognitive Training Lab</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Train recall. Sharpen pattern<br />recognition. Measure progress.
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mb-14">
              Structured exercises for working memory, sequencing, and spatial reasoning. No fluff — just measurable cognitive work.
            </p>

            {/* 3 Training Module Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
              {/* Module 1: Sequence Memory */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-5">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-10 h-10 rounded bg-indigo-500/80 flex items-center justify-center text-white text-sm font-bold">7</div>
                  <div className="w-10 h-10 rounded bg-indigo-500/80 flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div className="w-10 h-10 rounded bg-indigo-500/80 flex items-center justify-center text-white text-sm font-bold">9</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-500 text-sm font-bold">?</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-500 text-sm font-bold">?</div>
                </div>
                <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">Sequence Memory</p>
              </div>

              {/* Module 2: Pattern Matrix */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-5">
                <div className="grid grid-cols-3 gap-1.5 w-fit mb-4">
                  <div className="w-10 h-10 rounded bg-indigo-500/80" />
                  <div className="w-10 h-10 rounded bg-gray-800" />
                  <div className="w-10 h-10 rounded bg-indigo-500/80" />
                  <div className="w-10 h-10 rounded bg-gray-800" />
                  <div className="w-10 h-10 rounded bg-indigo-500/80" />
                  <div className="w-10 h-10 rounded bg-gray-800" />
                  <div className="w-10 h-10 rounded bg-gray-800" />
                  <div className="w-10 h-10 rounded bg-indigo-500/80" />
                  <div className="w-10 h-10 rounded bg-gray-800" />
                </div>
                <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">Pattern Matrix</p>
              </div>

              {/* Module 3: Spatial Recall */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-5">
                <div className="grid grid-cols-4 gap-1.5 w-fit mb-4">
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/60" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                </div>
                <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">Spatial Recall</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors tracking-tight">
                Take a 2-minute cognitive baseline
              </Link>
              <Link href="/library" className="border border-indigo-900/50 hover:border-indigo-400/60 text-gray-400 hover:text-gray-200 px-8 py-3 rounded-lg text-base transition-colors tracking-tight">
                Explore training games
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Cognitive Profile ── */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Your cognitive profile</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-10">What we measure</h2>

            <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-8">
              <div className="space-y-6">
                {/* Working Memory */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">Working Memory</span>
                    <span className="text-indigo-400 text-sm font-mono">82%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                {/* Recall Speed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">Recall Speed</span>
                    <span className="text-indigo-400 text-sm font-mono">64%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>

                {/* Pattern Recognition */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">Pattern Recognition</span>
                    <span className="text-indigo-400 text-sm font-mono">91%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                {/* Focus Span */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">Focus Span</span>
                    <span className="text-indigo-400 text-sm font-mono">73%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-xs mt-6 pt-4 border-t border-gray-800">
                Sample cognitive baseline — yours is generated from your first session
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Training Modules ── */}
        <section className="px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Training modules</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-10">Select an exercise</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tile 1: Number Strip */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-6 hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold tracking-tight">Number Strip</h3>
                  <span className="text-[10px] font-medium tracking-wider uppercase text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">Beginner</span>
                </div>
                <div className="flex gap-1.5 mb-2">
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">7</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">2</div>
                  <div className="w-10 h-10 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-sm font-mono font-bold">_</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">4</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">1</div>
                  <div className="w-10 h-10 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-sm font-mono font-bold">_</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">8</div>
                </div>
                <p className="text-gray-600 text-xs mt-3">Fill the missing digits from memory</p>
              </div>

              {/* Tile 2: Pattern Matrix */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-6 hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold tracking-tight">Pattern Matrix</h3>
                  <span className="text-[10px] font-medium tracking-wider uppercase text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">Advanced</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 w-fit mb-2">
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-indigo-500/80" />
                  <div className="w-8 h-8 rounded bg-gray-800" />
                </div>
                <p className="text-gray-600 text-xs mt-3">Memorize this pattern</p>
              </div>

              {/* Tile 3: Flip Memory */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-6 hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold tracking-tight">Flip Memory</h3>
                  <span className="text-[10px] font-medium tracking-wider uppercase text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">Beginner</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 w-fit mb-2">
                  <div className="w-12 h-14 rounded bg-indigo-500/80 flex items-center justify-center text-white text-lg font-bold">&Delta;</div>
                  <div className="w-12 h-14 rounded bg-gray-800 flex items-center justify-center text-gray-600 text-sm">///</div>
                  <div className="w-12 h-14 rounded bg-indigo-500/80 flex items-center justify-center text-white text-lg font-bold">&Omega;</div>
                  <div className="w-12 h-14 rounded bg-gray-800 flex items-center justify-center text-gray-600 text-sm">///</div>
                  <div className="w-12 h-14 rounded bg-indigo-500/80 flex items-center justify-center text-white text-lg font-bold">&Sigma;</div>
                  <div className="w-12 h-14 rounded bg-gray-800 flex items-center justify-center text-gray-600 text-sm">///</div>
                </div>
                <p className="text-gray-600 text-xs mt-3">Match hidden symbol pairs</p>
              </div>

              {/* Tile 4: N-Back Sequence */}
              <div className="bg-[#0f1225] border border-indigo-900/30 rounded-lg p-6 hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold tracking-tight">N-Back Sequence</h3>
                  <span className="text-[10px] font-medium tracking-wider uppercase text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">Advanced</span>
                </div>
                <div className="flex gap-1.5 mb-1">
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">M</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">K</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">M</div>
                  <div className="w-10 h-10 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-sm font-mono font-bold">_</div>
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-300 text-sm font-mono font-bold">K</div>
                  <div className="w-10 h-10 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-sm font-mono font-bold">_</div>
                </div>
                <div className="flex gap-1.5 mt-1">
                  <div className="w-10 text-center text-[9px] text-gray-700 font-mono">n-2</div>
                  <div className="w-10 text-center text-[9px] text-gray-700 font-mono">n-1</div>
                  <div className="w-10 text-center text-[9px] text-gray-700 font-mono">n</div>
                  <div className="w-10 text-center text-[9px] text-indigo-500/60 font-mono">n+1</div>
                  <div className="w-10 text-center text-[9px] text-gray-700 font-mono">n+2</div>
                  <div className="w-10 text-center text-[9px] text-indigo-500/60 font-mono">n+3</div>
                </div>
                <p className="text-gray-600 text-xs mt-3">Identify repeated items N positions back</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Research Backing ── */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Evidence base</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-10">Built on cognitive science</h2>

            <div className="space-y-6">
              <div className="border-l-2 border-indigo-500 pl-5 py-1">
                <h3 className="text-white font-semibold tracking-tight mb-1">Spaced Repetition</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Reviewing material at systematically increasing intervals dramatically improves long-term retention compared to massed practice.
                </p>
                <p className="text-gray-600 text-xs font-mono">Ebbinghaus, 1885; Cepeda et al., 2006</p>
              </div>

              <div className="border-l-2 border-indigo-500 pl-5 py-1">
                <h3 className="text-white font-semibold tracking-tight mb-1">Active Recall</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Self-testing produces stronger memory traces than passive review. The retrieval process itself strengthens the memory.
                </p>
                <p className="text-gray-600 text-xs font-mono">Roediger & Butler, 2011</p>
              </div>

              <div className="border-l-2 border-indigo-500 pl-5 py-1">
                <h3 className="text-white font-semibold tracking-tight mb-1">Dual N-Back</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Adaptive working memory training with dual n-back tasks shows evidence of transfer to fluid intelligence measures.
                </p>
                <p className="text-gray-600 text-xs font-mono">Jaeggi et al., 2008</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: CTA ── */}
        <section className="px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Your memory is trainable.<br />Start measuring it.
            </h2>
            <p className="text-gray-500 text-base mb-8">
              A structured baseline test. No account required to begin.
            </p>
            <Link href="/signup" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-3 rounded-lg text-base font-medium transition-colors tracking-tight">
              Begin baseline test
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-indigo-900/20 py-8 text-center text-gray-600 text-sm">
        <p>MemoryForge AI -- Part of the <span className="text-indigo-400/80">HumanOS</span> ecosystem</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} HumanOS. All rights reserved.</p>
      </footer>
    </div>
  )
}
