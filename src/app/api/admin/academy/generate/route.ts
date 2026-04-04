import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiGenerate } from '@/lib/ai-generate'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { topic, category } = await req.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const userPrompt = `Create an academy chapter about: "${topic}"${category ? ` in category "${category}"` : ''}.

Return JSON with this exact structure:
{
  "slug": "kebab-case-slug",
  "title": "Chapter Title",
  "body": "Full chapter body in markdown, 600-800 words, with scientific references and practical tips.",
  "category": "${category || 'general'}",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4", "takeaway 5"],
  "quizData": [
    { "question": "Question text?", "options": ["A", "B", "C", "D"], "correctIndex": 0 },
    { "question": "Question text?", "options": ["A", "B", "C", "D"], "correctIndex": 1 },
    { "question": "Question text?", "options": ["A", "B", "C", "D"], "correctIndex": 2 },
    { "question": "Question text?", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
  ]
}`

    const fallbackSystemPrompt = `You are an expert neuroscience and cognitive psychology educator creating content for MemoryForge, a brain training platform. Write scientifically accurate, engaging academy chapters. Always include real research citations. Return ONLY valid JSON.`

    const { result, model, tokensUsed, durationMs } = await aiGenerate({
      contentType: 'academy_chapter',
      userPrompt,
      adminId: (session.user as any).id,
      metadata: { topic, category },
      fallbackSystemPrompt,
    })

    return NextResponse.json({ ...result, _ai: { model, tokensUsed, durationMs } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}
