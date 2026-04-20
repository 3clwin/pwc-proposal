'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import {
  EditorialContainer,
  DisplayTitle,
  Eyebrow,
  SectionHeading,
  Lede,
} from '../../shared/typography'
import { OpmodelWorkstreamDiagram } from '../components/opmodel-workstream-diagram'
import { ImplementationTimelineDiagram } from '../components/implementation-timeline-diagram'
import { FutureStateArchitectureDiagram } from '../components/future-state-architecture-diagram'
import { IterativeReleaseDiagram } from '../components/iterative-release-diagram'
import { CATALYZE_JOURNEY_CONTENT } from '@/data/catalyze-journey-content'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §05 · Delivery Approach — five beats.
 *
 *   a · Section opener + Sprint 0 one-day workshop (3 phases horizontal)
 *   b · Operating model design workstreams
 *   c · Implementation roadmap timeline (6 months)
 *   d · MVP capability grid + post-MVP expansion
 *   e · Future-state architecture highlights
 */
export function DeliverySection() {
  const { delivery } = CATALYZE_JOURNEY_CONTENT

  return (
    <section id="delivery" className="relative border-t border-foreground/5 bg-gradient-to-b from-foreground/[0.02] to-white py-24 sm:py-32">
      <EditorialContainer measure="wide">
        {/* Section opener */}
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
        >
          <motion.div variants={FADE_UP}>
            <Eyebrow number="05" rule>
              {delivery.eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8 max-w-[900px]">
            <DisplayTitle>{delivery.title}</DisplayTitle>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-8">
            <Lede>{delivery.lede}</Lede>
          </motion.div>
        </motion.div>

        {/* Sprint 0 — 3-phase horizontal journey */}
        <div className="mt-28">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP}>
              <Eyebrow>{delivery.sprintZero.eyebrow}</Eyebrow>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6">
              <SectionHeading>{delivery.sprintZero.title}</SectionHeading>
            </motion.div>
            <motion.p
              variants={FADE_UP}
              className="mt-4 font-display text-xl italic text-muted-foreground"
            >
              {delivery.sprintZero.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {delivery.sprintZero.phases.map((phase, i) => {
              const last = i === delivery.sprintZero.phases.length - 1
              return (
                <motion.div
                  key={phase.number}
                  variants={FADE_UP}
                  className="relative flex flex-col gap-5 rounded-2xl border border-foreground/10 p-8"
                  style={{ backgroundColor: '#fbf2f0' }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display text-4xl leading-none"
                      style={{ color: '#d31710' }}
                    >
                      {phase.number}
                    </span>
                    {!last && (
                      <ArrowRight
                        aria-hidden
                        className="hidden size-4 text-foreground/30 lg:block"
                      />
                    )}
                  </div>
                  <h4 className="font-display text-2xl leading-tight text-foreground">
                    {phase.title}
                  </h4>
                  <p className="font-sans text-[14px] leading-[1.6] text-foreground/70">
                    {phase.body}
                  </p>
                  <ul className="mt-2 flex flex-col gap-2 border-t border-foreground/10 pt-4">
                    {phase.activities.map((a) => (
                      <li
                        key={a}
                        className="flex gap-2 font-sans text-[12px] leading-[1.5] text-foreground/75"
                      >
                        <Check
                          aria-hidden
                          className="mt-0.5 size-3 shrink-0"
                          style={{ color: '#d31710' }}
                          strokeWidth={2.5}
                        />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Sprint 0 outcomes row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <span className="font-mono text-[12px] uppercase tracking-[0.28em] text-muted-foreground">
              What you get
            </span>
            {delivery.sprintZero.outcomes.map((o) => (
              <span
                key={o}
                className="inline-flex rounded-full px-3 py-1.5 font-label text-[12px] uppercase tracking-[0.2em] text-white"
                style={{ backgroundColor: '#d31710' }}
              >
                {o}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Operating model design — slide 25 1:1 swim diagram. */}
        <div className="mt-32">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP}>
              <Eyebrow>{delivery.operatingModelDesign.eyebrow}</Eyebrow>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6 max-w-[860px]">
              <SectionHeading>
                {delivery.operatingModelDesign.title}{' '}
                <em style={{ fontStyle: 'italic' }}>
                  {delivery.operatingModelDesign.titleItalic}
                </em>
              </SectionHeading>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6">
              <Lede>{delivery.operatingModelDesign.body}</Lede>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7 }}
            className="mt-10"
          >
            <OpmodelWorkstreamDiagram
              months={delivery.operatingModelDesign.months}
              chevrons={delivery.operatingModelDesign.chevrons}
              workstreams={delivery.operatingModelDesign.workstreams}
              deliverables={delivery.operatingModelDesign.deliverables}
              playbookLabel={delivery.operatingModelDesign.playbookLabel}
            />
          </motion.div>
        </div>

        {/* CRM Implementation Timeline — slide 26 1:1 rebuild. Replaces
            the prior vertical timeline + MVP capability split. */}
        <div className="mt-32">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP} className="max-w-[860px]">
              <SectionHeading>
                {delivery.implementationTimeline.title}{' '}
                <em style={{ fontStyle: 'italic' }}>
                  {delivery.implementationTimeline.titleItalic}
                </em>
              </SectionHeading>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7 }}
            className="mt-10"
          >
            <ImplementationTimelineDiagram
              year={delivery.implementationTimeline.year}
              months={delivery.implementationTimeline.months}
              milestones={delivery.implementationTimeline.milestones}
              phases={delivery.implementationTimeline.phases}
              sprints={delivery.implementationTimeline.sprints}
              mvpStages={delivery.implementationTimeline.mvpStages}
              capabilityCascade={delivery.implementationTimeline.capabilityCascade}
              futureFeatures={delivery.implementationTimeline.futureFeatures}
              futureFootnote={delivery.implementationTimeline.futureFootnote}
              discoveryActivities={delivery.implementationTimeline.discoveryActivities}
              discoveryDeliverables={delivery.implementationTimeline.discoveryDeliverables}
              implementationDeliverables={
                delivery.implementationTimeline.implementationDeliverables
              }
              legend={delivery.implementationTimeline.legend}
            />
          </motion.div>
        </div>

        {/* Future-State Architecture — slide 27 1:1 rebuild. */}
        <div className="mt-32">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP}>
              <Eyebrow>{delivery.architecture.eyebrow}</Eyebrow>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6">
              <SectionHeading>
                {delivery.architecture.title}{' '}
                <em style={{ fontStyle: 'italic' }}>
                  {delivery.architecture.titleItalic}
                </em>
              </SectionHeading>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7 }}
            className="mt-10"
          >
            <FutureStateArchitectureDiagram
              sourceSystems={delivery.architecture.sourceSystems}
              esbLabel={delivery.architecture.esbLabel}
              internalUsers={delivery.architecture.internalUsers}
              internalUserBarLabel={delivery.architecture.internalUserBarLabel}
              externalUserLabel={delivery.architecture.externalUserLabel}
              externalUserBarLabel={delivery.architecture.externalUserBarLabel}
              crmCoreLabel={delivery.architecture.crmCoreLabel}
              crmCoreCapabilities={delivery.architecture.crmCoreCapabilities}
              dataModelsLabel={delivery.architecture.dataModelsLabel}
              dataModelEntities={delivery.architecture.dataModelEntities}
              dataModels={delivery.architecture.dataModels}
              coreCapabilitiesLabel={delivery.architecture.coreCapabilitiesLabel}
              coreCapabilities={delivery.architecture.coreCapabilities}
              keyHighlightsLabel={delivery.architecture.keyHighlightsLabel}
              highlights={delivery.architecture.highlights}
              legend={delivery.architecture.legend}
            />
          </motion.div>
        </div>

        {/* Iterative Release Operating Model — slide 28 1:1 rebuild. */}
        <div className="mt-32">
          <motion.div
            variants={STAGGER_PARENT}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
          >
            <motion.div variants={FADE_UP} className="max-w-[860px]">
              <SectionHeading>
                <em style={{ fontStyle: 'italic', color: '#d31710' }}>
                  {delivery.iterativeRelease.title}
                </em>{' '}
                {delivery.iterativeRelease.titleItalic}
              </SectionHeading>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-6 max-w-[840px]">
              <Lede>{delivery.iterativeRelease.intro}</Lede>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7 }}
            className="mt-10"
          >
            <IterativeReleaseDiagram
              topBandLabel={delivery.iterativeRelease.topBandLabel}
              bottomBandLabel={delivery.iterativeRelease.bottomBandLabel}
              columnLabels={delivery.iterativeRelease.columnLabels}
              requestSources={delivery.iterativeRelease.requestSources}
              intakeLabel={delivery.iterativeRelease.intakeLabel}
              requestTypes={delivery.iterativeRelease.requestTypes}
              epicLabel={delivery.iterativeRelease.epicLabel}
              backlogLabel={delivery.iterativeRelease.backlogLabel}
              backlogBody={delivery.iterativeRelease.backlogBody}
              reviewBoardLabel={delivery.iterativeRelease.reviewBoardLabel}
              prioritization={delivery.iterativeRelease.prioritization}
              releases={delivery.iterativeRelease.releases}
              flagLabels={delivery.iterativeRelease.flagLabels}
              legend={delivery.iterativeRelease.legend}
            />
          </motion.div>
        </div>
      </EditorialContainer>
    </section>
  )
}
