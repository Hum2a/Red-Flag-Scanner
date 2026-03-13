import { analyzeImage } from './imageAnalyzer.js'
import { matchRedFlags } from './redFlagMatcher.js'

export async function analyzePhoto(imageBuffer: Buffer): Promise<string[]> {
  const analysis = await analyzeImage(imageBuffer)
  return matchRedFlags(analysis)
}
