'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PwcLogo } from '@/components/pwc-logo'
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
        setError('Incorrect password.')
        setSubmitting(false)
        return
      }
      // Replace (not push) so the unlock URL doesn't sit in browser history.
      router.replace(returnPath)
    } catch {
      setError('Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4">
      <div className="flex w-full max-w-[360px] flex-col items-center gap-6">
        <PwcLogo className="h-12 w-auto" />

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-2xl border border-foreground/8 bg-white p-6 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.12)]"
        >
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
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
            className="h-11 text-base"
          />

          {error && (
            <p id="unlock-error" role="alert" className="text-xs text-[#E0301E]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!password.trim() || submitting}
            className="h-11 w-full"
          >
            {submitting && (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            )}
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
