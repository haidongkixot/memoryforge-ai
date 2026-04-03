import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const games = [
  { name: 'Card Match', slug: 'card-match', category: 'visual-memory', difficulty: 'beginner', description: 'Classic memory card matching game. Flip cards to find matching pairs. Trains visual memory and spatial recall.', benefits: ['Improves short-term visual memory', 'Enhances pattern recognition', 'Builds concentration'], rules: ['Flip two cards per turn', 'Match all pairs to win', 'Fewer moves = higher score'], gameType: 'match', gridSize: 4, timeLimit: 120, maxLevel: 10, sortOrder: 1 },
  { name: 'Sequence Recall', slug: 'sequence-recall', category: 'working-memory', difficulty: 'beginner', description: 'Remember and reproduce increasingly long sequences of colors and positions. Based on the classic Simon game.', benefits: ['Strengthens working memory capacity', 'Improves sequential processing', 'Builds auditory-visual integration'], rules: ['Watch the sequence carefully', 'Repeat the sequence in order', 'Each level adds one more step'], gameType: 'sequence', gridSize: 4, timeLimit: 0, maxLevel: 20, sortOrder: 2 },
  { name: 'Word Memory', slug: 'word-memory', category: 'verbal-memory', difficulty: 'intermediate', description: 'Memorize a list of words, then recall as many as possible. Trains verbal working memory.', benefits: ['Improves verbal recall', 'Expands vocabulary retention', 'Boosts language processing speed'], rules: ['Study the word list for 30 seconds', 'Recall as many words as possible', 'More words = higher score'], gameType: 'word', gridSize: 0, timeLimit: 60, maxLevel: 15, sortOrder: 3 },
  { name: 'Number Matrix', slug: 'number-matrix', category: 'numerical-memory', difficulty: 'intermediate', description: 'Memorize a matrix of numbers, then reproduce it from memory. Trains numerical and spatial memory.', benefits: ['Enhances numerical memory', 'Builds mental math ability', 'Trains working memory capacity'], rules: ['Study the number matrix', 'Fill it in from memory', 'Accuracy and speed both matter'], gameType: 'matrix', gridSize: 5, timeLimit: 45, maxLevel: 12, sortOrder: 4 },
  { name: 'N-Back Trainer', slug: 'n-back', category: 'working-memory', difficulty: 'advanced', description: 'The gold-standard working memory training task. Remember the position from N steps back.', benefits: ['Increases fluid intelligence', 'Strengthens working memory', 'Improves multitasking ability'], rules: ['Watch for positions matching N steps ago', 'Press when pattern repeats', 'Higher N = harder challenge'], gameType: 'nback', gridSize: 3, timeLimit: 0, maxLevel: 10, sortOrder: 5 },
  { name: 'Face Name Match', slug: 'face-name', category: 'associative-memory', difficulty: 'beginner', description: 'Match faces to names — one of the most practical memory skills for daily life.', benefits: ['Improves social memory', 'Trains face recognition', 'Builds association skills'], rules: ['Study faces and names', 'Match face to correct name', 'Time pressure increases difficulty'], gameType: 'association', gridSize: 0, timeLimit: 90, maxLevel: 8, sortOrder: 6 },
  { name: 'Lightning Tap', slug: 'lightning-tap', category: 'processing-speed', difficulty: 'beginner', description: 'Tap glowing targets as fast as possible. Tests your reaction time and processing speed under pressure.', benefits: ['Reaction time', 'Processing speed', 'Focus'], rules: ['Tap the lit circle as fast as you can', 'Faster taps earn more points', 'Wrong taps lose 10 points'], gameType: 'speed', gridSize: 4, timeLimit: 60, maxLevel: 5, sortOrder: 7 },
  { name: 'Speed Matrix', slug: 'speed-matrix', category: 'processing-speed', difficulty: 'intermediate', description: 'A larger speed tap grid with tighter timing. Push your processing speed to the limit.', benefits: ['Advanced reaction time', 'Processing speed', 'Sustained attention'], rules: ['Tap the lit circle on a 5x5 grid', 'Only 45 seconds — pace is faster', 'Accuracy and speed both matter'], gameType: 'speed', gridSize: 5, timeLimit: 45, maxLevel: 8, sortOrder: 8 },
  { name: 'Pattern Recall', slug: 'pattern-recall', category: 'spatial-memory', difficulty: 'beginner', description: 'Remember a colored pattern on a grid, then reproduce it from memory. Trains spatial and visual memory.', benefits: ['Spatial memory', 'Visual pattern recognition', 'Working memory'], rules: ['Study the colored pattern for 15 seconds', 'Click cells to reproduce the pattern', 'Higher accuracy = higher score'], gameType: 'spatial', gridSize: 4, timeLimit: 60, maxLevel: 8, sortOrder: 9 },
  { name: 'Spatial Matrix', slug: 'spatial-matrix', category: 'spatial-memory', difficulty: 'intermediate', description: 'A larger 5x5 spatial pattern challenge with more cells to remember. Tests extended spatial memory.', benefits: ['Extended spatial memory', 'Pattern recognition', 'Visual-spatial processing'], rules: ['Study a 5x5 colored pattern', 'Reproduce from memory', 'More cells means higher difficulty'], gameType: 'spatial', gridSize: 5, timeLimit: 60, maxLevel: 10, sortOrder: 10 },
  { name: 'Word Association', slug: 'word-association', category: 'verbal-memory', difficulty: 'intermediate', description: 'See a word, pick the most closely associated word from 4 options. Tests semantic memory and verbal reasoning.', benefits: ['Verbal memory', 'Semantic processing', 'Association building'], rules: ['Pick the associated word from 4 options', 'Faster answers earn bonus points', '20 rounds per game'], gameType: 'verbal', gridSize: 0, timeLimit: 120, maxLevel: 10, sortOrder: 11 },
  { name: 'Word Chain', slug: 'word-chain', category: 'cognitive-training', difficulty: 'advanced', description: 'Advanced verbal memory challenge with complex vocabulary. Memorize and recall a long list of challenging words.', benefits: ['Vocabulary retention', 'Verbal working memory', 'Language processing speed'], rules: ['Study the word list for 30 seconds', 'Recall as many words as possible', 'Advanced vocabulary tests deeper memory'], gameType: 'word', gridSize: 0, timeLimit: 90, maxLevel: 15, sortOrder: 12 },
]

