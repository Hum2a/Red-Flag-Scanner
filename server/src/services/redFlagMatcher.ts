import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import type { ImageAnalysis } from './imageAnalyzer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface TriggerCondition {
  aspectRatio?: string
  brightness?: string
  colorTemp?: string
  saturation?: string
  size?: string
  fallback?: boolean
}

interface Trigger {
  id: string
  condition: TriggerCondition
  redFlags: string[]
}

interface Dataset {
  triggers: Trigger[]
}

function loadDataset(): Dataset {
  const p = path.join(__dirname, '../data/red-flags.json')
  const raw = readFileSync(p, 'utf-8')
  return JSON.parse(raw) as Dataset
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, arr.length))
}

export function matchRedFlags(analysis: ImageAnalysis): string[] {
  const dataset = loadDataset()
  const matched: string[] = []

  for (const trigger of dataset.triggers) {
    if (trigger.condition.fallback) continue

    const cond = trigger.condition
    let matches = true

    if (cond.aspectRatio && cond.aspectRatio !== analysis.aspectRatio) matches = false
    if (cond.brightness && cond.brightness !== analysis.brightness) matches = false
    if (cond.colorTemp && cond.colorTemp !== analysis.colorTemp) matches = false
    if (cond.saturation && cond.saturation !== analysis.saturation) matches = false
    if (cond.size && cond.size !== analysis.size) matches = false

    if (matches && trigger.redFlags.length > 0) {
      const count = Math.min(2, trigger.redFlags.length)
      const chosen = pickRandom(trigger.redFlags, count)
      for (const flag of chosen) {
        if (flag && !matched.includes(flag)) matched.push(flag)
      }
    }
  }

  const fallbackTrigger = dataset.triggers.find((t) => t.condition.fallback)
  if (fallbackTrigger && matched.length < 3) {
    const needed = 3 - matched.length
    const fallbackFlags = fallbackTrigger.redFlags.filter((f) => !matched.includes(f))
    const added = pickRandom(fallbackFlags, needed)
    matched.push(...added)
  }

  return matched.length > 0 ? matched : fallbackTrigger?.redFlags.slice(0, 3) ?? ['Vibes: unclear']
}
