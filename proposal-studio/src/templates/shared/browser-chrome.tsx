'use client'

import type { CSSProperties, ReactNode } from 'react'

interface BrowserChromeProps {
  /** The URL to display in the pseudo-address bar. */
  url?: string
  /** Accent color for the URL favicon dot. */
  accent?: string
  /** Surface color for the chrome strip. */
  chromeBg?: string
  /** Text color inside the chrome (URL bar). */
  chromeFg?: string
  /** Border color between chrome and viewport. */
  border?: string
  /** Background of the viewport the site renders against. */
  viewportBg?: string
  /** Extra styles for the outer frame. */
  style?: CSSProperties
  children: ReactNode
}

/**
 * Miniature macOS Safari-style browser chrome used to frame live-site
 * thumbnails in the theme grid. The chrome itself reads as "this is a real
 * site" — the inner content renders legitimate typography, nav, and layout
 * so the thumbnail looks like a screenshot instead of a sketch.
 */
export function BrowserChrome({
  url: _url = 'proposal.site',
  accent: _accent = '#d31710',
  chromeBg: _chromeBg = '#edeae6',
  chromeFg: _chromeFg = '#6b6660',
  border: _border = 'rgba(17,17,17,0.08)',
  viewportBg = '#ffffff',
  style,
  children,
}: BrowserChromeProps) {
  return (
    <div
      className="browser-chrome relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: viewportBg, ...style }}
    >
      {/* Disable sticky/fixed positioning on anything inside the preview
          so the real site's sticky nav doesn't follow the parent page's
          scroll and appear detached from its thumbnail frame. */}
      <style>{`
        .browser-chrome .tpl-root .sticky,
        .browser-chrome .tpl-root [class*="sticky"] {
          position: relative !important;
          top: auto !important;
        }
        /* Hide fixed elements entirely (scroll-progress rule). They
           reference the outer viewport and look broken inside a preview. */
        .browser-chrome .tpl-root .fixed,
        .browser-chrome .tpl-root [class*="fixed"] {
          display: none !important;
        }
      `}</style>
      {/* Viewport */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ backgroundColor: viewportBg }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Shared mini site-nav used inside every theme-card preview. Renders a
 * TemplateHeader-like pattern at thumbnail scale so each card feels like
 * the same family of production sites.
 *
 * - Left: wordmark (black on light backgrounds, white on dark).
 * - Right: 3 nav links + one pill CTA.
 *
 * Call it with `variant="light"` over white / warm surfaces or
 * `variant="dark"` over black / navy canvases.
 */
interface MiniNavProps {
  wordmark: ReactNode
  links?: string[]
  activeLink?: string
  cta?: string
  accent?: string
  variant?: 'light' | 'dark' | 'warm'
  /** Background override — defaults to transparent over the viewport. */
  background?: string
  /** Hairline color under the nav. */
  border?: string
}

export function MiniNav({
  wordmark,
  links = ['Summary', 'Vision', 'Delivery'],
  activeLink,
  cta = 'Get in touch',
  accent = '#d31710',
  variant = 'light',
  background,
  border,
}: MiniNavProps) {
  const ink =
    variant === 'dark'
      ? 'rgba(255,255,255,0.92)'
      : variant === 'warm'
        ? '#191919'
        : '#191919'
  const mute =
    variant === 'dark' ? 'rgba(255,255,255,0.6)' : '#6a6660'
  const hairline =
    border ??
    (variant === 'dark'
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(17,17,17,0.06)')

  return (
    <div
      className="relative z-10 flex shrink-0 items-center justify-between gap-2 px-4"
      style={{
        height: 30,
        backgroundColor: background ?? 'transparent',
        borderBottom: `1px solid ${hairline}`,
      }}
    >
      <div
        className="flex shrink-0 items-center"
        style={{ fontSize: 12, color: ink, fontWeight: 600, letterSpacing: -0.2 }}
      >
        {wordmark}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-hidden">
        {links.map((label) => {
          const isActive = label.toLowerCase() === activeLink?.toLowerCase()
          return (
            <span
              key={label}
              className="font-sans shrink-0"
              style={{
                fontSize: 6,
                color: isActive ? accent : mute,
                letterSpacing: 0.4,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {label}
            </span>
          )
        })}
        <span
          className="rounded-full font-sans flex shrink-0 items-center gap-1"
          style={{
            padding: '3px 7px',
            backgroundColor: accent,
            color: '#ffffff',
            fontSize: 6,
            fontWeight: 600,
            letterSpacing: 0.5,
            marginLeft: 2,
          }}
        >
          {cta}
        </span>
      </div>
    </div>
  )
}
