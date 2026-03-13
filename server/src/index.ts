import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { initDb } from './db/schema.js'
import { createAnalyzeRouter } from './routes/analyze.js'
import { createCompareRouter } from './routes/compare.js'
import { createHistoryRouter } from './routes/history.js'
import { createInstagramRouter } from './routes/instagram.js'
import { createStatsRouter } from './routes/stats.js'
import { health } from './routes/health.js'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'
const dbPath = process.env.DATABASE_PATH
const db = initDb(dbPath)

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: { message: 'Too many scans. Try again in a minute.' } },
})

const app = express()
app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())

app.get('/health', health)
app.use('/api/analyze', analyzeLimiter, createAnalyzeRouter(db))
app.use('/api/instagram', analyzeLimiter, createInstagramRouter(db))
app.use('/api/compare', analyzeLimiter, createCompareRouter(db))
app.use('/api/history', createHistoryRouter(db))
app.use('/api/stats', createStatsRouter(db))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
