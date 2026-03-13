import { Router, type Request, type Response } from 'express'
import { getHistory, getScanById } from '../db/queries.js'
import type Database from 'better-sqlite3'

type Db = InstanceType<typeof Database>

export function createHistoryRouter(db: Db) {
  const router = Router()

  router.get('/', (_req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(String(_req.query.limit), 10) || 20, 100)
      const items = getHistory(db, limit)
      res.json({ data: items })
    } catch (e) {
      console.error('History error:', e)
      res.status(500).json({ error: { message: 'Failed to load history' } })
    }
  })

  router.get('/:id', (req: Request, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0]
      if (!id) {
        res.status(400).json({ error: { message: 'Missing id' } })
        return
      }
      const item = getScanById(db, id)
      if (!item) {
        res.status(404).json({ error: { message: 'Scan not found' } })
        return
      }
      res.json({ data: item })
    } catch (e) {
      console.error('History item error:', e)
      res.status(500).json({ error: { message: 'Failed to load scan' } })
    }
  })

  return router
}
