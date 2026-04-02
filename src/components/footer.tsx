import Link from 'next/link'

const footerLinks = {
  Product: [
    { name: 'Games', href: '/library' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Team', href: 'https://peeteeai.com/team', external: true },
    { name: 'Blog', href: 'https://peeteeai.com/blog', external: true },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  Ecosystem: [
    { name: 'BreathMaster AI', href: 'https://breathmaster-ai.vercel.app', external: true },
    { name: 'HabitOS AI', href: 'https://habitos-ai.vercel.app', external: true },
    { name: 'MemoryForge AI', href: '/' },
    { name: 'HarmonyMap AI', href: 'https://harmonymap-ai.vercel.app', external: true },
    { name: 'FocusFlow AI', href: 'https://focusflow-ai-mauve.vercel.app', external: true },
    { name: 'Seeneyu', href: 'https://seeneyu.com', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#1f2937] border-t border-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[#6366f1] font-semibold text-sm uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#5DEAEA] transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-[#5DEAEA] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#374151]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#6366f1] flex items-center justify-center text-white font-bold text-sm">
                MF
              </div>
              <div>
                <span className="text-white font-semibold">MemoryForge AI</span>
                <span className="text-gray-400 text-sm ml-2">A PeeTeeAI Product</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">&copy; 2026 PeeTeeAI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
