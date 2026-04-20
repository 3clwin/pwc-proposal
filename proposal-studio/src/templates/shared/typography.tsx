import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared editorial typography primitives. Every premium template composes
 * these so rhythm, weight, and tone stay consistent across the system.
 *
 * All primitives read font stacks from the surrounding ProposalCanvas —
 * `font-display` resolves to the client's serif display face (Garamond for
 * Lilly → EB Garamond fallback), `font-sans` to their body face, and
 * `font-label` to their wide-sans label face when available.
 */

// ─────────────────── Eyebrow ───────────────────

interface EyebrowProps {
  children: ReactNode
  /** When true, draws a 1px Lilly Red hairline after the label. */
  rule?: boolean
  /** Number of the chapter, e.g. "01". Rendered with a middle-dot before the label. */
  number?: string
  className?: string
  tone?: 'default' | 'red' | 'inverse'
}

const EYEBROW_COLOR: Record<NonNullable<EyebrowProps['tone']>, string> = {
  default: '#1e2a30',
  red: '#d31710',
  inverse: '#ffffff',
}

export function Eyebrow({
  children,
  rule = false,
  number,
  tone = 'default',
  className,
}: EyebrowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 font-label text-[12px] uppercase tracking-[0.28em]',
        className,
      )}
      style={{ color: EYEBROW_COLOR[tone] }}
    >
      {number && (
        <>
          <span className="tabular-nums">{number}</span>
          <span aria-hidden className="opacity-40">
            ·
          </span>
        </>
      )}
      <span>{children}</span>
      {rule && (
        <span
          aria-hidden
          className="h-px flex-1"
          style={{ backgroundColor: '#d31710', opacity: 0.6 }}
        />
      )}
    </div>
  )
}

// ─────────────────── DisplayTitle ───────────────────

interface DisplayTitleProps {
  children: ReactNode
  as?: 'h1' | 'h2'
  /** Size scale. `hero` is cover-page scale, `display` is chapter-opener scale. */
  size?: 'hero' | 'display' | 'title'
  tone?: 'default' | 'inverse'
  italic?: boolean
  className?: string
  style?: CSSProperties
}

const SIZE_CLAMP: Record<NonNullable<DisplayTitleProps['size']>, string> = {
  hero: 'clamp(48px, 10vw, 124px)',
  display: 'clamp(40px, 7vw, 88px)',
  title: 'clamp(28px, 4vw, 48px)',
}

