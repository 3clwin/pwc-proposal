import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LLMProvider } from '@/types'

export interface ProviderStatus {
  provider: LLMProvider
  label: string
  configured: boolean
  keyNames: string[]
  configuredKeyName?: string
  model: string
  modelEnvName: string
}

export function ProviderStatusCard({ provider }: { provider: ProviderStatus }) {
  return (
    <Card size="sm" className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              provider.configured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}
          >
            <KeyRound className="size-4" aria-hidden />
          </span>
          <div>
            <CardTitle>{provider.label}</CardTitle>
            <CardDescription>{provider.provider}</CardDescription>
          </div>
        </div>
        <CardAction>
          <Badge variant={provider.configured ? 'secondary' : 'outline'}>
            {provider.configured ? (
              <CheckCircle2 data-icon="inline-start" />
            ) : (
              <AlertCircle data-icon="inline-start" />
            )}
            {provider.configured ? 'Configured' : 'Missing key'}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              API key env
            </dt>
            <dd className="font-mono text-xs text-foreground">
              {provider.configuredKeyName ?? provider.keyNames.join(' or ')}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Effective model
            </dt>
            <dd className="font-mono text-xs text-foreground">{provider.model}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Model override
            </dt>
            <dd className="font-mono text-xs text-muted-foreground">{provider.modelEnvName}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
