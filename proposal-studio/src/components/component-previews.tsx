import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { BrandTokens } from '@/types'
import { Search, Edit, Layers, Tag, Trash2 } from 'lucide-react'

interface ComponentPreviewsProps {
  tokens: BrandTokens
}

export function ComponentPreviews({ tokens }: ComponentPreviewsProps) {
  const { colors } = tokens

  return (
    <div className="flex flex-col gap-6">
      {/* Buttons */}
      <div>
        <h4 className="mb-3 font-app text-sm font-medium text-foreground">Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <Button style={{ backgroundColor: colors.primary, color: '#fff' }}>
            Primary
          </Button>
          <Button style={{ backgroundColor: colors.secondary, color: '#fff' }}>
            Secondary
          </Button>
          <Button variant="outline" style={{ borderColor: colors.primary, color: colors.primary }}>
            Outlined
          </Button>
          <Button variant="secondary" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
            Subtle
          </Button>
        </div>
      </div>

      {/* Search input */}
      <div>
        <h4 className="mb-3 font-app text-sm font-medium text-foreground">Search Input</h4>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search proposals..." className="pl-9" readOnly />
        </div>
      </div>

      {/* Divider */}
      <div>
        <h4 className="mb-3 font-app text-sm font-medium text-foreground">Divider</h4>
        <Separator />
      </div>

      {/* Labels */}
      <div>
        <h4 className="mb-3 font-app text-sm font-medium text-foreground">Labels / Tags</h4>
        <div className="flex flex-wrap gap-2">
          {['Technology', 'Financial Services', 'Healthcare'].map((label) => (
            <Badge
              key={label}
              variant="secondary"
              style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Icon actions */}
      <div>
        <h4 className="mb-3 font-app text-sm font-medium text-foreground">Icon Actions</h4>
        <div className="flex gap-2">
          {[Edit, Layers, Tag, Trash2].map((Icon, i) => (
            <Button key={i} variant="outline" size="icon-sm">
              <Icon className="size-4 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
