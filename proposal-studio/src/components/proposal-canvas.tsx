'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { BrandTokens } from '@/types'
import { cn } from '@/lib/utils'
import { stackForRole } from '@/lib/font-stacks'

interface ProposalCanvasProps {
  tokens: BrandTokens
  /** Render output as `<div>` (default) or whatever tag works for the layout. */
  as?: 'div' | 'section' | 'main' | 'article'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

const RAMP_STEPS = [
  '005', '010', '020', '030', '040', '050',
  '060', '070', '080', '090', '100', '105',
] as const

/**
 * Binds the client's brand tokens to the rendered subtree via scoped CSS
 * custom properties. Everything inside this component consumes the CLIENT
 * design system — typography, color, radius — regardless of how the app
 * chrome tokens are configured in `:root`.
 *
 * Why this exists: proposal previews (the theme page, design system view,
 * and rendered microsite) must never drift when we tune the app chrome for
 * Proposal Studio itself. This wrapper isolates them.
 */
export function ProposalCanvas({
  tokens,
  as: Tag = 'div',
  className,
  style,
  children,
}: ProposalCanvasProps) {
  const { colors, typography, radius, tokenPrefix } = tokens

  // Build proper font stacks from each role — the category hint picks the
  // right web-safe fallback (Garamond → EB Garamond serif, Ringside Sans →
  // Space Grotesk sans, Ringside Extra Wide → Bricolage Grotesque wide).
  const sansStack = stackForRole(typography.body)
  const displayStack = stackForRole(typography.headline)
  const labelStack = stackForRole(typography.label)

  // Derive interaction (hover / pressed) tones from the brand ramp that
  // contains `primary`. Lilly's actual design system specifies:
  //   • hover   → one step darker than primary  (#9f180f for Lilly Red)
  //   • pressed → two steps darker             (#6e1911 for Lilly Red)
  // Using the client's own ramp keeps these on-brand across every
  // template; if no ramp contains `primary` we fall back to `tertiary`
  // (one step toward black) and `primary` itself, which is what
  // shadcn's defaults expect.
  let hoverColor = colors.tertiary || colors.primary
  let pressedColor = colors.primary
  if (colors.palettes) {
    const primaryLower = colors.primary.toLowerCase()
    for (const ramp of Object.values(colors.palettes)) {
      const idx = ramp.findIndex((hex) => hex.toLowerCase() === primaryLower)
      if (idx >= 0) {
        hoverColor = ramp[idx + 1] ?? hoverColor
        pressedColor = ramp[idx + 2] ?? ramp[idx + 1] ?? pressedColor
        break
      }
    }
  }

  // Radius scale — map the client's numeric radius rungs onto Tailwind's
  // semantic scale. Falls back to a small default so Tailwind's rounded-*
  // utilities still render something if the client lacks radii.
  const r = (key: string, fallback: string) =>
    radius?.[key]?.value ?? fallback

  const cssVars: Record<string, string> = {
    // Font stacks — body for sans, headline for display, label for eyebrows
    '--font-sans': sansStack,
    '--font-heading': displayStack,
    '--font-display': displayStack,
    '--font-label': labelStack,
    '--font-template-sans': sansStack,
    '--font-template-display': displayStack,

    // Radius scale
    '--radius': r('2', '0.25rem'),
    '--radius-sm': r('1', '0.25rem'),
    '--radius-md': r('2', '0.25rem'),
    '--radius-lg': r('3', '0.375rem'),
    '--radius-xl': r('4', '0.5rem'),
    '--radius-2xl': r('5', '0.625rem'),
    '--radius-3xl': r('6', '0.75rem'),
    '--radius-4xl': r('7', '1rem'),

    // Semantic color slots consumed by shadcn primitives
    '--primary': colors.primary,
    '--primary-foreground': '#ffffff',
    '--primary-hover': hoverColor,
    '--primary-pressed': pressedColor,
    '--primary-disabled': '#DFE3E6',
    '--primary-disabled-foreground': '#8E95A2',

    '--foreground': colors.secondary || '#111111',
    '--background': '#ffffff',
    '--card': '#ffffff',
    '--card-foreground': colors.secondary || '#111111',
    '--popover': '#ffffff',
    '--popover-foreground': colors.secondary || '#111111',

    '--muted':
      colors.palettes?.neutral?.[0] ||
      colors.palettes?.stone?.[0] ||
      '#f5f5f5',
    '--muted-foreground':
      colors.palettes?.neutral?.[5] || colors.neutral || '#6a6a6a',

    '--secondary':
      colors.palettes?.neutral?.[0] ||
      colors.palettes?.stone?.[0] ||
      '#f5f5f5',
    '--secondary-foreground': colors.secondary || '#111111',

    '--accent':
      colors.palettes?.neutral?.[0] ||
      colors.palettes?.stone?.[0] ||
      '#f5f5f5',
    '--accent-foreground': colors.secondary || '#111111',

    '--border':
      colors.palettes?.neutral?.[2] ||
      colors.palettes?.stone?.[2] ||
      '#e2e2e2',
    '--input':
      colors.palettes?.neutral?.[2] ||
      colors.palettes?.stone?.[2] ||
      '#e2e2e2',
    '--ring': colors.primary,

    '--destructive': '#d31710',
  }

  // Expose the full --lds-color-{family}-{step} palette tokens so templates
  // that read them directly (rare) resolve to the client's real brand ramps.
  if (tokenPrefix && colors.palettes) {
    for (const [family, ramp] of Object.entries(colors.palettes)) {
      ramp.forEach((hex, i) => {
        const step = RAMP_STEPS[i]
        if (step) cssVars[`${tokenPrefix}color-${family}-${step}`] = hex
      })
    }
    // Core brand aliases
    cssVars[`${tokenPrefix}color-lilly-red`] = colors.primary
    cssVars[`${tokenPrefix}color-lilly-black`] = colors.secondary || '#111111'
    cssVars[`${tokenPrefix}color-lilly-white`] = '#ffffff'
  }

  return (
    <Tag
      data-proposal-canvas=""
      data-client-slug={tokens.clientSlug}
      className={cn('font-sans text-foreground', className)}
      style={{ ...(cssVars as CSSProperties), ...style }}
    >
      {children}
    </Tag>
  )
}
