'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-sm">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Failed to load dashboard</h2>
        <p className="text-gray-500 mb-4 text-sm">
          This is usually temporary. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 bg-[#593CC8] text-white rounded-full text-sm font-medium hover:bg-[#4A2FB5] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
