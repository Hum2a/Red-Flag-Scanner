import { useEffect, useState } from 'react'
import { getStats } from '@/lib/api'

export default function Stats() {
  const [totalScans, setTotalScans] = useState<number | null>(null)

  useEffect(() => {
    getStats()
      .then(({ totalScans: t }) => setTotalScans(t))
      .catch(() => setTotalScans(null))
  }, [])

  if (totalScans === null) return null

  return (
    <p className="text-sm text-[var(--color-text-muted)]">
      {totalScans.toLocaleString()} profiles scanned so far
    </p>
  )
}
