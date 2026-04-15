'use client'

import { useEffect } from 'react'

export default function InviteTracker({ code }: { code: string }) {
  useEffect(() => {
    // Track referral click (fire and forget)
    fetch('/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }).catch(() => {
      // Silent fail — tracking is non-critical
    })
  }, [code])

  return null
}
