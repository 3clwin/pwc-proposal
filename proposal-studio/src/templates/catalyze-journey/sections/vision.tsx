'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  Lede,
} from '../../shared/typography'
import { PerspectiveSlides } from '../components/perspective-slides'
import { BackboneArchitectureDiagram } from '../components/backbone-architecture-diagram'
import { useJourneyContent } from '../journey-content-context'
import {
  FADE_UP,
  STAGGER_PARENT,
  VIEWPORT_ONCE,
  VIEWPORT_LATE,
} from '../../shared/motion'

/**
 * §04 · Imagine the Future — three beats, this is the hero chapter.
 *
 *   4a · "One Lilly. Many Doors." — typographic centerpiece on a deep
 *        Lilly Black canvas for a cinematic break from the white rhythm.
 *        5 principles revealed below.
 *   4b · Platform architecture — Salesforce CRM backbone + 3 pillars +
 *        3 supporting capabilities + 4 audience pills.
 *   4c · Three user perspectives (Partner / Innovation Team / Leadership)
 *        each rendered as a wide split-screen editorial.
 */
export function VisionSection() {
  const { vision } = useJourneyContent()

  return (
    <>
      {/* 4a · Hero vision — Science.png photographic backdrop with a
          dark editorial scrim. The fallback color stays #111 so there's
          no flash of bright photo behind white text on slow connections.
          Layer order (back → front):
            1. solid fallback color (on the <section> itself)
            2. <Image fill priority>  — Science.png, cover-fit
            3. dark gradient scrim    — protects headline contrast
            4. content                — z-10, sits above everything */}
      <section
        id="vision"
        className="relative overflow-hidden py-28 sm:py-40"
        style={{ backgroundColor: '#111111' }}
      >
        {/* 2 · Backdrop photo */}
        <Image
          src="/Science.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover"
        />

        {/* 3 · Dark editorial scrim — vertical gradient slightly heavier
            at top and bottom so the headline (centered) sits in the
            calmer middle band. Tuned for AA contrast on white serif. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,12,0.88) 0%, rgba(10,10,12,0.62) 30%, rgba(10,10,12,0.62) 70%, rgba(10,10,12,0.92) 100%)',
          }}
        />

        <EditorialContainer measure="wide" className="relative z-10">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            {/* Centered chapter-mark stack: eyebrow · kicker.
                Tight 12px pair-spacing — they read as one paired
                chapter mark, not two separate labels. */}
            <motion.div
              variants={FADE_UP}
              className="flex flex-col items-center gap-3 text-center"
            >
              <Eyebrow tone="inverse">{vision.eyebrow}</Eyebrow>
              <span className="font-mono text-[13px] uppercase tracking-[0.3em] text-white/65 sm:text-[15px]">
                {vision.subtitle}
              </span>
            </motion.div>

            {/* Hero headline — 48px below the chapter mark (2× base) */}
            <motion.div
              variants={FADE_UP}
              className="mt-12 text-center"
              transition={{ duration: 1, delay: 0.2 }}
            >
              <DisplayTitle as="h2" size="hero" tone="inverse">
                {vision.titleA}{' '}
                <em style={{ fontStyle: 'italic', color: '#f7513f' }}>
                  {vision.titleItalic}
                </em>
                <br />
                {vision.titleB}
              </DisplayTitle>
            </motion.div>

            {/* 5 principles — 96px below the headline (4× base, the
                clear "next band" beat). Centered text in each cell so
                the whole hero composition reads as one symmetric stack.
                Internal cell gap: 12px (0.5× base) for tight pairing. */}
            <motion.div
              variants={STAGGER_PARENT}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT_LATE}
              className="mt-24 grid grid-cols-1 gap-x-8 gap-y-14 @sm:grid-cols-2 @lg:grid-cols-5 sm:grid-cols-2 lg:grid-cols-5"
            >
              {vision.principles.map((principle, i) => (
                <motion.div
                  key={principle.title}
                  variants={FADE_UP}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <span className="font-mono text-[12px] uppercase tracking-[0.28em] text-white/40 tabular-nums">
                    0{i + 1}
                  </span>
                  <h4 className="font-display text-xl leading-tight text-white">
                    {principle.title}
                  </h4>
                  <p className="font-sans text-[13px] leading-[1.6] text-white/65">
                    {principle.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </EditorialContainer>
      </section>

      {/* 4b · Platform architecture — slide 18 1:1 rebuild. */}
      <section className="relative border-t border-foreground/5 bg-white py-24 sm:py-32">
        <EditorialContainer measure="wide">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP} className="max-w-[900px] text-center mx-auto">
              <DisplayTitle size="title">
                {vision.architecture.title}
                <br />
                <em style={{ fontStyle: 'italic', color: '#d31710' }}>
                  {vision.architecture.titleItalic}
                </em>
              </DisplayTitle>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6 mx-auto max-w-[760px] text-center">
              <Lede>{vision.architecture.body}</Lede>
            </motion.div>
          </motion.div>

          <div className="mt-16">
            <BackboneArchitectureDiagram
              audiences={vision.architecture.audiences}
              backboneLabel={vision.architecture.backboneLabel}
              pillarsHeading={vision.architecture.pillarsHeading}
              pillars={vision.architecture.pillars}
              capabilities={vision.architecture.capabilities}
              footerCaption={vision.architecture.footerCaption}
            />
          </div>
        </EditorialContainer>
      </section>

      {/* 4c · Three user perspectives — full-bleed Figma slides.
          Drops the reader straight into the three perspective
          compositions (Partner / Innovation Team / Leadership). The
          slides carry their own headlines and eyebrows, so no
          section header is needed here. */}
      <section className="relative bg-white">
        <PerspectiveSlides />
      </section>
    </>
  )
}