const techniques = [
  { name: 'Memory Palace', slug: 'memory-palace', category: 'spatial', difficulty: 'intermediate', description: 'Associate information with specific locations in a familiar place to recall ordered information.', steps: ['Choose a familiar location (home, school, route)', 'Create a vivid mental walkthrough with distinct waypoints', 'Place items to remember at specific locations', 'Walk through mentally to recall — in order'] },
  { name: 'Spaced Repetition', slug: 'spaced-repetition', category: 'retention', difficulty: 'beginner', description: 'Review information at increasing intervals to combat the forgetting curve.', steps: ['Review new material immediately after learning', 'Review again after 1 day', 'Review after 3 days', 'Review after 1 week', 'Review after 1 month'] },
  { name: 'Method of Loci', slug: 'method-of-loci', category: 'spatial', difficulty: 'advanced', description: 'Ancient Greek technique using spatial memory to recall ordered information along a mental route.', steps: ['Select a familiar route (walk to work, through your home)', 'Identify 10+ distinct waypoints along the route', 'Encode each piece of information as a vivid image at each waypoint', 'Mentally walk the route to recall information in sequence'] },
  { name: 'Chunking', slug: 'chunking', category: 'working-memory', difficulty: 'beginner', description: 'Group related items into meaningful chunks to expand effective working memory capacity.', steps: ['Identify patterns or relationships in the information', 'Group 3-4 related items into a meaningful unit', 'Create a label or association for each chunk', 'Recall chunks instead of individual items'] },
  { name: 'PAO System', slug: 'pao-system', category: 'numerical', difficulty: 'advanced', description: 'Person-Action-Object system for memorizing numbers, cards, and long sequences.', steps: ['Assign a Person to each 2-digit number (00-99)', 'Assign an Action to each (what they\'re doing)', 'Assign an Object to each', 'Encode 6-digit numbers as 3 PAO combinations in a memory palace'] },
]

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d }

