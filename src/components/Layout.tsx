import Header from '@/components/Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl">{children}</div>
      </main>
      <footer className="border-t border-[var(--color-border-muted)] py-6 text-center">
        <p className="font-mono text-xs text-[var(--color-text-dim)]">
          Red Flag Scanner — For entertainment only
        </p>
      </footer>
    </div>
  )
}
