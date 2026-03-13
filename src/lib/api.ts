const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const fetchOpts: RequestInit = { credentials: 'include' }

export async function analyzePhoto(file: File): Promise<{ id: string; identifier: string; redFlags: string[]; createdAt: string }> {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_BASE}/api/analyze/photo`, {
    ...fetchOpts,
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(err.error?.message ?? 'Failed to analyze photo')
  }

  const json = await res.json()
  return json.data
}

export async function getHistory(): Promise<{ id: string; identifier: string; createdAt: string }[]> {
  const res = await fetch(`${API_BASE}/api/history`, fetchOpts)

  if (!res.ok) {
    throw new Error('Failed to load history')
  }

  const json = await res.json()
  return json.data
}

export async function getHistoryItem(id: string): Promise<{ id: string; identifier: string; redFlags: string[]; createdAt: string } | null> {
  const res = await fetch(`${API_BASE}/api/history/${id}`, fetchOpts)

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error('Failed to load scan')
  }

  const json = await res.json()
  return json.data
}

export function getInstagramAuthUrl(): string {
  return `${API_BASE}/api/auth/instagram`
}

export async function getInstagramStatus(): Promise<{ connected: boolean }> {
  const res = await fetch(`${API_BASE}/api/auth/instagram/status`, fetchOpts)
  if (!res.ok) return { connected: false }
  const json = await res.json()
  return json.data
}

export async function logoutInstagram(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/instagram/logout`, {
    ...fetchOpts,
    method: 'POST',
  })
}

export async function analyzeInstagramProfile(profileUrl: string): Promise<{
  id: string
  identifier: string
  redFlags: string[]
  createdAt: string
}> {
  const res = await fetch(`${API_BASE}/api/instagram/analyze`, {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileUrl }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(err.error?.message ?? 'Failed to analyze profile')
  }

  const json = await res.json()
  return json.data
}
