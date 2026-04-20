'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { JourneyNav } from './journey-nav'
import { CoverSection } from './sections/cover'
import { ExecutiveSummarySection } from './sections/executive-summary'
import { CallToActionSection } from './sections/call-to-action'
import { FoundationSection } from './sections/foundation'
import { VisionSection } from './sections/vision'
import { DeliverySection } from './sections/delivery'
import { CommercialsSection } from './sections/commercials'
import { TeamSection } from './sections/team'
import { ExperienceSection } from './sections/experience'
import { CloseSection } from './sections/close'
import { EASE_OUT_EDITORIAL } from '../shared/motion'
import type { FullSiteProps } from '../types'
import type { ExecSummaryBlock } from './sections/executive-summary.schema'

/**
 * Catalyze Journey — the bespoke Lilly scroll-driven proposal experience.
 *
 * Ten sections, section-by-section composed as an editorial narrative:
 *
 *   §00 · Cover (entry moment)
 *   §01 · Executive Summary
 *   §02 · Call to Action
 *   §03 · Foundation (Tale of Two Experiences + Operating Model + Success Factors)
 *   §04 · Vision (One Lilly Many Doors + Architecture + 3 Perspectives)
 *   §05 · Delivery (Sprint 0 + Operating Model + Timeline + MVP + Architecture)
 *   §06 · Commercials
 *   §07 · Team
 *   §08 · Experience & Case Studies
 *   §09 · Close
 *
 * Content comes from `CATALYZE_JOURNEY_CONTENT` verbatim from the deck.
 * Typography uses Lilly's real stack (Garamond Narrow Condensed / Ringside
 * Sans / Ringside Extra Wide → EB Garamond / Space Grotesk / Bricolage).
 * Lilly Red used as punctuation, cool Lilly neutrals (pale blue, soft blue)
 * carry the ambient mood.
 *
 * `FullSiteProps` comes in from the normal SiteRenderer pipeline but we
 * don't consume any of it — Catalyze Journey is bespoke and reads its own
 * content constant. The props are accepted so the shared TemplateDefinition
 * contract stays satisfied.
 */
const TOC = [
  { id: 'executive-summary', number: '01', label: 'Summary' },
  { id: 'call-to-action', number: '02', label: 'Call' },
  { id: 'foundation', number: '03', label: 'Foundation' },
  { id: 'vision', number: '04', label: 'Vision' },
  { id: 'delivery', number: '05', label: 'Delivery' },
  { id: 'commercials', number: '06', label: 'Commercials' },
  { id: 'team', number: '07', label: 'Team' },
  { id: 'experience', number: '08', label: 'Cases' },
]

/**
 * Walk up from `el` to the nearest scrolling ancestor. Matches the same
 * heuristic used in CoverSection so both components lock on to the same
 * element (editor ScrollArea viewport in the app, document scroller on
 * the deployed site).
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

export function FullSite(props: FullSiteProps) {
  const execSummarySection = props.site?.sections?.find(
    (s) => s.type === 'executive-summary',
  )
  const execSummaryBlocks = execSummarySection?.blocks as
    | ExecSummaryBlock[]
    | undefined

  const [entered, setEntered] = useState(false)
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement | null>(null)

  const handleBegin = useCallback(() => {
    setEntered(true)
  }, [])

  /**
   * Return to the cover "route" from inside the body. Scrolls the
   * scrolling ancestor to the top first so the cover paints in at
   * y=0, then unmounts the body via `entered = false`. AnimatePresence
   * crossfades the two routes.
   */
  const handleReturnToCover = useCallback(() => {
    if (typeof window === 'undefined') {
      setEntered(false)
      return
    }
    const scroller = findScrollingAncestor(rootRef.current)
    const target = scroller ?? window
    const behavior = reduce ? 'auto' : 'smooth'
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior })
    } else {
      target.scrollTo({ top: 0, behavior })
    }
    setEntered(false)
  }, [reduce])

  // While the cover route is active, forcibly lock the scrolling ancestor
  // so the page *cannot* scroll even if sub-pixel rounding or a 1px extra
  // line-box would otherwise cause a scrollbar to appear. On the deployed
  // site the scroller is the document, in the editor it's the ScrollArea
  // viewport — both get the same treatment. Restore the previous
  // overflow-y on unmount or when the user begins.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (entered) return
    const scroller = findScrollingAncestor(rootRef.current)
    if (!scroller) return
    const previous = scroller.style.overflowY
    scroller.style.overflowY = 'hidden'
    return () => {
      scroller.style.overflowY = previous
    }
  }, [entered])

  // Once the body has mounted after Begin is clicked, bring the first
  // section into view. useLayoutEffect so the scroll happens before paint,
  // avoiding a visual "jump from cover" flicker.
  useLayoutEffect(() => {
    if (!entered) return
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById('executive-summary')
      if (!target) return
      target.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [entered, reduce])

  return (
    <div
      ref={rootRef}
      className="@container tpl-root"
      style={{
        fontFamily: 'var(--font-template-sans), Inter, system-ui, sans-serif',
        containerType: 'inline-size',
      }}
    >
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="cover-route"
            exit={
              reduce
                ? undefined
                : { opacity: 0, transition: { duration: 0.5, ease: EASE_OUT_EDITORIAL } }
            }
          >
            <CoverSection onBegin={handleBegin} />
          </motion.div>
        ) : (
          <motion.div
            key="body-route"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EDITORIAL, delay: 0.1 }}
          >
            <JourneyNav
              entries={TOC}
              coverSectionId={null}
              onReturnToCover={handleReturnToCover}
            />
            <ExecutiveSummarySection blocks={execSummaryBlocks} />
            <CallToActionSection />
            <FoundationSection />
            <VisionSection />
            <DeliverySection />
            <CommercialsSection />
            <TeamSection />
            <ExperienceSection />
            <CloseSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
