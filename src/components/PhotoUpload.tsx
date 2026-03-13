import { useCallback, useState } from 'react'

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface PhotoUploadProps {
  onUpload: (file: File) => void
  isAnalyzing: boolean
}

export default function PhotoUpload({ onUpload, isAnalyzing }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_SIZE_MB}MB`
    }
    return null
  }, [])

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null)
      setPreview(null)
      setSelectedFile(null)

      if (!file) return

      const err = validateFile(file)
      if (err) {
        setError(err)
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreview(url)
    },
    [validateFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files[0]
      if (file?.type?.startsWith('image/')) handleFile(file)
      else setError('Please drop an image file')
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      handleFile(file ?? null)
    },
    [handleFile]
  )

  const handleSubmit = useCallback(() => {
    if (selectedFile && !isAnalyzing) {
      onUpload(selectedFile)
    }
  }, [selectedFile, onUpload, isAnalyzing])

  const handleClear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setSelectedFile(null)
    setError(null)
  }, [preview])

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'scale-[1.02] border-[var(--color-accent)] bg-[var(--color-accent-glow)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:scale-[1.01] hover:border-[var(--color-text-dim)]'
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
          id="photo-upload"
          disabled={isAnalyzing}
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer"
          aria-disabled={isAnalyzing}
        >
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-56 rounded-xl object-contain ring-1 ring-[var(--color-border)] transition-transform duration-300 hover:scale-[1.02]"
              />
              <p className="text-sm text-[var(--color-text-muted)]">
                Click to change or analyze below
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-elevated)]">
                <svg
                  className="h-7 w-7 text-[var(--color-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-[var(--color-text)]">
                Drag and drop a photo here
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                or click to browse · JPEG, PNG, WebP · max {MAX_SIZE_MB}MB
              </p>
            </div>
          )}
        </label>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-accent)]" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {preview && (
          <>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="rounded-xl bg-[var(--color-accent)] px-6 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-[0_0_20px_var(--color-accent-glow)] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Generate Red Flags'
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isAnalyzing}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2.5 font-medium text-[var(--color-text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] disabled:opacity-50"
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  )
}
