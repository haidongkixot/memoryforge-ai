import Link from 'next/link'

const BLOG_POSTS = [
  { slug: 'memory-palace', title: 'The Memory Palace Technique Explained', excerpt: 'Learn how ancient Greek orators memorized entire speeches using mental architecture — and how you can too.', date: '2026-03-20', category: 'Technique' },
  { slug: 'n-back-training', title: 'N-Back Training: Science vs. Hype', excerpt: 'Does dual n-back training actually improve fluid intelligence? We examine the research.', date: '2026-03-12', category: 'Science' },
  { slug: 'spaced-repetition', title: 'Spaced Repetition: The Ultimate Memory Tool', excerpt: 'Why forgetting is actually good for memory, and how to use the forgetting curve to your advantage.', date: '2026-03-05', category: 'Strategy' },
  { slug: 'sleep-and-memory', title: 'Sleep: The Missing Link in Memory Training', excerpt: 'Your brain consolidates memories during sleep. Here is how to optimize your sleep for maximum retention.', date: '2026-02-25', category: 'Health' },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">MemoryForge Blog</h1>
          <p className="text-gray-400">Memory science, training techniques, and cognitive performance insights</p>
        </div>
        <div className="grid gap-6">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/40 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{post.category}</span>
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mt-1 mb-2">{post.title}</h2>
                  <p className="text-gray-400 text-sm">{post.excerpt}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 mt-1">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
