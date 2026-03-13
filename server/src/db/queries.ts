import type Database from 'better-sqlite3'

export function insertScan(
  db: Database.Database,
  id: string,
  identifier: string,
  redFlags: string[]
): void {
  const stmt = db.prepare(`
    INSERT INTO scanned_accounts (id, identifier, red_flags)
    VALUES (?, ?, ?)
  `)
  stmt.run(id, identifier, JSON.stringify(redFlags))
}

export function getHistory(db: Database.Database, limit = 20): { id: string; identifier: string; createdAt: string }[] {
  const stmt = db.prepare(`
    SELECT id, identifier, created_at as createdAt
    FROM scanned_accounts
    ORDER BY created_at DESC
    LIMIT ?
  `)
  return stmt.all(limit) as { id: string; identifier: string; createdAt: string }[]
}

export function getScanById(db: Database.Database, id: string): {
  id: string
  identifier: string
  redFlags: string[]
  createdAt: string
} | null {
  const stmt = db.prepare(`
    SELECT id, identifier, red_flags as redFlags, created_at as createdAt
    FROM scanned_accounts
    WHERE id = ?
  `)
  const row = stmt.get(id) as { id: string; identifier: string; redFlags: string; createdAt: string } | undefined
  if (!row) return null
  return {
    ...row,
    redFlags: JSON.parse(row.redFlags) as string[],
  }
}

export function getScanCount(db: Database.Database): number {
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM scanned_accounts`)
  const row = stmt.get() as { count: number }
  return row?.count ?? 0
}
