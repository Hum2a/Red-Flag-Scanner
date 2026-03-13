import { useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import Layout from '@/components/Layout'
import PhotoUpload from '@/components/PhotoUpload'
import ProfileInput from '@/components/ProfileInput'
import CompareInput from '@/components/CompareInput'
import RedFlagsList from '@/components/RedFlagsList'
import ResultActions from '@/components/ResultActions'
import HistoryList from '@/components/HistoryList'
import LoadingScan from '@/components/LoadingScan'
import Stats from '@/components/Stats'
import {
  analyzePhoto,
  analyzeProfile,
  compareProfiles,
} from '@/lib/api'

interface SingleResult {
  type: 'single'
  id: string
  identifier: string
  redFlags: string[]
}

interface CompareResult {
  type: 'compare'
  id: string
  identifier1: string
  identifier2: string
  redFlags1: string[]
  redFlags2: string[]
}

export default function HomePage() {
  const [result, setResult] = useState<SingleResult | CompareResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUsername, setLastUsername] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'scan' | 'compare'>('scan')
  const resultRef = useRef<HTMLDivElement>(null)

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#dc2626', '#f59e0b'],
    })
  }

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    try {
      const r = await analyzePhoto(file)
      setResult({ type: 'single', ...r })
      triggerConfetti()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleProfileAnalyze = async (username: string) => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setLastUsername(username)
    try {
      const r = await analyzeProfile(username)
      setResult({ type: 'single', ...r })
      triggerConfetti()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleScanAgain = async (username: string) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const r = await analyzeProfile(username, Date.now())
      setResult({ type: 'single', ...r })
      triggerConfetti()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCompare = async (username1: string, username2: string) => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    try {
      const r = await compareProfiles(username1, username2)
      setResult({ type: 'compare', ...r })
      triggerConfetti()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-10">
        <section className="animate-slide-up-delay-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 sm:p-8">
          <h2 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Upload a photo
          </h2>
          <PhotoUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
        </section>

        <section className="animate-slide-up-delay-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              Scan a profile
            </h2>
            <Stats />
          </div>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('scan')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                activeTab === 'scan'
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                activeTab === 'compare'
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Compare
            </button>
          </div>
          {activeTab === 'scan' ? (
            <ProfileInput
              onAnalyze={handleProfileAnalyze}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <CompareInput onCompare={handleCompare} isAnalyzing={isAnalyzing} />
          )}
        </section>

        {isAnalyzing && <LoadingScan />}

        {error && (
          <div
            className="animate-slide-up rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-3 text-[var(--color-accent)]"
            role="alert"
          >
            {error}
          </div>
        )}

        {result && !isAnalyzing && (
          <section
            ref={resultRef}
            className="animate-scale-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-mono text-lg font-medium text-[var(--color-text)]">
                {result.type === 'single' ? `Results for ${result.identifier}` : 'Comparison results'}
              </h2>
              <ResultActions
                resultId={result.id}
                identifier={result.type === 'single' ? result.identifier : `${result.identifier1} vs ${result.identifier2}`}
                redFlags={result.type === 'single' ? result.redFlags : [...result.redFlags1, ...result.redFlags2]}
                onScanAgain={result.type === 'single' && lastUsername ? () => handleScanAgain(lastUsername) : undefined}
                resultRef={resultRef}
              />
            </div>
            {result.type === 'single' ? (
              <RedFlagsList redFlags={result.redFlags} showConfidence animate />
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-mono text-sm font-medium text-[var(--color-text-muted)]">
                    {result.identifier1}
                  </h3>
                  <RedFlagsList redFlags={result.redFlags1} showConfidence animate={false} />
                </div>
                <div>
                  <h3 className="mb-3 font-mono text-sm font-medium text-[var(--color-text-muted)]">
                    {result.identifier2}
                  </h3>
                  <RedFlagsList redFlags={result.redFlags2} showConfidence animate={false} />
                </div>
              </div>
            )}
          </section>
        )}

        <section className="animate-slide-up-delay-3">
          <h2 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Recent scans
          </h2>
          <HistoryList />
        </section>
      </div>
    </Layout>
  )
}
