import { useState } from 'react'

interface CompareInputProps {
  onCompare: (username1: string, username2: string) => Promise<void>
  isAnalyzing: boolean
}

export default function CompareInput({ onCompare, isAnalyzing }: CompareInputProps) {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')

  const handleCompare = async () => {
    const u1 = user1.trim()
    const u2 = user2.trim()
    if (!u1 || !u2 || isAnalyzing) return
    await onCompare(u1, u2)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Compare two profiles side by side. Instagram, TikTok, or X — we&apos;ll find red flags for both.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={user1}
          onChange={(e) => setUser1(e.target.value)}
          placeholder="First username"
          className="animate-slide-in-left rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] transition-all duration-200 focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
          disabled={isAnalyzing}
        />
        <input
          type="text"
          value={user2}
          onChange={(e) => setUser2(e.target.value)}
          placeholder="Second username"
          className="animate-slide-in-right rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] transition-all duration-200 focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
          disabled={isAnalyzing}
        />
      </div>
      <button
        type="button"
        onClick={handleCompare}
        disabled={!user1.trim() || !user2.trim() || isAnalyzing}
        className="rounded-xl bg-[var(--color-accent)] px-6 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
      >
        {isAnalyzing ? 'Comparing...' : 'Compare'}
      </button>
    </div>
  )
}
