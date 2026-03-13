export default function LoadingScan() {
  return (
    <div className="animate-slide-up flex flex-col items-center gap-6 py-12">
      <div className="relative h-24 w-24">
        <div
          className="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)]/20"
          style={{ animationDuration: '2s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="animate-pulse font-medium text-[var(--color-text)]">Scanning profile...</p>
        <p className="text-sm text-[var(--color-text-muted)] transition-opacity duration-300">
          Analyzing aesthetic • Checking vibes • Detecting red flags
        </p>
      </div>
    </div>
  )
}
