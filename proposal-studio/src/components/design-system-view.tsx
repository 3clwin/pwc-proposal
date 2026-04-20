'use client'

import { Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColorTokens } from './color-tokens'
import { TypographyTokens } from './typography-tokens'
import { SpacingTokens } from './spacing-tokens'
import { RadiusTokens } from './radius-tokens'
import { ShadowTokens } from './shadow-tokens'
import { ComponentPreviews } from './component-previews'
import { useProject } from '@/context/project-context'
import type { BrandTokens } from '@/types'

interface DesignSystemViewProps {
  tokens: BrandTokens
}

/** Four-point sparkle / star glyph used in the extraction banner.
 *  Inline SVG so the fill stays tied to Lilly's primary red via
 *  `currentColor`. Matches the custom vector provided by the team;
 *  recolored from the source `#F10029` to the official
 *  `--lds-color-lilly` = `#d31710`. */
function SparkStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1134 1125"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ color: '#d31710' }}
    >
      <path
        d="M562.91 0L564.058 0.453222C566.841 150.394 628.593 293.2 735.931 397.929C805.33 465.99 891.017 515.124 984.808 540.64C1029.36 553.012 1076.45 558.754 1122.59 560.612C1124.3 560.682 1132.34 560.495 1133.11 561.497C1091.54 563.846 1065.12 564.795 1022.98 572.893C901.628 597.163 791.449 660.198 709.013 752.501C617.765 855.122 566.32 987.057 564.023 1124.36L562.857 1124.41C562.88 1106.14 560.308 1079.07 557.97 1060.76C542.796 938.776 488.375 825.04 402.914 736.692C298.151 627.942 154.604 565.083 3.63861 561.836L0 560.583C20.0998 560.682 47.7928 558.028 67.6947 555.379C186.198 539.815 296.763 487.236 383.627 405.138C497.099 298.497 558.128 154.976 562.91 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Provenance banner at the top of the design system view — tells
 *  the reviewer that what they're looking at was extracted from the
 *  client's live site, with the actual domain linked for verification. */
function ExtractionBanner({ tokens }: { tokens: BrandTokens }) {
  const { project } = useProject()

  // Display-friendly client name. Fall back to a Title-Cased
  // version of the slug if the project wasn't set up via intake
  // (e.g. direct-link demos).
  const clientName =
    project.clientName?.trim() ||
    tokens.clientSlug
      .split(/[-_]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')

  // Clean up the URL for display: strip protocol + trailing slash.
  const rawUrl = project.clientUrl || ''
  const displayUrl = rawUrl
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')

  return (
    <div
      className="relative flex flex-col gap-3 overflow-hidden rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-4"
      style={{
        backgroundColor: 'rgba(211,23,16,0.04)',
        borderColor: 'rgba(211,23,16,0.18)',
      }}
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(211,23,16,0.12)' }}
      >
        <SparkStar className="size-5" />
      </span>

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-app text-sm font-semibold" style={{ color: '#1A1A1A' }}>
          Extracted from {clientName}&rsquo;s live site
        </p>
        <p className="font-app text-xs leading-snug text-muted-foreground">
          Colors, typography, radii, shadows, and component primitives
          were pulled from the client&rsquo;s public website. Every
          token below is what their design system actually uses in
          production.
        </p>
      </div>

      {displayUrl && (
        <a
          href={rawUrl || `https://${displayUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors hover:bg-white"
          style={{
            borderColor: 'rgba(211,23,16,0.25)',
            color: '#d31710',
          }}
        >
          <Globe className="size-3.5" strokeWidth={2} aria-hidden />
          {displayUrl}
        </a>
      )}
    </div>
  )
}

function Section({ title, prefix, children }: { title: string; prefix: string; children: React.ReactNode }) {
  return (
    <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E3' }}>
      <CardHeader className="flex-row items-center gap-3 space-y-0 font-app">
        <CardTitle className="text-base" style={{ color: '#1A1A1A' }}>{title}</CardTitle>
        <Badge variant="outline" className="font-mono text-xs">{prefix}</Badge>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function DesignSystemView({ tokens }: DesignSystemViewProps) {
  const prefix = tokens.tokenPrefix

  return (
    <div className="flex flex-col gap-4">
      <ExtractionBanner tokens={tokens} />

      <Section title="Colors" prefix={`${prefix}color-*`}>
        <ColorTokens tokens={tokens} />
      </Section>

      <Section title="Typography" prefix={`${prefix}font-*`}>
        <TypographyTokens tokens={tokens} />
      </Section>

      <Section title="Spacing" prefix={`${prefix}spacing-*`}>
        <SpacingTokens tokens={tokens} />
      </Section>

      <Section title="Radius" prefix={`${prefix}radius-*`}>
        <RadiusTokens tokens={tokens} />
      </Section>

      <Section title="Shadow" prefix={`${prefix}shadow-*`}>
        <ShadowTokens tokens={tokens} />
      </Section>

      <Section title="Component Previews" prefix={`${prefix}component-*`}>
        <ComponentPreviews tokens={tokens} />
      </Section>
    </div>
  )
}
