'use client'

import { useReducedMotion } from 'framer-motion'

/**
 * 9-dot random pulse spinner (Cursor-style).
 *
 * 3×3 grid of round dots. Each dot pulses with a uniquely
 * seeded animation duration and delay to create a chaotic
 * but balanced shimmer effect without any JS loop overhead.
 *
 * Inherits color via `currentColor` so it picks up
 * whatever `text-*` utility you set on it (e.g. `text-primary`).
 *
 * Honors `prefers-reduced-motion` with a static center-dot.
 */

const GRID_SIZE = 3

// Pre-computed delays and durations to avoid SSR hydration mismatches
// while still looking delightfully random.
const DOT_DELAYS = [
  0.0, 0.4, 0.8,
  0.7, 0.1, 0.5,
  0.3, 0.9, 0.2,
]

const DOT_DURATIONS = [
  1.2, 0.9, 1.1,
  1.0, 1.3, 0.8,
  1.4, 1.1, 0.9,
]

export interface BrailleSpinnerProps {
  /** Legacy prop, ignored in the new CSS-animated version. */
  intervalMs?: number
  /** Visual size (CSS length). Defaults to 0.75em. */
  size?: string | number
  /** Custom class — color via `text-*`. */
  className?: string
  /** Set `null` when used inside an outer live region. */
  label?: string | null
}

/**
 * Component name kept as `BrailleSpinner` for backwards-compat with
 * existing imports.
 */
export function BrailleSpinner({
  size = '0.75em',
  className,
  label = 'Loading',
}: BrailleSpinnerProps) {
  const reduce = useReducedMotion()

  const containerStyle: React.CSSProperties = {
    width: typeof size === 'number' ? `${size}px` : size,
    aspectRatio: '1 / 1',
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
    gap: '20%',
  }

  const a11yProps =
    label === null
      ? ({ 'aria-hidden': true } as const)
      : ({
          role: 'status',
          'aria-live': 'polite',
          'aria-label': label,
        } as const)

  return (
    <span
      className={`inline-block leading-none ${className ?? ''}`}
      style={containerStyle}
      {...a11yProps}
    >
      <style suppressHydrationWarning>{`
        @keyframes cursor-spinner-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }
      `}</style>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
        const isCenter = i === 4
        return (
          <span
            key={i}
            aria-hidden
            style={{
              backgroundColor: 'currentColor',
              borderRadius: '50%',
              opacity: reduce ? (isCenter ? 0.85 : 0.15) : 0.15,
              animation: reduce
                ? 'none'
                : `cursor-spinner-pulse ${DOT_DURATIONS[i]}s ease-in-out infinite`,
              animationDelay: `${DOT_DELAYS[i]}s`,
            }}
          />
        )
      })}
    </span>
  )
}
