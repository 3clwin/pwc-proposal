'use client'

import type { BrandTokens, NamedColor } from '@/types'

interface BrandPaletteProps {
  tokens: BrandTokens
  /** Optional override heading, defaults to "Brand Palette". */
  eyebrow?: string
  title?: string
  description?: string
  /**
   * Variant sets the section's surface treatment so it reads correctly
   * inside the host template. Light = on white/cream surfaces; dark = on
   * deep brand backgrounds like bold-momentum's stone.
   */
  variant?: 'light' | 'dark'
}

const GROUP_ORDER: NonNullable<NamedColor['group']>[] = [
  'brand',
  'bold',
  'vibrant',
  'neutral',
  'support',
]

const GROUP_LABELS: Record<NonNullable<NamedColor['group']>, string> = {
  brand: 'Core',
  bold: 'Bold',
  vibrant: 'Vibrant',
  neutral: 'Neutral',
  support: 'Supporting',
}

/**
 * BrandPalette renders the client's real brand palette as it appears in
 * their brand guide. When the client has a `named` color list (e.g. Lilly),
 * colors are grouped by role (Core, Bold, Vibrant, Neutral). Otherwise it
 * falls back to the core semantic slots (primary/secondary/tertiary).
 *
 * This is a proposal-facing component — stylistically matched to the host
 * template — not an editor dev tool. It lives in the generated proposal
 * site so the client can see their own identity rendered back to them.
 */
export function BrandPalette({
  tokens,
  eyebrow = 'Design foundations',
  title = 'Brand palette',
  description = 'Every surface, headline, and call to action in this proposal uses your real brand palette — the same tokens that drive your live site.',
  variant = 'light',
}: BrandPaletteProps) {
  const named = tokens.colors.named
  const surface = variant === 'dark' ? '#111111' : '#ffffff'
  const textOnSurface = variant === 'dark' ? '#ffffff' : '#111111'
  const mutedText = variant === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(17,17,17,0.62)'
  const hairline = variant === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(17,17,17,0.08)'
  const accent = tokens.colors.accent ?? tokens.colors.primary

  const groups = groupNamedColors(named)
  const hasNamed = groups.length > 0

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: surface, color: textOnSurface }}
      aria-labelledby="brand-palette-title"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <header className="mb-12 flex flex-col gap-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </span>
          <h2
            id="brand-palette-title"
            className="max-w-3xl text-3xl font-normal leading-[1.1] tracking-tight md:text-5xl"
            style={{
              fontFamily:
                'var(--font-template-display), "Bricolage Grotesque", Georgia, serif',
            }}
          >
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: mutedText }}>
            {description}
          </p>
        </header>

        {hasNamed ? (
          <div className="flex flex-col gap-10">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-4">
                <div
                  className="flex items-baseline justify-between border-b pb-2"
                  style={{ borderColor: hairline }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-[0.18em]"
                    style={{ color: textOnSurface }}
                  >
                    {group.label}
                  </h3>
                  <span className="font-mono text-xs" style={{ color: mutedText }}>
                    {group.colors.length} {group.colors.length === 1 ? 'color' : 'colors'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {group.colors.map((c) => (
                    <ColorCard
                      key={c.reference ?? c.name}
                      color={c}
                      variant={variant}
                      hairline={hairline}
                      mutedText={mutedText}
                      textOnSurface={textOnSurface}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CoreFallback tokens={tokens} variant={variant} hairline={hairline} mutedText={mutedText} textOnSurface={textOnSurface} />
        )}
      </div>
    </section>
  )
}

function ColorCard({
  color,
  variant,
  hairline,
  mutedText,
  textOnSurface,
}: {
  color: NamedColor
  variant: 'light' | 'dark'
  hairline: string
  mutedText: string
  textOnSurface: string
}) {
  const contrastText = pickContrastText(color.hex)

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border"
      style={{ borderColor: hairline, backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff' }}
    >
      <div
        className="flex aspect-[5/3] items-end p-3"
        style={{ backgroundColor: color.hex, color: contrastText }}
      >
        <span className="font-mono text-[11px] tracking-tight">{color.hex.toUpperCase()}</span>
      </div>
      <div className="flex flex-col gap-0.5 px-4 py-3">
        <span
          className="text-sm font-medium leading-tight"
          style={{ color: textOnSurface }}
        >
          {color.name}
        </span>
        {color.reference && (
          <span className="font-mono text-[11px]" style={{ color: mutedText }}>
            {color.reference}
          </span>
        )}
      </div>
    </div>
  )
}

function CoreFallback({
  tokens,
  variant,
  hairline,
  mutedText,
  textOnSurface,
}: {
  tokens: BrandTokens
  variant: 'light' | 'dark'
  hairline: string
  mutedText: string
  textOnSurface: string
}) {
  const entries: NamedColor[] = [
    { name: 'Primary', hex: tokens.colors.primary, group: 'brand' },
    { name: 'Secondary', hex: tokens.colors.secondary, group: 'brand' },
    { name: 'Tertiary', hex: tokens.colors.tertiary, group: 'support' },
    { name: 'Neutral', hex: tokens.colors.neutral, group: 'neutral' },
  ]
  if (tokens.colors.accent) {
    entries.push({ name: 'Accent', hex: tokens.colors.accent, group: 'brand' })
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {entries.map((c) => (
        <ColorCard
          key={c.name}
          color={c}
          variant={variant}
          hairline={hairline}
          mutedText={mutedText}
          textOnSurface={textOnSurface}
        />
      ))}
    </div>
  )
}

interface Group {
  key: string
  label: string
  colors: NamedColor[]
}

function groupNamedColors(named: NamedColor[] | undefined): Group[] {
  if (!named || named.length === 0) return []
  const map = new Map<string, NamedColor[]>()
  for (const c of named) {
    const key = c.group ?? 'support'
    const bucket = map.get(key)
    if (bucket) {
      bucket.push(c)
    } else {
      map.set(key, [c])
    }
  }
  const ordered: Group[] = []
  for (const key of GROUP_ORDER) {
    const colors = map.get(key)
    if (colors && colors.length > 0) {
      ordered.push({ key, label: GROUP_LABELS[key], colors })
    }
  }
  // Any unknown groups (future-proofing) go at the end, alphabetized.
  const knownKeys = new Set<string>(GROUP_ORDER)
  const unknownKeys = [...map.keys()].filter((k) => !knownKeys.has(k)).sort()
  for (const key of unknownKeys) {
    const colors = map.get(key)!
    ordered.push({ key, label: key.charAt(0).toUpperCase() + key.slice(1), colors })
  }
  return ordered
}

/**
 * Pick black or white text for a given hex background using relative
 * luminance. Matches WCAG 2.2's contrast model closely enough for badge
 * labels; avoids a layout library dependency.
 */
function pickContrastText(hex: string): string {
  const normalized = hex.replace('#', '').trim()
  if (normalized.length !== 3 && normalized.length !== 6) return '#111111'
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const toLin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  const lum = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b)
  return lum > 0.5 ? '#111111' : '#ffffff'
}
