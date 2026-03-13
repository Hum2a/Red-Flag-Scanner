import { Router, type Request, type Response } from 'express'
import { randomUUID } from 'crypto'
import { getIgUserId, fetchProfileByUsername } from '../services/instagramService.js'
import { analyzePhoto } from '../services/analyzeService.js'
import { insertScan } from '../db/queries.js'
import type Database from 'better-sqlite3'

type Db = InstanceType<typeof Database>

const USERNAME_REGEX = /instagram\.com\/([a-zA-Z0-9._]+)/i

function parseUsernameFromUrl(url: string): string | null {
  try {
    const u = url.trim()
    if (/^[a-zA-Z0-9._]+$/.test(u)) return u
    const match = u.match(USERNAME_REGEX)
    return match ? match[1].replace(/\/$/, '') : null
  } catch {
    return null
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export function createInstagramRouter(db: Db) {
  const router = Router()

  router.post('/analyze', async (req: Request, res: Response) => {
    try {
      const token = req.session.instagramAccessToken
      if (!token) {
        res.status(401).json({ error: { message: 'Connect Instagram first' } })
        return
      }

      const { profileUrl } = req.body as { profileUrl?: string }
      if (!profileUrl || typeof profileUrl !== 'string') {
        res.status(400).json({ error: { message: 'profileUrl is required' } })
        return
      }

      const username = parseUsernameFromUrl(profileUrl)
      if (!username) {
        res.status(400).json({ error: { message: 'Invalid Instagram profile URL or username' } })
        return
      }

      const igUserId = await getIgUserId(token)
      const { profilePictureUrl, mediaUrls } = await fetchProfileByUsername(
        igUserId,
        token,
        username
      )

      const imagesToAnalyze: Buffer[] = []
      if (profilePictureUrl) {
        try {
          imagesToAnalyze.push(await downloadImage(profilePictureUrl))
        } catch (e) {
          console.warn('Profile pic download failed:', e)
        }
      }
      for (const url of mediaUrls.slice(0, 5)) {
        try {
          imagesToAnalyze.push(await downloadImage(url))
        } catch (e) {
          console.warn('Media download failed:', e)
        }
      }

      if (imagesToAnalyze.length === 0) {
        res.status(400).json({
          error: {
            message:
              'No images found. The account may be private, not a Business/Creator account, or have no posts.',
          },
        })
        return
      }

      const allRedFlags: string[] = []
      const seen = new Set<string>()
      for (const img of imagesToAnalyze) {
        const flags = await analyzePhoto(img)
        for (const f of flags) {
          if (!seen.has(f)) {
            seen.add(f)
            allRedFlags.push(f)
          }
        }
      }

      const id = randomUUID()
      insertScan(db, id, `@${username}`, allRedFlags)

      res.json({
        data: {
          id,
          identifier: `@${username}`,
          redFlags: allRedFlags,
          createdAt: new Date().toISOString(),
        },
      })
    } catch (e) {
      console.error('Instagram analyze error:', e)
      const message = e instanceof Error ? e.message : 'Analysis failed'
      res.status(500).json({ error: { message } })
    }
  })

  return router
}
