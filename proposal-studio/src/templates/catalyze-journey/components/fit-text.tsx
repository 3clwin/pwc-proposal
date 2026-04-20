'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import {
  prepareWithSegments,
  measureLineStats,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import { cn } from '@/lib/utils'

/**
 * <FitText> — a label that uses pretext (browser-free text measurement)
 * to pick the largest font size where the text fits inside its parent
 * box. Used in deck-fidelity SVG diagrams where labels live inside
 * fixed-size capability tiles, pills, milestone callouts, etc.
 *
 * Why pretext instead of `getBoundingClientRect`:
 *   • No layout reflow — measurement is pure arithmetic over canvas
 *     `measureText` widths.
 *   • Deterministic across resizes — no thrashing.
 *   • Works for tight 60×24 tiles where browser line-wrap heuristics
 *     would otherwise overflow or clip silently.
 *
 * The component shrink-fits font size in steps from `maxFontPx` down to
 * `minFontPx`, picking the largest value that fits within the parent's
 * `maxLines` * `lineHeight` budget at the parent's measured width.
 */

interface FitTextProps {
  text: string
  /** Font family (canvas shorthand without size — size is appended). */
  fontFamily?: string
  fontWeight?: number | string
  /** Largest font size to try (px). Default 14. */
  maxFontPx?: number
  /** Smallest font size to fall back to (px). Default 9. */
  minFontPx?: number
  /** Step in px between size attempts. Default 1. */
  stepPx?: number
  /** Line-height multiplier (e.g. 1.2). Default 1.2. */
  lineHeight?: number
  /** Max lines the text may wrap to. Default 2. */
  maxLines?: number
  /** Extra horizontal padding to subtract from the measured width (px). */
  paddingX?: number
  className?: string
  style?: React.CSSProperties
  as?: 'span' | 'div' | 'p'
}

// Cache prepared text per (text + font) — pretext recommends not re-running
// `prepareWithSegments` for the same inputs. Resize only re-runs the cheap
// `measureLineStats` call.
const PREPARED_CACHE = new Map<string, PreparedTextWithSegments>()

function getPrepared(text: string, font: string): PreparedTextWithSegments {
  const key = `${font}|${text}`
  let prepared = PREPARED_CACHE.get(key)
  if (!prepared) {
    prepared = prepareWithSegments(text, font)
    PREPARED_CACHE.set(key, prepared)
  }
  return prepared
}

export function FitText({
  text,
  fontFamily = 'Inter, ui-sans-serif, system-ui, sans-serif',
  fontWeight = 500,
  maxFontPx = 14,
  minFontPx = 9,
  stepPx = 1,
  lineHeight = 1.2,
  maxLines = 2,
  paddingX = 0,
  className,
  style,
  as: As = 'span',
}: FitTextProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const [fontSize, setFontSize] = useState(maxFontPx)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || typeof window === 'undefined') return

    const compute = () => {
      const width = el.clientWidth - paddingX
      if (width <= 0) return
      // Walk font sizes from largest to smallest; first one that fits wins.
      let chosen = minFontPx
      for (let size = maxFontPx; size >= minFontPx; size -= stepPx) {
        const font = `${fontWeight} ${size}px ${fontFamily}`
        const prepared = getPrepared(text, font)
        const { lineCount, maxLineWidth } = measureLineStats(prepared, width)
        if (lineCount <= maxLines && maxLineWidth <= width) {
          chosen = size
          break
        }
      }
      setFontSize(chosen)
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text, fontFamily, fontWeight, maxFontPx, minFontPx, stepPx, maxLines, paddingX])

  return (
    <As
      ref={containerRef as React.Ref<HTMLElement & HTMLDivElement & HTMLParagraphElement & HTMLSpanElement>}
      className={cn('block w-full', className)}
      style={{
        fontSize,
        lineHeight,
        ...style,
      }}
    >
      {text}
    </As>
  )
}
