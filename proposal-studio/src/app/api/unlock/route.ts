import { NextResponse } from 'next/server'
import { GATE_COOKIE } from '@/middleware'

export const runtime = 'nodejs'

const DEFAULT_PASSWORD = 'Proposal2026'

/**
 * 30 days. Long enough that returning visitors don't see the gate twice in
 * a sales cycle, short enough that a shared device eventually re-prompts.
 */
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

interface UnlockRequest {
  password?: string
}

export async function POST(request: Request) {
  let body: UnlockRequest = {}
  try {
    body = (await request.json()) as UnlockRequest
  } catch {
    return NextResponse.json({ error: 'invalid-body' }, { status: 400 })
  }

  const submitted = (body.password ?? '').trim()
  // Allow operators to override the password via env var in Vercel without
  // a redeploy. Falls back to the hardcoded default so local dev works.
  const expected = (process.env.SITE_PASSWORD ?? DEFAULT_PASSWORD).trim()

  if (!submitted || submitted !== expected) {
    return NextResponse.json({ error: 'incorrect-password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: GATE_COOKIE,
    value: '1',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
  return response
}
