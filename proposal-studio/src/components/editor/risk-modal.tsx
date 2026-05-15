'use client'

import { useMemo } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Check,
  X,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Info,
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

interface SeverityTheme {
  label: string
  /** Classes applied to the severity Badge itself. */
  badge: string
  /** Subtle card-body tint + left-accent bar so severity is legible
   *  at a glance without reading the badge text. */
  card: string
  /** Icon rendered next to the suggestion line for this severity. */
  icon: typeof AlertTriangle
}

// Status-color palette mapping severity → real signal colors, not just
// shadcn's generic Badge variants. Each severity gets a matching card
// tint + left-accent so the list reads as a legend even without the
// badge labels (legibility under cognitive load — a consultant about
// to ship doesn't want to decode arbitrary hues).
//
// - HIGH   → red    (destructive: reconsider before shipping)
// - MEDIUM → amber  (warning: address if possible)
// - LOW    → blue   (informational: awareness only)
const SEVERITY_THEMES: Record<Severity, SeverityTheme> = {
  high: {
    label: 'High',
    badge:
      'bg-red-100 text-red-800 border border-red-200 ' +
      'dark:bg-red-950/60 dark:text-red-200 dark:border-red-900',
    card:
      'border-red-200 bg-red-50/60 ' +
      'dark:border-red-900/60 dark:bg-red-950/20',
    icon: ShieldAlert,
  },
  medium: {
    label: 'Medium',
    badge:
      'bg-amber-100 text-amber-800 border border-amber-200 ' +
      'dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-900',
    card:
      'border-amber-200 bg-amber-50/60 ' +
      'dark:border-amber-900/60 dark:bg-amber-950/20',
    icon: AlertTriangle,
  },
  low: {
    label: 'Low',
    badge:
      'bg-blue-100 text-blue-800 border border-blue-200 ' +
      'dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-900',
    card:
      'border-blue-200 bg-blue-50/60 ' +
      'dark:border-blue-900/60 dark:bg-blue-950/20',
    icon: Info,
  },
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

  // Highest severity currently open drives the header badge color so
  // the user sees at a glance whether the blockers are red/amber/blue
  // without counting badges in the list.
  const topSeverity: Severity | null = openFlags.reduce<Severity | null>((acc, f) => {
    if (!acc) return f.severity
    return SEVERITY_RANK[f.severity] < SEVERITY_RANK[acc] ? f.severity : acc
  }, null)

  // Header shield is kept neutral for medium/unknown severities so the
  // modal doesn't lean yellow by default — the severity-colored cards
  // below already carry that signal. Only escalate the bubble color
  // when the top open flag is `high` (red) or `low` (blue), or when
  // everything is cleared (emerald).
  const headerBadgeClass = canDeploy
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
    : topSeverity === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : topSeverity === 'low'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'bg-muted text-foreground dark:bg-muted dark:text-foreground'

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
                headerBadgeClass,
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
              const theme = SEVERITY_THEMES[flag.severity]
              const SeverityIcon = theme.icon

              return (
                <li
                  key={flag.id}
                  className={cn(
                    'group rounded-xl border p-3 transition-colors',
                    isResolved
                      ? 'border-border/60 bg-muted/40'
                      : theme.card,
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            // Shaped like shadcn Badge but colored by
                            // severity. We render a span directly
                            // rather than the Badge primitive because
                            // shadcn doesn't ship warning/info variants
                            // and overriding `variant` would fight the
                            // built-in bg/text classes.
                            'inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide',
                            theme.badge,
                          )}
                        >
                          <SeverityIcon className="size-2.5" aria-hidden />
                          {theme.label}
                        </span>
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
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 1134 1125"
                            fill="black"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mt-0.5 shrink-0"
                            aria-hidden
                          >
                            <path d="M562.91 0L564.058 0.453222C566.841 150.394 628.593 293.2 735.931 397.929C805.33 465.99 891.017 515.124 984.808 540.64C1029.36 553.012 1076.45 558.754 1122.59 560.612C1124.3 560.682 1132.34 560.495 1133.11 561.497C1091.54 563.846 1065.12 564.795 1022.98 572.893C901.628 597.163 791.449 660.198 709.013 752.501C617.765 855.122 566.32 987.057 564.023 1124.36L562.857 1124.41C562.88 1106.14 560.308 1079.07 557.97 1060.76C542.796 938.776 488.375 825.04 402.914 736.692C298.151 627.942 154.604 565.083 3.63861 561.836L0 560.583C20.0998 560.682 47.7928 558.028 67.6947 555.379C186.198 539.815 296.763 487.236 383.627 405.138C497.099 298.497 558.128 154.976 562.91 0Z" />
                          </svg>
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
