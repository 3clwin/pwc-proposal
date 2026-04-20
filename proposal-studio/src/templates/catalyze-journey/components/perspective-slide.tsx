'use client'

import Image from 'next/image'
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
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* `unoptimized` so Next.js serves the source PNG byte-for-
            byte rather than re-encoding to WebP at quality 75
            (which destroys the fine UI text in the compositions).
            Lazy-loaded — these slides only appear deep in the
            Vision section, never above the fold, so they shouldn't
            block the initial paint. */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          quality={100}
          className="object-contain"
          loading="lazy"
          unoptimized
        />
      </motion.div>
    </section>
  )
}

export default PerspectiveSlide
