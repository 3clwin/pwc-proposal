import { Badge } from '@/components/ui/badge'
import type { BrandTokens } from '@/types'

interface SpacingTokensProps {
  tokens: BrandTokens
}

export function SpacingTokens({ tokens }: SpacingTokensProps) {
  const prefix = tokens.tokenPrefix

  return (
    <div className="flex flex-col gap-2 font-app">
      {Object.entries(tokens.spacing).map(([key, val]) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded border px-3 py-2"
          style={{ borderColor: '#E5E5E3' }}
        >
          <Badge variant="outline" className="shrink-0 font-mono text-xs">
            {prefix}{key}
          </Badge>
          <div
            className="rounded"
            style={{
              width: `${val.px}px`,
              height: '16px',
              backgroundColor: '#2563EB',
              opacity: 0.2,
              minWidth: '4px',
            }}
          />
          <span className="font-mono text-xs" style={{ color: '#6B6B6B' }}>
            {val.rem} / {val.px}px
          </span>
          <span className="text-xs" style={{ color: '#6B6B6B' }}>
            {val.usage}
          </span>
        </div>
      ))}
    </div>
  )
}
