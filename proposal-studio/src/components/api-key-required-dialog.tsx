'use client'

import Link from 'next/link'
import { KeyRound, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ApiKeyRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Optional pathname to bounce back to after the user sets a key in Settings.
   * Encoded into ?return= so the Settings page can offer a "back" affordance.
   * Optional — when omitted, the user just lands on Settings without a return target.
   */
  returnPath?: string
}

/**
 * Gate shown when the user attempts to kick off the AI pipeline (extract-brand
 * + generate-site) for a non-demo client without a verified provider key.
 *
 * The Lilly demo bypasses this gate server-side (see `isLillyClient` in
 * `/api/extract-brand` and `/api/generate-site`) so reviewers can still see
 * the canned proposal without configuring a key.
 */
export function ApiKeyRequiredDialog({
  open,
  onOpenChange,
  returnPath,
}: ApiKeyRequiredDialogProps) {
  const settingsHref = returnPath
    ? `/settings?return=${encodeURIComponent(returnPath)}`
    : '/settings'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-5" aria-hidden />
        </div>
        <DialogHeader>
          <DialogTitle className="text-lg">An API key is required</DialogTitle>
          <DialogDescription>
            Proposal Studio uses your own provider key (Anthropic, OpenAI, or
            Google) to read your documents, crawl the client&rsquo;s site, and
            generate the proposal. The Lilly demo is the only client that runs
            without a key.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-foreground/70" aria-hidden />
            <p>
              Keys are stored locally in your browser and sent only with your
              own requests — they never touch our servers.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button asChild>
            <Link href={settingsHref}>Add API key</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
