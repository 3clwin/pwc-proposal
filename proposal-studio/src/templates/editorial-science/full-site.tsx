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
  PullQuote,
} from '../shared/typography'
import { PlaceholderImage } from '../shared/placeholder-image'
import { PremiumCTA } from '../shared/premium-cta'
import { findSection } from '../shared/section-helpers'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../shared/motion'
import type { FullSiteProps } from '../types'

/**
 * Atelier (was Editorial Science).
 *
 * Direction: FT Weekend × gallery catalogue. Consistent 60/40 split
 * grid across every section — left column runs text, right column runs
 * 4:5 imagery. Alternating white → rose-tint → cream-tint surfaces.
 * Red-dot timeline. Red hairline rule after eyebrows.
 *
 * Signature moves:
 *   • Strict 60/40 grid rhythm
 *   • Section eyebrows: 11px RINGSIDE EXTRA WIDE + hairline red rule
 *   • 4:5 photo crops throughout
 *   • Red-dot milestone timeline
 *   • Alternating warm surfaces per section
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

  return (
    <div
      className="tpl-root"
      style={{
        backgroundColor: '#fbf5f4',
        fontFamily: 'var(--font-template-sans), Inter, system-ui, sans-serif',
        containerType: 'inline-size',
      }}
    >
      <TemplateHeader
        title={site.metadata.title}
        accent={accent}
        links={['Summary', 'Vision', 'Timeline', 'Team', 'Investment', 'Cases']}
        logoUrl={tokens.logo?.url}
        logoAlt={`${tokens.clientSlug} logo`}
      />

      {/* ─────────────── §00 Hero — 60/40 split ─────────────── */}
      {hero && (
        <SectionAnchor id={hero.id} {...anchorProps(hero.id)}>
          <section
            className="relative grid min-h-[85vh] grid-cols-1 items-center gap-10 pt-28 pb-20 md:grid-cols-[3fr,2fr] md:gap-16"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="pl-6 sm:pl-10 lg:pl-16">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow tone="red" rule>
                    {hero.content.subheadline}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-10">
                  <DisplayTitle as="h1" size="hero" italic>
                    {hero.content.headline}
                  </DisplayTitle>
                </motion.div>
                {hero.content.body && (
                  <motion.p
                    variants={FADE_UP}
                    className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground"
                  >
                    {hero.content.body}
                  </motion.p>
                )}
                {hero.content.cta && (
                  <motion.div variants={FADE_UP} className="mt-10">
                    <PremiumCTA
                      href={hero.content.cta.url ?? '#summary'}
                      size="lg"
                    >
                      {hero.content.cta.text}
                    </PremiumCTA>
                  </motion.div>
                )}
              </motion.div>
            </div>
            <div className="pr-6 sm:pr-10 lg:pr-16">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8 }}
              >
                <PlaceholderImage
                  aspect="4/5"
                  tone="rose"
                  label="Hero portrait"
                  caption="4:5 · documentary"
                  rounded
                />
              </motion.div>
            </div>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §01 Executive Summary (60/40 reverse) ─────────────── */}
      {summary && (
        <SectionAnchor id={summary.id} {...anchorProps(summary.id)}>
          <section
            id="summary"
            className="py-24"
            style={{ backgroundColor: '#fbf5f4' }}
          >
            <EditorialContainer measure="wide">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr,3fr] md:gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.8 }}
                  className="order-2 md:order-1"
                >
                  <PlaceholderImage
                    aspect="4/5"
                    tone="cream"
                    label="Leadership portrait"
                    caption="4:5 · editorial"
                    rounded
                  />
                </motion.div>
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="order-1 flex flex-col gap-6 md:order-2"
                >
                  <motion.div variants={FADE_UP}>
                    <Eyebrow number="01" rule>
                      Executive Summary
                    </Eyebrow>
                  </motion.div>
                  {summary.content.subheadline && (
                    <motion.div variants={FADE_UP}>
                      <DisplayTitle italic>{summary.content.subheadline}</DisplayTitle>
                    </motion.div>
                  )}
                  {summary.content.body && (
                    <motion.div variants={FADE_UP}>
                      <Lede>{summary.content.body}</Lede>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §02 Approach — editorial columns ─────────────── */}
      {approach && (
        <SectionAnchor id={approach.id} {...anchorProps(approach.id)}>
          <section
            id="approach"
            className="py-24"
            style={{ backgroundColor: '#ffffff' }}
          >
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[820px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="02" rule>
                    {approach.content.subheadline ?? 'The Challenge'}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle italic>{approach.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {approach.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2"
                >
                  {approach.content.items.map((it, i) => (
                    <motion.div
                      key={it.title}
                      variants={FADE_UP}
                      className="flex flex-col gap-3"
                    >
                      <div
                        aria-hidden
                        className="h-px w-12"
                        style={{ backgroundColor: accent }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                        0{i + 1}
                      </span>
                      <h4 className="font-display text-[clamp(22px,1.8vw,28px)] leading-tight text-foreground">
                        {it.title}
                      </h4>
                      <p className="font-sans text-[14px] leading-[1.7] text-foreground/75">
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

      {/* ─────────────── §03 Methodology — 60/40 with pull quote ─────────────── */}
      {methodology && (
        <SectionAnchor id={methodology.id} {...anchorProps(methodology.id)}>
          <section id="vision" className="py-24" style={{ backgroundColor: '#fcf5ed' }}>
            <EditorialContainer measure="wide">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[3fr,2fr] md:gap-16">
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="flex flex-col gap-6"
                >
                  <motion.div variants={FADE_UP}>
                    <Eyebrow number="03" rule>
                      Vision
                    </Eyebrow>
                  </motion.div>
                  <motion.div variants={FADE_UP}>
                    <DisplayTitle italic>{methodology.content.headline}</DisplayTitle>
                  </motion.div>
                  {methodology.content.body && (
                    <motion.div variants={FADE_UP}>
                      <Lede>{methodology.content.body}</Lede>
                    </motion.div>
                  )}
                  {methodology.content.items && (
                    <motion.ul
                      variants={STAGGER_PARENT}
                      className="mt-4 flex flex-col gap-5 border-t border-foreground/10 pt-5"
                    >
                      {methodology.content.items.map((p, i) => (
                        <motion.li key={p.title} variants={FADE_UP} className="flex gap-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                            0{i + 1}
                          </span>
                          <div>
                            <h4 className="font-display text-lg leading-tight text-foreground">
                              {p.title}
                            </h4>
                            <p className="mt-1 font-sans text-[13px] leading-[1.6] text-foreground/70">
                              {p.description}
                            </p>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col gap-8"
                >
                  <PlaceholderImage
                    aspect="4/5"
                    tone="sage"
                    label="Vision imagery"
                    caption="4:5 · lab"
                    rounded
                  />
                  {methodology.content.subheadline && (
                    <PullQuote>
                      {methodology.content.subheadline}
                    </PullQuote>
                  )}
                </motion.div>
              </div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §04 Timeline — horizontal rail with red dots ─────────────── */}
      {timeline && (
        <SectionAnchor id={timeline.id} {...anchorProps(timeline.id)}>
          <section id="timeline" className="py-24" style={{ backgroundColor: '#ffffff' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="04" rule>
                    Roadmap
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6 max-w-[820px]">
                  <DisplayTitle italic>{timeline.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {timeline.content.items && (
                <div className="mt-14 relative">
                  <div
                    aria-hidden
                    className="absolute left-0 right-0 top-5 hidden h-px md:block"
                    style={{ backgroundColor: accent, opacity: 0.3 }}
                  />
                  <motion.div
                    variants={STAGGER_PARENT}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT_ONCE}
                    className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-6"
                  >
                    {timeline.content.items.map((phase, i) => (
                      <motion.div
                        key={i}
                        variants={FADE_UP}
                        className="relative flex flex-col gap-3 md:pt-14"
                      >
                        <span
                          aria-hidden
                          className="absolute -top-[6px] left-0 hidden size-[22px] items-center justify-center rounded-full bg-white ring-1 ring-foreground/20 md:flex"
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                        </span>
                        <h4 className="font-display text-lg leading-tight text-foreground">
                          {phase.title}
                        </h4>
                        <p className="font-sans text-[12px] leading-[1.55] text-foreground/70">
                          {phase.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §05 Team — 4:5 portrait grid ─────────────── */}
      {team && (
        <SectionAnchor id={team.id} {...anchorProps(team.id)}>
          <section id="team" className="py-24" style={{ backgroundColor: '#fbf5f4' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[820px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="05" rule>
                    Team
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle italic>{team.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {team.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
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
                        className="flex flex-col gap-4"
                      >
                        <PlaceholderImage
                          aspect="4/5"
                          tone="stone"
                          monogram={initials}
                          rounded
                        />
                        <h4 className="font-display text-lg leading-tight text-foreground">
                          {p.title}
                        </h4>
                        <p className="font-sans text-[12px] leading-[1.55] text-foreground/70">
                          {p.description}
                        </p>
                      </motion.article>
                    )
                  })}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §06 Pricing — editorial list ─────────────── */}
      {pricing && (
        <SectionAnchor id={pricing.id} {...anchorProps(pricing.id)}>
          <section id="investment" className="py-24" style={{ backgroundColor: '#ffffff' }}>
            <EditorialContainer measure="wide">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[3fr,2fr] md:gap-16">
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="flex flex-col gap-6"
                >
                  <motion.div variants={FADE_UP}>
                    <Eyebrow number="06" rule>
                      Investment
                    </Eyebrow>
                  </motion.div>
                  <motion.div variants={FADE_UP}>
                    <DisplayTitle italic>{pricing.content.headline}</DisplayTitle>
                  </motion.div>
                  {pricing.content.body && (
                    <motion.div variants={FADE_UP}>
                      <Lede>{pricing.content.body}</Lede>
                    </motion.div>
                  )}
                </motion.div>
                {pricing.content.items && (
                  <motion.ul
                    variants={STAGGER_PARENT}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT_ONCE}
                    className="flex flex-col divide-y divide-foreground/10"
                  >
                    {pricing.content.items.map((line) => (
                      <motion.li
                        key={line.title}
                        variants={FADE_UP}
                        className="py-5"
                      >
                        <h4 className="font-display text-lg leading-tight text-foreground">
                          {line.title}
                        </h4>
                        <p className="mt-2 font-sans text-[13px] leading-[1.6] text-foreground/70">
                          {line.description}
                        </p>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §07 Case Studies — 60/40 imagery ─────────────── */}
      {caseStudies && (
        <SectionAnchor id={caseStudies.id} {...anchorProps(caseStudies.id)}>
          <section id="cases" className="py-24" style={{ backgroundColor: '#fcf5ed' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[820px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="07" rule>
                    Experience
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <DisplayTitle italic>{caseStudies.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>
              {caseStudies.content.items && (
                <div className="mt-16 flex flex-col gap-20">
                  {caseStudies.content.items.map((c, i) => {
                    const reverse = i % 2 === 1
                    return (
                      <motion.article
                        key={c.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: 0.8 }}
                        className={`grid grid-cols-1 items-center gap-10 md:grid-cols-[3fr,2fr] md:gap-16 ${
                          reverse ? 'md:[&>*:first-child]:order-2' : ''
                        }`}
                      >
                        <div className="flex flex-col gap-5">
                          <Eyebrow tone="red">Case 0{i + 1}</Eyebrow>
                          <h3 className="font-display text-[clamp(22px,2vw,32px)] leading-[1.2] text-foreground">
                            {c.title}
                          </h3>
                          <p className="font-sans text-[14px] leading-[1.7] text-foreground/75">
                            {c.description}
                          </p>
                        </div>
                        <PlaceholderImage
                          aspect="4/5"
                          tone={['rose', 'stone', 'cream', 'sage'][i % 4] as 'rose' | 'stone' | 'cream' | 'sage'}
                          label={`Case 0${i + 1}`}
                          caption="4:5 · editorial"
                          rounded
                        />
                      </motion.article>
                    )
                  })}
                </div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §08 Contact ─────────────── */}
      {contact && (
        <SectionAnchor id={contact.id} {...anchorProps(contact.id)}>
          <section className="py-28" style={{ backgroundColor: '#ffffff' }}>
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
                  <DisplayTitle as="h2" italic>
                    {contact.content.headline}
                  </DisplayTitle>
                </motion.div>
                {contact.content.body && (
                  <motion.div variants={FADE_UP} className="mt-6">
                    <Lede className="text-center mx-auto">{contact.content.body}</Lede>
                  </motion.div>
                )}
                {contact.content.cta && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <PremiumCTA href="#" size="lg">
                      {contact.content.cta.text}
                    </PremiumCTA>
                  </motion.div>
                )}
              </motion.div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      <BrandPalette tokens={tokens} variant="light" />
    </div>
  )
}
