'use client'

import { motion } from 'framer-motion'
import { SectionAnchor } from '../shared/section-anchor'
import { TemplateHeader } from '../shared/template-header'
import { BrandPalette } from '../shared/brand-palette'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  Lede,
  StatNumeral,
} from '../shared/typography'
import { PremiumCTA } from '../shared/premium-cta'
import { findSection } from '../shared/section-helpers'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../shared/motion'
import type { FullSiteProps } from '../types'

/**
 * Vanguard (was Bold Momentum).
 *
 * Direction: Linear × Stripe, dark pharma edition. Black canvas with a
 * floating white summary panel, red only as single accent punctuation.
 * Data viz uses the red-* ramp for categorical progression. No photography
 * — type and color carry everything.
 *
 * Signature moves:
 *   • Black canvas (#111) throughout
 *   • Single floating white executive-summary card
 *   • Red-ramp horizontal bar charts (derived from palette)
 *   • Vertical phase-stack roadmap with red eyebrow numbers
 *   • Feature cards with 1px red top border, black-on-darker
 */
export function FullSite({
  site,
  tokens,
  hoveredSectionId,
  selectedSectionId,
  onSectionClick,
  onSectionHover,
}: FullSiteProps) {
  const accent = tokens.colors.primary || '#d31710'
  const redRamp = tokens.colors.palettes?.red ?? []
  const barColors = [
    redRamp[3] ?? '#f6b8ae',
    redRamp[4] ?? '#fd9485',
    redRamp[5] ?? '#f7513f',
    redRamp[6] ?? '#d31710',
    redRamp[7] ?? '#9f180f',
  ]

  const hero = findSection(site, 'hero')
  const summary = findSection(site, 'executive-summary')
  const approach = findSection(site, 'approach')
  const methodology = findSection(site, 'methodology')
  const team = findSection(site, 'team')
  const timeline = findSection(site, 'timeline')
  const pricing = findSection(site, 'pricing')
  const caseStudies = findSection(site, 'case-studies')
  const contact = findSection(site, 'contact')

  function anchorProps(id?: string) {
    if (!id) return {}
    return {
      isHovered: hoveredSectionId === id,
      isSelected: selectedSectionId === id,
      onClick: () => onSectionClick?.(id),
      onMouseEnter: () => onSectionHover?.(id),
      onMouseLeave: () => onSectionHover?.(null),
    }
  }

  const DARK = '#111111'
  const DARKER = '#1e2a30'

  return (
    <div
      className="tpl-root text-white"
      style={{
        backgroundColor: DARK,
        fontFamily: 'var(--font-template-sans), Inter, system-ui, sans-serif',
        containerType: 'inline-size',
      }}
    >
      <TemplateHeader
        title={site.metadata.title}
        accent={accent}
        links={['Summary', 'Approach', 'Vision', 'Timeline', 'Team', 'Investment', 'Cases']}
        logoUrl={tokens.logo?.url}
        logoAlt={`${tokens.clientSlug} logo`}
      />

      {/* ─────────────── §00 Hero — dark + red accent word ─────────────── */}
      {hero && (
        <SectionAnchor id={hero.id} {...anchorProps(hero.id)}>
          <section
            className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden pt-32 pb-20"
            style={{ backgroundColor: DARK }}
          >
            {/* Red radial glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-25"
              style={{
                background:
                  'radial-gradient(ellipse at 25% 0%, #d31710 0%, transparent 55%)',
              }}
            />
            <EditorialContainer measure="wide" className="relative z-10">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[1100px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow tone="inverse" rule>
                    {hero.content.subheadline}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-10">
                  <DisplayTitle as="h1" size="hero" tone="inverse">
                    {hero.content.headline}
                  </DisplayTitle>
                </motion.div>
                {hero.content.body && (
                  <motion.p
                    variants={FADE_UP}
                    className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-white/60"
                  >
                    {hero.content.body}
                  </motion.p>
                )}
                {hero.content.cta && (
                  <motion.div variants={FADE_UP} className="mt-10">
                    <PremiumCTA
                      href={hero.content.cta.url ?? '#summary'}
                      tone="dark"
                      size="lg"
                    >
                      {hero.content.cta.text}
                    </PremiumCTA>
                  </motion.div>
                )}
              </motion.div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §01 Executive Summary — floating white panel ─────────────── */}
      {summary && (
        <SectionAnchor id={summary.id} {...anchorProps(summary.id)}>
          <section id="summary" className="relative py-24" style={{ backgroundColor: DARK }}>
            <EditorialContainer measure="wide">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.9 }}
                className="relative rounded-3xl bg-white p-10 text-foreground sm:p-14 shadow-[0_32px_60px_rgba(0,0,0,0.5)]"
              >
                <Eyebrow number="01" rule>
                  Executive Summary
                </Eyebrow>
                {summary.content.subheadline && (
                  <div className="mt-6 max-w-[820px]">
                    <DisplayTitle>{summary.content.subheadline}</DisplayTitle>
                  </div>
                )}
                {summary.content.body && (
                  <div className="mt-6 max-w-[820px]">
                    <Lede>{summary.content.body}</Lede>
                  </div>
                )}

                {/* Red-ramp differentiator bars */}
                {hero?.content.items && (
                  <div className="mt-12 grid grid-cols-1 gap-3 border-t border-foreground/10 pt-8">
                    {hero.content.items.map((it, i) => (
                      <div key={it.title} className="flex items-center gap-4">
                        <span className="w-10 shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                          0{i + 1}
                        </span>
                        <div
                          className="h-8 shrink-0"
                          style={{
                            width: `${40 + i * 8}%`,
                            backgroundColor: barColors[i % barColors.length],
                          }}
                        />
                        <span className="font-display text-[15px] leading-tight text-foreground">
                          {it.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §02 Approach — dark feature cards with red top-border ─────────────── */}
      {approach && (
        <SectionAnchor id={approach.id} {...anchorProps(approach.id)}>
          <section id="approach" className="py-24" style={{ backgroundColor: DARK }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[820px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="02" tone="inverse" rule>
                    {approach.content.subheadline ?? 'The Challenge'}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">{approach.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {approach.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                  {approach.content.items.map((it, i) => (
                    <motion.div
                      key={it.title}
                      variants={FADE_UP}
                      className="relative flex flex-col gap-3 rounded-2xl p-6"
                      style={{ backgroundColor: DARKER }}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-6 top-0 h-px"
                        style={{ backgroundColor: accent }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50 tabular-nums">
                        0{i + 1}
                      </span>
                      <h4 className="font-display text-lg leading-tight text-white">
                        {it.title}
                      </h4>
                      <p className="font-sans text-[13px] leading-[1.6] text-white/70">
                        {it.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §03 Methodology (Vision) ─────────────── */}
      {methodology && (
        <SectionAnchor id={methodology.id} {...anchorProps(methodology.id)}>
          <section id="vision" className="py-24" style={{ backgroundColor: DARKER }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[900px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="03" tone="inverse" rule>
                    Vision
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">
                    {methodology.content.headline}
                  </DisplayTitle>
                </motion.div>
                {methodology.content.body && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <Lede tone="inverse">{methodology.content.body}</Lede>
                  </motion.div>
                )}
              </motion.div>
              {methodology.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5"
                >
                  {methodology.content.items.map((p, i) => (
                    <motion.div
                      key={p.title}
                      variants={FADE_UP}
                      className="flex flex-col gap-3 border-t pt-5"
                      style={{ borderColor: accent }}
                    >
                      <span
                        className="font-display text-2xl leading-none"
                        style={{ color: accent }}
                      >
                        0{i + 1}
                      </span>
                      <h4 className="font-display text-lg leading-tight text-white">
                        {p.title}
                      </h4>
                      <p className="font-sans text-[12px] leading-[1.55] text-white/70">
                        {p.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §04 Timeline — vertical phase stack ─────────────── */}
      {timeline && (
        <SectionAnchor id={timeline.id} {...anchorProps(timeline.id)}>
          <section id="timeline" className="py-24" style={{ backgroundColor: DARK }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[900px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="04" tone="inverse" rule>
                    Roadmap
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">{timeline.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {timeline.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-12 flex flex-col gap-3"
                >
                  {timeline.content.items.map((phase, i) => (
                    <motion.div
                      key={i}
                      variants={FADE_UP}
                      className="flex flex-col gap-2 rounded-2xl p-6 md:flex-row md:items-center md:gap-8"
                      style={{ backgroundColor: DARKER }}
                    >
                      <span
                        className="font-display text-3xl leading-none"
                        style={{ color: accent }}
                      >
                        0{i + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-display text-lg leading-tight text-white">
                          {phase.title}
                        </h4>
                        <p className="mt-1 font-sans text-[13px] leading-[1.55] text-white/70">
                          {phase.description}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="hidden h-4 w-px md:block"
                        style={{ backgroundColor: accent, opacity: 0.5 }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §05 Team — monogram cards on dark ─────────────── */}
      {team && (
        <SectionAnchor id={team.id} {...anchorProps(team.id)}>
          <section id="team" className="py-24" style={{ backgroundColor: DARKER }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[900px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="05" tone="inverse" rule>
                    Team
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">{team.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {team.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {team.content.items.map((p) => {
                    const initials =
                      p.title
                        ?.split(/\s+/)
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('') ?? ''
                    return (
                      <motion.article
                        key={p.title}
                        variants={FADE_UP}
                        className="flex gap-4 rounded-2xl p-6"
                        style={{ backgroundColor: DARK }}
                      >
                        <div
                          className="flex size-16 shrink-0 items-center justify-center rounded-full font-display italic text-xl text-white/90"
                          style={{ backgroundColor: DARKER }}
                        >
                          {initials}
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-display text-lg leading-tight text-white">
                            {p.title}
                          </h4>
                          <p className="font-sans text-[12px] leading-[1.5] text-white/70">
                            {p.description}
                          </p>
                        </div>
                      </motion.article>
                    )
                  })}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §06 Pricing — massive stat + bars ─────────────── */}
      {pricing && (
        <SectionAnchor id={pricing.id} {...anchorProps(pricing.id)}>
          <section id="investment" className="py-24" style={{ backgroundColor: DARK }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[900px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="06" tone="inverse" rule>
                    Investment
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">{pricing.content.headline}</DisplayTitle>
                </motion.div>
                {pricing.content.body && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <Lede tone="inverse">{pricing.content.body}</Lede>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8 }}
                className="mt-14 border-y border-white/10 py-10"
              >
                <StatNumeral
                  value="$1.39M"
                  caption="Final proposed fees"
                  sub="After PwC Lilly Partnership Discount (19%) and additional investment"
                  size="xl"
                  tone="inverse"
                />
              </motion.div>

              {pricing.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  {pricing.content.items.map((line) => (
                    <motion.div
                      key={line.title}
                      variants={FADE_UP}
                      className="relative rounded-2xl p-6"
                      style={{ backgroundColor: DARKER }}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-6 top-0 h-px"
                        style={{ backgroundColor: accent }}
                      />
                      <h4 className="font-display text-lg leading-tight text-white">
                        {line.title}
                      </h4>
                      <p className="mt-3 font-sans text-[13px] leading-[1.6] text-white/70">
                        {line.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §07 Case Studies ─────────────── */}
      {caseStudies && (
        <SectionAnchor id={caseStudies.id} {...anchorProps(caseStudies.id)}>
          <section id="cases" className="py-24" style={{ backgroundColor: DARKER }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[900px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="07" tone="inverse" rule>
                    Experience
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">{caseStudies.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {caseStudies.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-14 flex flex-col gap-6"
                >
                  {caseStudies.content.items.map((c, i) => (
                    <motion.article
                      key={c.title}
                      variants={FADE_UP}
                      className="grid grid-cols-1 gap-6 rounded-2xl p-8 md:grid-cols-[auto,1fr]"
                      style={{ backgroundColor: DARK }}
                    >
                      <span
                        className="font-display text-5xl leading-none"
                        style={{ color: accent }}
                      >
                        0{i + 1}
                      </span>
                      <div className="flex flex-col gap-3">
                        <h3 className="font-display text-xl leading-[1.2] text-white">
                          {c.title}
                        </h3>
                        <p className="font-sans text-[13px] leading-[1.7] text-white/70">
                          {c.description}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §08 Contact ─────────────── */}
      {contact && (
        <SectionAnchor id={contact.id} {...anchorProps(contact.id)}>
          <section className="py-28" style={{ backgroundColor: DARK }}>
            <EditorialContainer measure="reading">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-center text-center"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow tone="red">Next Steps</Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle tone="inverse">{contact.content.headline}</DisplayTitle>
                </motion.div>
                {contact.content.body && (
                  <motion.div variants={FADE_UP} className="mt-6">
                    <Lede tone="inverse" className="text-center mx-auto">
                      {contact.content.body}
                    </Lede>
                  </motion.div>
                )}
                {contact.content.cta && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <PremiumCTA href="#" tone="dark" size="lg">
                      {contact.content.cta.text}
                    </PremiumCTA>
                  </motion.div>
                )}
              </motion.div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      <BrandPalette tokens={tokens} variant="dark" />
    </div>
  )
}
