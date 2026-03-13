const INSTAGRAM_OAUTH = 'https://api.instagram.com/oauth/authorize'
const INSTAGRAM_TOKEN = 'https://api.instagram.com/oauth/access_token'
const GRAPH_API = 'https://graph.instagram.com'

export function getAuthUrl(): string {
  const clientId = process.env.INSTAGRAM_APP_ID
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI
  const scope = 'instagram_business_basic,pages_read_engagement,instagram_manage_insights'

  if (!clientId || !redirectUri) {
    throw new Error('INSTAGRAM_APP_ID and INSTAGRAM_REDIRECT_URI must be set')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    response_type: 'code',
  })
  return `${INSTAGRAM_OAUTH}?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string
  userId: string
}> {
  const clientId = process.env.INSTAGRAM_APP_ID
  const clientSecret = process.env.INSTAGRAM_APP_SECRET
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Instagram env vars not configured')
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code,
  })

  const res = await fetch(INSTAGRAM_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Token exchange failed: ${err}`)
  }

  const data = (await res.json()) as { access_token: string; user_id: string }
  return {
    accessToken: data.access_token,
    userId: data.user_id,
  }
}

export async function getIgUserId(accessToken: string): Promise<string> {
  const res = await fetch(
    `https://graph.instagram.com/v21.0/me?fields=id&access_token=${accessToken}`
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to get IG user: ${err}`)
  }
  const data = (await res.json()) as { id?: string }
  if (!data.id) throw new Error('No Instagram user ID in response')
  return data.id
}

export async function fetchProfileByUsername(
  igUserId: string,
  accessToken: string,
  targetUsername: string
): Promise<{ profilePictureUrl: string; mediaUrls: string[] }> {
  const fields = [
    'business_discovery.username(' + targetUsername + '){profile_picture_url,media{media_url,media_type}}',
  ].join(',')
  const url = `https://graph.facebook.com/v21.0/${igUserId}?fields=${encodeURIComponent(fields)}&access_token=${accessToken}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Instagram API error: ${err}`)
  }

  const data = (await res.json()) as {
    business_discovery?: {
      profile_picture_url?: string
      media?: { data?: { media_url?: string; media_type?: string }[] }
    }
  }

  const discovery = data.business_discovery
  if (!discovery) {
    throw new Error('Profile not found. The account may be private or not a Business/Creator account.')
  }

  const profilePictureUrl = discovery.profile_picture_url ?? ''
  const mediaUrls: string[] = []
  const mediaData = discovery.media?.data ?? []
  for (const item of mediaData) {
    if (item.media_url && item.media_type !== 'VIDEO') {
      mediaUrls.push(item.media_url)
    }
  }

  return { profilePictureUrl, mediaUrls }
}
