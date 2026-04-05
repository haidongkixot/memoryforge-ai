'use client'
import { useEffect, useState } from 'react'

export function useUserPlan() {
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/plan')
      .then(r => r.json())
      .then(d => setPlan(d.planSlug ?? 'free'))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { plan, loading }
}
