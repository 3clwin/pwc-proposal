'use client'

import type { BrandTokens, NamedColor, SemanticColorToken } from '@/types'

interface ColorTokensProps {
  tokens: BrandTokens
}

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

const SectionHeading = ({ label, meta }: { label: string; meta?: string }) => (
  <div className="mb-4 flex items-baseline justify-between border-b border-foreground/10 pb-2 font-app">
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
      {label}
    </span>
    {meta && (
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {meta}
      </span>
    )}
  </div>
)

function SemanticSwatch({ token }: { token: SemanticColorToken }) {
  return (
    <div className="flex flex-col overflow-hidden border border-foreground/10">
      <div className="h-12 w-full" style={{ backgroundColor: token.hex }} aria-hidden />
      <div className="flex flex-col gap-0.5 px-3 py-2.5">
        <span className="text-[11px] font-medium leading-tight text-foreground">
          {token.name}
        </span>
        <span className="font-mono text-[10px] leading-tight text-muted-foreground">
          {token.token}
        </span>
        <span className="font-mono text-[10px] leading-tight text-muted-foreground/70">
          {token.hex.toUpperCase()}
        </span>
        {token.usage && (
          <span className="mt-1 text-[10px] italic leading-tight text-muted-foreground/80">
            {token.usage}
          </span>
        )}
      </div>
    </div>
  )
}

function NamedSwatch({ color }: { color: NamedColor }) {
  return (
    <div className="flex flex-col overflow-hidden border border-foreground/10">
      <div className="h-12 w-full" style={{ backgroundColor: color.hex }} aria-hidden />
      <div className="flex flex-col gap-0.5 px-3 py-2.5">
        <span className="text-[11px] font-medium leading-tight text-foreground">
          {color.name}
        </span>
        <span className="font-mono text-[10px] leading-tight text-muted-foreground">
          {color.hex.toUpperCase()}
        </span>
        {color.reference && (
          <span className="font-mono text-[10px] leading-tight text-muted-foreground/70">
            --{color.reference}
          </span>
        )}
      </div>
    </div>
  )
}

function CoreSlot({
  label,
  token,
  hex,
}: {
  label: string
  token: string
  hex: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-10 shrink-0 border border-foreground/10"
        style={{ backgroundColor: hex }}
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-[11px] font-medium text-foreground">{label}</span>
        <span className="truncate font-mono text-[10px] text-muted-foreground">
          {token}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/70">
          {hex.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

function RampRow({
  name,
  colors,
  prefix,
}: {
  name: string
  colors: string[]
  prefix: string
}) {
  const steps = ['005', '010', '020', '030', '040', '050', '060', '070', '080', '090', '100', '105']
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium capitalize text-foreground">
          {name}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {prefix}color-{name}-*
        </span>
      </div>
      <div className="flex gap-px">
        {colors.map((hex, i) => (
          <div
            key={i}
            className="group relative flex flex-1 flex-col items-stretch"
            title={`${prefix}color-${name}-${steps[i]} · ${hex}`}
          >
            <div
              className="h-10 w-full border border-foreground/5"
              style={{ backgroundColor: hex }}
            />
            <span className="mt-1 text-center font-mono text-[9px] text-muted-foreground/60">
              {steps[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NamedPaletteGroups({ named }: { named: NamedColor[] }) {
  const groups = new Map<string, NamedColor[]>()
  for (const c of named) {
    const key = c.group ?? 'support'
    const bucket = groups.get(key)
    if (bucket) bucket.push(c)
    else groups.set(key, [c])
  }
  const ordered: { key: string; label: string; colors: NamedColor[] }[] = []
  for (const key of NAMED_GROUP_ORDER) {
    const colors = groups.get(key)
    if (colors && colors.length > 0) {
      ordered.push({ key, label: NAMED_GROUP_LABELS[key], colors })
    }
  }
  const known = new Set<string>(NAMED_GROUP_ORDER)
  for (const [key, colors] of groups) {
    if (!known.has(key)) {
      ordered.push({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        colors,
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {ordered.map((group) => (
        <div key={group.key} className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium text-foreground">
              {group.label}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {group.colors.length} {group.colors.length === 1 ? 'color' : 'colors'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {group.colors.map((c) => (
              <NamedSwatch key={c.reference ?? c.name} color={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ColorTokens({ tokens }: ColorTokensProps) {
  const prefix = tokens.tokenPrefix
  const semantic = tokens.colors.semantic

  return (
    // font-app on the outer wrapper — all chrome text (section headings,
    // swatch labels, slot labels, ramp family names) renders in app Arial
    // even though ColorTokens lives inside <ProposalCanvas>. Swatch fills
    // still use the client's real hex values. Mono text (token names, hex)
    // keeps font-mono via more-specific classes.
    <div className="flex flex-col gap-10 font-app">
      {/* Semantic slots */}
      <section>
        <SectionHeading label="Semantic slots" meta="role-based" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CoreSlot
            label="Primary"
            token={`${prefix}color-primary`}
            hex={tokens.colors.primary}
          />
          <CoreSlot
            label="Secondary"
            token={`${prefix}color-secondary`}
            hex={tokens.colors.secondary}
          />
          <CoreSlot
            label="Tertiary"
            token={`${prefix}color-tertiary`}
            hex={tokens.colors.tertiary}
          />
          <CoreSlot
            label="Neutral"
            token={`${prefix}color-neutral`}
            hex={tokens.colors.neutral}
          />
        </div>
      </section>

      {/* Named brand palette */}
      {tokens.colors.named && tokens.colors.named.length > 0 && (
        <section>
          <SectionHeading
            label="Brand palette"
            meta={`${tokens.colors.named.length} named colors`}
          />
          <NamedPaletteGroups named={tokens.colors.named} />
        </section>
      )}

      {/* Semantic token groups — pulled verbatim from client's live CSS */}
      {semantic?.map((group) => (
        <section key={group.label}>
          <SectionHeading label={group.label} meta={`${group.tokens.length} tokens`} />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {group.tokens.map((t) => (
              <SemanticSwatch key={t.token} token={t} />
            ))}
          </div>
        </section>
      ))}

      {/* Utility ramps — every family, 12-step */}
      <section>
        <SectionHeading
          label="Utility ramps"
          meta={`${Object.keys(tokens.colors.palettes).length} families · 12 steps each`}
        />
        <div className="flex flex-col gap-5">
          {Object.entries(tokens.colors.palettes).map(([name, shades]) => (
            <RampRow key={name} name={name} colors={shades} prefix={prefix} />
          ))}
        </div>
      </section>
    </div>
  )
}
