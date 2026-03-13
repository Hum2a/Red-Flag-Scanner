import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { initDb } from './db/schema.js'
import { createAnalyzeRouter } from './routes/analyze.js'
import { createAuthRouter } from './routes/auth.js'
import { createHistoryRouter } from './routes/history.js'
import { createInstagramRouter } from './routes/instagram.js'
import { health } from './routes/health.js'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'
const dbPath = process.env.DATABASE_PATH
const db = initDb(dbPath)

const app = express()
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
)

app.get('/health', health)
app.use('/api/auth', createAuthRouter())
app.use('/api/analyze', createAnalyzeRouter(db))
app.use('/api/instagram', createInstagramRouter(db))
app.use('/api/history', createHistoryRouter(db))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
