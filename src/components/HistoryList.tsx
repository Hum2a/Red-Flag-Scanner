import { useEffect, useState } from 'react'
import { getHistory, getHistoryItem } from '@/lib/api'

interface HistoryItem {
  id: string
  identifier: string
  createdAt: string
}

export default function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedFlags, setExpandedFlags] = useState<Record<string, string[]>>({})

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    if (expandedFlags[id]) {
      setExpandedId(id)
      return
    }
    try {
      const item = await getHistoryItem(id)
      if (item) {
        setExpandedFlags((prev) => ({ ...prev, [id]: item.redFlags }))
        setExpandedId(id)
      }
    } catch (e) {
      console.error(e)
    }
  }

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
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]"
        >
          <button
            type="button"
            onClick={() => handleExpand(item.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-medium text-[var(--color-text)]">
              {item.identifier}
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </button>
          {expandedId === item.id && expandedFlags[item.id] && (
            <ul className="space-y-1.5 border-t border-[var(--color-border-muted)] px-4 py-3">
              {expandedFlags[item.id].map((flag, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]"
                >
                  <span className="text-[var(--color-accent)]">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
