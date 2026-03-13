import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '@/lib/api'

interface HistoryItem {
  id: string
  identifier: string
  createdAt: string
}

export default function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">Loading history...</p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        No scans yet. Upload a photo or scan a profile to get started.
      </p>
    )
  }

  return (
    <ul className="space-y-2" role="list">
      {items.map((item, i) => (
        <li
          key={item.id}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 hover:-translate-x-1 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]"
          style={{
            animation: 'fadeSlideIn 0.4s ease-out forwards',
            opacity: 0,
            animationDelay: `${i * 60}ms`,
          }}
        >
          <Link
            to={`/r/${item.id}`}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-medium text-[var(--color-text)]">
              {item.identifier}
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
