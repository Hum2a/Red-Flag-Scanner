import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import { randomUUID } from 'crypto'
import { analyzePhoto } from '../services/analyzeService.js'
import { insertScan } from '../db/queries.js'
import type Database from 'better-sqlite3'

type Db = InstanceType<typeof Database>

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Use JPEG, PNG, or WebP.'))
    }
  },
})

export function createAnalyzeRouter(db: Db) {
  const router = Router()

  router.post('/photo', upload.single('image'), async (req: Request, res: Response) => {
    try {
      const file = req.file
      if (!file) {
        res.status(400).json({ error: { message: 'No image provided' } })
        return
      }

      const redFlags = await analyzePhoto(file.buffer)
      const id = randomUUID()
      const identifier = `photo-${id.slice(0, 8)}`

      insertScan(db, id, identifier, redFlags)

      res.json({
        data: {
          id,
          identifier,
          redFlags,
          createdAt: new Date().toISOString(),
        },
      })
    } catch (e) {
      console.error('Analyze error:', e)
      const message = e instanceof Error ? e.message : 'Analysis failed'
      res.status(500).json({ error: { message } })
    }
  })

  return router
}
