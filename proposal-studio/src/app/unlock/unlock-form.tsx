'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UnlockFormProps {
  /**
   * Path the user was heading to before being redirected to the gate.
   * Validated server-side in `page.tsx` so we only ever receive a path
   * that starts with `/` — safe to pass into `router.replace`.
   */
  returnPath: string
}

/**
 * PwC-branded preview gate. Single-column card with proper UX hierarchy:
 *  - Brand mark + product label (visitor knows where they are)
 *  - Clear headline
 *  - Password field (sr-only label; placeholder for sighted users)
 *  - Clear primary CTA with explicit disabled state
 *  - Fine-print help link
 *
 * The form posts to /api/unlock, which sets the HttpOnly `ps-gate` cookie
 * on success. We then `router.replace(returnPath)` so /unlock doesn't
 * pollute browser history.
 */
export function UnlockForm({ returnPath }: UnlockFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!password.trim() || submitting) return

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('That password didn\u2019t match. Try again.')
        setSubmitting(false)
        return
      }
      router.replace(returnPath)
    } catch {
      setError('Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  const canSubmit = password.trim().length > 0 && !submitting

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4 py-12">
      {/* Atmospheric background — two layered radial highlights pick up the
          PwC orange (top-right) and a soft charcoal (bottom-left) so the
          flat off-white gets a sense of depth without distracting from
          the card. Opacity is intentionally low (3-5%) to stay quiet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 85% 5%, rgba(224, 48, 30, 0.07), transparent 70%), radial-gradient(ellipse 50% 50% at 15% 95%, rgba(26, 26, 26, 0.05), transparent 70%)',
        }}
      />

      <form
        onSubmit={handleSubmit}
        aria-labelledby="unlock-heading"
        className="relative z-10 flex w-full max-w-[440px] flex-col gap-8 rounded-3xl border border-foreground/8 bg-white p-10 font-sans shadow-[0_24px_64px_-32px_rgba(26,26,26,0.18)] ring-1 ring-foreground/[0.04]"
      >
        {/* Brand bar — PwC logo + thin rule + product label. Tells the
            visitor what they're about to access; "Password" alone doesn't. */}
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-auto text-foreground" />
          <span className="h-4 w-px bg-foreground/15" aria-hidden />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/60">
            Proposal Studio
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h1
            id="unlock-heading"
            className="font-heading text-2xl font-medium leading-tight tracking-tight text-foreground"
          >
            Authentication Required
          </h1>

          {/* Field — placeholder cues sighted users; sr-only label for AT. */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter the shared password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              disabled={submitting}
              aria-invalid={!!error}
              aria-describedby={error ? 'unlock-error' : undefined}
              className="h-12 text-base"
            />
            {error && (
              <p
                id="unlock-error"
                role="alert"
                className="flex items-start gap-1.5 text-xs leading-relaxed text-[#E0301E]"
              >
                <span aria-hidden className="mt-[3px] inline-block size-1 shrink-0 rounded-full bg-[#E0301E]" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Primary action — full-width, dark charcoal so it reads as PwC's
            "decision" weight. Disabled state uses opacity (preserves color
            identity) rather than a wash of gray that's hard to read. */}
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="h-12 w-full bg-[#1A1A1A] text-base font-medium text-white hover:bg-[#2a2a2a] disabled:bg-[#1A1A1A] disabled:opacity-40"
        >
          {submitting && (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          )}
          Continue
        </Button>

        {/* Footer — tiny help line so visitors without access have a path
            forward instead of a dead end. Separator above gives the action
            zone a clean closure. */}
        <div className="flex flex-col gap-3 border-t border-foreground/8 pt-4">
          <p className="text-[11px] leading-relaxed text-foreground/55">
            Don&rsquo;t have the password? Reach out to the owner for access.
          </p>
        </div>
      </form>
    </div>
  )
}
