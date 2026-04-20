import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type Tone =
  | 'stone'
  | 'rose'
  | 'cream'
  | 'sage'
  | 'dark'
  | 'brand'
  | 'lilly-blue'
  | 'lilly-sky'

const TONE_BG: Record<Tone, string> = {
  stone: '#f3f7fa',
  rose: '#fbf5f4',
  cream: '#fcf5ed',
  sage: '#f0f8f6',
  dark: '#1e2a30',
  brand: '#501009',
  'lilly-blue': '#e5eff4',
  'lilly-sky': '#d4e3ec',
}

const TONE_INK: Record<Tone, string> = {
  stone: '#606c73',
  rose: '#9f180f',
  cream: '#846700',
  sage: '#005a56',
  dark: '#ffffff',
  brand: '#ffffff',
  'lilly-blue': '#0b5e91',
  'lilly-sky': '#0b4a6f',
}

interface PlaceholderImageProps {
  /** Aspect ratio expressed CSS-style, e.g. "4/5" or "16/9". Defaults to "3/2". */
  aspect?: string
  /** Warm neutral tone for the fill. */
  tone?: Tone
  /** Small label describing what content should eventually live here. */
  label?: string
  /** Optional second line for the label (role, crop hint, etc.). */
  caption?: string
  /** Optional monogram — renders as oversized ghost initials (e.g. "NA"). */
  monogram?: string
  className?: string
  style?: CSSProperties
  /**
   * When true, renders the placeholder as a square portrait container with
   * rounded corners picked up from --radius-lg in the canvas.
   */
  rounded?: boolean
}

/**
 * Swappable visual placeholder. Renders a warm-neutral block with a faint
 * diagonal weave so empty layouts still have rhythm. Drop-in replacement for
 * real imagery during template scaffolding — just change `src` later.
 *
 * Reads color tones from the LDS neutral ramps so it never looks alien
 * inside a proposal canvas bound to Lilly (or any client) tokens.
 */
export function PlaceholderImage({
  aspect = '3/2',
  tone = 'stone',
  label,
  caption,
  monogram,
  rounded = false,
  className,
  style,
}: PlaceholderImageProps) {
  const bg = TONE_BG[tone]
  const ink = TONE_INK[tone]

  return (
    <div
      aria-hidden={!label}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cn(
        'relative flex w-full items-end overflow-hidden',
        rounded && 'rounded-xl',
        className,
      )}
      style={{
        aspectRatio: aspect,
        backgroundColor: bg,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 12px, ${ink}0a 12px 13px)`,
        ...style,
      }}
    >
      {monogram && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[clamp(60px,18cqw,140px)] leading-none"
          style={{
            color: ink,
            opacity: 0.16,
            letterSpacing: '-0.02em',
            fontStyle: 'italic',
          }}
        >
          {monogram}
        </span>
      )}
      {(label || caption) && (
        <div
          className="relative z-10 flex w-full items-baseline justify-between gap-4 px-4 pb-3"
          style={{ color: ink }}
        >
          {label && (
            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{ opacity: 0.7 }}
            >
              {label}
            </span>
          )}
          {caption && (
            <span
              className="font-mono text-[10px]"
              style={{ opacity: 0.5 }}
            >
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
