import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
    const { gameName, score, level, accuracy, duration } = await req.json()
    const safeName = String(gameName || '').slice(0, 100)
    const safeScore = Number(score) || 0
    const safeLevel = Number(level) || 1
    const safeAccuracy = Number(accuracy) || 0
    const safeDuration = Number(duration) || 0

    const openai = getOpenAI()
    if (!openai) {
      const tip = safeAccuracy > 80 ? 'Excellent accuracy! Try increasing the difficulty.' :
        safeAccuracy > 60 ? 'Good work! Focus on accuracy before speed.' :
        'Take your time — accuracy improves with practice.'
      return NextResponse.json({ feedback: `Score: ${safeScore} | Level: ${safeLevel} | ${tip}` })
    }

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      temperature: 0.7,
      messages: [{
        role: 'system',
        content: 'You are a cognitive training coach. Give brief, encouraging feedback on memory game performance with one specific improvement tip.'
      }, {
        role: 'user',
        content: `Game: ${safeName}, Score: ${safeScore}, Level: ${safeLevel}, Accuracy: ${safeAccuracy}%, Duration: ${safeDuration}s`
      }],
    })

    return NextResponse.json({ feedback: resp.choices[0]?.message?.content || 'Great effort! Keep training.' })
  } catch {
    return NextResponse.json({ feedback: 'Keep practicing to strengthen your memory!' })
  }
}