'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { motion, useScroll, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Mail, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

interface JourneyNavEntry {
  id: string
  number: string
  label: string
}

interface JourneyNavProps {
  entries: JourneyNavEntry[]
  /** Id of the cover section whose visibility hides the nav. When `null`
   *  (e.g. the cover lives on a separate "route" and is not mounted), the
   *  nav is always visible. Defaults to `"cover"`. */
  coverSectionId?: string | null
  /**
   * Optional handler for clicks on the logo / home link. When provided,
   * the logo becomes a clickable control that returns the user to the
   * cover "route". When omitted, the logo renders as a static mark
   * (useful for thumbnails or previews where there's no cover to
   * return to).
   */
  onReturnToCover?: () => void
}

/**
 * Sticky top nav for the Catalyze Journey.
 *
 *   • 2px Lilly Red progress bar at the very top edge — fades out while
 *     the cover is visible so the landing stays uncluttered.
 *   • Thin app bar with the real PwC mark (SVG) + "Catalyze360" label.
 *   • Desktop (lg+): numbered TOC rendered inline.
 *   • Tablet / mobile (<lg): TOC collapses into a shadcn DropdownMenu
 *     triggered by a Menu icon button; the active section appears as a
 *     compact pill on ≥sm so the user always sees where they are.
 *   • Scroll-spy highlights the active section everywhere.
 *   • Hides entirely while `#cover` is in view (IntersectionObserver);
 *     fades in once the user scrolls past the hero.
 */
