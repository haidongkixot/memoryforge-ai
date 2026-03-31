import { prisma } from '@/lib/prisma'

export default async function AdminLogsPage() {
  const [systemLogs, activityLogs] = await Promise.all([
    prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  const levelColors: Record<string, string> = {
    error: 'bg-red-500/20 text-red-400',
    warn: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400',
    debug: 'bg-gray-700 text-gray-400',
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">System Logs</h1>
        <p className="text-gray-400 text-sm mt-1">System and activity logs (last 50 each)</p>
      </div>

      {/* System Logs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white text-sm">System Logs</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Level</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono">
            {systemLogs.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No system logs</td></tr>
            ) : systemLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-800/30">
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[log.level] || levelColors.debug}`}>
                    {log.level.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300 text-xs max-w-md truncate">{log.message}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{log.source || '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Logs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white text-sm">Activity Logs</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {activityLogs.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No activity logs</td></tr>
            ) : activityLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-300 text-xs">{log.user?.name || log.user?.email || 'System'}</td>
                <td className="px-4 py-3 text-xs"><span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300">{log.action}</span></td>
                <td className="px-4 py-3 text-gray-500 text-xs">{log.entity || '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
