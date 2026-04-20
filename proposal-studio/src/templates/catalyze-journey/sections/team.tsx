'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  Lede,
  SectionHeading,
} from '../../shared/typography'
import { PlaceholderImage } from '../../shared/placeholder-image'
import { CATALYZE_JOURNEY_CONTENT } from '@/data/catalyze-journey-content'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'
import type { TeamMember } from '@/data/catalyze-journey-content'

const TIER_LABEL: Record<TeamMember['tier'], string> = {
  core: 'Core Team',
  specialist: 'Specialists',
  'lilly-sme': 'Lilly Subject-Matter Experts',
}

const TIER_TONE: Record<
  TeamMember['tier'],
  'lilly-blue' | 'stone' | 'lilly-sky'
> = {
  core: 'lilly-blue',
  specialist: 'stone',
  'lilly-sme': 'lilly-sky',
}

/**
 * §07 · Team — 12 bios in a tiered editorial grid.
 *
 * Three tiers (Core → Specialists → Lilly SMEs), each rendered as its
 * own band with eyebrow + grid of portrait-forward cards. Monogram
 * initials stand in for real headshots.
 */
export function TeamSection() {
  const { team } = CATALYZE_JOURNEY_CONTENT

  const grouped: Record<TeamMember['tier'], TeamMember[]> = {
    core: [],
    specialist: [],
    'lilly-sme': [],
  }
  for (const m of team.members) grouped[m.tier].push(m)

  return (
    <section id="team" className="relative border-t border-foreground/5 bg-foreground/[0.01] py-24 sm:py-32">
      <EditorialContainer measure="wide">
        {/* Section opener */}
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
        >
          <motion.div variants={FADE_UP}>
            <Eyebrow number="07" rule>
              {team.eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
            <DisplayTitle>{team.title}</DisplayTitle>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8">
            <Lede>{team.lede}</Lede>
          </motion.div>
        </motion.div>

        {/* Tier bands */}
        {(['core', 'specialist', 'lilly-sme'] as TeamMember['tier'][]).map(
          (tier) =>
            grouped[tier].length > 0 && (
              <div key={tier} className="mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.6 }}
                  className="mb-8 flex items-baseline justify-between border-t border-foreground/10 pt-6"
                >
                  <SectionHeading>{TIER_LABEL[tier]}</SectionHeading>
                  <span className="font-mono text-[12px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
                    {String(grouped[tier].length).padStart(2, '0')} People
                  </span>
                </motion.div>

                <motion.div
                  variants={STAGGER_PARENT}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {grouped[tier].map((member) => (
                    <motion.article
                      key={member.email}
                      variants={FADE_UP}
                      className="group flex flex-col gap-4"
                    >
                      {member.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.imageSrc}
                          alt={member.name}
                          className="aspect-[4/5] w-full rounded object-cover transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        />
                      ) : (
                        <PlaceholderImage
                          aspect="4/5"
                          tone={TIER_TONE[tier]}
                          monogram={member.monogram}
                          rounded
                          className="w-full transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <h4 className="font-display text-xl leading-tight text-foreground">
                          {member.name}
                        </h4>
                        <p className="font-label text-[12px] uppercase tracking-[0.24em] text-[#d31710]">
                          {member.role}
                        </p>
                        <p className="font-sans text-[13px] leading-[1.6] text-foreground/70">
                          {member.bio}
                        </p>
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-foreground/60 transition-colors hover:text-[#d31710]"
                        >
                          <Mail className="size-3" />
                          {member.email}
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </div>
            ),
        )}
      </EditorialContainer>
    </section>
  )
}
