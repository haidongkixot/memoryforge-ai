import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { aiGenerate } from '@/lib/ai-generate'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { gameId, contentType, difficulty, theme } = await req.json()

  let prompt = ''
  if (contentType === 'word_list') {
    prompt = `Generate a list of ${difficulty === 'advanced' ? '14' : difficulty === 'intermediate' ? '13' : '12'} words for a word memory game.
Theme: ${theme || 'general vocabulary'}
Difficulty: ${difficulty}
Return JSON: { "words": ["word1", "word2", ...] }
${difficulty === 'beginner' ? 'Use simple, common nouns.' : difficulty === 'intermediate' ? 'Use moderately complex words.' : 'Use sophisticated, less common words.'}`
  } else if (contentType === 'word_pair') {
    prompt = `Generate 15 word association pairs for a word association game.
Theme: ${theme || 'general knowledge'}
Difficulty: ${difficulty}
Return JSON: { "pairs": [{ "target": "Ocean", "answer": "Wave", "distractors": ["Mountain", "Desert", "Forest"] }, ...] }
Each pair needs 1 target word, 1 correct answer, and 3 plausible but wrong distractors.`
  } else if (contentType === 'face_data') {
    prompt = `Generate 8 fictional character profiles for a face-name memory game.
Theme: ${theme || 'diverse professionals'}
Return JSON: { "faces": [{ "emoji": "😊", "name": "FirstName LastName", "job": "Profession" }, ...] }
Use diverse emojis: 😊😎🤔😄🙂😁😍🤗😏🧐🤩😌
Make names diverse and culturally varied.`
  } else {
    return NextResponse.json({ error: 'Unsupported contentType' }, { status: 400 })
  }

  try {
    const { result } = await aiGenerate({
      contentType: 'game_content',
      userPrompt: prompt,
      adminId: (session.user as any).id ?? session.user?.email ?? 'admin',
      metadata: { gameId, contentType, difficulty, theme },
      fallbackSystemPrompt: 'You are a game content designer for a brain training app. Return ONLY valid JSON, no markdown.',
    })

    const saved = await prisma.gameContent.create({
      data: {
        gameId,
        contentType,
        content: result,
        difficulty: difficulty || 'beginner',
        label: theme ? `${theme} (AI)` : `AI Generated - ${new Date().toLocaleDateString()}`,
      },
    })

    return NextResponse.json(saved)
  } catch (err) {
    return NextResponse.json({ error: 'AI generation failed: ' + String(err) }, { status: 500 })
  }
}
