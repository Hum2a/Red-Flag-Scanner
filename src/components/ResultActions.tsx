import { useState } from 'react'
import html2canvas from 'html2canvas'

interface ResultActionsProps {
  resultId: string
  identifier: string
  redFlags: string[]
  onScanAgain?: () => void
  resultRef?: React.RefObject<HTMLDivElement | null>
}

export default function ResultActions({
  resultId,
  identifier,
  redFlags,
  onScanAgain,
  resultRef,
}: ResultActionsProps) {
  const [copied, setCopied] = useState(false)
  const [reporting, setReporting] = useState(false)

  const shareUrl = `${window.location.origin}/r/${resultId}`

  const handleCopy = async () => {
    const text = `🚩 Red flags for ${identifier}:\n${redFlags.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nScan yours: ${shareUrl}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Red flags for ${identifier}`,
          text: `🚩 ${redFlags.length} red flags detected. Scan yours!`,
          url: shareUrl,
        })
      } catch {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  const handleExport = async () => {
    if (!resultRef?.current) return
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#0c0c10',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `red-flags-${identifier.replace(/[^a-z0-9]/gi, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    }
  }

  const handleReport = () => {
    setReporting(true)
    setTimeout(() => {
      setReporting(false)
      alert("Report submitted. Our team of zero people will look into it. (This is satire — there's no team.)")
    }, 500)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-elevated)]"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-elevated)]"
      >
        Share
      </button>
      {resultRef && (
        <button
          type="button"
          onClick={handleExport}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-elevated)]"
        >
          Export image
        </button>
      )}
      {onScanAgain && (
        <button
          type="button"
          onClick={onScanAgain}
          className="rounded-lg border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent)]/20"
        >
          Scan again
        </button>
      )}
      <button
        type="button"
        onClick={handleReport}
        disabled={reporting}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-elevated)] disabled:opacity-50"
      >
        {reporting ? '...' : 'Report inaccuracy'}
      </button>
    </div>
  )
}
