import sharp from 'sharp'

export interface ImageAnalysis {
  width: number
  height: number
  aspectRatio: 'portrait' | 'square' | 'landscape' | 'ultra-wide'
  brightness: 'dark' | 'normal' | 'bright'
  colorTemp: 'warm' | 'neutral' | 'cool'
  saturation: 'low' | 'normal' | 'high'
  size: 'small' | 'medium' | 'large'
  pixelCount: number
}

const SAMPLE_SIZE = 50
const BRIGHTNESS_DARK = 0.35
const BRIGHTNESS_BRIGHT = 0.7
const SATURATION_LOW = 0.2
const SATURATION_HIGH = 0.6
const SMALL_PIXELS = 200_000
const LARGE_PIXELS = 4_000_000

export async function analyzeImage(buffer: Buffer): Promise<ImageAnalysis> {
  const meta = await sharp(buffer).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const pixelCount = width * height

  const { data: raw, info } = await sharp(buffer)
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const channels = info.channels
  const len = raw.length
  let sumR = 0
  let sumG = 0
  let sumB = 0
  let sumMax = 0
  let sumMin = 0

  for (let i = 0; i < len; i += channels) {
    const r = raw[i] ?? 0
    const g = raw[i + 1] ?? 0
    const b = raw[i + 2] ?? 0
    sumR += r
    sumG += g
    sumB += b
    sumMax += Math.max(r, g, b)
    sumMin += Math.min(r, g, b)
  }

  const n = len / channels
  const avgR = sumR / n / 255
  const avgG = sumG / n / 255
  const avgB = sumB / n / 255
  const brightness = (avgR + avgG + avgB) / 3
  const saturation = n > 0 ? (sumMax - sumMin) / n / 255 : 0
  const warmth = avgR - avgB

  const aspectRatio = getAspectRatio(width, height)
  const brightnessLevel = getBrightness(brightness)
  const colorTemp = getColorTemp(warmth)
  const saturationLevel = getSaturation(saturation)
  const sizeLevel = getSize(pixelCount)

  return {
    width,
    height,
    aspectRatio,
    brightness: brightnessLevel,
    colorTemp,
    saturation: saturationLevel,
    size: sizeLevel,
    pixelCount,
  }
}

function getAspectRatio(w: number, h: number): ImageAnalysis['aspectRatio'] {
  if (w === 0 || h === 0) return 'square'
  const ratio = w / h
  if (ratio < 0.7) return 'portrait'
  if (ratio > 1.5) return 'ultra-wide'
  if (ratio > 1.1) return 'landscape'
  if (ratio < 0.9) return 'portrait'
  return 'square'
}

function getBrightness(b: number): ImageAnalysis['brightness'] {
  if (b < BRIGHTNESS_DARK) return 'dark'
  if (b > BRIGHTNESS_BRIGHT) return 'bright'
  return 'normal'
}

function getColorTemp(warmth: number): ImageAnalysis['colorTemp'] {
  if (warmth > 0.08) return 'warm'
  if (warmth < -0.08) return 'cool'
  return 'neutral'
}

function getSaturation(s: number): ImageAnalysis['saturation'] {
  if (s < SATURATION_LOW) return 'low'
  if (s > SATURATION_HIGH) return 'high'
  return 'normal'
}

function getSize(pixels: number): ImageAnalysis['size'] {
  if (pixels < SMALL_PIXELS) return 'small'
  if (pixels > LARGE_PIXELS) return 'large'
  return 'medium'
}
