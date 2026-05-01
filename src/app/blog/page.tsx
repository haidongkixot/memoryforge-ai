import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

const FALLBACK_POSTS = [
  { slug: 'memory-palace', title: 'The Memory Palace Technique Explained', excerpt: 'Learn how ancient Greek orators memorized entire speeches using mental architecture — and how you can too.', date: '2026-03-20', category: 'Technique' },
  { slug: 'n-back-training', title: 'N-Back Training: Science vs. Hype', excerpt: 'Does dual n-back training actually improve fluid intelligence? We examine the research.', date: '2026-03-12', category: 'Science' },
  { slug: 'spaced-repetition', title: 'Spaced Repetition: The Ultimate Memory Tool', excerpt: 'Why forgetting is actually good for memory, and how to use the forgetting curve to your advantage.', date: '2026-03-05', category: 'Strategy' },
  { slug: 'sleep-and-memory', title: 'Sleep: The Missing Link in Memory Training', excerpt: 'Your brain consolidates memories during sleep. Here is how to optimize your sleep for maximum retention.', date: '2026-02-25', category: 'Health' },
]

async function getBlogPosts() {
  try {
    const dbPosts = await (prisma as any).blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, excerpt: true, tags: true, publishedAt: true },
    })
    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? '',
        date: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : '',
        category: p.tags?.[0] ?? 'Insight',
      }))
    }
  } catch {
    // DB not ready — fall through to hardcoded
  }
  return FALLBACK_POSTS
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/illustrations/memoryforge-blog-actor-rehearses-lines-v1.png"
              alt="Actor rehearsing lines — disciplined practice for reliable recall"
              width={500}
              height={400}
              priority
              className="w-auto h-56 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#593CC8] mb-3">MemoryForge Blog</h1>
          <p className="text-[#6B7280]">Memory science, training techniques, and cognitive performance insights</p>
        </div>
        <div className="grid gap-6">
          {posts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-[#593CC8]/30 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#5DEAEA] uppercase tracking-wider bg-[#5DEAEA]/10 px-2 py-0.5 rounded-full">{post.category}</span>
                  <h2 className="text-xl font-bold text-[#1f2937] group-hover:text-[#593CC8] transition-colors mt-2 mb-2">{post.title}</h2>
                  <p className="text-[#6B7280] text-sm">{post.excerpt}</p>
                </div>
                <span className="text-xs text-[#6B7280] whitespace-nowrap flex-shrink-0 mt-1">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
