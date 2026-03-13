import { Router, type Request, type Response } from 'express'
import { randomUUID } from 'crypto'
import { analyzeUsername } from '../services/usernameAnalyzer.js'
import { insertScan } from '../db/queries.js'
import type Database from 'better-sqlite3'

type Db = InstanceType<typeof Database>

const USERNAME_REGEX = /instagram\.com\/([a-zA-Z0-9._]+)/i

function parseUsername(input: string): string | null {
  const u = input.trim()
  if (!u) return null
  if (/^[a-zA-Z0-9._]+$/.test(u)) return u
  const match = u.match(USERNAME_REGEX)
  return match ? match[1].replace(/\/$/, '') : null
}

export function createInstagramRouter(db: Db) {
  const router = Router()

  router.post('/analyze', async (req: Request, res: Response) => {
    try {
      const { username: input } = req.body as { username?: string }
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: { message: 'Username is required' } })
        return
      }

      const username = parseUsername(input)
      if (!username) {
        res.status(400).json({ error: { message: 'Invalid username or profile URL' } })
        return
      }

      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
      const redFlags = analyzeUsername(username)
      const id = randomUUID()
      insertScan(db, id, `@${username}`, redFlags)

      res.json({
        data: {
          id,
          identifier: `@${username}`,
          redFlags,
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
