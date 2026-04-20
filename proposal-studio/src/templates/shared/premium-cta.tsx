'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Premium CTA — a pill-shaped, token-aware call-to-action with an arrow
 * affordance that animates on hover. This is the "hero button" shape we
 * use across templates when taste demands theatre beyond shadcn Button.
 *
 * Reads `--primary`, `--primary-foreground`, `--primary-hover` from the
 * ProposalCanvas so it auto-matches the client's brand without further
 * config.
 */

type Variant = 'solid' | 'outline' | 'ghost'

interface PremiumCTAProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  /** Show arrow glyph with slide-on-hover animation. Default true. */
  arrow?: boolean
  /** Tone context — `dark` flips the default variant to work on dark surfaces. */
  tone?: 'default' | 'dark'
  /** Size scale. Cover CTA uses `lg`, body CTAs use `md`. */
  size?: 'md' | 'lg'
  className?: string
}

export function PremiumCTA({
  children,
  href,
  onClick,
  variant = 'solid',
  arrow = true,
  tone = 'default',
  size = 'md',
  className,
}: PremiumCTAProps) {
  const isDark = tone === 'dark'

  const solid = isDark
    ? 'bg-white text-[#111111] hover:bg-[#e8e3db]'
    : 'bg-primary text-primary-foreground hover:bg-primary-hover'

  const outline = isDark
    ? 'border border-white/70 text-white hover:bg-white hover:text-[#111111]'
    : 'border border-[#d31710] text-[#d31710] hover:bg-[#d31710] hover:text-white'

  const ghost = isDark
    ? 'text-white/80 hover:text-white'
    : 'text-foreground hover:text-[#d31710]'

  const variantClasses: Record<Variant, string> = {
    solid,
    outline,
    ghost,
  }

  const sizeClasses =
    size === 'lg'
      ? 'h-12 px-7 text-[15px]'
      : 'h-10 px-5 text-sm'

  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
        />
      )}
    </>
  )

  const baseClasses = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full font-label uppercase tracking-[0.18em] transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    isDark ? 'focus-visible:ring-white/60' : 'focus-visible:ring-[#d31710]/30',
    sizeClasses,
    variantClasses[variant],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {inner}
    </button>
  )
}

// ─────────────────── PremiumCard ───────────────────

interface PremiumCardProps {
  children: ReactNode
  /** Warm surface tone from the LDS neutral ramps. */
  surface?: 'white' | 'rose' | 'cream' | 'sage' | 'stone' | 'dark'
  /** Apply editorial drop shadow (`--lds-g-shadow-bottom-2`). Default true. */
  elevated?: boolean
  /** Top-border accent stripe (Lilly Red). Used for vanguard-style cards. */
  topAccent?: boolean
  className?: string
}

const CARD_SURFACE: Record<NonNullable<PremiumCardProps['surface']>, string> = {
  white: '#ffffff',
  rose: '#fbf5f4',
  cream: '#fcf5ed',
  sage: '#f0f8f6',
  stone: '#f3f7fa',
  dark: '#1e2a30',
}

export function PremiumCard({
  children,
  surface = 'white',
  elevated = true,
  topAccent = false,
  className,
}: PremiumCardProps) {
  const isDark = surface === 'dark'
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-6 transition-all duration-300',
        isDark ? 'text-white' : 'text-foreground',
        elevated && 'shadow-[0_2px_4px_rgba(52,63,65,0.16),0_4px_6px_rgba(52,63,65,0.1)]',
        className,
      )}
      style={{
        backgroundColor: CARD_SURFACE[surface],
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(17,17,17,0.05)',
        borderWidth: 1,
      }}
    >
      {topAccent && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: '#d31710' }}
        />
      )}
      {children}
    </div>
  )
}
