'use client'

import { motion } from 'framer-motion'
import { VIEWPORT_ONCE } from '../../shared/motion'

/**
 * One "Three Perspectives" slide rendered as a single full-bleed
 * image at the Figma-native 16:9 aspect ratio. The image is the
 * complete composition (eyebrow, headline, portrait, MacBook
 * mockup, callouts) — there's no React-side layout to misalign.
 *
 * Used for the three audience views (Partner / Innovation Team /
 * Leadership) under §04 Vision. Each slide is its own anchor
 * target so the JourneyNav can scroll to specific perspectives if
 * we ever wire deep links.
 */

export interface PerspectiveSlideProps {
  id: string
  /** Accessible label for the slide (e.g. "01 · Partner"). */
  ariaLabel: string
  /** Image source under /public — Figma-native composition. */
  src: string
  /** Alt text describing the slide content. */
  alt: string
}

export function PerspectiveSlide({
  id,
  ariaLabel,
  src,
  alt,
}: PerspectiveSlideProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#fbf2f0' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="block h-auto w-full"
          loading="lazy"
        />
      </motion.div>
    </section>
  )
}

export default PerspectiveSlide
