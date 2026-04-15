const APPS = [
  { name: 'BreathMaster', emoji: '🫁', url: 'https://breathmaster-ai.vercel.app', current: false },
  { name: 'HabitOS', emoji: '✅', url: 'https://habitos-ai.vercel.app', current: false },
  { name: 'HarmonyMap', emoji: '✨', url: 'https://harmonymap-ai.vercel.app', current: false },
  { name: 'MemoryForge', emoji: '🧠', url: 'https://memoryforge-ai.vercel.app', current: true },
  { name: 'FocusFlow', emoji: '⚡', url: 'https://focusflow-ai-mauve.vercel.app', current: false },
]

export default function EcosystemBar() {
  return (
    <div className="bg-[#EEF2FF] border-b border-[#E0E7FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-9 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] font-semibold text-[#6366F1]/60 uppercase tracking-widest shrink-0">
            HumanOS
          </span>
          <div className="w-px h-4 bg-[#C7D2FE] shrink-0" />
          <div className="flex items-center gap-1">
            {APPS.map((app) =>
              app.current ? (
                <span
                  key={app.name}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#593CC8] text-white text-[11px] font-semibold shrink-0"
                >
                  {app.emoji} {app.name}
                </span>
              ) : (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[#4B5563] hover:bg-[#E0E7FF] text-[11px] transition shrink-0"
                >
                  {app.emoji} {app.name}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
