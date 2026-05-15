import { NextResponse, type NextRequest } from 'next/server'

/**
 * Cookie name for the site-wide password gate. The cookie is set by
 * `/api/unlock` after a successful password POST and read here on every
 * request. Keep the name short — it's sent on every request.
 */
export const GATE_COOKIE = 'ps-gate'

/**
 * Soft password wall for the public deployment. The cookie is HttpOnly so
 * it can't be inspected from the browser console, but the password check
 * is intentionally lightweight — this is a marketing gate, not real auth.
 * Anyone with the password can unlock; the gate keeps casual visitors and
 * search-engine crawlers out of the demo.
 */
export function middleware(request: NextRequest) {
  const hasGate = request.cookies.has(GATE_COOKIE)
  if (hasGate) return NextResponse.next()

  // Preserve the original path + query so the unlock page can bounce the
  // user back to where they were heading once they're authenticated.
  const url = request.nextUrl.clone()
  const intended = url.pathname + url.search
  url.pathname = '/unlock'
  url.search = `?return=${encodeURIComponent(intended)}`
  return NextResponse.redirect(url)
}

/**
 * The matcher excludes:
 * - `/unlock` — the gate page itself (or it would redirect to itself)
 * - `/api/unlock` — the password-check endpoint
 * - `/_next/*` — Next.js build assets (JS chunks, images, fonts)
 * - Common static files served from /public — favicons, icons, sitemap, robots
 *
 * Everything else (pages, server actions, other API routes) is gated.
 */
export const config = {
  matcher: [
    '/((?!unlock|api/unlock|_next/static|_next/image|favicon\\.ico|icon\\.svg|robots\\.txt|sitemap\\.xml).*)',
  ],
}
