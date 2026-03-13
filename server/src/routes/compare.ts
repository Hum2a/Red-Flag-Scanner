import { Router, type Request, type Response } from 'express'
import { randomUUID } from 'crypto'
import { analyzeUsername } from '../services/usernameAnalyzer.js'
import { insertScan } from '../db/queries.js'
import type Database from 'better-sqlite3'

type Db = InstanceType<typeof Database>

const USERNAME_REGEX = /(?:instagram\.com|tiktok\.com|twitter\.com|x\.com)\/([a-zA-Z0-9._]+)/i

function parseUsername(input: string): string | null {
  const u = input.trim().replace(/^@/, '')
  if (!u) return null
  if (/^[a-zA-Z0-9._]+$/.test(u)) return u
  const match = u.match(USERNAME_REGEX)
  return match ? match[1].replace(/\/$/, '') : null
}

export function createCompareRouter(db: Db) {
  const router = Router()

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { username1, username2 } = req.body as { username1?: string; username2?: string }
      if (!username1 || !username2 || typeof username1 !== 'string' || typeof username2 !== 'string') {
        res.status(400).json({ error: { message: 'Both username1 and username2 are required' } })
        return
      }

      const u1 = parseUsername(username1)
      const u2 = parseUsername(username2)
      if (!u1 || !u2) {
        res.status(400).json({ error: { message: 'Invalid usernames' } })
        return
      }

      await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000))
      const flags1 = analyzeUsername(u1)
      const flags2 = analyzeUsername(u2)

      const id = randomUUID()
      insertScan(db, id, `@${u1} vs @${u2}`, [...flags1, ...flags2])

      res.json({
        data: {
          id,
          identifier1: `@${u1}`,
          identifier2: `@${u2}`,
          redFlags1: flags1,
          redFlags2: flags2,
          createdAt: new Date().toISOString(),
        },
      })
    } catch (e) {
      console.error('Compare error:', e)
      const message = e instanceof Error ? e.message : 'Comparison failed'
      res.status(500).json({ error: { message } })
    }
  })

  return router
}
