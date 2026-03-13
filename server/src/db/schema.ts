import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

export function initDb(dbPath?: string): Database.Database {
  const resolved = dbPath ?? path.join(process.cwd(), 'data', 'scanner.db')
  const dir = path.dirname(resolved)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const db = new Database(resolved)

  db.exec(`
    CREATE TABLE IF NOT EXISTS scanned_accounts (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      red_flags TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  return db
}
