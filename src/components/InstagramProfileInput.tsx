import { useState } from 'react'

interface InstagramProfileInputProps {
  onAnalyze: (username: string) => Promise<void>
  isAnalyzing: boolean
}

export default function InstagramProfileInput({ onAnalyze, isAnalyzing }: InstagramProfileInputProps) {
  const [input, setInput] = useState('')

  const handleAnalyze = async () => {
    const trimmed = input.trim()
    if (!trimmed || isAnalyzing) return
    await onAnalyze(trimmed)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Enter any Instagram username — we&apos;ll analyze their profile and surface the red flags.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="@username or instagram.com/username"
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
          disabled={isAnalyzing}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!input.trim() || isAnalyzing}
          className="rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
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
