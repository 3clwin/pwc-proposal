'use client'

import { useMemo } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Check,
  X,
  Loader2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { RiskFlag } from '@/types'

interface RiskModalProps {
  open: boolean
  onClose: () => void
  flags: RiskFlag[]
  onResolve: (flagId: string, status: 'dismissed' | 'resolved') => void
  onDeploy: () => void
  deploying: boolean
}

type Severity = RiskFlag['severity']

const SEVERITY_VARIANT: Record<Severity, 'destructive' | 'default' | 'secondary'> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
}

const SEVERITY_LABEL: Record<Severity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

// Stable sort so open items surface first, then by severity, then by order received.
const SEVERITY_RANK: Record<Severity, number> = { high: 0, medium: 1, low: 2 }

export function RiskModal({
  open,
  onClose,
  flags,
  onResolve,
  onDeploy,
  deploying,
}: RiskModalProps) {
  const { openFlags, resolvedCount, total, sorted } = useMemo(() => {
    const openFlags = flags.filter((f) => f.status === 'open')
    const sorted = [...flags].sort((a, b) => {
      const aOpen = a.status === 'open' ? 0 : 1
      const bOpen = b.status === 'open' ? 0 : 1
      if (aOpen !== bOpen) return aOpen - bOpen
      return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
    })
    return {
      openFlags,
      resolvedCount: flags.length - openFlags.length,
      total: flags.length,
      sorted,
    }
  }, [flags])

  const canDeploy = openFlags.length === 0
  const progress = total === 0 ? 100 : Math.round((resolvedCount / total) * 100)

  function handleDismissAll() {
    for (const flag of openFlags) {
      onResolve(flag.id, 'dismissed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl">
        {/* Header */}
        <DialogHeader className="space-y-3 px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full',
                canDeploy
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
              )}
              aria-hidden
            >
              {canDeploy ? (
                <ShieldCheck className="size-5" />
              ) : (
                <ShieldAlert className="size-5" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base leading-tight">
                {canDeploy ? 'Ready to deploy' : 'Review risks before deploying'}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {canDeploy
                  ? 'All flagged items have been resolved or dismissed.'
                  : `${openFlags.length} open ${openFlags.length === 1 ? 'issue needs' : 'issues need'} your attention.`}
              </DialogDescription>
            </div>
          </div>

          {total > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {resolvedCount} of {total} resolved
                </span>
                <span className="tabular-nums text-muted-foreground">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-1.5"
                aria-label={`${resolvedCount} of ${total} issues resolved`}
              />
            </div>
          )}
        </DialogHeader>

        <Separator />

        {/* Flag list */}
        <ScrollArea className="max-h-[420px]">
          <ul className="flex flex-col gap-2 px-6 py-4" role="list">
            {sorted.map((flag) => {
              const isResolved = flag.status !== 'open'
              const badgeVariant = SEVERITY_VARIANT[flag.severity]

              return (
                <li
                  key={flag.id}
                  className={cn(
                    'group rounded-xl border bg-card p-3 transition-colors',
                    isResolved
                      ? 'border-border/60 bg-muted/40'
                      : 'border-border hover:border-border/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant={badgeVariant} className="text-[10px] uppercase tracking-wide">
                          {SEVERITY_LABEL[flag.severity]}
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground">
                          {flag.rule}
                        </span>
                        {isResolved && (
                          <Badge variant="outline" className="gap-1 text-[10px] capitalize">
                            <Check className="size-2.5" aria-hidden />
                            {flag.status}
                          </Badge>
                        )}
                      </div>

                      <p
                        className={cn(
                          'font-mono text-sm leading-snug',
                          isResolved
                            ? 'text-muted-foreground line-through decoration-muted-foreground/40'
                            : 'text-foreground'
                        )}
                      >
                        &ldquo;{flag.text}&rdquo;
                      </p>

                      {flag.suggestedReplacement && !isResolved && (
                        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Sparkles
                            className="mt-0.5 size-3 shrink-0 text-primary"
                            aria-hidden
                          />
                          <span>
                            <span className="font-medium text-foreground">Suggestion:</span>{' '}
                            {flag.suggestedReplacement}
                          </span>
                        </p>
                      )}
                    </div>

                    {!isResolved && (
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => onResolve(flag.id, 'dismissed')}
                        >
                          <X className="size-3.5" aria-hidden />
                          Dismiss
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => onResolve(flag.id, 'resolved')}
                        >
                          <Check className="size-3.5 text-emerald-600" aria-hidden />
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}

            {total === 0 && (
              <li className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="size-6 text-emerald-600" aria-hidden />
                No risks detected in this proposal.
              </li>
            )}
          </ul>
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <DialogFooter className="flex-row items-center justify-between gap-2 px-6 py-4 sm:justify-between">
          <div className="flex items-center gap-2">
            {openFlags.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismissAll}
                className="text-muted-foreground"
              >
                Dismiss all
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={deploying}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!canDeploy || deploying}
              onClick={onDeploy}
              aria-label={
                canDeploy
                  ? 'Deploy to Vercel'
                  : `Resolve ${openFlags.length} remaining ${
                      openFlags.length === 1 ? 'issue' : 'issues'
                    } to deploy`
              }
            >
              {deploying ? (
                <>
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" aria-hidden />
                  Deploying…
                </>
              ) : canDeploy ? (
                'Deploy to Vercel'
              ) : (
                <>
                  <AlertTriangle className="size-4" data-icon="inline-start" aria-hidden />
                  {openFlags.length} to resolve
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
