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
  StatNumeral,
} from '../shared/typography'
import { PlaceholderImage } from '../shared/placeholder-image'
import { PremiumCTA, PremiumCard } from '../shared/premium-cta'
import { findSection } from '../shared/section-helpers'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../shared/motion'
import type { FullSiteProps } from '../types'

// Small inline hairline glyph used around eyebrows. Module-scoped so it
// isn't recreated on every render.
function GoldMark({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[1.5px] w-8"
      style={{ backgroundColor: color }}
    />
  )
}

/**
 * Pavilion (was Warm Partnership).
 *
 * Direction: Aesop + Apple Retail, warmed for pharma. Alternating
 * white → rose-tint → cream-tint sections with 160px vertical padding.
 * Centered Garamond hero with narrow measure. Gold hairline accents
 * used sparingly for trust. 4:5 portrait grids.
 *
 * Signature moves:
 *   • Centered Garamond hero with gold hairline above eyebrow
 *   • Alternating warm surfaces every section
 *   • 4x1 red rule BEFORE section eyebrows (not after)
 *   • Testimonials one-per-section, centered
 *   • Outlined red buttons on rose, solid red on white (context-flipped)
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
  const gold = tokens.colors.palettes?.gold?.[4] ?? '#daaa00'

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
        backgroundColor: '#ffffff',
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

      {/* ─────────────── §00 Hero — centered, gold hairline above eyebrow ─────────────── */}
      {hero && (
        <SectionAnchor id={hero.id} {...anchorProps(hero.id)}>
          <section
            className="relative flex min-h-[80vh] flex-col justify-center py-32"
            style={{ backgroundColor: '#fbf5f4' }}
          >
            <EditorialContainer measure="reading">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-center text-center"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <GoldMark color={gold} />
                  <Eyebrow>{hero.content.subheadline}</Eyebrow>
                  <GoldMark color={gold} />
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-10">
                  <DisplayTitle as="h1" size="display" italic>
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
                  <motion.div variants={FADE_UP} className="mt-10 flex gap-3">
                    <PremiumCTA href={hero.content.cta.url ?? '#summary'} size="lg">
                      {hero.content.cta.text}
                    </PremiumCTA>
                  </motion.div>
                )}
              </motion.div>
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §01 Executive Summary ─────────────── */}
      {summary && (
        <SectionAnchor id={summary.id} {...anchorProps(summary.id)}>
          <section id="summary" className="py-32" style={{ backgroundColor: '#ffffff' }}>
            <EditorialContainer measure="reading">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-start gap-6"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="01">Executive Summary</Eyebrow>
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
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §02 Approach — photo trio ─────────────── */}
      {approach && (
        <SectionAnchor id={approach.id} {...anchorProps(approach.id)}>
          <section
            id="approach"
            className="py-32"
            style={{ backgroundColor: '#fcf5ed' }}
          >
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col gap-6"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="02">{approach.content.subheadline ?? 'Approach'}</Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="max-w-[860px]">
                  <DisplayTitle italic>{approach.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {approach.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {approach.content.items.map((it, i) => (
                    <motion.div key={it.title} variants={FADE_UP}>
                      <PremiumCard surface="white">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="h-[2px] w-4"
                            style={{ backgroundColor: gold }}
                          />
                          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                            0{i + 1}
                          </span>
                        </div>
                        <h4 className="mt-3 font-display text-xl leading-tight text-foreground">
                          {it.title}
                        </h4>
                        <p className="mt-3 font-sans text-[13px] leading-[1.65] text-foreground/75">
                          {it.description}
                        </p>
                      </PremiumCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §03 Methodology with centered testimonial ─────────────── */}
      {methodology && (
        <SectionAnchor id={methodology.id} {...anchorProps(methodology.id)}>
          <section id="vision" className="py-32" style={{ backgroundColor: '#ffffff' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-center text-center"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="03">Vision</Eyebrow>
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6 max-w-[900px]">
                  <DisplayTitle italic>{methodology.content.headline}</DisplayTitle>
                </motion.div>
                {methodology.content.subheadline && (
                  <motion.div variants={FADE_UP} className="mt-10 max-w-[720px]">
                    <PullQuote attribution="PwC · Vision Statement">
                      {methodology.content.subheadline}
                    </PullQuote>
                  </motion.div>
                )}
              </motion.div>

              {methodology.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5"
                >
                  {methodology.content.items.map((p, i) => (
                    <motion.div key={p.title} variants={FADE_UP} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="h-[1.5px] w-4"
                          style={{ backgroundColor: gold }}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                          0{i + 1}
                        </span>
                      </div>
                      <h4 className="font-display text-lg leading-tight text-foreground">
                        {p.title}
                      </h4>
                      <p className="font-sans text-[12px] leading-[1.6] text-foreground/70">
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

      {/* ─────────────── §04 Timeline — warm rose surface ─────────────── */}
      {timeline && (
        <SectionAnchor id={timeline.id} {...anchorProps(timeline.id)}>
          <section
            id="timeline"
            className="py-32"
            style={{ backgroundColor: '#fbf5f4' }}
          >
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-center gap-6 text-center"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="04">Roadmap</Eyebrow>
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                </motion.div>
                <motion.div variants={FADE_UP} className="max-w-[820px]">
                  <DisplayTitle italic>{timeline.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {timeline.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {timeline.content.items.map((phase, i) => (
                    <motion.div key={i} variants={FADE_UP}>
                      <PremiumCard surface="white">
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="h-[1.5px] w-4"
                            style={{ backgroundColor: gold }}
                          />
                          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                            Phase 0{i + 1}
                          </span>
                        </div>
                        <h4 className="mt-3 font-display text-lg leading-tight text-foreground">
                          {phase.title}
                        </h4>
                        <p className="mt-2 font-sans text-[12px] leading-[1.55] text-foreground/70">
                          {phase.description}
                        </p>
                      </PremiumCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §05 Team — 4:5 portrait grid ─────────────── */}
      {team && (
        <SectionAnchor id={team.id} {...anchorProps(team.id)}>
          <section id="team" className="py-32" style={{ backgroundColor: '#ffffff' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-start gap-6"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="05">Team</Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="max-w-[820px]">
                  <DisplayTitle italic>{team.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {team.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
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
                          tone="rose"
                          monogram={initials}
                          rounded
                        />
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="h-[1.5px] w-4"
                            style={{ backgroundColor: gold }}
                          />
                          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                            Team
                          </span>
                        </div>
                        <h4 className="font-display text-xl leading-tight text-foreground">
                          {p.title}
                        </h4>
                        <p className="font-sans text-[13px] leading-[1.6] text-foreground/70">
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

      {/* ─────────────── §06 Pricing — centered stat + cards ─────────────── */}
      {pricing && (
        <SectionAnchor id={pricing.id} {...anchorProps(pricing.id)}>
          <section id="investment" className="py-32" style={{ backgroundColor: '#fcf5ed' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-center gap-6 text-center"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="06">Investment</Eyebrow>
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                </motion.div>
                <motion.div variants={FADE_UP} className="max-w-[720px]">
                  <DisplayTitle italic>{pricing.content.headline}</DisplayTitle>
                </motion.div>
                {pricing.content.body && (
                  <motion.div variants={FADE_UP}>
                    <Lede className="text-center mx-auto">{pricing.content.body}</Lede>
                  </motion.div>
                )}
                <motion.div variants={FADE_UP} className="mt-6">
                  <StatNumeral value="$1.39M" caption="Final proposed fees" size="xl" tone="red" align="center" />
                </motion.div>
              </motion.div>

              {pricing.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                  {pricing.content.items.map((line) => (
                    <motion.div key={line.title} variants={FADE_UP}>
                      <PremiumCard surface="white">
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="h-[1.5px] w-4"
                            style={{ backgroundColor: gold }}
                          />
                        </div>
                        <h4 className="mt-2 font-display text-lg leading-tight text-foreground">
                          {line.title}
                        </h4>
                        <p className="mt-3 font-sans text-[13px] leading-[1.6] text-foreground/75">
                          {line.description}
                        </p>
                      </PremiumCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §07 Case Studies — editorial pairs ─────────────── */}
      {caseStudies && (
        <SectionAnchor id={caseStudies.id} {...anchorProps(caseStudies.id)}>
          <section id="cases" className="py-32" style={{ backgroundColor: '#ffffff' }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-start gap-6"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[2px] w-4"
                    style={{ backgroundColor: accent }}
                  />
                  <Eyebrow number="07">Experience</Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="max-w-[900px]">
                  <DisplayTitle italic>{caseStudies.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {caseStudies.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2"
                >
                  {caseStudies.content.items.map((c, i) => (
                    <motion.article
                      key={c.title}
                      variants={FADE_UP}
                      className="flex flex-col gap-5"
                    >
                      <PlaceholderImage
                        aspect="3/2"
                        tone={['rose', 'cream', 'sage', 'stone'][i % 4] as 'rose' | 'cream' | 'sage' | 'stone'}
                        label={`Case 0${i + 1}`}
                        caption="3:2 · editorial"
                        rounded
                      />
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="h-[1.5px] w-4"
                          style={{ backgroundColor: gold }}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                          Case 0{i + 1}
                        </span>
                      </div>
                      <h3 className="font-display text-xl leading-[1.2] text-foreground">
                        {c.title}
                      </h3>
                      <p className="font-sans text-[13px] leading-[1.65] text-foreground/70">
                        {c.description}
                      </p>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §08 Contact — centered sign-off ─────────────── */}
      {contact && (
        <SectionAnchor id={contact.id} {...anchorProps(contact.id)}>
          <section className="py-32" style={{ backgroundColor: '#fbf5f4' }}>
            <EditorialContainer measure="reading">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="flex flex-col items-center text-center"
              >
                <motion.div variants={FADE_UP} className="flex items-center gap-3">
                  <GoldMark color={gold} />
                  <Eyebrow>Next Steps</Eyebrow>
                  <GoldMark color={gold} />
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
                  <motion.div variants={FADE_UP} className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <PremiumCTA href="#" size="lg">
                      {contact.content.cta.text}
                    </PremiumCTA>
                    <PremiumCTA href="#" variant="outline">
                      Download PDF
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
