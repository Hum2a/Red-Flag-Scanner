import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="animate-scale-in py-16 text-center">
        <h1 className="mb-2 font-mono text-4xl font-bold text-[var(--color-accent)]">
          404
        </h1>
        <p className="mb-2 font-mono text-xl text-[var(--color-text)]">
          Page not found
        </p>
        <p className="mb-6 text-[var(--color-text-muted)]">
          This is a red flag. You shouldn&apos;t be here.
        </p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-[var(--color-accent)] px-6 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </Layout>
  )
}
