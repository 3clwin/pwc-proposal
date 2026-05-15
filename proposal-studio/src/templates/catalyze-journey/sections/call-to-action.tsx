'use client'

import { motion } from 'framer-motion'
import {
  EditorialContainer,
  Eyebrow,
} from '../../shared/typography'
import { QuagmireDiagram } from '../components/quagmire-diagram'
import { useJourneyContent } from '../journey-content-context'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §02 · Lilly's Call to Action — the editorial opener.
 *
 * Opens on a full-width pull quote overlaid on a documentary-style photo
 * placeholder. Body paragraph follows at editorial measure. Closes with
 * the transformation diagram: "From a Complex Quagmire → To a One-Stop,
 * Integrated Shop" — two columns of items with an arrow between.
 */
export function CallToActionSection() {
  const { callToAction } = useJourneyContent()

  return (
    <>
      <section
        id="call-to-action"
        className="relative bg-white py-24 sm:py-32"
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
              <Eyebrow number="02" rule>
                {callToAction.eyebrow}
              </Eyebrow>
            </motion.div>
          </motion.div>

          {/* Slide 5 1:1 rebuild — Statement Card */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9 }}
          >
            <div
              className="w-full max-w-[1000px] overflow-hidden rounded-4xl px-8 py-16 shadow-2xl shadow-foreground/5 ring-1 ring-foreground/5 @sm:px-16 @sm:py-24 @lg:px-24 @lg:py-28 sm:px-16 sm:py-24 lg:px-24 lg:py-28"
              style={{ backgroundColor: '#fbf2f0' }}
            >
              {/* Red horizontal rule */}
              <div
                className="mb-10 h-[3px] w-12"
                style={{ backgroundColor: '#d31710' }}
              />

              {/* Statement text — matching the slide's 3-paragraph flow */}
              <div
                className="flex flex-col gap-10 font-display text-[clamp(22px,2.2vw,28px)] leading-[1.4] tracking-[-0.01em]"
                style={{ color: '#191919' }}
              >
                <p>{callToAction.pullQuote.text}</p>
                <p>
                  {callToAction.bodyParagraph}
                </p>
                <p>
                  This opportunity is about{' '}
                  <em
                    style={{
                      color: '#d31710',
                      fontWeight: 700,
                      fontStyle: 'italic',
                    }}
                  >
                    {callToAction.oneStopClosing}
                  </em>{' '}
                  through a proposal experience that connects requirements,
                  brand, proof, and delivery into one executive-ready story.
                </p>
              </div>
            </div>
          </motion.div>
        </EditorialContainer>
      </section>

      {/* Transformation diagram — dedicated rose-tint section so it reads
          as its own "Our Understanding" beat, separate from the call to
          action statement card above. */}
      <section
        id="our-understanding"
        className="relative py-24 sm:py-32"
        style={{ backgroundColor: '#fbf2f0' }}
      >
        <EditorialContainer measure="wide">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7 }}
          >
            <QuagmireDiagram
              eyebrow={callToAction.transformationEyebrow}
              title={callToAction.transformationTitle}
              quagmireLabel={callToAction.quagmireLabel}
              oneStopLabel={callToAction.oneStopLabel}
              centerBanner={callToAction.centerBanner}
              centerPill={callToAction.centerPill}
              quagmireBody={callToAction.quagmireBody}
              oneStopBody={callToAction.oneStopBody}
            />
          </motion.div>
        </EditorialContainer>
      </section>
    </>
  )
}
