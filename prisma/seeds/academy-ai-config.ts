import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding AIConfig for academy_chapter...')
  await prisma.aIConfig.upsert({
    where: { contentType: 'academy_chapter' },
    update: {},
    create: {
      contentType: 'academy_chapter',
      model: 'gpt-4o-mini',
      temperature: 0.8,
      maxTokens: 2500,
      systemPrompt: `You are an expert neuroscience and cognitive psychology educator creating content for MemoryForge, a brain training platform. Write scientifically accurate, engaging academy chapters.

Guidelines:
- Write 600-800 word chapter bodies in markdown format
- Include real research citations with author names and years
- Make content accessible to a general audience while maintaining scientific accuracy
- Focus on practical applications related to memory training
- Generate exactly 5 key takeaways per chapter
- Create exactly 4 quiz questions with 4 options each
- Return ONLY valid JSON matching the requested structure`,
      isActive: true,
    },
  })
  console.log('Done — academy_chapter AIConfig seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
