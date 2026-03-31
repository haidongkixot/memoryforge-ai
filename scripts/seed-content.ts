import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  const games = [
    { slug: 'card-match', name: 'Card Match', category: 'visual', difficulty: 'beginner', description: 'Classic memory card matching game. Flip cards and find matching pairs before time runs out.', benefits: ['Visual memory', 'Pattern recognition', 'Concentration'], rules: ['Flip two cards per turn', 'Match all pairs to win', 'Fewer moves = higher score'], gameType: 'matching', gridSize: 4, timeLimit: 60, maxLevel: 10 },
    { slug: 'sequence-recall', name: 'Sequence Recall', category: 'sequential', difficulty: 'beginner', description: 'Remember and reproduce increasingly long sequences of colors and sounds.', benefits: ['Short-term memory', 'Sequential recall', 'Auditory memory'], rules: ['Watch the sequence', 'Repeat it in order', 'Sequences get longer each level'], gameType: 'sequence', gridSize: 4, timeLimit: 90, maxLevel: 15 },
    { slug: 'number-matrix', name: 'Number Matrix', category: 'numerical', difficulty: 'intermediate', description: 'Memorize positions of numbers in a grid, then recall their locations.', benefits: ['Working memory', 'Spatial awareness', 'Number processing'], rules: ['Study the number grid', 'Numbers disappear after timer', 'Click correct positions'], gameType: 'spatial', gridSize: 5, timeLimit: 45, maxLevel: 12 },
    { slug: 'word-association', name: 'Word Association', category: 'verbal', difficulty: 'intermediate', description: 'Build chains of associated words and recall them in sequence.', benefits: ['Verbal memory', 'Semantic processing', 'Association building'], rules: ['Remember word pairs', 'Recall the matching word', 'Speed bonus for fast answers'], gameType: 'verbal', gridSize: 3, timeLimit: 120, maxLevel: 10 },
    { slug: 'face-name', name: 'Face & Name', category: 'social', difficulty: 'advanced', description: 'Match faces with names and personal details - a real-world memory skill.', benefits: ['Social memory', 'Face recognition', 'Detail retention'], rules: ['Study face-name pairs', 'Match names to faces', 'Bonus for remembering details'], gameType: 'association', gridSize: 4, timeLimit: 90, maxLevel: 8 },
    { slug: 'spatial-puzzle', name: 'Spatial Puzzle', category: 'spatial', difficulty: 'advanced', description: 'Remember and recreate complex spatial patterns and arrangements.', benefits: ['Spatial memory', 'Mental rotation', 'Visual processing'], rules: ['Study the pattern', 'Recreate it from memory', 'Patterns increase in complexity'], gameType: 'spatial', gridSize: 6, timeLimit: 60, maxLevel: 10 },
  ]
  for (const g of games) {
    await p.game.upsert({ where: { slug: g.slug }, update: g, create: g })
    console.log('Game:', g.name)
  }

  const techniques = [
    { name: 'Method of Loci', slug: 'method-of-loci', category: 'spatial', description: 'Also known as the Memory Palace technique. Visualize a familiar place and associate items to remember with specific locations along a mental path.', steps: ['Choose a familiar location', 'Identify distinct spots along a route', 'Place each item at a spot using vivid imagery', 'Walk the route to recall items'], difficulty: 'intermediate' },
    { name: 'Chunking', slug: 'chunking', category: 'organizational', description: 'Break large amounts of information into smaller, meaningful groups or chunks to make them easier to remember.', steps: ['Identify the information to memorize', 'Group related items together', 'Create meaningful labels for each chunk', 'Practice recalling chunks'], difficulty: 'beginner' },
    { name: 'Spaced Repetition', slug: 'spaced-repetition', category: 'review', description: 'Review information at gradually increasing intervals to move it from short-term to long-term memory.', steps: ['Learn the material initially', 'Review after 1 day', 'Review after 3 days', 'Review after 7 days', 'Continue doubling intervals'], difficulty: 'beginner' },
    { name: 'Peg System', slug: 'peg-system', category: 'association', description: 'Associate numbered pegs with items to remember using rhymes or visual links.', steps: ['Learn the peg words (one-bun, two-shoe, etc.)', 'Create vivid images linking pegs to items', 'Use the peg sequence to recall order', 'Practice with different lists'], difficulty: 'intermediate' },
    { name: 'Story Method', slug: 'story-method', category: 'narrative', description: 'Create a vivid story that links all the items you need to remember in a memorable narrative.', steps: ['List items to remember', 'Create a narrative connecting all items', 'Make the story vivid and unusual', 'Retell the story to recall items'], difficulty: 'beginner' },
  ]
  for (const t of techniques) {
    await p.memoryTechnique.upsert({ where: { slug: t.slug }, update: t, create: t })
    console.log('Technique:', t.name)
  }

  await p.$disconnect()
  console.log('MemoryForge seed complete!')
}

main().catch(e => { console.error(e); process.exit(1) })
