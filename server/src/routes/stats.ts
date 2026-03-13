import { Router, type Request, type Response } from 'express'
import { getScanCount } from '../db/queries.js'
import type Database from 'better-sqlite3'

type Db = InstanceType<typeof Database>

export function createStatsRouter(db: Db) {
  const router = Router()

  router.get('/', (_req: Request, res: Response) => {
    try {
      const totalScans = getScanCount(db)
      res.json({ data: { totalScans } })
    } catch (e) {
      console.error('Stats error:', e)
      res.status(500).json({ error: { message: 'Failed to load stats' } })
    }
  })

  return router
}
