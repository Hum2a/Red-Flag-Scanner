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

  const handleInstagramAnalyze = async (profileUrl: string) => {
    setIsAnalyzing(true)
    setError(null)
    setRedFlags(null)
    try {
      const result = await analyzeInstagramProfile(profileUrl)
      setRedFlags(result.redFlags)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Upload a photo
          </h2>
          <PhotoUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Or scan an Instagram profile
          </h2>
          <InstagramProfileInput
            onAnalyze={handleInstagramAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </section>

        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {redFlags && redFlags.length > 0 && (
          <section>
            <RedFlagsList redFlags={redFlags} />
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Recent scans
          </h2>
          <HistoryList />
        </section>
      </div>
    </Layout>
  )
}

export default App
