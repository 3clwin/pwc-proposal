import { Badge } from '@/components/ui/badge'
import type { BrandTokens } from '@/types'

interface RadiusTokensProps {
  tokens: BrandTokens
}

export function RadiusTokens({ tokens }: RadiusTokensProps) {
  const prefix = tokens.tokenPrefix

  return (
    <div className="flex flex-col gap-2 font-app">
      {Object.entries(tokens.radius).map(([key, val]) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded border px-3 py-2"
          style={{ borderColor: '#E5E5E3' }}
        >
          <Badge variant="outline" className="shrink-0 font-mono text-xs">
            {prefix}{key}
          </Badge>
          <div
            className="size-8 border-2"
            style={{
              borderRadius: val.value,
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37,99,235,0.08)',
            }}
          />
          <span className="font-mono text-xs" style={{ color: '#6B6B6B' }}>
            {val.value}
          </span>
          <span className="text-xs" style={{ color: '#6B6B6B' }}>
            {val.usage}
          </span>
        </div>
      ))}
    </div>
  )
}
