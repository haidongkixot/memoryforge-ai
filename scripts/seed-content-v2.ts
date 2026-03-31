import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  // ── Seed Games (extended) ──
  const games = [
    { slug: 'card-match', name: 'Card Match', category: 'visual', difficulty: 'beginner', description: 'Classic memory card matching game. Flip cards and find matching pairs before time runs out.', benefits: ['Visual memory', 'Pattern recognition', 'Concentration'], rules: ['Flip two cards per turn', 'Match all pairs to win', 'Fewer moves = higher score'], gameType: 'matching', gridSize: 4, timeLimit: 60, maxLevel: 10, sortOrder: 1 },
    { slug: 'sequence-recall', name: 'Sequence Recall', category: 'sequential', difficulty: 'beginner', description: 'Remember and reproduce increasingly long sequences of colors and sounds.', benefits: ['Short-term memory', 'Sequential recall', 'Auditory memory'], rules: ['Watch the sequence', 'Repeat it in order', 'Sequences get longer each level'], gameType: 'sequence', gridSize: 4, timeLimit: 90, maxLevel: 15, sortOrder: 2 },
    { slug: 'number-matrix', name: 'Number Matrix', category: 'numerical', difficulty: 'intermediate', description: 'Memorize positions of numbers in a grid, then recall their locations.', benefits: ['Working memory', 'Spatial awareness', 'Number processing'], rules: ['Study the number grid', 'Numbers disappear after timer', 'Click correct positions'], gameType: 'spatial', gridSize: 5, timeLimit: 45, maxLevel: 12, sortOrder: 3 },
    { slug: 'word-association', name: 'Word Association', category: 'verbal', difficulty: 'intermediate', description: 'Build chains of associated words and recall them in sequence.', benefits: ['Verbal memory', 'Semantic processing', 'Association building'], rules: ['Remember word pairs', 'Recall the matching word', 'Speed bonus for fast answers'], gameType: 'verbal', gridSize: 3, timeLimit: 120, maxLevel: 10, sortOrder: 4 },
    { slug: 'face-name', name: 'Face & Name', category: 'social', difficulty: 'advanced', description: 'Match faces with names and personal details - a real-world memory skill.', benefits: ['Social memory', 'Face recognition', 'Detail retention'], rules: ['Study face-name pairs', 'Match names to faces', 'Bonus for remembering details'], gameType: 'association', gridSize: 4, timeLimit: 90, maxLevel: 8, sortOrder: 5 },
    { slug: 'spatial-puzzle', name: 'Spatial Puzzle', category: 'spatial', difficulty: 'advanced', description: 'Remember and recreate complex spatial patterns and arrangements.', benefits: ['Spatial memory', 'Mental rotation', 'Visual processing'], rules: ['Study the pattern', 'Recreate it from memory', 'Patterns increase in complexity'], gameType: 'spatial', gridSize: 6, timeLimit: 60, maxLevel: 10, sortOrder: 6 },
    { slug: 'n-back', name: 'N-Back', category: 'working-memory', difficulty: 'advanced', description: 'The gold standard of working memory training. Track items N steps back.', benefits: ['Working memory', 'Fluid intelligence', 'Executive function'], rules: ['A sequence of stimuli is shown', 'Press when current matches N steps back', 'N increases with performance'], gameType: 'nback', gridSize: 3, timeLimit: 120, maxLevel: 10, sortOrder: 7 },
    { slug: 'speed-sort', name: 'Speed Sort', category: 'processing', difficulty: 'intermediate', description: 'Sort items into correct categories as fast as possible under time pressure.', benefits: ['Processing speed', 'Categorization', 'Quick decision-making'], rules: ['Items appear on screen', 'Sort them into correct bins', 'Speed and accuracy both count'], gameType: 'sorting', gridSize: 4, timeLimit: 60, maxLevel: 10, sortOrder: 8 },
  ]

  for (const g of games) {
    await p.game.upsert({ where: { slug: g.slug }, update: g, create: g })
    console.log('Game:', g.name)
  }

  // ── Seed Memory Techniques ──
  const techniques = [
    { name: 'Method of Loci', slug: 'method-of-loci', category: 'spatial', description: 'Also known as the Memory Palace technique. Visualize a familiar place and associate items to remember with specific locations along a mental path.', steps: ['Choose a familiar location', 'Identify distinct spots along a route', 'Place each item at a spot using vivid imagery', 'Walk the route to recall items'], difficulty: 'intermediate' },
    { name: 'Chunking', slug: 'chunking', category: 'organizational', description: 'Break large amounts of information into smaller, meaningful groups or chunks to make them easier to remember.', steps: ['Identify the information to memorize', 'Group related items together', 'Create meaningful labels for each chunk', 'Practice recalling chunks'], difficulty: 'beginner' },
    { name: 'Spaced Repetition', slug: 'spaced-repetition', category: 'review', description: 'Review information at gradually increasing intervals to move it from short-term to long-term memory.', steps: ['Learn the material initially', 'Review after 1 day', 'Review after 3 days', 'Review after 7 days', 'Continue doubling intervals'], difficulty: 'beginner' },
    { name: 'Peg System', slug: 'peg-system', category: 'association', description: 'Associate numbered pegs with items to remember using rhymes or visual links.', steps: ['Learn the peg words (one-bun, two-shoe, etc.)', 'Create vivid images linking pegs to items', 'Use the peg sequence to recall order', 'Practice with different lists'], difficulty: 'intermediate' },
    { name: 'Story Method', slug: 'story-method', category: 'narrative', description: 'Create a vivid story that links all the items you need to remember in a memorable narrative.', steps: ['List items to remember', 'Create a narrative connecting all items', 'Make the story vivid and unusual', 'Retell the story to recall items'], difficulty: 'beginner' },
    { name: 'Major System', slug: 'major-system', category: 'numerical', description: 'Convert numbers into consonant sounds, then into words for easier memorization of numerical sequences.', steps: ['Learn the number-to-consonant mapping', 'Convert number sequences to consonants', 'Add vowels to form words', 'Create memorable images from words'], difficulty: 'advanced' },
    { name: 'PAO System', slug: 'pao-system', category: 'numerical', description: 'Person-Action-Object system for memorizing numbers. Assign a person, action, and object to each two-digit number.', steps: ['Create PAO for numbers 00-99', 'Practice until associations are automatic', 'Combine PAOs for longer number sequences', 'Use with Method of Loci for large sets'], difficulty: 'advanced' },
  ]

  for (const t of techniques) {
    await p.memoryTechnique.upsert({ where: { slug: t.slug }, update: t, create: t })
    console.log('Technique:', t.name)
  }

  // ── Seed Coach Insights ──
  const insights = [
    { type: 'inactivity', title: 'Welcome Back', description: 'Looks like you have been away. Even a single game per day keeps your memory sharp. Try a quick card match to warm up!', conditions: { activeDays: { lt: 3 } }, priority: 10 },
    { type: 'low_accuracy', title: 'Slow Down to Speed Up', description: 'Your accuracy has room to grow. Focus on encoding each item deliberately before moving on. Quality practice beats quantity.', conditions: { avgAccuracy: { lt: 60 } }, priority: 8 },
    { type: 'streak', title: 'Streak Master', description: 'Consistency is the number one predictor of memory improvement. You are building a great habit!', conditions: { streakDays: { gte: 7 } }, priority: 5 },
    { type: 'new_user', title: 'Getting Started', description: 'Start with Card Match to build your visual memory foundation, then try Sequence Recall for working memory.', conditions: { totalGames: { lt: 5 } }, priority: 15 },
    { type: 'plateau', title: 'Break Through', description: 'Try increasing the difficulty or switching to a different game type. Novelty challenges your brain in new ways.', conditions: { improvementRate: { lt: 2 }, gamesPlayed: { gte: 20 } }, priority: 7 },
    { type: 'high_performer', title: 'Elite Recall', description: 'Your performance is exceptional. Consider exploring advanced techniques like the PAO System or Major System.', conditions: { avgAccuracy: { gte: 90 }, level: { gte: 5 } }, priority: 3 },
  ]

  for (const ins of insights) {
    await p.coachInsight.upsert({
      where: { id: ins.type },
      update: { title: ins.title, description: ins.description, conditions: ins.conditions, priority: ins.priority },
      create: ins,
    })
    console.log('Insight:', ins.title)
  }

  // ── Seed Default Training Plan Templates (stored as AppConfig) ──
  const planTemplates = [
    {
      key: 'plan_template_beginner',
      label: 'Beginner 7-Day Plan',
      value: {
        name: 'Memory Foundations',
        goal: 'Build core memory skills',
        days: [
          { day: 1, game: 'card-match', technique: 'chunking' },
          { day: 2, game: 'sequence-recall', technique: 'spaced-repetition' },
          { day: 3, game: 'word-association', technique: 'story-method' },
          { day: 4, game: 'card-match', technique: 'chunking' },
          { day: 5, game: 'number-matrix', technique: 'method-of-loci' },
          { day: 6, game: 'sequence-recall', technique: 'spaced-repetition' },
          { day: 7, game: 'spatial-puzzle', technique: 'method-of-loci' },
        ],
      },
    },
    {
      key: 'plan_template_intermediate',
      label: 'Intermediate 7-Day Plan',
      value: {
        name: 'Memory Mastery',
        goal: 'Strengthen all memory types',
        days: [
          { day: 1, game: 'n-back', technique: 'method-of-loci' },
          { day: 2, game: 'face-name', technique: 'peg-system' },
          { day: 3, game: 'number-matrix', technique: 'chunking' },
          { day: 4, game: 'speed-sort', technique: 'story-method' },
          { day: 5, game: 'spatial-puzzle', technique: 'method-of-loci' },
          { day: 6, game: 'word-association', technique: 'peg-system' },
          { day: 7, game: 'n-back', technique: 'spaced-repetition' },
        ],
      },
    },
  ]

  for (const tmpl of planTemplates) {
    await p.appConfig.upsert({
      where: { key: tmpl.key },
      update: { value: tmpl.value, label: tmpl.label },
      create: tmpl,
    })
    console.log('Plan template:', tmpl.label)
  }

  // ── Seed Achievement Definitions (stored as AppConfig) ──
  const achievements = [
    { key: 'achievement_first_game', label: 'First Game', value: { name: 'First Steps', description: 'Complete your first memory game', icon: '🎯', xpBonus: 10 } },
    { key: 'achievement_streak_3', label: '3-Day Streak', value: { name: 'Consistent', description: 'Maintain a 3-day training streak', icon: '🔥', xpBonus: 20 } },
    { key: 'achievement_streak_7', label: '7-Day Streak', value: { name: 'Dedicated', description: 'Maintain a 7-day training streak', icon: '💪', xpBonus: 50 } },
    { key: 'achievement_streak_30', label: '30-Day Streak', value: { name: 'Unstoppable', description: 'Maintain a 30-day training streak', icon: '⚡', xpBonus: 200 } },
    { key: 'achievement_perfect', label: 'Perfect Score', value: { name: 'Flawless', description: 'Achieve 100% accuracy in any game', icon: '💎', xpBonus: 30 } },
    { key: 'achievement_all_games', label: 'All Games', value: { name: 'Explorer', description: 'Play every available game at least once', icon: '🗺️', xpBonus: 40 } },
    { key: 'achievement_level_5', label: 'Level 5', value: { name: 'Rising Star', description: 'Reach level 5', icon: '⭐', xpBonus: 25 } },
    { key: 'achievement_level_10', label: 'Level 10', value: { name: 'Memory Master', description: 'Reach level 10', icon: '👑', xpBonus: 100 } },
    { key: 'achievement_100_games', label: '100 Games', value: { name: 'Centurion', description: 'Complete 100 game sessions', icon: '🏅', xpBonus: 75 } },
    { key: 'achievement_speed_demon', label: 'Speed Demon', value: { name: 'Speed Demon', description: 'Complete a game in under 30 seconds', icon: '⚡', xpBonus: 30 } },
  ]

  for (const ach of achievements) {
    await p.appConfig.upsert({
      where: { key: ach.key },
      update: { value: ach.value, label: ach.label },
      create: ach,
    })
    console.log('Achievement:', ach.label)
  }

  await p.$disconnect()
  console.log('\nMemoryForge v2 seed complete!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
