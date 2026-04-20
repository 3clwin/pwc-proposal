import type { BrandTokens, ThemeVariant } from '@/types'

/**
 * Simulated brand extraction fallback.
 * In production, this would use Playwright MCP to crawl the client site.
 * For the prototype, we generate sensible defaults based on the client slug
 * and a base color heuristic.
 */
export function generateSimulatedBrandTokens(
  clientSlug: string,
  clientUrl: string
): BrandTokens {
  const hue = hashStringToHue(clientUrl)
  const primary = hslToHex(hue, 65, 50)
  const secondary = hslToHex((hue + 30) % 360, 55, 45)
  const tertiary = hslToHex((hue + 210) % 360, 45, 55)
  const neutral = '#4A4A4A'
  const accent = hslToHex((hue + 180) % 360, 70, 55)

  const tokenPrefix = `--ps-${clientSlug}-`

  return {
    clientSlug,
    tokenPrefix,
    colors: {
      primary,
      secondary,
      tertiary,
      neutral,
      accent,
      palettes: {
        primary: generatePalette(hue, 65),
        secondary: generatePalette((hue + 30) % 360, 55),
        tertiary: generatePalette((hue + 210) % 360, 45),
        neutral: generateNeutralPalette(),
      },
    },
    typography: {
      headline: { family: 'Inter', weight: '700' },
      body: { family: 'Inter', weight: '400' },
      label: { family: 'Inter', weight: '500' },
      fontScale: {
        'font-scale-1': { rem: '0.75rem', px: 12, usage: 'Helper text' },
        'font-scale-2': { rem: '0.8125rem', px: 13, usage: 'Captions' },
        'font-scale-3': { rem: '0.875rem', px: 14, usage: 'Body text' },
        'font-scale-4': { rem: '1rem', px: 16, usage: 'Large body' },
        'font-scale-5': { rem: '1.25rem', px: 20, usage: 'Subheading' },
        'font-scale-6': { rem: '1.5rem', px: 24, usage: 'Section heading' },
        'font-scale-7': { rem: '2rem', px: 32, usage: 'Page heading' },
      },
    },
    spacing: {
      'spacing-1': { rem: '0.25rem', px: 4, usage: 'Minimal gaps' },
      'spacing-2': { rem: '0.5rem', px: 8, usage: 'Tight spacing' },
      'spacing-3': { rem: '0.75rem', px: 12, usage: 'Small padding' },
      'spacing-4': { rem: '1rem', px: 16, usage: 'Standard padding' },
      'spacing-5': { rem: '1.5rem', px: 24, usage: 'Medium sections' },
      'spacing-6': { rem: '2rem', px: 32, usage: 'Section spacing' },
      'spacing-7': { rem: '3rem', px: 48, usage: 'Large sections' },
      'spacing-8': { rem: '4rem', px: 64, usage: 'Page sections' },
    },
    radius: {
      'radius-1': { value: '0.25rem', usage: 'Subtle rounding' },
      'radius-2': { value: '0.375rem', usage: 'Buttons/inputs' },
      'radius-3': { value: '0.5rem', usage: 'Cards' },
      'radius-4': { value: '0.75rem', usage: 'Modals' },
      'radius-circle': { value: '9999px', usage: 'Avatars/pills' },
    },
    shadow: {
      'shadow-1': { value: '0 1px 2px rgba(0,0,0,0.05)', usage: 'Subtle elevation' },
      'shadow-2': { value: '0 2px 8px rgba(0,0,0,0.08)', usage: 'Cards/tiles' },
      'shadow-3': { value: '0 4px 16px rgba(0,0,0,0.12)', usage: 'Dropdowns' },
      'shadow-4': { value: '0 8px 32px rgba(0,0,0,0.16)', usage: 'Modals/overlays' },
    },
    logo: {
      url: '/placeholder-logo.svg',
      format: 'svg',
    },
    heroImages: [],
    brandVoice: ['professional', 'innovative', 'trustworthy'],
  }
}

export function generateDefaultThemeVariants(tokens: BrandTokens): ThemeVariant[] {
  const variants: Omit<ThemeVariant, 'tokens'>[] = [
    {
      id: 'clinical-authority',
      label: 'Editorial',
      description:
        'NYT Magazine meets a corporate white paper. Garamond display at editorial scale, italic drop-cap leads, 1px accent section hairlines, oversized stat numerals, and pull quotes with a hanging accent glyph.',
      colorWeight: 'light',
      layoutDensity: 'spacious',
      typeScale: 'editorial',
      accentUsage: 'minimal',
      preview: {
        heroStyle: 'Full-bleed photo hero with serif display headline and accent CTA',
        sectionLayout: 'Editorial single-column with alternating white and warm stone sections',
        navStyle: 'Sticky minimal top bar with pill CTA',
      },
    },
    {
      id: 'editorial-science',
      label: 'Atelier',
      description:
        'FT Weekend × gallery catalogue. Strict 60/40 split grid across every section, 4:5 editorial portraiture, accent-dot milestone timelines, Garamond italic display, and warm alternating surfaces.',
      colorWeight: 'medium',
      layoutDensity: 'spacious',
      typeScale: 'editorial',
      accentUsage: 'moderate',
      preview: {
        heroStyle: 'Split 60/40 hero — Garamond italic headline on the left, 4:5 image on the right',
        sectionLayout: 'Editorial columns with pull-quotes, photo-led case studies, alternating surfaces',
        navStyle: 'Centered serif wordmark with restrained link set',
      },
    },
    {
      id: 'bold-momentum',
      label: 'Vanguard',
      description:
        'Linear × Stripe, dark edition. Black canvas throughout with a floating white executive-summary card, accent-ramp horizontal data bars, vertical phase-stack roadmap, and no photography — type and color carry everything.',
      colorWeight: 'dark',
      layoutDensity: 'balanced',
      typeScale: 'modern',
      accentUsage: 'bold',
      preview: {
        heroStyle: 'Dark full-bleed hero with oversized display type and accent divider',
        sectionLayout: 'Color-blocked dark sections with accent feature cards and vertical phase-stack',
        navStyle: 'Translucent overlay nav with bold CTA button',
      },
    },
  ]

  return variants.map((v) => ({ ...v, tokens }))
}

// --- Color utility helpers ---

function hashStringToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(hue: number, saturation: number): string[] {
  return [95, 90, 80, 70, 60, 50, 40, 30, 20, 15].map((l) =>
    hslToHex(hue, saturation, l)
  )
}

function generateNeutralPalette(): string[] {
  return [97, 93, 87, 75, 62, 50, 38, 25, 15, 8].map((l) =>
    hslToHex(0, 0, l)
  )
}
