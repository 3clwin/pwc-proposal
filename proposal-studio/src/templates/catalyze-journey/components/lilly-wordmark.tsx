/**
 * Lilly cursive wordmark + co-brand lockup.
 *
 * Source: vendored SVG `/lilly-wordmark.svg` — pulled from lilly.com's
 * Adobe AEM CDN (`LillyLogo_RGB_Red_v3.svg`). Used in this template only,
 * for a simulation-mode RFP mockup; not for production client work.
 *
 * `LillyWordmark` renders the wordmark at a given height; width is derived
 * from the source aspect ratio (97×52 ≈ 1.865:1). `tone='red'` uses the
 * brand red as authored; `tone='inverse'` inverts the SVG to white via
 * CSS filters for use on dark surfaces.
 *
 * `LillyCatalyze360Lockup` is the exact center-of-honeycomb mark from
 * deck slide 11: cursive "Lilly" + tiny mono "catalyze360™" stacked or
 * inline depending on `orientation`.
 */
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LillyWordmarkProps {
  /** Height in px. Width derives from source aspect (97×52). */
  height?: number
  tone?: 'red' | 'inverse'
  className?: string
}

const SRC_ASPECT = 97 / 52

export function LillyWordmark({
  height = 32,
  tone = 'red',
  className,
}: LillyWordmarkProps) {
  const width = Math.round(height * SRC_ASPECT)
  return (
    <Image
      src="/lilly-wordmark.svg"
      alt="Lilly"
      width={width}
      height={height}
      priority
      className={cn(
        'inline-block select-none',
        tone === 'inverse' && 'brightness-0 invert',
        className,
      )}
      style={{ height, width }}
    />
  )
}

interface LockupProps {
  /** Wordmark height; the "catalyze360" type scales relative to this. */
  height?: number
  tone?: 'red' | 'inverse'
  orientation?: 'inline' | 'stacked'
  className?: string
}

/**
 * Co-brand lockup matching the deck-slide-11 honeycomb center cell:
 * cursive Lilly wordmark + small "catalyze360™" word in mono next to it.
 */
export function LillyCatalyze360Lockup({
  height = 28,
  tone = 'red',
  orientation = 'inline',
  className,
}: LockupProps) {
  const labelColor = tone === 'inverse' ? '#ffffff' : '#0b0f14'
  const labelSize = Math.max(8, Math.round(height * 0.32))
  return (
    <span
      className={cn(
        'inline-flex select-none items-center',
        orientation === 'stacked' ? 'flex-col gap-1' : 'flex-row gap-2',
        className,
      )}
    >
      <LillyWordmark height={height} tone={tone} />
      <span
        className="font-mono uppercase leading-none"
        style={{
          color: labelColor,
          fontSize: labelSize,
          letterSpacing: '0.18em',
        }}
      >
        catalyze360
        <sup
          className="ml-px"
          style={{ fontSize: Math.max(6, labelSize - 2), top: '-0.4em' }}
        >
          ™
        </sup>
      </span>
    </span>
  )
}
