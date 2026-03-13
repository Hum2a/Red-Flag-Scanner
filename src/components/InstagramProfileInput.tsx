import { useEffect, useState } from 'react'
import {
  getInstagramAuthUrl,
  getInstagramStatus,
  logoutInstagram,
} from '@/lib/api'

interface InstagramProfileInputProps {
  onAnalyze: (profileUrl: string) => Promise<void>
  isAnalyzing: boolean
}

export default function InstagramProfileInput({ onAnalyze, isAnalyzing }: InstagramProfileInputProps) {
  const [profileUrl, setProfileUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    getInstagramStatus()
      .then(({ connected: c }) => setConnected(c))
      .catch(() => setConnected(false))
      .finally(() => setLoadingStatus(false))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    const ig = params.get('instagram')
    if (error) {
      setConnected(false)
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (ig === 'connected') {
      setConnected(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const handleConnect = () => {
    window.location.href = getInstagramAuthUrl()
  }

  const handleLogout = async () => {
    await logoutInstagram()
    setConnected(false)
  }

  const handleAnalyze = async () => {
    if (!profileUrl.trim() || isAnalyzing) return
    const url = profileUrl.trim()
    if (!url.includes('instagram.com') && !/^[a-zA-Z0-9._]+$/.test(url)) {
      return
    }
    const fullUrl = url.includes('instagram.com') ? url : `https://instagram.com/${url}`
    await onAnalyze(fullUrl)
  }

  if (loadingStatus) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        Checking Instagram connection...
      </p>
    )
  }

  if (!connected) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Connect your Instagram (Business or Creator account) to analyze any public profile by URL.
        </p>
        <button
          type="button"
          onClick={handleConnect}
          className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-text-dim)] hover:bg-[var(--color-surface-elevated)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </span>
          Connect Instagram
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-success)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
          Instagram connected
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          Disconnect
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="https://instagram.com/username or just username"
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
          disabled={isAnalyzing}
        />
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!profileUrl.trim() || isAnalyzing}
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
      <p className="text-xs text-[var(--color-text-dim)]">
        Only works with Business or Creator accounts. Personal accounts are not supported by
        Instagram&apos;s API.
      </p>
    </div>
  )
}
