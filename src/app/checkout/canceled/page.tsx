import Link from 'next/link'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Checkout canceled — MemoryForge AI' }
export default function CheckoutCanceledPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FE] relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, rgba(148,163,184,0.10), transparent 60%)' }} />
      <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 border border-gray-200 mb-6">
          <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx={12} cy={12} r={9} /><path d="M9 9l6 6M15 9l-6 6" /></svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1f2937] tracking-tight">No worries, no charge.</h1>
        <p className="mt-4 text-lg text-[#6B7280] max-w-xl mx-auto">You canceled checkout before completing payment. Nothing was charged and your account is exactly where you left it.</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#593CC8] hover:bg-[#4a30a8] text-white transition-colors">Back to pricing</Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white hover:bg-[#F8F9FE] text-[#1f2937] border border-gray-200 transition-colors">Return to dashboard</Link>
        </div>
        <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 text-left">
          <h2 className="text-sm font-semibold text-[#1f2937] mb-2">Questions before upgrading?</h2>
          <p className="text-sm text-[#6B7280]">Check out our <Link href="/pricing" className="text-[#593CC8] hover:underline underline-offset-2">plan comparison</Link>, or <Link href="/contact" className="text-[#593CC8] hover:underline underline-offset-2">reach out</Link> — we&apos;re happy to help you find the right plan for your memory goals.</p>
        </div>
      </div>
    </div>
  )
}
