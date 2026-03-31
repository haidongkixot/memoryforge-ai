import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - MemoryForge AI',
  description: 'Privacy policy for MemoryForge AI cognitive training platform.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080a14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-12">Last updated: March 30, 2026</p>

        <div className="space-y-8">
          <section>
            <p className="text-gray-300 leading-relaxed">
              MemoryForge AI is operated by <strong className="text-indigo-400">PeeTeeAI</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the MemoryForge AI platform and related services.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you create an account, we may collect your name, email address, and authentication credentials. If you sign in through a third-party provider (e.g., Google, GitHub), we receive basic profile information from that provider.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2">Usage Data</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We automatically collect information about how you interact with the platform, including game scores, session durations, cognitive performance metrics, feature usage patterns, and device/browser information.
            </p>
            <h3 className="text-lg font-semibold text-white mb-2">Cookies and Tracking</h3>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies to maintain your session and preferences. We may use analytics cookies to understand how users interact with our platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>To provide, maintain, and improve the MemoryForge AI platform and services.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>To personalize your cognitive training experience using AI-driven recommendations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>To track your progress and generate performance analytics.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>To communicate with you about updates, features, and support.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>To ensure the security and integrity of our platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>To comply with legal obligations.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">Service Providers:</strong> Third-party services that help us operate the platform (hosting, analytics, email).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">HumanOS Ecosystem:</strong> Aggregated, anonymized performance data may be shared across HumanOS apps to enhance your overall experience.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or governmental authority.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption in transit (TLS/SSL), secure database storage, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us. Some data may be retained as required by law or for legitimate business purposes.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Access, correct, or delete your personal information.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Object to or restrict certain processing activities.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Export your data in a portable format.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">&#9679;</span>
                <span>Withdraw consent where processing is based on consent.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              MemoryForge AI is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected data from a child under 13, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on the platform or sending you an email. Your continued use of MemoryForge AI after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
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
