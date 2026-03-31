import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - MemoryForge AI',
  description: 'Terms of service for MemoryForge AI cognitive training platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#080a14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-12">Last updated: March 30, 2026</p>

        <div className="space-y-8">
          <section>
            <p className="text-gray-300 leading-relaxed">
              MemoryForge AI is a product of <strong className="text-indigo-400">PeeTeeAI</strong>. By accessing or using the MemoryForge AI platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By creating an account or using MemoryForge AI, you acknowledge that you have read, understood, and agree to these Terms of Service and our Privacy Policy. These terms apply to all users of the platform, including visitors, registered users, and premium subscribers.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              MemoryForge AI provides AI-powered cognitive training games, spaced repetition tools, personalized coaching, progress tracking, and related features. The platform is part of the HumanOS ecosystem operated by PeeTeeAI. We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>You must provide accurate and complete registration information.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>You are responsible for maintaining the confidentiality of your account credentials.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>You are responsible for all activities that occur under your account.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>You must be at least 13 years of age to create an account.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>We reserve the right to suspend or terminate accounts that violate these terms.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Use the platform for any unlawful purpose or in violation of any applicable laws.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Attempt to gain unauthorized access to any part of the platform or its systems.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Interfere with or disrupt the platform or servers connected to the platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Use automated tools to scrape, crawl, or extract data from the platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Manipulate leaderboard rankings, game scores, or any competitive features through dishonest means.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content, features, and functionality of MemoryForge AI, including but not limited to text, graphics, logos, game designs, algorithms, and software, are owned by PeeTeeAI and are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Subscriptions and Payments</h2>
            <p className="text-gray-300 leading-relaxed">
              Some features of MemoryForge AI may require a paid subscription. By subscribing, you agree to pay the applicable fees. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled in accordance with our refund policy. We reserve the right to change pricing with reasonable notice.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              MemoryForge AI is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. Specifically:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>The platform is not a medical device and is not intended to diagnose, treat, cure, or prevent any medical condition.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>AI-generated coaching and recommendations are for informational purposes only.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>We do not guarantee specific cognitive improvements or outcomes.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, PeeTeeAI and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits, or goodwill, arising from your use of or inability to use the platform.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your access to the platform at any time, with or without cause, with or without notice. Upon termination, your right to use the platform ceases immediately. You may delete your account at any time through the platform settings or by contacting us.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Material changes will be communicated through the platform or via email. Continued use of the platform after changes take effect constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms of Service, contact us at{' '}
              <a href="mailto:hai@eagodi.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                hai@eagodi.com
              </a>{' '}
              or visit our{' '}
              <a href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Contact page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
