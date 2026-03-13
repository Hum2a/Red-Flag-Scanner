import { useState } from 'react'

type Platform = 'instagram' | 'tiktok' | 'twitter'

interface ProfileInputProps {
  onAnalyze: (username: string) => Promise<void>
  isAnalyzing: boolean
}

const PLATFORMS: { id: Platform; label: string; placeholder: string }[] = [
  { id: 'instagram', label: 'Instagram', placeholder: '@username or instagram.com/username' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@username or tiktok.com/@username' },
  { id: 'twitter', label: 'X / Twitter', placeholder: '@username or x.com/username' },
]

export default function ProfileInput({ onAnalyze, isAnalyzing }: ProfileInputProps) {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')

  const handleAnalyze = async () => {
    const trimmed = input.trim()
    if (!trimmed || isAnalyzing) return
    await onAnalyze(trimmed)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlatform(p.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
              platform === p.id
                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        Enter any {PLATFORMS.find((p) => p.id === platform)?.label} username — we&apos;ll analyze their profile.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLATFORMS.find((p) => p.id === platform)?.placeholder}
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] transition-all duration-200 focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
          disabled={isAnalyzing}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button
          type="button"
          onClick={() => handleAnalyze()}
          disabled={!input.trim() || isAnalyzing}
          className="rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-5 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Scanning...
            </span>
          ) : (
            'Scan'
          )}
        </button>
      </div>
    </div>
  )
}
