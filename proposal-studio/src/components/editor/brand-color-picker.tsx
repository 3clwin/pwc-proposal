'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandTokens, NamedColor } from '@/types'

interface ColorEntry {
  /** Display label shown on hover. */
  label: string
  /** CSS hex. */
  hex: string
  /** Optional design-system token name for the tooltip. */
  token?: string
}

interface ColorSectionSpec {
  /** Stable key so collapse state persists. */
  key: string
  /** Section heading (e.g. "Core brand"). */
  label: string
  /** Optional sub-label (e.g. "brand hierarchy"). */
  meta?: string
  /** Flat list of swatches in this section. */
  colors: ColorEntry[]
  /** How many columns to render the swatches in. */
  columns: number
  /** Whether the section is collapsed by default. */
  collapsed?: boolean
}

/**
 * Generic fallback swatch set. Used when the project has no
 * brand tokens yet — e.g. brand-new sessions or templates viewed
 * outside a project. Matches the original hand-picked editor
 * swatches so existing muscle memory isn't lost.
 */
const FALLBACK_COLORS: ColorEntry[] = [
  { label: 'Ink', hex: '#1A1A1A' },
  { label: 'Brand', hex: '#C52B09' },
  { label: 'Blue', hex: '#2563EB' },
  { label: 'Green', hex: '#15803D' },
  { label: 'Violet', hex: '#A855F7' },
  { label: 'Amber', hex: '#D97706' },
  { label: 'Gray', hex: '#6B7280' },
  { label: 'White', hex: '#FFFFFF' },
]

const NAMED_GROUP_ORDER: NonNullable<NamedColor['group']>[] = [
  'brand',
  'bold',
  'vibrant',
  'neutral',
  'support',
]

const NAMED_GROUP_LABELS: Record<NonNullable<NamedColor['group']>, string> = {
  brand: 'Core brand',
  bold: 'Bold',
  vibrant: 'Vibrant',
  neutral: 'Neutral',
  support: 'Supporting',
}

const RAMP_STEPS = [
  '005',
  '010',
  '020',
  '030',
  '040',
  '050',
  '060',
  '070',
  '080',
  '090',
  '100',
  '105',
]

/**
 * Build the flattened section list from `BrandTokens`. Order mirrors
 * the Design System view: semantic slots → named brand palette →
 * per-group semantic tokens (brand hierarchy, text, surface, …) →
 * utility ramps. Ramps are collapsed by default because there are a
 * lot of them and they're power-user territory.
 */
function buildSections(
  tokens: BrandTokens | null | undefined,
): ColorSectionSpec[] {
  if (!tokens) {
    return [
      {
        key: 'fallback',
        label: 'Defaults',
        meta: 'generic',
        colors: FALLBACK_COLORS,
        columns: 8,
      },
    ]
  }

  const sections: ColorSectionSpec[] = []
  const prefix = tokens.tokenPrefix

  // Semantic slots.
  const slots: ColorEntry[] = [
    { label: 'Primary', hex: tokens.colors.primary, token: `${prefix}color-primary` },
    {
      label: 'Secondary',
      hex: tokens.colors.secondary,
      token: `${prefix}color-secondary`,
    },
    {
      label: 'Tertiary',
      hex: tokens.colors.tertiary,
      token: `${prefix}color-tertiary`,
    },
    {
      label: 'Neutral',
      hex: tokens.colors.neutral,
      token: `${prefix}color-neutral`,
    },
  ]
  if (tokens.colors.accent) {
    slots.push({
      label: 'Accent',
      hex: tokens.colors.accent,
      token: `${prefix}color-accent`,
    })
  }
  sections.push({
    key: 'slots',
    label: 'Semantic slots',
    meta: 'role-based',
    colors: slots,
    columns: 8,
  })

  // Named brand palette, grouped.
  if (tokens.colors.named && tokens.colors.named.length > 0) {
    const byGroup = new Map<string, NamedColor[]>()
    for (const c of tokens.colors.named) {
      const key = c.group ?? 'support'
      const bucket = byGroup.get(key)
      if (bucket) bucket.push(c)
      else byGroup.set(key, [c])
    }
    // Emit in canonical order, then any extra groups alphabetically.
    const emitted = new Set<string>()
    for (const key of NAMED_GROUP_ORDER) {
      const colors = byGroup.get(key)
      if (colors && colors.length > 0) {
        sections.push({
          key: `named-${key}`,
          label: NAMED_GROUP_LABELS[key],
          meta:
            colors.length === 1 ? '1 color' : `${colors.length} colors`,
          colors: colors.map((c) => ({
            label: c.name,
            hex: c.hex,
            token: c.reference ? `--${c.reference}` : undefined,
          })),
          columns: 8,
        })
        emitted.add(key)
      }
    }
    for (const [key, colors] of byGroup) {
      if (emitted.has(key)) continue
      sections.push({
        key: `named-${key}`,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        meta: colors.length === 1 ? '1 color' : `${colors.length} colors`,
        colors: colors.map((c) => ({
          label: c.name,
          hex: c.hex,
          token: c.reference ? `--${c.reference}` : undefined,
        })),
        columns: 8,
      })
    }
  }

  // Per-group semantic tokens (e.g. Brand Hierarchy, Text, Surface).
  if (tokens.colors.semantic) {
    for (const group of tokens.colors.semantic) {
      if (group.tokens.length === 0) continue
      sections.push({
        key: `semantic-${group.label}`,
        label: group.label,
        meta:
          group.tokens.length === 1
            ? '1 token'
            : `${group.tokens.length} tokens`,
        colors: group.tokens.map((t) => ({
          label: t.name,
          hex: t.hex,
          token: t.token,
        })),
        columns: 8,
      })
    }
  }

  // Utility ramps — collapsed by default. Each ramp becomes its own
  // section so the 12-step ladder reads as one coherent row when
  // expanded.
  const rampEntries = Object.entries(tokens.colors.palettes)
  if (rampEntries.length > 0) {
    for (const [name, shades] of rampEntries) {
      sections.push({
        key: `ramp-${name}`,
        label: `${name.charAt(0).toUpperCase()}${name.slice(1)} ramp`,
        meta: `${prefix}color-${name}-*`,
        columns: 12,
        collapsed: true,
        colors: shades.map((hex, i) => ({
          label: `${name} ${RAMP_STEPS[i] ?? i}`,
          hex,
          token: `${prefix}color-${name}-${RAMP_STEPS[i] ?? i}`,
        })),
      })
    }
  }

  return sections
}

