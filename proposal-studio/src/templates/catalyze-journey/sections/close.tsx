'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  Lede,
} from '../../shared/typography'
import { PremiumCTA } from '../../shared/premium-cta'
import { Logo } from '@/components/logo'
import { CATALYZE_JOURNEY_CONTENT } from '@/data/catalyze-journey-content'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §09 · Close — single viewport sign-off.
 *
 * Eyebrow → Garamond title → contact cards → CTAs → PwC signature.
 * Cool Lilly pale-blue background to feel like you've landed somewhere restful.
 */
export function CloseSection() {
  const { close } = CATALYZE_JOURNEY_CONTENT

  return (
    <section
      id="close"
      className="relative flex min-h-[70vh] flex-col py-24 sm:py-32"
      style={{ backgroundColor: '#d31710' }}
    >
      <EditorialContainer measure="wide">
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={FADE_UP}>
            <Eyebrow tone="inverse" number="09">
              {close.eyebrow}
            </Eyebrow>
          </motion.div>

          <motion.div variants={FADE_UP} className="mt-8 max-w-[920px]">
            <DisplayTitle as="h2" size="hero" tone="inverse">
              {close.title}
            </DisplayTitle>
          </motion.div>

          <motion.div variants={FADE_UP} className="mt-8 max-w-[680px]">
            <Lede tone="inverse" className="text-center mx-auto">
              {close.body}
            </Lede>
          </motion.div>

          {/* Contact cards */}
          <motion.div
            variants={FADE_UP}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {close.contacts.map((contact) => (
              <div
                key={contact.email}
                className="flex flex-col items-start gap-2 rounded-2xl border border-foreground/10 bg-white p-6 text-left"
              >
                <h4 className="font-display text-2xl leading-tight text-foreground">
                  {contact.name}
                </h4>
                <p className="font-label text-[12px] uppercase tracking-[0.24em] text-[#d31710]">
                  {contact.role}
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-foreground/75 transition-colors hover:text-[#d31710]"
                >
                  <Mail className="size-4" />
                  {contact.email}
                </a>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={FADE_UP}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            <PremiumCTA
              href={`mailto:${close.contacts[0]?.email ?? ''}`}
              size="lg"
              tone="dark"
              className="!bg-white !text-[#d31710] hover:!bg-[#fbf2f0]"
            >
              {close.primaryCTA}
            </PremiumCTA>
            <PremiumCTA
              href="#"
              variant="ghost"
              arrow={false}
              tone="dark"
            >
              {close.secondaryCTA}
            </PremiumCTA>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-24 flex flex-col items-center gap-3 border-t border-white/20 pt-10 text-center">
          <Logo className="h-8 w-auto text-white" />
          <p className="max-w-[640px] font-mono text-[12px] leading-[1.6] uppercase tracking-[0.2em] text-white/70">
            © 2026 PwC. All rights reserved. PwC refers to the PwC network
            and/or one or more of its member firms, each of which is a separate
            legal entity.
          </p>
        </div>
      </EditorialContainer>
    </section>
  )
}
