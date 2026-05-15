'use client'

import { motion } from 'framer-motion'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  Lede,
  PullQuote,
  SectionHeading,
} from '../../shared/typography'
import { useJourneyContent } from '../journey-content-context'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §08 · Experience & Case Studies — proof section.
 *
 * Four full-width editorial case studies. The deck doesn't use case
 * imagery (slides 35–38 are pure typography), so we drop the photo
 * placeholder and let the stat numeral + Challenge / Solution / Outcome
 * read as the hero. Closes with the "Tech@Lilly" wall-of-experience
 * small-type block to signal breadth.
 */
export function ExperienceSection() {
  const { experience } = useJourneyContent()

  return (
    <section
      id="experience"
      className="relative border-t border-foreground/5 py-24 sm:py-32"
      style={{ backgroundColor: '#fbf2f0' }}
    >
      <EditorialContainer measure="wide">
        {/* Section opener */}
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
        >
          <motion.div variants={FADE_UP}>
            <Eyebrow number="08" rule>
              {experience.eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
            <DisplayTitle>{experience.title}</DisplayTitle>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8">
            <Lede>{experience.lede}</Lede>
          </motion.div>
        </motion.div>

        {/* Case studies */}
        <div className="mt-24 flex flex-col gap-16">
          {experience.cases.map((c, i) => {
            const hasQuotes = !!c.quotes && c.quotes.length > 0
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-10 rounded-3xl bg-white p-6 @sm:p-10 @lg:p-14 sm:p-10 lg:p-14"
              >
                {/* Header: eyebrow + title; stat (if present) sits on the right */}
                <header className="flex flex-col gap-6 @lg:flex-row @lg:items-end @lg:justify-between @lg:gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                  <div className="flex max-w-[760px] flex-col gap-3">
                    <Eyebrow tone="red">Case Study 0{i + 1}</Eyebrow>
                    <h3 className="font-display text-[clamp(24px,2.4vw,36px)] leading-[1.2] text-foreground">
                      {c.title}
                    </h3>
                  </div>

                  {c.stat && (
                    <div className="flex shrink-0 items-baseline gap-4 lg:flex-col lg:items-end lg:gap-1 lg:text-right">
                      <span
                        className="font-display tabular-nums leading-none"
                        style={{
                          fontSize: 'clamp(48px, 5.2vw, 84px)',
                          color: '#d31710',
                        }}
                      >
                        {c.stat.value}
                      </span>
                      <p className="font-label text-[12px] uppercase tracking-[0.24em] text-muted-foreground">
                        {c.stat.caption}
                      </p>
                    </div>
                  )}
                </header>

                {/* Body: Challenge / Solution / Outcome as 3-column on lg, stacked below */}
                <div className="grid grid-cols-1 gap-8 border-t border-foreground/10 pt-8 @lg:grid-cols-3 @lg:gap-10 lg:grid-cols-3 lg:gap-10">
                  {[
                    { label: 'Challenge', body: c.challenge },
                    { label: 'Solution', body: c.solution },
                    { label: 'Outcome', body: c.outcome },
                  ].map(({ label, body }) => (
                    <div key={label} className="flex flex-col gap-3">
                      <Eyebrow>{label}</Eyebrow>
                      <p className="font-sans text-[14px] leading-[1.7] text-foreground/75">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quotes (when present) live below the body, full width */}
                {hasQuotes && c.quotes && (
                  <div className="flex flex-col gap-8 border-t border-foreground/10 pt-10">
                    {c.quotes.map((q) => (
                      <PullQuote key={q.attribution} attribution={q.attribution}>
                        {q.text}
                      </PullQuote>
                    ))}
                  </div>
                )}
              </motion.article>
            )
          })}
        </div>

        {/* Tech@Lilly wall of experience */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8 }}
          className="mt-24 rounded-3xl p-10 sm:p-14"
          style={{ backgroundColor: '#111111' }}
        >
          <Eyebrow tone="inverse">{experience.techAtLilly.eyebrow}</Eyebrow>
          <div className="mt-6 max-w-[900px]">
            <SectionHeading tone="inverse">
              {experience.techAtLilly.title}
            </SectionHeading>
          </div>
          <p className="mt-8 max-w-[900px] font-sans text-[13px] leading-[1.8] text-white/60">
            {experience.techAtLilly.note}
          </p>

          {/* Subtle numbers strip */}
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-10 sm:grid-cols-5">
            {[
              { v: '15+', l: 'Years' },
              { v: '400+', l: 'Engagements' },
              { v: '5', l: 'Functions' },
              { v: '50+', l: 'Active programs' },
              { v: '1', l: 'Team' },
            ].map((item) => (
              <div key={item.l} className="flex flex-col gap-1">
                <span
                  className="font-display tabular-nums leading-none text-white"
                  style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}
                >
                  {item.v}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.24em] text-white/40">
                  {item.l}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </EditorialContainer>
    </section>
  )
}
