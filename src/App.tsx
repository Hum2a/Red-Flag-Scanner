import { useState } from 'react'
import Layout from '@/components/Layout'
import PhotoUpload from '@/components/PhotoUpload'
import InstagramProfileInput from '@/components/InstagramProfileInput'
import RedFlagsList from '@/components/RedFlagsList'
import HistoryList from '@/components/HistoryList'
import { analyzePhoto, analyzeInstagramProfile } from '@/lib/api'

function App() {
  const [redFlags, setRedFlags] = useState<string[] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)
    setRedFlags(null)

    try {
      const result = await analyzePhoto(file)
      setRedFlags(result.redFlags)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleInstagramAnalyze = async (username: string) => {
    setIsAnalyzing(true)
    setError(null)
    setRedFlags(null)
    try {
      const result = await analyzeInstagramProfile(username)
      setRedFlags(result.redFlags)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-10">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <h2 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Upload a photo
          </h2>
          <PhotoUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <h2 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Or scan an Instagram profile
          </h2>
          <InstagramProfileInput
            onAnalyze={handleInstagramAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </section>

        {error && (
          <div
            className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-3 text-[var(--color-accent)]"
            role="alert"
          >
            {error}
          </div>
        )}

        {redFlags && redFlags.length > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <RedFlagsList redFlags={redFlags} />
          </section>
        )}

        <section>
          <h2 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Recent scans
          </h2>
          <HistoryList />
        </section>
      </div>
    </Layout>
  )
}

export default App
