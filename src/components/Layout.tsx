import Header from '@/components/Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl animate-slide-up">{children}</div>
      </main>
      <footer className="border-t border-[var(--color-border-muted)] py-6 transition-colors duration-200">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="mb-1 font-mono text-xs text-[var(--color-text-dim)]">
            Red Flag Scanner — For entertainment only
          </p>
          <p className="font-mono text-xs text-[var(--color-text-dim)]/80">
            This is satire. Don&apos;t take it seriously. We make it up.
          </p>
        </div>
      </footer>
    </div>
  )
}
