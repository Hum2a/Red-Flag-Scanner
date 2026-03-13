import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface Trigger {
  id: string
  condition: Record<string, unknown>
  redFlags: string[]
}

interface Dataset {
  triggers: Trigger[]
}

function loadAllRedFlags(): string[] {
  const p = path.join(__dirname, '../data/red-flags.json')
  const raw = readFileSync(p, 'utf-8')
  const data = JSON.parse(raw) as Dataset
  const all: string[] = []
  for (const t of data.triggers) {
    all.push(...t.redFlags)
  }
  return [...new Set(all)]
}

/**
 * Deterministic "random" seed from username.
 * Same username = same red flags every time.
 */
function seedFromUsername(username: string): number {
  const s = username.toLowerCase().replace(/[^a-z0-9]/g, '')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * Seeded shuffle - deterministic order based on seed.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * "Analyze" a username and return red flags based on arbitrary factors.
 * Factors: length, character composition, seeded randomness.
 * Same username always gets same result.
 */
export function analyzeUsername(username: string): string[] {
  const allFlags = loadAllRedFlags()
  const seed = seedFromUsername(username)

  const len = username.length
  const count = Math.min(
    Math.max(4, 3 + (len % 5)),
    8
  )

  const shuffled = seededShuffle(allFlags, seed)
  const picked = shuffled.slice(0, count)

  return picked
}
