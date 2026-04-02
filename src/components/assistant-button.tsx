'use client'
import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'assistant'; content: string }

export default function AssistantButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history: messages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.message || 'How can I help you train your memory?' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#6366f1] hover:bg-[#5558e6] shadow-[0_4px_15px_rgba(99,102,241,0.35)] flex items-center justify-center transition-all duration-200 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title="Memory Coach"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_6px_20px_rgba(156,163,175,0.15)] flex flex-col" style={{ height: '480px' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#1f2937]">Memory Coach</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🧠</div>
                <p className="text-[#6B7280] text-sm">Hi! I&apos;m your MemoryForge Coach. Ask me about memory techniques, cognitive training, or how to improve your brain performance!</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#6366f1] text-white' : 'bg-[#F3F4F6] text-[#1f2937]'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F3F4F6] px-3 py-2 rounded-2xl flex gap-1">
                  {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-[#E5E7EB]">
            <div className="flex gap-2">
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask your coach..."
                className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#1f2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6366f1] transition-colors"
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-[#6366f1] hover:bg-[#5558e6] disabled:opacity-40 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
