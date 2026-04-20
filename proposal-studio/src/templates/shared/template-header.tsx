'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

export type HeaderVariant = 'light' | 'dark' | 'warm' | 'editorial'

interface TemplateHeaderProps {
  title: string
  accent: string
  variant?: HeaderVariant
  links?: string[]
  logoUrl?: string
  logoAlt?: string
}

/**
 * Standard proposal-site nav shared across every template.
 *
 * Two states:
 *   1. At rest (hero in view): transparent wrapper floating over the hero image.
 *      White text with a subtle shadow so it reads over photography.
 *   2. Scrolled (hero out of view): solid translucent bar with backdrop blur
 *      and a subtle bottom hairline. Transitions with a short fade.
 *
 * The transition is driven by an IntersectionObserver watching a sentinel
 * placed at the very top of the header — once the sentinel is out of view,
 * we've scrolled past the header's initial resting place over the hero.
 *
 * Layout:
 *   Left:  client logo + proposal title
 *   Right: up to 4 section links inline, overflow collapses into a menu.
 *          On narrow viewports, all links live in the menu.
 */
export function TemplateHeader({
  title,
  accent,
  links = ['Approach', 'Team', 'Timeline', 'Investment'],
  logoUrl,
  logoAlt,
}: TemplateHeaderProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const UI_SANS = 'var(--font-template-sans), "Space Grotesk", system-ui, sans-serif'
  const DISPLAY = 'var(--font-template-display), "Bricolage Grotesque", system-ui, sans-serif'

  const INLINE_MAX = 4
  const inlineLinks = links.slice(0, INLINE_MAX)
  const overflowLinks = links.slice(INLINE_MAX)
  const hasOverflow = overflowLinks.length > 0

  // Watch a sentinel at the very top of the content. Once it scrolls out of
  // view, the hero has scrolled past the nav's initial resting position.
  // Uses the nearest scrolling ancestor as the observer root so this works
  // both at the window level and inside a nested scroll container (e.g. the
  // editor preview's ScrollArea).
  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const root = findScrollParent(node)
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setScrolled(!entry.isIntersecting)
      },
      { root, threshold: 0, rootMargin: '0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Close menu on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const brand = (
    <span
      className="flex min-w-0 shrink items-center gap-2"
      aria-label={logoAlt ?? `${shortTitle(title)} logo`}
    >
      {logoUrl ? (
        <span
          role="img"
          aria-hidden
          className="tpl-brand-logo block h-5 shrink-0 bg-current"
          style={{
            width: 'calc(1.85 * 1.25rem)',
            WebkitMaskImage: `url(${logoUrl})`,
            maskImage: `url(${logoUrl})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ) : (
        <span
          className="size-5 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      )}
      <span
        className="tpl-title truncate text-sm font-semibold tracking-tight"
        style={{ fontFamily: DISPLAY }}
      >
        {shortTitle(title)}
      </span>
    </span>
  )

  return (
    <>
      {/* Sentinel: sits at the top of the document. While visible, nav is at rest. */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <header
        data-scrolled={scrolled || undefined}
        className="tpl-header sticky top-0 z-40 flex items-center justify-between gap-4 px-5 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300"
        style={{
          fontFamily: UI_SANS,
          color: '#ffffff',
          height: 64,
          // Pull the next section (hero) up underneath the nav so the
          // transparent resting state floats over the hero image.
          marginBottom: -64,
          backgroundColor: scrolled ? 'rgba(17, 18, 20, 0.78)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid transparent',
          textShadow: scrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Left: client logo + proposal title */}
        <div className="flex min-w-0 items-center">{brand}</div>

        {/* Right: inline section links + menu trigger */}
        <div className="flex shrink-0 items-center gap-1">
          {inlineLinks.length > 0 && (
            <nav
              aria-label="Proposal sections"
              className="tpl-inline-nav hidden items-center gap-0.5"
            >
              {inlineLinks.map((label) => (
                <a
                  key={label}
                  href={`#${slugify(label)}`}
                  className="flex h-9 items-center rounded-full px-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:outline-none"
                >
                  {label}
                </a>
              ))}
            </nav>
          )}

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={hasOverflow ? 'Open menu for more sections' : 'Open menu'}
            aria-expanded={open}
            aria-controls={panelId}
            data-has-overflow={hasOverflow || undefined}
            className="tpl-menu-trigger flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
          >
            <Menu className="size-4" strokeWidth={2} />
          </button>
        </div>

        <style>{`
          /* Narrow viewports: hide inline nav, show menu trigger */
          .tpl-inline-nav { display: none; }
          .tpl-menu-trigger { display: inline-flex; }

          @media (min-width: 640px) {
            .tpl-inline-nav { display: flex; }
            /* On wide screens, hide the menu trigger unless there are overflow links */
            .tpl-menu-trigger:not([data-has-overflow]) { display: none; }
          }
        `}</style>
      </header>

      {open && (
        <MenuPanel
          id={panelId}
          title={title}
          accent={accent}
          links={links}
          logo={brand}
          onClose={() => {
            setOpen(false)
            triggerRef.current?.focus()
          }}
          panelRef={panelRef}
        />
      )}
    </>
  )
}

function MenuPanel({
  id,
  title,
  accent,
  links,
  logo,
  onClose,
  panelRef,
}: {
  id: string
  title: string
  accent: string
  links: string[]
  logo: React.ReactNode
  onClose: () => void
  panelRef: React.RefObject<HTMLDivElement | null>
}) {
  const DISPLAY = 'var(--font-template-display), "Bricolage Grotesque", system-ui, sans-serif'

  useEffect(() => {
    panelRef.current?.focus()
  }, [panelRef])

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label={`${shortTitle(title)} navigation`}
      tabIndex={-1}
      className="fixed inset-x-3 top-3 z-50 overflow-hidden rounded-3xl backdrop-blur-xl focus-visible:outline-none"
      style={{
        backgroundColor: 'rgba(17, 18, 20, 0.94)',
        color: '#ffffff',
      }}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <div
          className="flex h-10 min-w-0 items-center gap-2 rounded-full border px-4"
          style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
        >
          {logo}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
        >
          <X className="size-5" strokeWidth={2} />
        </button>
      </div>

      <div className="mx-6 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

      <div className="px-6 py-5">
        <p
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          Sections
        </p>
        <nav aria-label="All proposal sections">
          <ul className="flex flex-col">
            {links.map((label) => (
              <li
                key={label}
                className="border-t"
                style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
              >
                <a
                  href={`#${slugify(label)}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 text-lg font-medium text-white transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70"
                  style={{ fontFamily: DISPLAY }}
                >
                  <span>{label}</span>
                  <span aria-hidden className="text-sm opacity-50">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

function shortTitle(title: string): string {
  const first = title.split(/\s+/)[0] ?? title
  return first
}

/**
 * Walk up the DOM to find the nearest ancestor that scrolls vertically.
 * Returns `null` (meaning "use the window as observer root") if none found.
 */
function findScrollParent(node: Element): Element | null {
  let current: Element | null = node.parentElement
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight
    ) {
      return current
    }
    current = current.parentElement
  }
  return null
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
