import type { BrandTokens } from '@/types'

/**
 * Produce a "resolved" brand-token view that a premium template can consume
 * without worrying about which fields the client actually provided.
 *
 * Layers of source:
 *   1. Fully-declared semantic tokens (e.g. Lilly's LDS) → used verbatim
 *   2. Core slots + palettes → we derive secondary roles (muted, border,
 *      primary-hover, etc.) from the ramps so things still look on-brand
 *   3. Simulated/unknown clients → tasteful neutral fallbacks so we never
 *      render a broken system
 *
 * This is the judgment layer the user asked for: when we don't have client
 * examples for a role, we use sensible derivations from what we do have.
 */

export interface ResolvedBrandTokens {
  /** Core brand palette (always present) */
  primary: string
  primaryHover: string
  primaryPressed: string
  primaryForeground: string
  primaryDisabled: string
  primaryDisabledForeground: string

  /** Neutrals and surfaces */
  foreground: string
  background: string
  muted: string
  mutedForeground: string
  border: string
  ring: string

  /** Content surfaces */
  card: string
  cardForeground: string

  /** Accents pulled from the brand palette for use in bespoke organisms */
  accentWarm: string
  accentCool: string

  /** Provenance — tells UIs whether each group came from real tokens or was derived. */
  provenance: {
    primary: 'real' | 'derived' | 'simulated'
    neutrals: 'real' | 'derived' | 'simulated'
    semantic: 'real' | 'derived' | 'simulated'
  }
}

function pickRamp(
  tokens: BrandTokens,
  family: string
): string[] | undefined {
  const ramp = tokens.colors.palettes?.[family]
  if (!ramp || ramp.length < 6) return undefined
  return ramp
}

/**
 * Resolve a client's brand tokens into a complete, ready-to-consume set
 * with sensible fallbacks for anything missing.
 */
export function deriveTokens(tokens: BrandTokens): ResolvedBrandTokens {
  const hasNamed = !!tokens.colors.named && tokens.colors.named.length > 0
  const hasSemantic = !!tokens.colors.semantic && tokens.colors.semantic.length > 0
  const hasPalettes = Object.keys(tokens.colors.palettes ?? {}).length > 0

  const primaryRamp = pickRamp(tokens, 'red') || pickRamp(tokens, 'primary')
  const neutralRamp =
    pickRamp(tokens, 'neutral') || pickRamp(tokens, 'stone')

  // Primary — verbatim when available, else assemble from the brand ramp.
  const primary = tokens.colors.primary
  const primaryHover =
    primaryRamp?.[7] ?? // e.g. red-070 (darker)
    tokens.colors.tertiary ??
    primary
  const primaryPressed = primaryRamp?.[6] ?? primary
  const primaryForeground = '#ffffff'

  // Neutrals — pull from the ramp when we have one, otherwise use LDS-like
  // warm neutrals that stay consistent with most pharma/consumer brands.
  const foreground = tokens.colors.secondary || neutralRamp?.[11] || '#111111'
  const background = '#ffffff'
  const muted = neutralRamp?.[1] || '#f5f5f5'
  const mutedForeground =
    neutralRamp?.[5] || tokens.colors.neutral || '#6a6a6a'
  const border = neutralRamp?.[2] || '#e2e2e2'

  // Accents — pick one warm and one cool from the palette family if present.
  const warmRamp =
    pickRamp(tokens, 'orange') ||
    pickRamp(tokens, 'gold') ||
    pickRamp(tokens, 'red')
  const coolRamp =
    pickRamp(tokens, 'azure') ||
    pickRamp(tokens, 'blue') ||
    pickRamp(tokens, 'teal')

  const accentWarm = warmRamp?.[5] || tokens.colors.accent || '#daaa00'
  const accentCool = coolRamp?.[5] || tokens.colors.tertiary || '#468ee0'

  // Disabled — this is a Proposal Studio convention from the button spec;
  // keep it independent of client tokens for consistency.
  const primaryDisabled = '#DFE3E6'
  const primaryDisabledForeground = '#8E95A2'

  const provenance: ResolvedBrandTokens['provenance'] = {
    primary: primary ? (hasNamed ? 'real' : 'derived') : 'simulated',
    neutrals: hasPalettes ? 'real' : 'derived',
    semantic: hasSemantic ? 'real' : 'derived',
  }

  return {
    primary,
    primaryHover,
    primaryPressed,
    primaryForeground,
    primaryDisabled,
    primaryDisabledForeground,
    foreground,
    background,
    muted,
    mutedForeground,
    border,
    ring: primary,
    card: background,
    cardForeground: foreground,
    accentWarm,
    accentCool,
    provenance,
  }
}
