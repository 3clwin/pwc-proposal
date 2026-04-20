import { Badge } from '@/components/ui/badge'
import type { BrandTokens } from '@/types'
import { stackForRole } from '@/lib/font-stacks'

interface TypographyTokensProps {
  tokens: BrandTokens
}

export function TypographyTokens({ tokens }: TypographyTokensProps) {
  const prefix = tokens.tokenPrefix

  // Resolve each role into a proper CSS font-family stack that chains the
  // client's real family name through EB Garamond / Space Grotesk /
  // Bricolage Grotesque web-safe substitutes based on the role's category.
  const stacks = {
    headline: stackForRole(tokens.typography.headline),
    body: stackForRole(tokens.typography.body),
    label: stackForRole(tokens.typography.label),
  } as const

  return (
    // font-app here means labels ("headline"/"body"/"label", "Font Scale",
    // usage text) render in app Arial. The actual type samples (Aa, scale
    // rows) use inline style={{ fontFamily }} which overrides and keeps the
    // client's real typography via the role-aware stack.
    <div className="flex flex-col gap-6 font-app">
      {/* Font families */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(['headline', 'body', 'label'] as const).map((role) => {
          const font = tokens.typography[role]
          return (
            <div key={role} className="rounded-lg border p-4" style={{ borderColor: '#E5E5E3' }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: '#6B6B6B' }}>
                {role}
              </p>
              <p
                className="mt-2 text-4xl font-bold"
                style={{
                  fontFamily: stacks[role],
                  fontWeight: font.weight,
                  color: '#1A1A1A',
                }}
              >
                Aa
              </p>
              <p className="mt-1 font-mono text-xs" style={{ color: '#6B6B6B' }}>
                {font.family} {font.weight}
              </p>
              {font.category && (
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
                  {font.category}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Font scale tokens — rendered in the body family so users can see
          each scale step in the client's actual reading face. */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Font Scale</h4>
        <div className="flex flex-col gap-1">
          {Object.entries(tokens.typography.fontScale).map(([key, val]) => {
            // Display/heading scale steps use the headline stack; body/label
            // steps use the body stack. Keeps samples typographically honest.
            const stack =
              key.startsWith('display') || key.startsWith('heading')
                ? stacks.headline
                : key.startsWith('cta') || key === 'eyebrow'
                  ? stacks.label
                  : stacks.body
            return (
              <div
                key={key}
                className="flex items-center gap-3 rounded border px-3 py-2"
                style={{ borderColor: '#E5E5E3' }}
              >
                <Badge variant="outline" className="shrink-0 font-mono text-xs">
                  {prefix}{key}
                </Badge>
                <span className="font-mono text-xs" style={{ color: '#6B6B6B' }}>
                  {val.rem} / {val.px}px
                </span>
                <span className="text-xs" style={{ color: '#6B6B6B' }}>
                  {val.usage}
                </span>
                <span
                  className="ml-auto"
                  style={{
                    fontSize: val.rem,
                    lineHeight: 1.2,
                    color: '#1A1A1A',
                    fontFamily: stack,
                  }}
                >
                  Sample
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