export function JourneyNav({
  entries,
  coverSectionId = 'cover',
  onReturnToCover,
}: JourneyNavProps) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? '')
  // When there's no cover to watch, the nav is immediately visible.
  const [coverInView, setCoverInView] = useState(() => coverSectionId !== null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  // Scroll-spy over all TOC entries
  useEffect(() => {
    if (typeof window === 'undefined') return
    const observer = new IntersectionObserver(
      (observed) => {
        const best = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (best?.target instanceof HTMLElement) {
          setActiveId(best.target.id)
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    )
    const nodes = entries
      .map((e) => document.getElementById(e.id))
      .filter((n): n is HTMLElement => n !== null)
    for (const n of nodes) observer.observe(n)
    return () => observer.disconnect()
  }, [entries])

  // Watch the cover — hide nav entirely while the cover is visible.
  // If `coverSectionId` is null (e.g. the cover is on a separate "route"
  // and has been unmounted), skip the observer entirely; initial state
  // has already set `coverInView` to false so the nav renders immediately.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (coverSectionId === null) return
    const cover = document.getElementById(coverSectionId)
    if (!cover) return
    const observer = new IntersectionObserver(
      (observed) => {
        const entry = observed[0]
        if (!entry) return
        // Consider the cover "in view" while any part ≥ 25% is intersecting.
        setCoverInView(entry.isIntersecting && entry.intersectionRatio > 0.25)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    observer.observe(cover)
    return () => observer.disconnect()
  }, [coverSectionId])

  const activeIndex = Math.max(
    0,
    entries.findIndex((e) => e.id === activeId),
  )
  const activeEntry = entries[activeIndex]

  /**
   * Smooth-scroll the clicked section into view. `scrollIntoView` with
   * `behavior: 'smooth'` works inside any scrolling ancestor (the Radix
   * ScrollArea viewport in the editor, the document scroller on the
   * deployed site), which plain `<a href="#id">` jumps cannot — native
   * hash-jumps instant-teleport AND don't touch non-document scrollers.
   *
   * We still let modifier-key clicks fall through (cmd/ctrl/shift/alt)
   * so opening in a new tab / deep-linking behaves normally. Respect
   * `prefers-reduced-motion` by falling back to 'auto' (instant).
   */
  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return
      }
      const target = document.getElementById(id)
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      })
      // Update the hash so back/forward + sharing still work, but do it
      // without triggering the browser's own instant hash-jump.
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    },
    [reduce],
  )

  return (
    <AnimatePresence>
      {!coverInView && (
        <>
          {/* 2px progress bar — always pinned to the true top of the viewport */}
          <motion.div
            aria-hidden
            className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
            style={{
              scaleX: reduce ? scrollYProgress : smoothProgress,
              backgroundColor: '#d31710',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Sticky app bar */}
          <motion.nav
            key="journey-nav"
            aria-label="Proposal sections"
            className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                'mx-auto grid h-14 max-w-[1280px] items-center gap-4 px-4 @sm:gap-6 @sm:px-10 @4xl:px-16',
                // Three columns: logo (auto) | centered TOC (1fr) |
                // actions (auto). The centered middle column guarantees
                // the inline TOC sits truly centered in the bar,
                // independent of the logo and Contact us widths. Below
                // @4xl the TOC is `display: none` so the middle track
                // collapses visually to empty space; the layout still
                // works because the actions cell stays on the right.
                'grid-cols-[auto_1fr_auto]',
              )}
            >
              {/* Left: real PwC mark + deck label. Logo scales down on
                  narrow screens; the label hides on very small widths
                  so the trigger row stays uncrowded.
                  Uses Tailwind v4 container-query variants against the
                  parent `.tpl-root @container` so the nav responds to
                  the preview frame width, not the browser window.
                  Breakpoints here are CONTAINER-query sizes (not the
                  usual viewport sm/md/lg), so:
                    • @sm  = 384px  → logo label visible
                    • @4xl = 896px  → inline TOC replaces the menu
                  This maps "mobile + tablet preview → menu" and
                  "desktop preview → inline" correctly.
                  When `onReturnToCover` is provided, the whole cluster
                  becomes a button that dismisses the body route and
                  returns to the cover. Otherwise it renders as a
                  static mark. */}
              {onReturnToCover ? (
                <button
                  type="button"
                  onClick={onReturnToCover}
                  aria-label="Return to cover"
                  className={cn(
                    'flex shrink-0 cursor-pointer items-center gap-2.5 rounded-md tracking-tight text-foreground transition-opacity @sm:gap-3',
                    'hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d31710]/30 focus-visible:ring-offset-2',
                  )}
                >
                  <Logo className="h-6 w-auto text-foreground @sm:h-7" />
                  <span
                    aria-hidden
                    className="hidden h-3 w-px bg-black/15 @sm:block"
                  />
                  <span className="hidden font-label text-[14px] uppercase tracking-[0.28em] text-muted-foreground @sm:inline">
                    Catalyze360
                  </span>
                </button>
              ) : (
                <div
                  className="flex shrink-0 items-center gap-2.5 tracking-tight text-foreground @sm:gap-3"
                  aria-label="PwC · Catalyze 360"
                >
                  <Logo className="h-6 w-auto text-foreground @sm:h-7" />
                  <span
                    aria-hidden
                    className="hidden h-3 w-px bg-black/15 @sm:block"
                  />
                  <span className="hidden font-label text-[14px] uppercase tracking-[0.28em] text-muted-foreground @sm:inline">
                    Catalyze360
                  </span>
                </div>
              )}

              {/* Centered cell — inline TOC. Shows only once the
                  container is wide enough for all 8 entries to fit
                  without wrapping (≈896px). `justify-self-center`
                  centers the list horizontally within its grid track so
                  the nav reads logo · · · TOC · · · actions. Below
                  @4xl the list is `display: none` and the track
                  collapses to empty space. */}
              <ol className="hidden items-center gap-5 justify-self-center @4xl:flex">
                {entries.map((entry, i) => {
                  const isActive = entry.id === activeId
                  const isPast = i < activeIndex
                  return (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        onClick={(e) => handleNavClick(e, entry.id)}
                        className={cn(
                          'group inline-block font-label text-[12px] uppercase tracking-[0.24em] transition-colors duration-200',
                          isActive
                            ? 'text-[#d31710]'
                            : isPast
                              ? 'text-foreground/70 hover:text-foreground'
                              : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <span
                          className={cn(
                            'transition-opacity',
                            isActive
                              ? 'opacity-100'
                              : 'opacity-80 group-hover:opacity-100',
                          )}
                        >
                          {entry.label}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ol>

              {/* Right cell — mobile menu (hidden at @4xl+) + Contact us
                  CTA. Kept together so the two actions sit as one
                  cluster on the far right of the bar. */}
              <div className="flex items-center justify-end gap-3 @sm:gap-5">
              {/* Mobile / tablet: active-section marker + DropdownMenu */}
              <div className="flex items-center gap-2 @4xl:hidden">
                <div className="hidden items-center @sm:flex">
                  <span className="font-label text-[12px] uppercase tracking-[0.24em] text-[#d31710]">
                    {activeEntry?.label ?? ''}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Open proposal sections"
                    className={cn(
                      'inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors',
                      'hover:bg-foreground/5 hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d31710]/30',
                    )}
                  >
                    <Menu className="size-[18px]" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="min-w-[240px]"
                  >
                    {entries.map((entry, i) => {
                      const isActive = entry.id === activeId
                      const isPast = i < activeIndex
                      return (
                        <DropdownMenuItem key={entry.id} asChild>
                          <a
                            href={`#${entry.id}`}
                            onClick={(e) => handleNavClick(e, entry.id)}
                            className={cn(
                              'flex cursor-pointer items-baseline rounded-2xl px-3 py-2 font-label text-[11px] uppercase tracking-[0.24em]',
                              isActive
                                ? 'text-[#d31710]'
                                : isPast
                                  ? 'text-foreground/70'
                                  : 'text-muted-foreground',
                            )}
                          >
                            <span>{entry.label}</span>
                          </a>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Contact us — primary action, pinned far right. Lilly
                  red pill. On very narrow widths it collapses to an
                  icon-only button (mail glyph) to keep the nav tidy;
                  from @sm up it shows the full label. Links to the
                  Close section which houses the contact cards. */}
              <a
                href="#close"
                onClick={(e) => handleNavClick(e, 'close')}
                aria-label="Contact us"
                className={cn(
                  'group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-label uppercase tracking-[0.18em] transition-all duration-200 ease-out',
                  'bg-[#d31710] text-white hover:bg-[#9f180f] active:bg-[#6e1911]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d31710]/30 focus-visible:ring-offset-2',
                  // Icon-only on narrow, full pill from @sm up
                  'size-9 text-[10px] @sm:h-9 @sm:w-auto @sm:px-4',
                )}
              >
                <Mail className="size-4 shrink-0 @sm:hidden" aria-hidden />
                <span className="hidden @sm:inline">Contact us</span>
                <ArrowRight
                  aria-hidden
                  className="hidden size-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 @sm:inline-block"
                />
              </a>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