interface BrandColorPickerProps {
  /** Brand tokens from the active project. When null, falls back to generic swatches. */
  tokens: BrandTokens | null | undefined
  /** Currently-selected CSS color (hex); used to mark the active swatch. */
  selected?: string | null
  /** Fired with the selected hex on click. */
  onSelect: (hex: string) => void
  /** Optional hard max height for the scrollable picker body. Defaults to 320px. */
  maxHeight?: number
}

function normalizeHex(hex: string | null | undefined): string {
  if (!hex) return ''
  return hex.trim().toLowerCase()
}

/**
 * Organized, scrollable color picker that surfaces the project's
 * brand tokens — semantic slots, named brand palette, semantic token
 * groups, and utility ramps — in collapsible sections. Falls back to
 * a generic swatch grid when no brand tokens are available.
 */
export function BrandColorPicker({
  tokens,
  selected,
  onSelect,
  maxHeight = 320,
}: BrandColorPickerProps) {
  const sections = React.useMemo(() => buildSections(tokens), [tokens])

  // All sections start collapsed for a compact, scannable picker.
  // Users open only the families they care about. State is local to
  // the picker instance so flipping sections open/closed doesn't
  // leak across re-selections.
  const [collapsedKeys, setCollapsedKeys] = React.useState<Set<string>>(
    () => new Set(sections.map((s) => s.key)),
  )

  const normalizedSelected = normalizeHex(selected)

  const toggle = (key: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div
      className="flex flex-col gap-3 overflow-y-auto overscroll-contain rounded-lg border border-border bg-background p-2"
      style={{ maxHeight }}
    >
      {sections.map((section) => {
        const isCollapsed = collapsedKeys.has(section.key)
        const count = section.colors.length
        return (
          <div key={section.key} className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => toggle(section.key)}
              aria-expanded={!isCollapsed}
              className="group flex w-full items-baseline justify-between rounded-md px-1 py-0.5 text-left transition-colors hover:bg-muted/70"
            >
              <span className="flex items-center gap-1.5">
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-3 text-muted-foreground transition-transform',
                    isCollapsed && '-rotate-90',
                  )}
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
                  {section.label}
                </span>
              </span>
              {section.meta && (
                <span className="font-mono text-[9px] text-muted-foreground">
                  {section.meta}
                </span>
              )}
            </button>
            {!isCollapsed && (
              <div
                className="grid gap-1.5 px-1"
                style={{
                  gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))`,
                }}
              >
                {section.colors.map((c) => {
                  const isActive =
                    normalizedSelected && normalizeHex(c.hex) === normalizedSelected
                  return (
                    <button
                      key={`${section.key}-${c.hex}-${c.label}`}
                      type="button"
                      title={c.token ? `${c.label} · ${c.token} · ${c.hex.toUpperCase()}` : `${c.label} · ${c.hex.toUpperCase()}`}
                      aria-label={`Use color ${c.label}`}
                      aria-pressed={Boolean(isActive)}
                      onClick={() => onSelect(c.hex)}
                      className={cn(
                        'relative aspect-square w-full rounded-md ring-1 ring-foreground/10 transition hover:scale-110 hover:ring-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive &&
                          'ring-2 ring-foreground shadow-sm hover:ring-foreground',
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  )
                })}
              </div>
            )}
            <p className="sr-only" aria-live="polite">
              {isCollapsed
                ? `${section.label} collapsed, ${count} colors hidden.`
                : `${section.label} expanded, ${count} colors.`}
            </p>
          </div>
        )
      })}
    </div>
  )
}
