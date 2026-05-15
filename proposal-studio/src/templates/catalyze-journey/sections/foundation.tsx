'use client'

import { motion } from 'framer-motion'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  Lede,
  SectionHeading,
} from '../../shared/typography'
import { OperatingModelDiagram } from '../components/operating-model-diagram'
import { SuccessFactorsDiagram } from '../components/success-factors-diagram'
import { useJourneyContent } from '../journey-content-context'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §03 · Building a Foundation — three beats.
 *
 *   3a · A Tale of Two Experiences — Rachel + Marcus storyboard across
 *        Problem → Transformation → Outcome. Each beat renders as a
 *        two-column editorial spread with photo placeholder, mood label,
 *        verbatim quote, and narrative body.
 *   3b · Operating Model — 6-pillar grid rendering the connected
 *        operating model (Partner Intake, Seamless Experience, Pricing,
 *        Governance, Value, Org Model).
 *   3c · Success Factors — 6-up editorial grid with Garamond title and
 *        italic lead sentence per factor.
 */
export function FoundationSection() {
  const { foundation } = useJourneyContent()
  const tale = foundation.taleOfTwo
  // Pre-assemble the three beats so we can iterate over them evenly.
  const partnerBeats = [
    { label: 'Problem', ...tale.partner.problem },
    { label: 'Transformation', ...tale.partner.transformation },
    { label: 'Outcome', ...tale.partner.outcome },
  ]
  const navigatorBeats = [
    { label: 'Problem', ...tale.navigator.problem },
    { label: 'Transformation', ...tale.navigator.transformation },
    { label: 'Outcome', ...tale.navigator.outcome },
  ]

  return (
    <section id="foundation" className="relative border-t border-foreground/5 bg-white py-24 sm:py-32">
      <EditorialContainer measure="wide">
        {/* Section opener */}
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
        >
          <motion.div variants={FADE_UP}>
            <Eyebrow number="03" rule>
              {foundation.eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
            <DisplayTitle>{foundation.title}</DisplayTitle>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8">
            <Lede>{foundation.lede}</Lede>
          </motion.div>
        </motion.div>

        {/* 3a · Tale of Two Experiences */}
        <div className="mt-32">
          <div className="mb-10 flex items-end justify-between">
            <SectionHeading>{tale.title}</SectionHeading>
            <span className="hidden font-mono text-[12px] uppercase tracking-[0.24em] text-muted-foreground sm:block">
              {tale.subtitle}
            </span>
          </div>

          {/* Character header strip */}
          <div className="grid grid-cols-1 gap-6 border-y border-foreground/10 py-8 @md:grid-cols-2 md:grid-cols-2">
            {/* Rachel */}
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/team/rachel-martinez.png"
                alt={tale.partner.name}
                className="aspect-square h-20 w-20 shrink-0 self-start rounded object-cover"
              />
              <div className="flex flex-col justify-center gap-1">
                <Eyebrow tone="red">Partner</Eyebrow>
                <h4 className="font-display text-2xl text-foreground">
                  {tale.partner.name}
                </h4>
                <p className="font-sans text-[12px] leading-[1.5] text-muted-foreground">
                  {tale.partner.context}
                </p>
              </div>
            </div>
            {/* Marcus */}
            <div className="flex gap-4 md:border-l md:border-foreground/10 md:pl-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/team/marcus-chen.png"
                alt={tale.navigator.name}
                className="aspect-square h-20 w-20 shrink-0 self-start rounded object-cover"
              />
              <div className="flex flex-col justify-center gap-1">
                <Eyebrow tone="red">Navigator</Eyebrow>
                <h4 className="font-display text-2xl text-foreground">
                  {tale.navigator.name}
                </h4>
                <p className="font-sans text-[12px] leading-[1.5] text-muted-foreground">
                  {tale.navigator.context}
                </p>
              </div>
            </div>
          </div>

          {/* Three beats, each a 2-col row */}
          {['Problem', 'Transformation', 'Outcome'].map((beatLabel, beatIdx) => {
            const partnerBeat = partnerBeats[beatIdx]!
            const navBeat = navigatorBeats[beatIdx]!
            const isTransformation = beatLabel === 'Transformation'
            const isOutcome = beatLabel === 'Outcome'
            return (
              <motion.div
                key={beatLabel}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.7 }}
                className="mt-16 border-t border-foreground/10 pt-10"
              >
                {/* Beat number + label — inline, not straddling the divider */}
                <div className="mb-8 flex items-center gap-3">
                  <span className="inline-flex size-7 items-center justify-center rounded-full font-mono text-[12px] font-medium tabular-nums text-foreground/70 ring-1 ring-foreground/15">
                    {String(beatIdx + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden
                    className="h-px w-6 bg-foreground/15"
                  />
                  <span
                    className="font-label text-[11px] uppercase tracking-[0.28em]"
                    style={{
                      color: isOutcome
                        ? '#d31710'
                        : isTransformation
                          ? '#1e2a30'
                          : '#606c73',
                    }}
                  >
                    {beatLabel}
                  </span>
                </div>

                {/* Two-column quote layout */}
                <div className="grid grid-cols-1 gap-10 @md:grid-cols-2 @md:gap-16 md:grid-cols-2 md:gap-16">

                {/* Rachel column */}
                <div className="flex flex-col gap-3">
                  <span className="font-label text-[12px] uppercase tracking-[0.24em] text-[#d31710]">
                    {partnerBeat.mood}
                  </span>
                  <p className="font-display text-[clamp(20px,2vw,26px)] italic leading-[1.3] text-foreground">
                    &ldquo;{partnerBeat.quote}&rdquo;
                  </p>
                  <p className="font-sans text-[14px] leading-[1.7] text-foreground/70">
                    {partnerBeat.body}
                  </p>
                </div>

                {/* Marcus column */}
                <div className="flex flex-col gap-3 md:border-l md:border-foreground/10 md:pl-16">
                  <span className="font-label text-[12px] uppercase tracking-[0.24em] text-[#d31710]">
                    {navBeat.mood}
                  </span>
                  <p className="font-display text-[clamp(20px,2vw,26px)] italic leading-[1.3] text-foreground">
                    &ldquo;{navBeat.quote}&rdquo;
                  </p>
                  <p className="font-sans text-[14px] leading-[1.7] text-foreground/70">
                    {navBeat.body}
                  </p>
                </div>
                </div>
              </motion.div>
            )
          })}

          {/* Outcome footer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7 }}
            className="mt-16 rounded-2xl p-10"
            style={{ backgroundColor: '#fbf2f0' }}
          >
            <Eyebrow tone="red" className="mb-4">
              The Result
            </Eyebrow>
            <p className="font-display text-[clamp(22px,2.2vw,32px)] leading-[1.3] text-foreground">
              {tale.outcome}
            </p>
          </motion.div>
        </div>

        {/* 3b · Operating Model */}
        <div className="mt-32">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP}>
              <Eyebrow>{foundation.operatingModel.eyebrow}</Eyebrow>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6 max-w-[900px]">
              <SectionHeading>{foundation.operatingModel.title}</SectionHeading>
            </motion.div>
          </motion.div>

          {/* 6-pillar honeycomb (1:1 with deck slide 11). Italic red
              subtitle rides above the cluster; bold caption below. */}
          <div className="mt-14">
            <OperatingModelDiagram
              pillars={foundation.operatingModel.pillars}
              subtitle={foundation.operatingModel.subtitle}
              caption={foundation.operatingModel.agenticCrmCaption}
            />
          </div>
        </div>

        {/* 3c · Success Factors */}
        <div className="mt-32">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP}>
              <Eyebrow>{foundation.successFactors.eyebrow}</Eyebrow>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6 max-w-[820px]">
              <SectionHeading>{foundation.successFactors.title}</SectionHeading>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6">
              <Lede>{foundation.successFactors.body}</Lede>
            </motion.div>
          </motion.div>

          <div className="mt-14">
            <SuccessFactorsDiagram
              factors={foundation.successFactors.factors}
              footer='…and most importantly, the operating model is never "finished". Maintain room for evolution as market and business dynamics shift.'
            />
          </div>
        </div>
      </EditorialContainer>
    </section>
  )
}
