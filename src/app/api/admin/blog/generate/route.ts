import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiGenerate } from '@/lib/ai-generate'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { topic, tone } = await req.json()
  if (!topic) return NextResponse.json({ error: 'topic is required' }, { status: 400 })

  const prompt = `Write a blog post about: ${topic}
Tone: ${tone || 'informative and engaging'}

Return JSON:
{
  "title": "Blog post title",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence excerpt for previews",
  "body": "Full blog post in markdown (800-1200 words). Use ## for sections, include practical tips.",
  "tags": ["tag1", "tag2", "tag3"]
}

The blog is for MemoryForge, a brain training and memory improvement app. Focus on memory science, cognitive training, brain health, or productivity topics.`

  try {
    const { result, model, tokensUsed, durationMs } = await aiGenerate({
      contentType: 'blog_post',
      userPrompt: prompt,
      adminId: (session.user as any).id ?? session.user?.email ?? 'admin',
      metadata: { topic, tone },
      fallbackSystemPrompt: 'You are an expert content writer specializing in cognitive science, memory improvement, and brain health. Return ONLY valid JSON, no markdown fences.',
    })

    return NextResponse.json({ ...result, _ai: { model, tokensUsed, durationMs } })
  } catch (err) {
    return NextResponse.json({ error: 'Blog generation failed: ' + String(err) }, { status: 500 })
  }
}
