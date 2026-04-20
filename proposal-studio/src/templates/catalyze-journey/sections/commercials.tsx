'use client'

import { motion } from 'framer-motion'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  StatNumeral,
  SectionHeading,
} from '../../shared/typography'
import { CATALYZE_JOURNEY_CONTENT } from '@/data/catalyze-journey-content'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §06 · Commercials — honest, direct, no ornament.
 *
 * Headline stat, two workstream cards with deliverable lists, discount
 * reconciliation, and assumption footnotes.
 */
export function CommercialsSection() {
  const { commercials } = CATALYZE_JOURNEY_CONTENT

  return (
    <section
      id="commercials"
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
            <Eyebrow number="06" rule>
              {commercials.eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
            <DisplayTitle>{commercials.title}</DisplayTitle>
          </motion.div>
        </motion.div>

        {/* Headline fee */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8 }}
          className="mt-16 border-y border-foreground/10 py-16"
        >
          <StatNumeral
            value={commercials.headlineFee.value}
            caption={commercials.headlineFee.caption}
            size="xl"
            tone="red"
          />
        </motion.div>

        {/* Two workstream fee cards */}
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {commercials.feeLines.map((line, i) => (
            <motion.div
              key={line.name}
              variants={FADE_UP}
              className="flex flex-col gap-5 rounded-2xl bg-white p-8"
            >
              <div className="flex items-baseline justify-between border-b border-foreground/10 pb-4">
                <div className="flex flex-col gap-1">
                  <Eyebrow>Line 0{i + 1}</Eyebrow>
                  <h4 className="font-display text-2xl leading-tight text-foreground">
                    {line.name}
                  </h4>
                </div>
                <span
                  className="font-display tabular-nums"
                  style={{
                    fontSize: 'clamp(28px, 3vw, 40px)',
                    color: '#1e2a30',
                  }}
                >
                  {line.amount}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {line.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex gap-3 font-sans text-[13px] leading-[1.6] text-foreground/75"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full"
                      style={{ backgroundColor: '#d31710' }}
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Discount reconciliation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.7 }}
          className="mt-12 rounded-2xl bg-white p-8"
        >
          <SectionHeading>Fees & Investment</SectionHeading>
          <ul className="mt-6 flex flex-col gap-0 divide-y divide-foreground/10">
            {commercials.discount.map((line, i) => {
              const isLast = i === commercials.discount.length - 1
              return (
                <li
                  key={line.label}
                  className={`flex items-center justify-between py-4 ${
                    isLast ? 'pt-5' : ''
                  }`}
                >
                  <span
                    className={
                      isLast
                        ? 'font-label text-[11px] uppercase tracking-[0.28em] text-[#d31710]'
                        : 'font-sans text-sm text-foreground/75'
                    }
                  >
                    {line.label}
                  </span>
                  <span
                    className={
                      isLast
                        ? 'font-display text-3xl tabular-nums text-foreground'
                        : 'font-display text-xl tabular-nums text-foreground/80'
                    }
                  >
                    {line.value}
                  </span>
                </li>
              )
            })}
          </ul>
        </motion.div>

        {/* Assumptions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6 }}
          className="mt-10"
        >
          <Eyebrow className="mb-4">Assumptions</Eyebrow>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {commercials.assumptions.map((a) => (
              <li
                key={a}
                className="flex gap-3 font-sans text-[12px] leading-[1.6] text-foreground/65"
              >
                <span
                  aria-hidden
                  className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/40"
                />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </EditorialContainer>
    </section>
  )
}
