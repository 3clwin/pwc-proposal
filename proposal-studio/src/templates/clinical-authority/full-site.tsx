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
import { PlaceholderImage } from '../shared/placeholder-image'
import { PremiumCTA, PremiumCard } from '../shared/premium-cta'
import { findSection } from '../shared/section-helpers'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../shared/motion'
import type { FullSiteProps } from '../types'

/**
 * Editorial Pharma (was Clinical Authority).
 *
 * Direction: NYT Magazine meets a clinical white paper. White with stone
 * neutrals, massive Garamond display, italic emphasis on one word, Lilly
 * Red as a 1px section hairline + primary CTA. Stats rendered as oversized
 * Garamond numerals. Body copy in Ringside at editorial measure.
 *
 * Signature moves:
 *   • Garamond italic drop-cap lead after hero
 *   • 1px red hairline between every section — replaces card borders
 *   • Stat strip with 3–4 huge Garamond numerals
 *   • Pull-quote moments with hanging red glyph
 *   • Single wide documentary hero at the top
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

      {/* ─────────────── §00 Hero ─────────────── */}
      {hero && (
        <SectionAnchor id={hero.id} {...anchorProps(hero.id)}>
          <section
            className="relative min-h-[88vh] overflow-hidden"
            style={{ backgroundColor: '#111111' }}
          >
            <PlaceholderImage
              aspect="16/9"
              tone="dark"
              label="Hero photograph"
              caption="Documentary · 16:9"
              className="absolute inset-0 h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

            <div className="relative z-10 flex min-h-[88vh] flex-col justify-end pb-20 pt-32">
              <EditorialContainer measure="wide">
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="max-w-[980px]"
                >
                  <motion.div variants={FADE_UP}>
                    <Eyebrow tone="red">{hero.content.subheadline}</Eyebrow>
                  </motion.div>
                  <motion.div variants={FADE_UP} className="mt-6">
                    <DisplayTitle as="h1" size="hero" tone="inverse">
                      {hero.content.headline}
                    </DisplayTitle>
                  </motion.div>
                  {hero.content.body && (
                    <motion.p
                      variants={FADE_UP}
                      className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-white/70"
                    >
                      {hero.content.body}
                    </motion.p>
                  )}
                  <motion.div variants={FADE_UP} className="mt-10 flex flex-wrap gap-3">
                    {hero.content.cta && (
                      <PremiumCTA
                        href={hero.content.cta.url ?? '#executive-summary'}
                        tone="dark"
                        size="lg"
                      >
                        {hero.content.cta.text}
                      </PremiumCTA>
                    )}
                  </motion.div>
                </motion.div>
              </EditorialContainer>
            </div>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §01 Executive Summary ─────────────── */}
      {summary && (
        <SectionAnchor id={summary.id} {...anchorProps(summary.id)}>
          <section id="summary" className="border-t bg-white py-28" style={{ borderColor: accent }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="01" rule>
                    Executive Summary
                  </Eyebrow>
                </motion.div>
                {summary.content.subheadline && (
                  <motion.div variants={FADE_UP} className="mt-8 max-w-[860px]">
                    <DisplayTitle>{summary.content.subheadline}</DisplayTitle>
                  </motion.div>
                )}
              </motion.div>

              {/* Drop-cap lead */}
              {summary.content.body && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-12 max-w-[720px]"
                >
                  <p
                    className="font-display text-[clamp(18px,1.5vw,22px)] italic leading-[1.7] text-foreground"
                    style={{
                      textIndent: 0,
                    }}
                  >
                    <span
                      aria-hidden
                      className="float-left mr-3 font-display not-italic leading-[0.85]"
                      style={{
                        fontSize: 'clamp(64px, 6vw, 88px)',
                        color: accent,
                      }}
                    >
                      {summary.content.body.charAt(0)}
                    </span>
                    {summary.content.body.slice(1)}
                  </p>
                </motion.div>
              )}

              {/* Stat strip from hero differentiators (5 items) */}
              {hero?.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-20 grid grid-cols-2 gap-8 border-t border-foreground/10 pt-14 md:grid-cols-5"
                >
                  {hero.content.items.map((it, i) => (
                    <motion.div key={it.title} variants={FADE_UP}>
                      <StatNumeral
                        value={String(i + 1).padStart(2, '0')}
                        caption={it.title ?? ''}
                        sub={it.description}
                        size="md"
                        tone="red"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §02 Approach (challenge) ─────────────── */}
      {approach && (
        <SectionAnchor id={approach.id} {...anchorProps(approach.id)}>
          <section
            id="approach"
            className="border-t py-28"
            style={{ backgroundColor: '#fcf5ed', borderColor: accent }}
          >
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="02" rule>
                    {approach.content.subheadline ?? 'The Challenge'}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
                  <DisplayTitle>{approach.content.headline}</DisplayTitle>
                </motion.div>
                {approach.content.body && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <Lede>{approach.content.body}</Lede>
                  </motion.div>
                )}
              </motion.div>

              {approach.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2"
                >
                  {approach.content.items.map((it, i) => (
                    <motion.div
                      key={it.title}
                      variants={FADE_UP}
                      className="flex gap-6 border-t pt-6"
                      style={{ borderColor: accent }}
                    >
                      <span
                        className="font-display text-3xl leading-none"
                        style={{ color: accent }}
                      >
                        0{i + 1}
                      </span>
                      <div className="flex flex-col gap-2">
                        <h4 className="font-display text-2xl leading-tight text-foreground">
                          {it.title}
                        </h4>
                        <p className="font-sans text-[14px] leading-[1.65] text-foreground/75">
                          {it.description}
                        </p>
                      </div>
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
          <section id="vision" className="border-t bg-white py-32" style={{ borderColor: accent }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="max-w-[900px]"
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="03" rule>
                    Vision
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-8">
                  <DisplayTitle>{methodology.content.headline}</DisplayTitle>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-6">
                  <p className="font-display text-xl italic text-muted-foreground">
                    {methodology.content.subheadline}
                  </p>
                </motion.div>
                {methodology.content.body && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <Lede>{methodology.content.body}</Lede>
                  </motion.div>
                )}
              </motion.div>

              {methodology.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5"
                >
                  {methodology.content.items.map((p, i) => (
                    <motion.div
                      key={p.title}
                      variants={FADE_UP}
                      className="flex flex-col gap-3 border-t pt-6"
                      style={{ borderColor: accent }}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                        0{i + 1}
                      </span>
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

      {/* ─────────────── §04 Timeline ─────────────── */}
      {timeline && (
        <SectionAnchor id={timeline.id} {...anchorProps(timeline.id)}>
          <section
            id="timeline"
            className="border-t py-28"
            style={{ backgroundColor: '#f3f7fa', borderColor: accent }}
          >
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="04" rule>
                    {timeline.content.subheadline ?? 'Roadmap'}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-8 max-w-[820px]">
                  <DisplayTitle>{timeline.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {timeline.content.items && (
                <div className="mt-14 relative">
                  <div
                    aria-hidden
                    className="absolute left-5 top-0 bottom-0 w-px"
                    style={{ backgroundColor: accent, opacity: 0.3 }}
                  />
                  <motion.div
                    variants={STAGGER_PARENT}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT_ONCE}
                    className="flex flex-col gap-10"
                  >
                    {timeline.content.items.map((phase, i) => (
                      <motion.div
                        key={i}
                        variants={FADE_UP}
                        className="relative flex gap-6 pl-14"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-1 inline-flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-foreground/15"
                        >
                          <span
                            className="size-3 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                        </span>
                        <div className="flex flex-1 flex-col gap-2">
                          <h4 className="font-display text-2xl leading-tight text-foreground">
                            {phase.title}
                          </h4>
                          <p className="font-sans text-sm leading-[1.65] text-foreground/70">
                            {phase.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §05 Team ─────────────── */}
      {team && (
        <SectionAnchor id={team.id} {...anchorProps(team.id)}>
          <section id="team" className="border-t bg-white py-28" style={{ borderColor: accent }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="05" rule>
                    {team.content.subheadline ?? 'Team'}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
                  <DisplayTitle>{team.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {team.content.items && (
                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
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

      {/* ─────────────── §06 Pricing ─────────────── */}
      {pricing && (
        <SectionAnchor id={pricing.id} {...anchorProps(pricing.id)}>
          <section
            id="investment"
            className="border-t py-28"
            style={{ backgroundColor: '#fbf5f4', borderColor: accent }}
          >
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="06" rule>
                    Investment
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-8 max-w-[820px]">
                  <DisplayTitle>{pricing.content.headline}</DisplayTitle>
                </motion.div>
                {pricing.content.body && (
                  <motion.div variants={FADE_UP} className="mt-8">
                    <Lede>{pricing.content.body}</Lede>
                  </motion.div>
                )}
              </motion.div>

              {pricing.content.items && (
                <div className="mt-14 grid grid-cols-1 gap-px bg-foreground/10 overflow-hidden rounded-2xl md:grid-cols-3">
                  {pricing.content.items.map((line) => (
                    <PremiumCard key={line.title} surface="white" elevated={false} topAccent>
                      <h4 className="font-display text-lg leading-tight text-foreground">
                        {line.title}
                      </h4>
                      <p className="mt-3 font-sans text-[13px] leading-[1.6] text-foreground/70">
                        {line.description}
                      </p>
                    </PremiumCard>
                  ))}
                </div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §07 Case Studies ─────────────── */}
      {caseStudies && (
        <SectionAnchor id={caseStudies.id} {...anchorProps(caseStudies.id)}>
          <section id="cases" className="border-t bg-white py-28" style={{ borderColor: accent }}>
            <EditorialContainer measure="wide">
              <motion.div
                variants={STAGGER_PARENT}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
              >
                <motion.div variants={FADE_UP}>
                  <Eyebrow number="07" rule>
                    {caseStudies.content.subheadline ?? 'Experience'}
                  </Eyebrow>
                </motion.div>
                <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
                  <DisplayTitle>{caseStudies.content.headline}</DisplayTitle>
                </motion.div>
              </motion.div>

              {caseStudies.content.items && (
                <div className="mt-16 flex flex-col gap-16">
                  {caseStudies.content.items.map((c, i) => (
                    <motion.article
                      key={c.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VIEWPORT_ONCE}
                      transition={{ duration: 0.7 }}
                      className="grid grid-cols-1 gap-10 border-t pt-10 lg:grid-cols-[5fr,7fr]"
                      style={{ borderColor: accent }}
                    >
                      <div className="flex flex-col gap-4">
                        <Eyebrow tone="red">Case 0{i + 1}</Eyebrow>
                        <h3 className="font-display text-[clamp(22px,2vw,30px)] leading-[1.2] text-foreground">
                          {c.title}
                        </h3>
                      </div>
                      <p className="font-sans text-[14px] leading-[1.7] text-foreground/75">
                        {c.description}
                      </p>
                    </motion.article>
                  ))}
                </div>
              )}
            </EditorialContainer>
          </section>
        </SectionAnchor>
      )}

      {/* ─────────────── §08 Contact ─────────────── */}
      {contact && (
        <SectionAnchor id={contact.id} {...anchorProps(contact.id)}>
          <section
            className="border-t py-28"
            style={{ backgroundColor: '#fcf5ed', borderColor: accent }}
          >
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
                  <DisplayTitle as="h2">{contact.content.headline}</DisplayTitle>
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

      {/* Brand palette footer */}
      <BrandPalette tokens={tokens} variant="light" />
    </div>
  )
}
