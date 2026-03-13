export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-muted)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        <div className="flex items-baseline gap-3">
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Red Flag Scanner
          </h1>
          <span className="hidden rounded-full bg-[var(--color-accent)]/20 px-2 py-0.5 font-mono text-xs font-medium text-[var(--color-accent)] sm:inline">
            BETA
          </span>
        </div>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          Upload a photo or scan an Instagram profile — we&apos;ll find the red flags
        </p>
      </div>
    </header>
  )
}
