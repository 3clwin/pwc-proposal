import { Badge } from '@/components/ui/badge'
import type { BrandTokens } from '@/types'

interface ShadowTokensProps {
  tokens: BrandTokens
}

export function ShadowTokens({ tokens }: ShadowTokensProps) {
  const prefix = tokens.tokenPrefix

  return (
    <div className="flex flex-col gap-3 font-app">
      {Object.entries(tokens.shadow).map(([key, val]) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded border px-3 py-3"
          style={{ borderColor: '#E5E5E3' }}
        >
          <Badge variant="outline" className="shrink-0 font-mono text-xs">
            {prefix}{key}
          </Badge>
          <div
            className="size-10 rounded-md bg-white"
            style={{ boxShadow: val.value }}
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
