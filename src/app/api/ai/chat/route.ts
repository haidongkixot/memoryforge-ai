import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildCoachContext, buildSystemPrompt, saveMessage, getConversationHistory } from '@/lib/ai-coach'
import OpenAI from 'openai'

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your-openai-api-key') return null
  return new OpenAI({ apiKey })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = (session.user as any).id
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const safeMessage = message.slice(0, 2000)
    await saveMessage(userId, 'user', safeMessage)

    const openai = getOpenAI()
    if (!openai) {
      // Fallback without OpenAI
      const tips = [
        'Try the Method of Loci: visualize items in familiar locations along a mental path.',
        'Chunking works great for numbers. Break long sequences into groups of 3-4.',
        'Spaced repetition is key. Review today, tomorrow, then in 3 days, then a week.',
        'Before a game, take 3 deep breaths to improve focus and concentration.',
        'Visual memory improves fastest with pattern matching games like Card Match.',
        'Sleep is critical for memory consolidation. Aim for 7-9 hours nightly.',
        'Association is powerful. Link new information to things you already know.',
      ]
      const reply = tips[Math.floor(Math.random() * tips.length)]
      await saveMessage(userId, 'assistant', reply)
      return NextResponse.json({ reply })
    }

    const [ctx, history] = await Promise.all([
      buildCoachContext(userId),
      getConversationHistory(userId, 10),
    ])

    const systemPrompt = buildSystemPrompt(ctx)
    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...history.map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    ]

    // Ensure last message is the current one
    if (!chatMessages.find((m) => m.role === 'user' && m.content === safeMessage)) {
      chatMessages.push({ role: 'user', content: safeMessage })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      temperature: 0.7,
      messages: chatMessages,
    })

    const reply = completion.choices[0]?.message?.content || 'Keep practicing! Consistency is the key to memory improvement.'
    await saveMessage(userId, 'assistant', reply)

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = (session.user as any).id
    const history = await getConversationHistory(userId, 50)
    const messages = history.map((m, i) => ({
      id: `${i}-${m.createdAt}`,
      role: m.role,
      content: m.content,
    }))
    return NextResponse.json({ messages })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}
