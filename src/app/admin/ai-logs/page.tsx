'use client'
import { useEffect, useState } from 'react'

interface Log {
  id: string
  contentType: string
  action: string
  prompt: string
  result: any
  model: string
  tokensUsed: number | null
  durationMs: number | null
  status: string
  error: string | null
  adminId: string
  createdAt: string
}

export default function AILogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (filterType) params.set('contentType', filterType)
    if (filterStatus) params.set('status', filterStatus)
    fetch(`/api/admin/ai-logs?${params}`)
      .then(r => r.json())
      .then(d => { setLogs(d.logs); setTotal(d.total); setTotalPages(d.totalPages) })
      .finally(() => setLoading(false))
  }, [page, filterType, filterStatus])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Generation Logs</h1>
        <p className="text-gray-400 text-sm mt-1">{total} total generations logged</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value); setPage(1) }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Content Types</option>
          <option value="game_content">Game Content</option>
          <option value="blog_post">Blog Post</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-white mb-2">No Logs Yet</h2>
          <p className="text-gray-400">AI generation logs will appear here once content is generated.</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Content Type</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                  <th className="text-left px-4 py-3 font-medium">Model</th>
                  <th className="text-left px-4 py-3 font-medium">Tokens</th>
                  <th className="text-left px-4 py-3 font-medium">Duration</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <>
                    <tr
                      key={log.id}
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                      className="border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer text-gray-300"
                    >
                      <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs">{log.contentType}</td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3 text-xs">{log.model}</td>
                      <td className="px-4 py-3">{log.tokensUsed ?? '-'}</td>
                      <td className="px-4 py-3">{log.durationMs ? `${log.durationMs}ms` : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                    {expandedId === log.id && (
                      <tr key={`${log.id}-detail`}>
                        <td colSpan={7} className="px-4 py-4 bg-gray-950">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-gray-400 mb-1">Prompt</p>
                              <pre className="text-xs text-gray-300 bg-gray-900 rounded-lg p-3 whitespace-pre-wrap max-h-40 overflow-auto">{log.prompt}</pre>
                            </div>
                            {log.error ? (
                              <div>
                                <p className="text-xs font-medium text-red-400 mb-1">Error</p>
                                <pre className="text-xs text-red-300 bg-gray-900 rounded-lg p-3 whitespace-pre-wrap">{log.error}</pre>
                              </div>
                            ) : (
                              <div>
                                <p className="text-xs font-medium text-gray-400 mb-1">Result</p>
                                <pre className="text-xs text-gray-300 bg-gray-900 rounded-lg p-3 whitespace-pre-wrap max-h-60 overflow-auto">{JSON.stringify(log.result, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Page {page} of {totalPages} ({total} total)</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
