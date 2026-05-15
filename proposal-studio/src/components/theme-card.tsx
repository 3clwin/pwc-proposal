'use client'

import { Check } from 'lucide-react'
import { getTemplate } from '@/templates'
import type { ThemeVariant } from '@/types'
import { cn } from '@/lib/utils'

interface ThemeCardProps {
  theme: ThemeVariant
  isSelected: boolean
  onSelect: (theme: ThemeVariant) => void
}

/**
 * Pick four accent dots that represent the theme as it will render for
 * THIS client. Prefers the client's real brand palette so the preview
 * matches the actual site, not a generic template palette.
 */
function pickAccentDots(theme: ThemeVariant): string[] {
  const template = getTemplate(theme.id)
  
  // If the template explicitly overrides the accent dots for this exact design system, use those
  // so that different templates for the same client can show distinct palettes.
  if (template?.accentPreview && template.accentPreview.length > 0) {
    return template.accentPreview
  }

  const { colors } = theme.tokens
  const named = colors.named

  if (named && named.length > 0) {
    const byGroup = new Map<string, string[]>()
    for (const c of named) {
      const key = c.group ?? 'support'
      const bucket = byGroup.get(key) ?? []
      bucket.push(c.hex)
      byGroup.set(key, bucket)
    }
    const groupOrder = ['brand', 'bold', 'vibrant', 'neutral', 'support']
    const picked: string[] = []
    for (const g of groupOrder) {
      const hexes = byGroup.get(g)
      if (hexes && hexes.length > 0) picked.push(hexes[0]!)
      if (picked.length === 4) break
    }
    if (picked.length === 4) return picked
    for (const c of named) {
      if (!picked.includes(c.hex)) picked.push(c.hex)
      if (picked.length === 4) break
    }
    if (picked.length > 0) return picked
  }

  const slotted = [
    colors.primary,
    colors.secondary,
    colors.tertiary,
    colors.accent ?? colors.neutral,
  ].filter((c): c is string => Boolean(c))
  if (slotted.length > 0) return slotted

  return ['#111111', '#6a6a6a', '#c5c5c5', '#f5f5f5']
}

function FallbackPreview({ theme }: { theme: ThemeVariant }) {
  const { colors } = theme.tokens
  return (
    <div
      className="flex h-full items-center justify-center"
      style={{ backgroundColor: '#fafaf8' }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="h-[4px] w-24 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="h-[2px] w-16 rounded-full"
          style={{ backgroundColor: colors.neutral + '40' }}
        />
      </div>
    </div>
  )
}

export function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  const template = getTemplate(theme.id)
  const Preview = template?.CardPreview
  const accents = pickAccentDots(theme)

  return (
    // Rendered as `div[role="button"]` rather than a native `<button>` because
    // the preview subtree includes a live-site `JourneyNav` that itself
    // contains real <button> elements (DropdownMenuTrigger, Return-to-cover).
    // Nesting <button> inside <button> is invalid HTML and triggers a
    // hydration error in React 19. We're fully keyboard-accessible — the
    // Enter / Space handlers below match native button semantics, and
    // `aria-pressed` tells screen readers whether this theme is selected.
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${theme.label} theme`}
      onClick={() => onSelect(theme)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(theme)
        }
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left transition-all duration-300',
        'border hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2',
        isSelected
          ? 'border-app-primary shadow-[0_8px_24px_rgba(255,170,114,0.18)] ring-1 ring-app-primary/30'
          : 'border-[#e5e5e3] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#d4d4d0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
      )}
    >
      {/* Selection chip — app-chrome primary so it matches the "Build my site" step */}
      {isSelected && (
        <div
          className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-full shadow-sm"
          style={{ backgroundColor: 'var(--app-primary)' }}
        >
          <Check
            className="size-4"
            style={{ color: 'var(--app-primary-foreground)' }}
            strokeWidth={2.5}
          />
        </div>
      )}

      {/* Preview frame — presented as a live-site thumbnail in browser chrome.
          Uses `isolate` to create a stacking context so the scaled inner
          content's own layers can't escape the rounded corners under
          certain browser compositing paths. We also pair the inner
          ring with a matching border so the frame has a crisp hairline
          edge regardless of whether the GPU compositor honors the ring
          outline on the scaled subtree. */}
      <div className="relative p-3">
        <div
          className={cn(
            'relative h-[300px] isolate overflow-hidden rounded-xl bg-white transition-shadow duration-300',
            'border border-[#e5e5e3] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
          )}
          // Exposes the thumbnail's corner radius to the nested
          // BrowserChrome so its clip-path can mask the scaled preview
          // subtree to the exact same rounded geometry. Keep this in
          // sync with the `rounded-xl` utility above (Tailwind 12px).
          style={{ ['--thumb-radius' as string]: '12px' }}
        >
          {Preview ? <Preview /> : <FallbackPreview theme={theme} />}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
        <h3 className="text-lg font-semibold tracking-tight text-[#191919]">
          {theme.label}
        </h3>
        <p className="text-sm leading-[1.6] text-[#6a6a6a]">
          {theme.description}
        </p>

        {/* Accent row */}
        <div className="mt-1 flex items-center gap-3">
          <div className="flex -space-x-1">
            {accents.slice(0, 4).map((color, i) => (
              <span
                key={`${color}-${i}`}
                className="size-3.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: color }}
                aria-hidden
              />
            ))}
          </div>
          <span className="text-xs uppercase tracking-[0.15em] text-[#afafaf]">
            {theme.colorWeight} · {theme.typeScale}
          </span>
        </div>
      </div>
    </div>
  )
}
