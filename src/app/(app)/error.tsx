'use client'

import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App section error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">&#x26A0;&#xFE0F;</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          An unexpected error occurred. This is usually temporary — please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-[#593CC8] text-white rounded-full font-medium hover:bg-[#4A2FB5] transition-colors"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-2.5 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
