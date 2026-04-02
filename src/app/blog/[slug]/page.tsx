import { notFound } from 'next/navigation'
import Link from 'next/link'

const POSTS: Record<string, { title: string; date: string; category: string; content: string }> = {
  'memory-palace': {
    title: 'The Memory Palace Technique Explained',
    date: 'March 20, 2026', category: 'Technique',
    content: `The Memory Palace (also called the Method of Loci) is one of the oldest and most powerful memory techniques known to humanity. First used by ancient Greek and Roman orators to memorize entire speeches, it remains one of the most effective memory tools available.

How It Works

A memory palace is a mental construct — an imaginary place you know well where you can "store" information by associating it with specific locations.

Step 1: Choose your palace
Pick a familiar place: your home, your school route, a park you know well. The more detail you can visualize, the better.

Step 2: Identify locations
Walk through your palace mentally and identify 10-20 distinct "stations" (the front door, the couch, the kitchen table, etc.)

Step 3: Place memories
Associate each piece of information with a specific station. Make the image vivid, unusual, or funny — the stranger, the more memorable.

Step 4: Walk the path
To recall, simply mentally walk through your palace and "see" the images at each station.

Why It Works

The technique works because it leverages your brain's exceptional spatial and visual memory systems, which are far stronger than rote verbal memory.

Practice with MemoryForge

Our spatial memory games are specifically designed to strengthen the mental imagery skills needed for effective memory palace construction.`
  },
  'n-back-training': {
    title: 'N-Back Training: Science vs. Hype',
    date: 'March 12, 2026', category: 'Science',
    content: `N-back training is one of the most studied cognitive training tasks in neuroscience. The basic task requires you to remember stimuli from n trials back and identify when the current stimulus matches.

The Research

Early studies (Jaeggi et al., 2008) reported dramatic gains in fluid intelligence from n-back training, sparking enormous excitement. However, subsequent meta-analyses have produced mixed results.

What the Evidence Shows

- Working memory capacity does improve with n-back practice
- Some transfer to related cognitive tasks occurs
- Far transfer to general fluid intelligence remains contested
- Regular practitioners report subjective improvements in attention and focus

The Bottom Line

N-back training is not a magic pill for intelligence, but it is a genuinely challenging cognitive exercise that improves working memory and sustained attention — both critical components of cognitive performance.

MemoryForge's n-back game progressively increases difficulty as your working memory expands, providing optimal challenge for continuous improvement.`
  },
  'spaced-repetition': {
    title: 'Spaced Repetition: The Ultimate Memory Tool',
    date: 'March 5, 2026', category: 'Strategy',
    content: `Spaced repetition is arguably the most efficient learning technique ever discovered. Based on the "forgetting curve" identified by Hermann Ebbinghaus in 1885, it uses the principle that information is best reviewed just before you are about to forget it.

The Forgetting Curve

Without review, we forget approximately 50% of new information within an hour, 70% within 24 hours, and nearly 90% within a week. Spaced repetition fights this curve.

How Spaced Repetition Works

Instead of reviewing information at fixed intervals, you space reviews based on how well you remember each item:
- Easy to recall → review in 2 weeks
- Somewhat difficult → review in 3 days
- Very difficult → review tomorrow

The Algorithm

Modern spaced repetition software (SRS) uses algorithms like SM-2 to calculate the optimal review interval for each piece of information.

Applications

- Language learning (vocabulary)
- Medical school (anatomy, pharmacology)
- Professional certifications
- General knowledge retention

MemoryForge integrates spaced repetition principles into our training system to maximize your long-term memory performance.`
  },
  'sleep-and-memory': {
    title: 'Sleep: The Missing Link in Memory Training',
    date: 'February 25, 2026', category: 'Health',
    content: `You can practice memory techniques all day, but without adequate sleep, your training will be far less effective. Sleep is not merely rest — it is an active cognitive process essential for memory consolidation.

What Happens During Sleep

During NREM (non-REM) slow-wave sleep, your brain replays the day's experiences, transferring them from short-term to long-term storage. During REM sleep, it makes connections between new and existing memories.

The Research Is Clear

- Sleep deprivation reduces memory consolidation by up to 40%
- A single night of 6 hours sleep causes measurable cognitive impairment
- A 20-minute nap after learning can boost retention by 20%
- Deep sleep is especially important for procedural and motor memories

Optimize Your Sleep for Memory

1. Maintain consistent sleep/wake times (even on weekends)
2. Aim for 7-9 hours for optimal cognitive performance
3. Keep your bedroom cool (65-68°F / 18-20°C)
4. Avoid screens 1 hour before bed (blue light suppresses melatonin)
5. Consider a short nap (10-20 min) after intensive training sessions

Training Without Sleep Is Wasted

If you are serious about improving your memory, sleep is non-negotiable. Schedule your MemoryForge sessions for times when you are well-rested, and always prioritize sleep over extra training.`
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug]
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog" className="text-[#593CC8] hover:text-[#4a30a8] text-sm mb-8 block font-medium">← Back to Blog</Link>
        <span className="text-xs font-semibold text-[#5DEAEA] uppercase tracking-wider bg-[#5DEAEA]/10 px-3 py-1 rounded-full">{post.category}</span>
        <h1 className="text-4xl font-bold text-[#593CC8] mt-4 mb-3">{post.title}</h1>
        <p className="text-[#6B7280] text-sm mb-10">{post.date}</p>
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="text-[#1f2937] leading-relaxed space-y-4 whitespace-pre-wrap">{post.content}</div>
        </div>
      </div>
    </div>
  )
}