async function main() {
  console.log('🧠 Seeding MemoryForge AI...')

  // Games
  for (const g of games) {
    await prisma.game.upsert({ where: { slug: g.slug }, update: g, create: g })
  }
  console.log('  ✓ Games')

  // Memory Techniques
  for (const t of techniques) {
    await prisma.memoryTechnique.upsert({ where: { slug: t.slug }, update: t, create: t })
  }
  console.log('  ✓ Memory Techniques')

  // Coach Insights
  const insights = [
    { type: 'plateau_detected', title: "You've Hit a Plateau", description: "Your scores have been flat for 5+ days. Time to challenge yourself with a harder game or try a new memory technique.", conditions: { consecutiveDaysFlat: 5 }, priority: 8 },
    { type: 'strength_identified', title: 'Visual Memory is Your Superpower', description: 'Your accuracy in card-matching games consistently exceeds 90%. Consider advanced visual memory techniques like the Memory Palace.', conditions: { memoryType: 'visual-memory', minAccuracy: 90 }, priority: 5 },
    { type: 'consistency_drop', title: 'Practice Streak in Danger', description: "You haven't practiced today and your streak is at risk. Even 5 minutes counts!", conditions: { hoursWithoutPractice: 20 }, priority: 9 },
    { type: 'new_pb', title: 'Personal Best Achieved! 🏆', description: 'You just beat your personal best score. Your memory is measurably improving — this is the compound effect of consistent practice.', conditions: { isPersonalBest: true }, priority: 6 },
  ]
  for (const insight of insights) {
    try { await prisma.coachInsight.create({ data: insight }) } catch { /* skip if exists */ }
  }
  console.log('  ✓ Coach Insights')

  // App Config
  for (const [key, value, label] of [
    ['max_daily_games', 20, 'Maximum games per day (free)'],
    ['xp_per_game', 15, 'XP awarded per completed game'],
    ['perfect_score_bonus', 50, 'Bonus XP for accuracy > 95%'],
    ['streak_bonus_xp', 10, 'Daily streak bonus XP'],
    ['maintenance_mode', false, 'Maintenance mode toggle'],
  ] as const) {
    await prisma.appConfig.upsert({ where: { key }, update: {}, create: { key, value, label } })
  }
  console.log('  ✓ App Config')

  // Users
  const adminHash = await bcrypt.hash('admin123!', 12)
  const demoHash = await bcrypt.hash('demo1234', 12)

  const admin = await prisma.user.upsert({ where: { email: 'admin@memoryforge.ai' }, update: {}, create: { email: 'admin@memoryforge.ai', name: 'Admin', password: adminHash, role: 'admin' } })
  const sarah = await prisma.user.upsert({ where: { email: 'sarah.chen@example.com' }, update: {}, create: { email: 'sarah.chen@example.com', name: 'Sarah Chen', password: demoHash } })
  const marcus = await prisma.user.upsert({ where: { email: 'marcus.johnson@example.com' }, update: {}, create: { email: 'marcus.johnson@example.com', name: 'Marcus Johnson', password: demoHash } })
  const emma = await prisma.user.upsert({ where: { email: 'emma.wilson@example.com' }, update: {}, create: { email: 'emma.wilson@example.com', name: 'Emma Wilson', password: demoHash } })
  const alex = await prisma.user.upsert({ where: { email: 'alex.rivera@example.com' }, update: {}, create: { email: 'alex.rivera@example.com', name: 'Alex Rivera', password: demoHash } })
  console.log('  ✓ Users')

  // Game Sessions
  const allGames = await prisma.game.findMany({ select: { id: true, slug: true } })
  const gameMap: Record<string, string> = {}
  for (const g of allGames) gameMap[g.slug] = g.id

  // Game Content Packs (default word lists, word pairs, face data)
  const wordMemoryId = gameMap['word-memory']
  const wordChainId = gameMap['word-chain']
  const wordAssocId = gameMap['word-association']
  const faceNameId = gameMap['face-name']

  if (wordMemoryId) {
    const wordContentPacks = [
      { gameId: wordMemoryId, contentType: 'word_list', difficulty: 'beginner', label: 'Default Beginner', content: { words: ['apple', 'blue', 'chair', 'dance', 'eagle', 'fish', 'green', 'house', 'island', 'jacket', 'kite', 'lemon'] } },
      { gameId: wordMemoryId, contentType: 'word_list', difficulty: 'intermediate', label: 'Default Intermediate', content: { words: ['abstract', 'balance', 'cascade', 'derive', 'eclipse', 'fracture', 'glimpse', 'horizon', 'ignite', 'journal', 'kinetic', 'lattice', 'memoir', 'nucleus'] } },
      { gameId: wordMemoryId, contentType: 'word_list', difficulty: 'advanced', label: 'Default Advanced', content: { words: ['ambiguous', 'Byzantine', 'clandestine', 'dilemma', 'ephemeral', 'furtive', 'gregarious', 'hypothesis', 'insidious', 'juxtapose', 'kaleidoscope', 'labyrinth'] } },
    ]
    for (const pack of wordContentPacks) {
      const existing = await prisma.gameContent.findFirst({ where: { gameId: pack.gameId, label: pack.label } })
      if (!existing) await prisma.gameContent.create({ data: pack })
    }
  }

  if (wordChainId) {
    const wordChainPacks = [
      { gameId: wordChainId, contentType: 'word_list', difficulty: 'advanced', label: 'Default Advanced', content: { words: ['ambiguous', 'Byzantine', 'clandestine', 'dilemma', 'ephemeral', 'furtive', 'gregarious', 'hypothesis', 'insidious', 'juxtapose', 'kaleidoscope', 'labyrinth'] } },
    ]
    for (const pack of wordChainPacks) {
      const existing = await prisma.gameContent.findFirst({ where: { gameId: pack.gameId, label: pack.label } })
      if (!existing) await prisma.gameContent.create({ data: pack })
    }
  }

  if (wordAssocId) {
    const pairs = [
      { target: 'Ocean', answer: 'Wave', distractors: ['Mountain', 'Desert', 'Forest'] },
      { target: 'Piano', answer: 'Music', distractors: ['Painting', 'Sculpture', 'Dance'] },
      { target: 'Doctor', answer: 'Hospital', distractors: ['School', 'Library', 'Stadium'] },
      { target: 'Night', answer: 'Moon', distractors: ['Flower', 'River', 'Cloud'] },
      { target: 'Winter', answer: 'Snow', distractors: ['Sand', 'Leaf', 'Rain'] },
      { target: 'Book', answer: 'Library', distractors: ['Kitchen', 'Garage', 'Garden'] },
      { target: 'Fire', answer: 'Smoke', distractors: ['Ice', 'Wind', 'Earth'] },
      { target: 'Crown', answer: 'King', distractors: ['Chef', 'Pilot', 'Artist'] },
      { target: 'Telescope', answer: 'Stars', distractors: ['Trees', 'Rocks', 'Waves'] },
      { target: 'Pencil', answer: 'Paper', distractors: ['Glass', 'Metal', 'Clay'] },
      { target: 'Bee', answer: 'Honey', distractors: ['Milk', 'Juice', 'Water'] },
      { target: 'Camera', answer: 'Photo', distractors: ['Song', 'Story', 'Recipe'] },
      { target: 'Lock', answer: 'Key', distractors: ['Rope', 'Chain', 'Wire'] },
      { target: 'Compass', answer: 'Direction', distractors: ['Speed', 'Weight', 'Color'] },
      { target: 'Thunder', answer: 'Lightning', distractors: ['Rainbow', 'Sunset', 'Breeze'] },
      { target: 'Nest', answer: 'Bird', distractors: ['Fish', 'Cat', 'Horse'] },
      { target: 'Brush', answer: 'Paint', distractors: ['Glue', 'Tape', 'Nail'] },
      { target: 'Anchor', answer: 'Ship', distractors: ['Plane', 'Train', 'Car'] },
      { target: 'Seed', answer: 'Plant', distractors: ['Rock', 'Sand', 'Mud'] },
      { target: 'Clock', answer: 'Time', distractors: ['Space', 'Sound', 'Light'] },
      { target: 'Helmet', answer: 'Safety', distractors: ['Beauty', 'Comfort', 'Speed'] },
      { target: 'Map', answer: 'Journey', distractors: ['Recipe', 'Puzzle', 'Game'] },
      { target: 'Stethoscope', answer: 'Heartbeat', distractors: ['Footstep', 'Whisper', 'Echo'] },
      { target: 'Feather', answer: 'Light', distractors: ['Heavy', 'Dark', 'Loud'] },
      { target: 'Diamond', answer: 'Precious', distractors: ['Common', 'Cheap', 'Rough'] },
      { target: 'Volcano', answer: 'Eruption', distractors: ['Erosion', 'Flood', 'Drought'] },
      { target: 'Magnifying', answer: 'Glass', distractors: ['Plastic', 'Wood', 'Stone'] },
      { target: 'Bread', answer: 'Butter', distractors: ['Ketchup', 'Mustard', 'Vinegar'] },
      { target: 'Stage', answer: 'Performance', distractors: ['Storage', 'Parking', 'Shipping'] },
      { target: 'Thread', answer: 'Needle', distractors: ['Hammer', 'Wrench', 'Drill'] },
    ]
    const existing = await prisma.gameContent.findFirst({ where: { gameId: wordAssocId, label: 'Default' } })
    if (!existing) {
      await prisma.gameContent.create({ data: { gameId: wordAssocId, contentType: 'word_pair', difficulty: 'intermediate', label: 'Default', content: { pairs } } })
    }
  }

  if (faceNameId) {
    const faces = [
      { emoji: '😊', name: 'Sarah Chen', job: 'Teacher' },
      { emoji: '😎', name: 'Marcus Lee', job: 'Chef' },
      { emoji: '🤔', name: 'Emma Park', job: 'Doctor' },
      { emoji: '😄', name: 'David Kim', job: 'Engineer' },
      { emoji: '🙂', name: 'Aisha Johnson', job: 'Artist' },
      { emoji: '😁', name: 'Lucas Brown', job: 'Writer' },
      { emoji: '😍', name: 'Priya Patel', job: 'Musician' },
      { emoji: '🤗', name: 'Carlos Rivera', job: 'Pilot' },
    ]
    const existing = await prisma.gameContent.findFirst({ where: { gameId: faceNameId, label: 'Default' } })
    if (!existing) {
      await prisma.gameContent.create({ data: { gameId: faceNameId, contentType: 'face_data', difficulty: 'beginner', label: 'Default', content: { faces } } })
    }
  }
  console.log('  ✓ Game Content Packs')

  const sessionsConfig = [
    { user: sarah, sessions: [
      ...Array.from({length:10}, (_,i) => ({ gameSlug: 'card-match', score: 850+i*115, level: 4+Math.floor(i/3), accuracy: 82+i*1.4, duration: 90+i*10, movesCount: 18+i, daysAgo: i+1 })),
      ...Array.from({length:8}, (_,i) => ({ gameSlug: 'sequence-recall', score: 620+i*103, level: 5+Math.floor(i/3), accuracy: 75+i*2.1, duration: 120+i*15, movesCount: 12+i, daysAgo: i+2 })),
      ...Array.from({length:7}, (_,i) => ({ gameSlug: 'word-memory', score: 720+i*68, level: 4+Math.floor(i/3), accuracy: 80+i*2.1, duration: 60+i*5, movesCount: 0, daysAgo: i+3 })),
      ...Array.from({length:5}, (_,i) => ({ gameSlug: 'n-back', score: 350+i*86, level: 2+i, accuracy: 68+i*2.8, duration: 180+i*20, movesCount: 0, daysAgo: i+4 })),
    ]},
    { user: marcus, sessions: [
      ...Array.from({length:8}, (_,i) => ({ gameSlug: 'card-match', score: 650+i*94, level: 3+Math.floor(i/3), accuracy: 70+i*2, duration: 100+i*10, movesCount: 20+i, daysAgo: i+1 })),
      ...Array.from({length:5}, (_,i) => ({ gameSlug: 'sequence-recall', score: 420+i*94, level: 3+Math.floor(i/2), accuracy: 68+i*2.4, duration: 90+i*12, movesCount: 10+i, daysAgo: i+2 })),
      ...Array.from({length:5}, (_,i) => ({ gameSlug: 'number-matrix', score: 380+i*68, level: 2+i, accuracy: 65+i*2.8, duration: 45+i*5, movesCount: 0, daysAgo: i+3 })),
    ]},
    { user: emma, sessions: [
      { gameSlug: 'card-match', score: 280, level: 1, accuracy: 60, duration: 120, movesCount: 24, daysAgo: 3 },
      { gameSlug: 'card-match', score: 410, level: 1, accuracy: 67, duration: 105, movesCount: 21, daysAgo: 2 },
      { gameSlug: 'card-match', score: 540, level: 2, accuracy: 72, duration: 95, movesCount: 19, daysAgo: 1 },
      { gameSlug: 'sequence-recall', score: 180, level: 1, accuracy: 62, duration: 60, movesCount: 8, daysAgo: 2 },
      { gameSlug: 'sequence-recall', score: 320, level: 2, accuracy: 71, duration: 75, movesCount: 9, daysAgo: 1 },
    ]},
    { user: alex, sessions: [
      ...Array.from({length:8}, (_,i) => ({ gameSlug: 'n-back', score: 780+i*97, level: 3+i, accuracy: 73+i*1.1, duration: 240+i*20, movesCount: 0, daysAgo: i+1 })),
      ...Array.from({length:7}, (_,i) => ({ gameSlug: 'sequence-recall', score: 1200+i*129, level: 7+i, accuracy: 85+i*0.9, duration: 150+i*20, movesCount: 14+i, daysAgo: i+2 })),
      ...Array.from({length:7}, (_,i) => ({ gameSlug: 'card-match', score: 1500+i*129, level: 6+i, accuracy: 88+i*0.6, duration: 80+i*8, movesCount: 15+i, daysAgo: i+3 })),
    ]},
  ]

  for (const { user, sessions } of sessionsConfig) {
    for (const s of sessions) {
      const gameId = gameMap[s.gameSlug]
      if (!gameId) continue
      await prisma.gameSession.create({
        data: { userId: user.id, gameId, score: s.score, level: s.level, accuracy: s.accuracy, duration: s.duration, movesCount: s.movesCount, completedAt: daysAgo(s.daysAgo) },
      })
    }
    console.log(`  ✓ Game sessions: ${user.name}`)
  }

  // XP Ledger
  for (let i = 0; i < 15; i++) {
    await prisma.xpLedger.create({ data: { userId: sarah.id, amount: i % 3 === 0 ? 50 : 15, reason: i % 3 === 0 ? 'perfect_score' : 'game_complete', createdAt: daysAgo(i) } })
  }
  for (let i = 0; i < 8; i++) {
    await prisma.xpLedger.create({ data: { userId: marcus.id, amount: 15, reason: 'game_complete', createdAt: daysAgo(i) } })
  }
  for (const u of [emma, alex]) {
    for (let i = 0; i < 5; i++) {
      await prisma.xpLedger.create({ data: { userId: u.id, amount: 15, reason: 'game_complete', createdAt: daysAgo(i) } })
    }
  }
  console.log('  ✓ XP Ledger')

  // Streaks
  const streakRows = [
    { user: sarah, currentCount: 18, longestCount: 21 },
    { user: marcus, currentCount: 9, longestCount: 14 },
    { user: emma, currentCount: 3, longestCount: 3 },
    { user: alex, currentCount: 14, longestCount: 18 },
  ]
  for (const { user, currentCount, longestCount } of streakRows) {
    await prisma.streak.upsert({ where: { userId_type: { userId: user.id, type: 'daily_play' } }, update: {}, create: { userId: user.id, type: 'daily_play', currentCount, longestCount, lastActiveAt: daysAgo(0) } })
  }
  console.log('  ✓ Streaks')

  // DailyStats for Sarah (last 7 days)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(); date.setDate(date.getDate() - i); date.setHours(0,0,0,0)
    try {
      await prisma.dailyStat.upsert({
        where: { userId_date: { userId: sarah.id, date } },
        update: {},
        create: { userId: sarah.id, date, gamesPlayed: 2+Math.floor(Math.random()*3), totalScore: 1800+Math.floor(Math.random()*800), totalXp: 30+Math.floor(Math.random()*70), avgAccuracy: 80+Math.random()*12, bestAccuracy: 88+Math.random()*10, totalDuration: 180+Math.floor(Math.random()*120) },
      })
    } catch { /* skip */ }
  }
  console.log('  ✓ Daily Stats')

  // Memory Profiles for Sarah
  for (const [memoryType, strengthScore, improvementRate] of [
    ['visual-memory', 78, 3.2], ['working-memory', 72, 4.1], ['verbal-memory', 85, 2.8], ['numerical-memory', 65, 5.0],
  ] as const) {
    await prisma.memoryProfile.upsert({ where: { userId_memoryType: { userId: sarah.id, memoryType } }, update: {}, create: { userId: sarah.id, memoryType, strengthScore, improvementRate } })
  }
  console.log('  ✓ Memory Profiles')

  // Training Plan for Sarah
  const plan = await prisma.trainingPlan.create({
    data: { userId: sarah.id, name: '30-Day Memory Mastery', goal: 'Improve working memory to N-Back level 5', status: 'active', startDate: daysAgo(7) },
  })
  const cardMatchId = gameMap['card-match']
  const sequenceId = gameMap['sequence-recall']
  for (let day = 1; day <= 7; day++) {
    await prisma.trainingPlanItem.create({
      data: { planId: plan.id, dayNumber: day, gameId: day % 2 === 0 ? sequenceId : cardMatchId, targetScore: 800 + day * 100, completed: day <= 5, completedAt: day <= 5 ? daysAgo(7 - day) : null },
    })
  }
  console.log('  ✓ Training Plan')

  // Coach Messages
  const coachMsgs = [
    { userId: sarah.id, role: 'user', content: 'My card match scores have plateaued around 1400. How do I break through?' },
    { userId: sarah.id, role: 'assistant', content: 'Plateaus happen when your current strategy has maxed out. Try this: before flipping each card, predict its position out loud. This forces active encoding rather than passive recognition. Also, group cards by visual similarity — colors, shapes, patterns. Your accuracy data shows 88% — the ceiling is strategy, not capacity. You should see a 15-20% score jump within 5 sessions.' },
    { userId: sarah.id, role: 'user', content: 'What memory technique would help most for my job as a software developer?' },
    { userId: sarah.id, role: 'assistant', content: "For developers, the Method of Loci works beautifully for API structures and system architectures. Imagine your codebase as a building — each service is a room, each function a piece of furniture. Your N-Back scores suggest strong working memory capacity — leverage that for mentally simulating code execution flows. I'd also recommend the Chunking technique for memorizing variable names and patterns: group them into meaningful clusters rather than trying to remember each one individually." },
  ]
  for (const msg of coachMsgs) {
    await prisma.coachMessage.create({ data: msg })
  }
  console.log('  ✓ Coach Messages')

  // User Achievements
  const achievementRows = [
    { user: sarah, achievements: ['first_game', 'week_streak', 'accuracy_master', 'hundred_sessions'] },
    { user: marcus, achievements: ['first_game', 'week_streak'] },
    { user: emma, achievements: ['first_game'] },
    { user: alex, achievements: ['first_game', 'week_streak', 'speed_demon', 'accuracy_master'] },
  ]
  for (const { user, achievements } of achievementRows) {
    for (const achievement of achievements) {
      await prisma.userAchievement.upsert({ where: { userId_achievement: { userId: user.id, achievement } }, update: {}, create: { userId: user.id, achievement } })
    }
  }
  console.log('  ✓ Achievements')

  // System Logs
  await prisma.systemLog.createMany({ data: [
    { level: 'info', message: 'Daily stats aggregation completed', context: { usersProcessed: 284, duration: '2.3s' }, source: 'cron' },
    { level: 'info', message: 'Memory profile recalculation completed', context: { profiles: 284 * 4, duration: '8.1s' }, source: 'cron' },
    { level: 'warn', message: 'Game session scoring anomaly detected — score > theoretical maximum', context: { gameSlug: 'n-back', score: 99999 }, source: 'api' },
    { level: 'error', message: 'AI coaching service timeout after 30s', context: { userId: 'cm_test', timeout: 30000 }, source: 'api' },
  ]})
  console.log('  ✓ System Logs')

  // Activity Logs
  await prisma.activityLog.createMany({ data: [
    { userId: admin.id, action: 'game_updated', entity: 'game', entityId: gameMap['n-back'], metadata: { field: 'maxLevel', from: 8, to: 10 } },
    { userId: admin.id, action: 'user_viewed', entity: 'user', entityId: sarah.id },
    { userId: sarah.id, action: 'game_played', entity: 'game_session', metadata: { game: 'card-match', score: 1420 } },
    { userId: marcus.id, action: 'achievement_unlocked', entity: 'achievement', metadata: { achievement: 'week_streak' } },
  ]})
  console.log('  ✓ Activity Logs')

  // AI Configs
  const aiConfigs = [
    {
      contentType: 'game_content',
      model: 'gpt-4o-mini',
      temperature: 0.9,
      maxTokens: 1000,
      systemPrompt: 'You are a game content designer for a brain training app. Return ONLY valid JSON, no markdown.',
      isActive: true,
    },
    {
      contentType: 'blog_post',
      model: 'gpt-4o-mini',
      temperature: 0.8,
      maxTokens: 1500,
      systemPrompt: 'You are an expert content writer specializing in cognitive science, memory improvement, and brain health. Return ONLY valid JSON, no markdown fences.',
      isActive: true,
    },
  ]
  for (const cfg of aiConfigs) {
    await prisma.aIConfig.upsert({
      where: { contentType: cfg.contentType },
      update: {},
      create: cfg,
    })
  }
  console.log('  ✓ AI Configs')

  console.log('\n🎉 MemoryForge seed complete!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