export function DisplayTitle({
  children,
  as: Tag = 'h2',
  size = 'display',
  tone = 'default',
  italic = false,
  className,
  style,
}: DisplayTitleProps) {
  return (
    <Tag
      className={cn('font-display leading-[1.04] tracking-[-0.01em]', className)}
      style={{
        fontSize: SIZE_CLAMP[size],
        color: tone === 'inverse' ? '#ffffff' : '#1e2a30',
        fontStyle: italic ? 'italic' : undefined,
        fontWeight: 400,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

// ─────────────────── SectionHeading ───────────────────

interface SectionHeadingProps {
  children: ReactNode
  as?: 'h2' | 'h3'
  tone?: 'default' | 'inverse' | 'red'
  className?: string
}

export function SectionHeading({
  children,
  as: Tag = 'h3',
  tone = 'default',
  className,
}: SectionHeadingProps) {
  const color = tone === 'inverse' ? '#ffffff' : tone === 'red' ? '#d31710' : '#1e2a30'
  return (
    <Tag
      className={cn(
        'font-display text-[clamp(24px,3vw,36px)] font-normal leading-[1.15] tracking-[-0.005em]',
        className,
      )}
      style={{ color }}
    >
      {children}
    </Tag>
  )
}

// ─────────────────── Lede ───────────────────

interface LedeProps {
  children: ReactNode
  tone?: 'default' | 'muted' | 'inverse'
  className?: string
}

export function Lede({ children, tone = 'muted', className }: LedeProps) {
  const color = tone === 'inverse' ? '#ffffff' : tone === 'muted' ? '#3a3a3a' : '#191919'
  return (
    <p
      className={cn(
        'max-w-[680px] font-sans text-[clamp(17px,1.3vw,20px)] leading-[1.6]',
        className,
      )}
      style={{ color }}
    >
      {children}
    </p>
  )
}

// ─────────────────── PullQuote ───────────────────

interface PullQuoteProps {
  children: ReactNode
  attribution?: string
  tone?: 'default' | 'inverse'
  className?: string
}

export function PullQuote({
  children,
  attribution,
  tone = 'default',
  className,
}: PullQuoteProps) {
  const textColor = tone === 'inverse' ? '#ffffff' : '#191919'
  const attrColor = tone === 'inverse' ? 'rgba(255,255,255,0.7)' : '#6a6a6a'
  // Reserve space on the left for the decorative glyph so it never escapes
  // the figure or overlaps the quote text / attribution, regardless of how
  // the consuming container is padded.
  return (
    <figure
      className={cn(
        'relative flex flex-col gap-6 pt-4 pl-12 sm:pl-14',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 font-display leading-none text-[72px] sm:text-[96px]"
        style={{ color: '#d31710', opacity: 0.9, letterSpacing: '-0.03em' }}
      >
        “
      </span>
      <blockquote
        className="relative font-display text-[clamp(22px,2.4vw,36px)] italic leading-[1.3]"
        style={{ color: textColor, fontStyle: 'italic' }}
      >
        {children}
      </blockquote>
      {attribution && (
        <figcaption
          className="font-label text-[11px] uppercase tracking-[0.24em]"
          style={{ color: attrColor }}
        >
          {attribution}
        </figcaption>
      )}
    </figure>
  )
}

// ─────────────────── StatNumeral ───────────────────

interface StatNumeralProps {
  value: string
  caption?: string
  sub?: string
  tone?: 'default' | 'inverse' | 'red'
  align?: 'left' | 'center'
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

const STAT_SIZE: Record<NonNullable<StatNumeralProps['size']>, string> = {
  md: 'clamp(44px, 5vw, 72px)',
  lg: 'clamp(56px, 7vw, 104px)',
  xl: 'clamp(72px, 9vw, 140px)',
}

export function StatNumeral({
  value,
  caption,
  sub,
  tone = 'default',
  align = 'left',
  size = 'lg',
  className,
}: StatNumeralProps) {
  const numColor = tone === 'inverse' ? '#ffffff' : tone === 'red' ? '#d31710' : '#1e2a30'
  const capColor = tone === 'inverse' ? 'rgba(255,255,255,0.72)' : '#606c73'
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <span
        className="font-display tabular-nums leading-[0.95] tracking-[-0.02em]"
        style={{
          fontSize: STAT_SIZE[size],
          color: numColor,
          fontWeight: 400,
        }}
      >
        {value}
      </span>
      {caption && (
        <span
          className="font-label text-[11px] uppercase tracking-[0.24em]"
          style={{ color: capColor }}
        >
          {caption}
        </span>
      )}
      {sub && (
        <span className="max-w-[280px] font-sans text-[13px] leading-[1.5]" style={{ color: capColor }}>
          {sub}
        </span>
      )}
    </div>
  )
}

// ─────────────────── EditorialContainer ───────────────────

interface EditorialContainerProps {
  children: ReactNode
  /** Section max width. `reading` = 720px (long-form body), `wide` = 1200px (default), `full` = 1440px. */
  measure?: 'reading' | 'wide' | 'full'
  className?: string
}

const MEASURE: Record<NonNullable<EditorialContainerProps['measure']>, string> = {
  reading: 'max-w-[720px]',
  wide: 'max-w-[1200px]',
  full: 'max-w-[1440px]',
}

export function EditorialContainer({
  children,
  measure = 'wide',
  className,
}: EditorialContainerProps) {
  return (
    <div className={cn('mx-auto px-6 sm:px-10 lg:px-16', MEASURE[measure], className)}>
      {children}
    </div>
  )
}
