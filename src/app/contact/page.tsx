'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#080a14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-indigo-400">Us</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions, feedback, or need support? We would love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Email</h3>
                  <a href="mailto:hai@eagodi.com" className="text-gray-300 hover:text-indigo-400 transition-colors">
                    hai@eagodi.com
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Platform</h3>
                  <a
                    href="https://memoryforge-ai.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    memoryforge-ai.vercel.app
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">GitHub</h3>
                  <a
                    href="https://github.com/haidongkixot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    github.com/haidongkixot
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">About PeeTeeAI</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                MemoryForge AI is built and operated by <strong className="text-indigo-400">PeeTeeAI</strong>, the team behind the HumanOS ecosystem of AI-powered personal development tools.
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  PT
                </div>
                <div>
                  <p className="text-white text-sm font-medium">PeeTeeAI</p>
                  <p className="text-gray-500 text-xs">AI Personal Trainer for Humans</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-indigo-500/20 rounded-2xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-2">Send a Message</h2>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
