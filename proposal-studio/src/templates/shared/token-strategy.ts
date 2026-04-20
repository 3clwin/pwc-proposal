import type { ResolvedBrandTokens } from '@/lib/derive-tokens'

/**
 * Per-template aesthetic interpretation of the client's tokens.
 *
 * Each template declares its own strategy so the same client tokens
 * produce visually distinct sites. The strategy is NOT a theme — it's a
 * set of decisions about how the template prefers to use the tokens.
 *
 * Example: two templates receiving identical Lilly tokens. Editorial
 * Pharma uses solid-red CTAs with minimal shadows. Vanguard uses red
 * only as a single accent word in a black canvas. Same palette,
 * different interpretations.
 */

export type Surface =
  | 'white'
  | 'rose'
  | 'cream'
  | 'sage'
  | 'stone'
  | 'dark'

export type CTAVariant = 'solid' | 'outline' | 'ghost'

export type SectionDivider = 'hairline-red' | 'whitespace' | 'rule'

export interface TokenStrategy {
  /** Which surface rotation the template cycles through section-by-section. */
  surfaceRotation: Surface[]
  /** Primary CTA variant for hero and footer CTAs. */
  heroCTAVariant: CTAVariant
  /** Inline / secondary CTA variant (used inside content). */
  inlineCTAVariant: CTAVariant
  /** How sections are visually separated. */
  sectionDivider: SectionDivider
  /** How heavy the red accent is used. */
  accentUsage: 'minimal' | 'moderate' | 'bold'
  /** Whether the template is dark-first (canvas = foreground color). */
  darkFirst?: boolean
  /** Optional surface the template uses as its dominant base (overrides rotation[0]). */
  baseSurface?: Surface
}

/**
 * Resolve a surface key to a concrete hex, given the client's resolved
 * token set. Keeps template code free of hex literals for neutrals.
 */
export function surfaceHex(surface: Surface, tokens: ResolvedBrandTokens): string {
  switch (surface) {
    case 'white':
      return tokens.background
    case 'rose':
      return '#fbf5f4'
    case 'cream':
      return '#fcf5ed'
    case 'sage':
      return '#f0f8f6'
    case 'stone':
      return '#f3f7fa'
    case 'dark':
      return tokens.foreground
  }
}

/**
 * Default strategy — used as a fallback when a template doesn't declare
 * its own. Editorial and restrained.
 */
export const DEFAULT_STRATEGY: TokenStrategy = {
  surfaceRotation: ['white', 'cream'],
  heroCTAVariant: 'solid',
  inlineCTAVariant: 'ghost',
  sectionDivider: 'whitespace',
  accentUsage: 'moderate',
}
