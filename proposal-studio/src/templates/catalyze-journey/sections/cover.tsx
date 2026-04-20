'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { DisplayTitle } from '../../shared/typography'
import { PremiumCTA } from '../../shared/premium-cta'
import { Logo } from '@/components/logo'
import { CATALYZE_JOURNEY_CONTENT } from '@/data/catalyze-journey-content'
import { EASE_OUT_EDITORIAL } from '../../shared/motion'

interface CoverSectionProps {
  /** When provided, the primary "Begin" CTA calls this instead of linking
   *  to `#executive-summary`. FullSite uses this to treat the cover as a
   *  standalone entry "route" that unmounts into the proposal body. */
  onBegin?: () => void
}

/**
 * Walk up from `el` to the nearest scrolling ancestor so we can size the
 * cover to exactly fill it. This is what lets the cover look like "one
 * fixed page" both inside the editor preview (ScrollArea viewport) and on
 * the deployed site (document/viewport). Returns null if no scrolling
 * ancestor is found — the cover then falls back to `100dvh`.
 */
function findScrollingAncestor(el: HTMLElement | null): HTMLElement | null {
  let node: HTMLElement | null = el?.parentElement ?? null
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node)
    const overflowY = style.overflowY
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return node
    }
    node = node.parentElement
  }
  return null
}

/**
 * §00 · Cover — the entry moment.
 *
 * Full-bleed PwC hero photo with a dark gradient overlay. Exactly one
 * viewport tall with no internal scroll: the cover measures its nearest
 * scrolling ancestor (the ScrollArea viewport in the editor, the document
 * on the deployed site) and sizes itself to match. Falls back to
 * `100dvh`.
 *
 * Content (eyebrow → Garamond title → dateline → CTAs) is pinned to the
 * page's left edge with responsive padding — no centered max-width
 * container — so the title hugs the left margin consistent with Lilly's
 * editorial cover treatment. Typography is driven by the client's brand
 * tokens via ProposalCanvas: Garamond Narrow Condensed (→ EB Garamond
 * fallback) for the headline, Ringside Extra Wide (→ Bricolage fallback)
 * for label-scale text.
 *
 * Gentle staggered fade-up on load. When `onBegin` is provided, the Begin
 * button transitions into the rest of the proposal as a separate route.
 */
export function CoverSection({ onBegin }: CoverSectionProps = {}) {
  const reduce = useReducedMotion()
  const { cover } = CATALYZE_JOURNEY_CONTENT

  const sectionRef = useRef<HTMLElement | null>(null)
  // `null` means "measurement hasn't run yet" — we render with 100dvh so
  // SSR markup is stable and first paint isn't blank.
  const [lockedHeight, setLockedHeight] = useState<number | null>(null)

  // Measure the scrolling ancestor and keep the cover locked to its size.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const section = sectionRef.current
    if (!section) return

    const scroller = findScrollingAncestor(section)
    if (!scroller) {
      // No scrolling ancestor — the viewport itself is the scroller.
      // Track viewport height so we follow OS chrome changes (mobile).
      const applyViewport = () => setLockedHeight(window.innerHeight)
      applyViewport()
      window.addEventListener('resize', applyViewport)
      return () => window.removeEventListener('resize', applyViewport)
    }

    const apply = () => setLockedHeight(scroller.clientHeight)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(scroller)
    return () => ro.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cover"
      className="relative flex flex-col overflow-hidden"
      style={{
        height: lockedHeight != null ? `${lockedHeight}px` : '100dvh',
        backgroundColor: '#0b0f14',
      }}
    >
      {/* Full-bleed hero photograph */}
      <Image
        src="/PwC_bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
        aria-hidden
      />

      {/* Editorial dark-to-transparent gradient — heavy on the left where
          the title sits, feathering out toward the right so the photo's
          subject and PwC orange mark stay visible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(8,12,16,0.85) 0%, rgba(8,12,16,0.72) 30%, rgba(8,12,16,0.45) 55%, rgba(8,12,16,0.15) 82%, rgba(8,12,16,0.05) 100%)',
        }}
      />

      {/* Subtle vertical fade at the bottom so the CTA bar sits on a
          slightly darker band — improves button contrast without
          washing out the image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            'linear-gradient(to top, rgba(8,12,16,0.55) 0%, rgba(8,12,16,0) 100%)',
        }}
      />

      {/* Hairline top rule in Lilly red */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-px"
        style={{ backgroundColor: '#d31710', opacity: 0.45 }}
      />

      {/* Left-aligned content rail. Hugs the page's left edge with
          responsive padding — no centering. The inner content capped to
          max-w-[820px] so the title never stretches into unreadable
          widths on ultra-wide screens. */}
      <div className="relative z-10 flex flex-1 flex-col px-6 py-10 text-white sm:px-10 lg:px-16 lg:py-14">
        {/* Top meta row — PwC logo only */}
        <motion.div
          className="flex items-start"
          initial={reduce ? undefined : { opacity: 0, y: -8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EDITORIAL, delay: 0.1 }}
        >
          <Logo className="h-[72px] w-auto text-white" />
        </motion.div>

        {/* Center block — title + dateline.
            "Catalyze 360" is prepended to the headline as one flowing
            line of Garamond display type. */}
        <div className="flex max-w-[820px] flex-1 flex-col justify-center py-16">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EDITORIAL, delay: 0.3 }}
          >
            <DisplayTitle as="h1" size="hero" tone="inverse">
              Catalyze 360
              <br />
              {cover.titleMain}
              <br />
              <em style={{ fontStyle: 'italic' }}>{cover.titleItalic}</em>
            </DisplayTitle>
          </motion.div>

          {/* Dateline — pairs with the headline (title + metadata as one
              unit), so a tight gap to the title (mt-6 = 24px) and a
              generous gap before the CTAs separates the information
              block from the action block. */}
          <motion.p
            className="mt-6 font-label text-xs uppercase tracking-[0.3em]"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EDITORIAL, delay: 0.7 }}
          >
            {cover.dateline}
          </motion.p>

          <motion.div
            className="mt-14 flex flex-wrap items-center gap-3"
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EDITORIAL, delay: 1.1 }}
          >
            {onBegin ? (
              <PremiumCTA onClick={onBegin} size="lg">
                {cover.ctaLabel}
              </PremiumCTA>
            ) : (
              <PremiumCTA href="#executive-summary" size="lg">
                {cover.ctaLabel}
              </PremiumCTA>
            )}
            <PremiumCTA href="#" variant="ghost" arrow={false} tone="dark">
              Download PDF
            </PremiumCTA>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
