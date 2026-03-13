import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import RedFlagsList from '@/components/RedFlagsList'
import ResultActions from '@/components/ResultActions'
import { getHistoryItem } from '@/lib/api'

export default function SharedResultPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<{
    id: string
    identifier: string
    redFlags: string[]
    createdAt: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    getHistoryItem(id)
      .then((item) => {
        if (item) setData(item)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <p className="text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </Layout>
    )
  }

  if (notFound || !data) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <h1 className="mb-2 font-mono text-2xl font-semibold text-[var(--color-text)]">
            Scan not found
          </h1>
          <p className="mb-6 text-[var(--color-text-muted)]">
            This red flag might have been too embarrassing to keep.
          </p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-[var(--color-accent)] px-6 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          >
            Scan your own
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="animate-slide-up space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-all duration-200 hover:-translate-x-0.5 hover:text-[var(--color-text)]"
        >
          <span aria-hidden>←</span>
          Back to home
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-mono text-xl font-medium text-[var(--color-text)]">
            Red flags for {data.identifier}
          </h1>
          <ResultActions
            resultId={data.id}
            identifier={data.identifier}
            redFlags={data.redFlags}
          />
        </div>
        <RedFlagsList redFlags={data.redFlags} showConfidence animate={false} />
        <Link
          to="/"
          className="inline-block text-sm text-[var(--color-accent)] transition-all duration-200 hover:-translate-x-1 hover:underline"
        >
          ← Scan your own profile
        </Link>
      </div>
    </Layout>
  )
}
