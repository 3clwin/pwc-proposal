'use client'

import { useEffect, useState } from 'react'

export interface LocalFont {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

/**
 * Well-known fonts bundled with macOS, Windows, and common Linux distros.
 * Used as a reliable fallback when the Local Font Access API is unavailable.
 */
const COMMON_SYSTEM_FONTS: string[] = [
  // macOS
  'SF Pro', 'SF Pro Display', 'SF Pro Rounded', 'SF Pro Text',
  'SF Mono', 'New York', 'Helvetica Neue', 'Helvetica',
  'Avenir', 'Avenir Next', 'Futura', 'Gill Sans',
  'Optima', 'Palatino', 'Baskerville', 'Didot',
  'Georgia', 'Hoefler Text', 'Menlo', 'Monaco',
  'American Typewriter', 'Copperplate', 'Rockwell',
  'Courier New', 'Times New Roman', 'Verdana', 'Trebuchet MS',
  'Lucida Grande', 'Geneva', 'Impact',
  // Windows
  'Segoe UI', 'Segoe UI Variable', 'Cascadia Code', 'Cascadia Mono',
  'Calibri', 'Cambria', 'Consolas', 'Candara',
  'Corbel', 'Constantia', 'Garamond', 'Century Gothic',
  'Book Antiqua', 'Franklin Gothic Medium', 'Tahoma', 'Arial',
  // Cross-platform
  'Comic Sans MS', 'Arial Black', 'Lucida Console',
]

/**
 * Detect whether a font is actually available by measuring a test string
 * against the default monospace and sans-serif baselines.
 */
function isFontAvailable(family: string): boolean {
  if (typeof document === 'undefined') return false
  const testString = 'mmmmmmmmmmlli'
  const testSize = '72px'
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  const measure = (f: string) => {
    ctx.font = `${testSize} ${f}`
    return ctx.measureText(testString).width
  }

  const monoWidth = measure('monospace')
  const sansWidth = measure('sans-serif')
  const testWidth = measure(`"${family}", monospace`)
  const testWidth2 = measure(`"${family}", sans-serif`)

  return testWidth !== monoWidth || testWidth2 !== sansWidth
}

/**
 * Deduplicate font families, returning unique family names sorted alphabetically.
 */
function deduplicateFamilies(fonts: Array<{ family: string }>): string[] {
  const seen = new Set<string>()
  for (const f of fonts) {
    seen.add(f.family)
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b))
}

/**
 * Attempts to enumerate local/OS fonts using the Local Font Access API
 * (Chromium 103+). Falls back to canvas-based detection of common system fonts.
 */
export function useLocalFonts() {
  const [fonts, setFonts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'api' | 'probe'>('probe')

  useEffect(() => {
    let cancelled = false

    async function enumerate() {
      // Try the Local Font Access API first (Chromium 103+)
      if ('queryLocalFonts' in window) {
        try {
          const localFonts: LocalFont[] = await (window as unknown as { queryLocalFonts: () => Promise<LocalFont[]> }).queryLocalFonts()
          if (!cancelled) {
            setFonts(deduplicateFamilies(localFonts))
            setSource('api')
            setLoading(false)
          }
          return
        } catch {
          // Permission denied or API failed — fall through to probe
        }
      }

      // Fallback: probe common system fonts with canvas measurement
      const available = COMMON_SYSTEM_FONTS.filter(isFontAvailable)
      if (!cancelled) {
        setFonts(available)
        setSource('probe')
        setLoading(false)
      }
    }

    enumerate()
    return () => { cancelled = true }
  }, [])

  return { fonts, loading, source }
}
