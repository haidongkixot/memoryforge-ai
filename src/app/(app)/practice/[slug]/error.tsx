'use client'

import { useEffect } from 'react'

export default function PracticeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Practice error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-sm">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Failed to load practice</h2>
        <p className="text-gray-500 mb-4 text-sm">
          This is usually temporary. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-[#593CC8] text-white rounded-full text-sm font-medium hover:bg-[#4A2FB5] transition-colors"
          >
            Try again
          </button>
          <a
            href="/library"
            className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Back to library
          </a>
        </div>
      </div>
    </div>
  )
}
