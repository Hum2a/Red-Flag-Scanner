import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="animate-slide-down sticky top-0 z-50 border-b border-[var(--color-border-muted)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        <Link to="/" className="block transition-transform duration-200 hover:translate-x-0.5 active:translate-x-0">
        <div className="flex items-baseline gap-3">
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-[var(--color-text)] transition-colors duration-200 sm:text-3xl">
            Red Flag Scanner
          </h1>
          <span className="hidden rounded-full bg-[var(--color-accent)]/20 px-2 py-0.5 font-mono text-xs font-medium text-[var(--color-accent)] transition-transform duration-200 sm:inline-block sm:hover:scale-110">
            BETA
          </span>
        </div>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)] transition-colors duration-200">
          Upload a photo or scan a profile — we&apos;ll find the red flags
        </p>
        </Link>
      </div>
    </header>
  )
}
