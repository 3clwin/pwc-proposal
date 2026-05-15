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
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[400px] flex-col items-center gap-6 rounded-2xl border border-foreground/8 bg-white px-8 py-10 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.12)]"
      >
        <Logo className="h-10 w-auto text-foreground" />

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Password
          </h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ask the owner for the password.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
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
        </div>
      </form>
    </div>
  )
}
