'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { VIEWPORT_ONCE } from '../../shared/motion'
import {
  IconDocument,
  IconSprintCircle,
  IconStarMilestone,
} from './deck-icons'
import { DIAGRAM_PALETTE } from './diagram-palette'
import { FitText } from './fit-text'

/**
 * Slide 26 — …and Delivered Through a Rapid MVP with Iterative Releases.
 *
 * Premium rebuild. The deck packed too much into one bar (sprints,
 * SIT/UAT/Deploy chips, hypercare label) and rendered milestones
 * floating above the timeline with no visual relationship.
 *
 * New structure:
 *   1. Year + month axis (header)
 *   2. Milestone row above with hairline guides down to the axis
 *   3. Three phase bars: Discovery (red), MVP (ink), Post-MVP (grey)
 *   4. Sprint row beneath the MVP bar (S0-S3 + SIT/UAT/Deploy/Hypercare)
 *   5. Capability cascade as a clean diagonal stair with connectors
 *   6. Two columns: Discovery activities + Future features
 *   7. Bottom: deliverables row + legend
 */

interface Milestone {
  label: string
  month: string
}

interface Phase {
  label: string
  sub: string
  tone: 'red' | 'dark' | 'grey'
  spanStart: string
  spanEnd: string
}

interface DiscoveryWeek {
  week: string
  bullets: string[]
}

interface ImplementationTimelineDiagramProps {
  year: string
  months: string[]
  milestones: Milestone[]
  phases: Phase[]
  sprints: string[]
  mvpStages: string[]
  capabilityCascade: string[]
  futureFeatures: string[]
  futureFootnote: string
  discoveryActivities: DiscoveryWeek[]
  discoveryDeliverables: string[]
  implementationDeliverables: string[]
  legend: { sprintLabel: string; milestoneLabel: string }
}

const PHASE_TONES: Record<Phase['tone'], { bg: string; text: string }> = {
  red: { bg: DIAGRAM_PALETTE.red, text: DIAGRAM_PALETTE.white },
  dark: { bg: DIAGRAM_PALETTE.ink, text: DIAGRAM_PALETTE.white },
  grey: { bg: DIAGRAM_PALETTE.surfaceMuted, text: DIAGRAM_PALETTE.ink },
}

export function ImplementationTimelineDiagram({
  year,
  months,
  milestones,
  phases,
  sprints,
  mvpStages,
  capabilityCascade,
  futureFeatures,
  futureFootnote,
  discoveryActivities,
  discoveryDeliverables,
  implementationDeliverables,
  legend,
}: ImplementationTimelineDiagramProps) {
  const reduce = useReducedMotion()
  const mvpPhase = phases.find((p) => p.tone === 'dark')

  return (
    <figure
      role="img"
      aria-label="Year-long CRM implementation timeline showing Discovery, MVP, and Post-MVP phases with milestone markers and deliverables."
      className="flex flex-col gap-10"
    >
      {/* ─── Top: timeline ─── */}
      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="mb-2 flex items-baseline justify-between">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{ color: DIAGRAM_PALETTE.inkMuted }}
            >
              Implementation Roadmap
            </span>
            <span
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: DIAGRAM_PALETTE.inkSoft }}
            >
              {year}
            </span>
          </div>

          {/* Milestones row with hairline guides */}
          <div className="relative mb-4 h-14">
            <div
              className="absolute inset-x-0 bottom-0 grid"
              style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
            >
              {months.map((m) => {
                const ms = milestones.find((mk) => mk.month === m)
                return (
                  <div key={m} className="relative flex flex-col items-center">
                    {ms ? (
                      <motion.div
                        initial={reduce ? undefined : { opacity: 0, y: -4 }}
                        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <IconStarMilestone size={14} style={{ color: DIAGRAM_PALETTE.red }} />
                        <span
                          className="text-center font-sans text-[10px] font-medium leading-[1.25]"
                          style={{ color: DIAGRAM_PALETTE.ink, maxWidth: 80 }}
                        >
                          {ms.label}
                        </span>
                      </motion.div>
                    ) : null}
                    {ms && (
                      <span
                        aria-hidden
                        className="absolute bottom-0 h-2 w-px"
                        style={{ backgroundColor: DIAGRAM_PALETTE.hairlineStrong }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Month axis */}
          <div
            className="grid border-y py-2"
            style={{
              gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))`,
              borderColor: DIAGRAM_PALETTE.hairline,
            }}
          >
            {months.map((m) => (
              <div
                key={m}
                className="text-center font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: DIAGRAM_PALETTE.inkSoft }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Phase bars */}
          <div className="mt-3 flex flex-col gap-1.5">
            {phases.map((phase, i) => {
              const tokens = PHASE_TONES[phase.tone]
              const startIdx = months.indexOf(phase.spanStart)
              const endIdx = months.indexOf(phase.spanEnd)
              const colSpan = endIdx - startIdx + 1
              return (
                <motion.div
                  key={phase.label}
                  initial={reduce ? undefined : { opacity: 0, scaleX: 0, transformOrigin: 'left' }}
                  whileInView={reduce ? undefined : { opacity: 1, scaleX: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                  className="grid"
                  style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
                >
                  <div
                    className="flex items-center gap-3 rounded-md px-3 py-2"
                    style={{
                      gridColumn: `${startIdx + 1} / span ${colSpan}`,
                      backgroundColor: tokens.bg,
                      color: tokens.text,
                    }}
                  >
                    <span className="font-display text-[13px] italic">{phase.label}</span>
                    {phase.sub && (
                      <span
                        className="font-mono text-[9.5px] uppercase tracking-[0.18em]"
                        style={{ opacity: 0.7 }}
                      >
                        {phase.sub}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Sprint + stage row beneath the MVP bar */}
          {mvpPhase && (
            <div
              className="mt-3 grid"
              style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
            >
              {(() => {
                const startIdx = months.indexOf(mvpPhase.spanStart)
                const endIdx = months.indexOf(mvpPhase.spanEnd)
                const colSpan = endIdx - startIdx + 1
                return (
                  <div
                    className="flex items-center justify-between gap-4"
                    style={{ gridColumn: `${startIdx + 1} / span ${colSpan}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      {sprints.map((s) => (
                        <span
                          key={s}
                          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em]"
                          style={{ color: DIAGRAM_PALETTE.inkSoft }}
                        >
                          <IconSprintCircle size={12} style={{ color: DIAGRAM_PALETTE.ink }} />
                          {s.replace('Sprint ', 'S')}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {mvpStages.map((stage) => {
                        const isHypercare = stage === 'Hypercare'
                        return (
                          <span
                            key={stage}
                            className="rounded-sm px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em]"
                            style={{
                              backgroundColor: isHypercare ? DIAGRAM_PALETTE.redSoft : DIAGRAM_PALETTE.surfaceMuted,
                              color: isHypercare ? DIAGRAM_PALETTE.redDeep : DIAGRAM_PALETTE.inkSoft,
                            }}
                          >
                            {stage}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Capability cascade — diagonal stair with hairline connectors */}
          <div className="mt-8">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{ color: DIAGRAM_PALETTE.inkMuted }}
            >
              MVP Capabilities (in order of build)
            </span>
            <div className="mt-3 flex flex-col gap-1">
              {capabilityCascade.map((cap, i) => (
                <motion.div
                  key={cap}
                  initial={reduce ? undefined : { opacity: 0, x: -8 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3"
                  style={{ marginLeft: `${i * 28}px` }}
                >
                  <span
                    aria-hidden
                    className="block h-px flex-shrink-0"
                    style={{
                      width: 24,
                      backgroundColor: DIAGRAM_PALETTE.hairlineStrong,
                    }}
                  />
                  <span
                    className="rounded-md bg-white px-3 py-1.5 font-sans text-[12px] font-medium"
                    style={{
                      color: DIAGRAM_PALETTE.ink,
                      boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
                    }}
                  >
                    {cap}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Side-by-side: Discovery activities + Future features ─── */}
      <div className="grid grid-cols-1 gap-10 border-t pt-8 md:grid-cols-[1fr_2fr]" style={{ borderColor: DIAGRAM_PALETTE.hairline }}>
        <div>
          <h4
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: DIAGRAM_PALETTE.red }}
          >
            Discovery Phase Activities
          </h4>
          <div className="flex flex-col gap-4">
            {discoveryActivities.map((week) => (
              <div key={week.week} className="flex flex-col gap-1">
                <span className="font-sans text-[11.5px] font-semibold" style={{ color: DIAGRAM_PALETTE.ink }}>
                  {week.week}
                </span>
                <ul className="flex flex-col gap-0.5">
                  {week.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 font-sans text-[12px] leading-[1.5]"
                      style={{ color: DIAGRAM_PALETTE.inkSoft }}
                    >
                      <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full" style={{ backgroundColor: DIAGRAM_PALETTE.inkMuted }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: DIAGRAM_PALETTE.inkMuted }}
          >
            Future Implementation Features
            <sup className="ml-0.5 text-[8px]">1</sup>
          </h4>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {futureFeatures.map((feature) => (
              <li
                key={feature}
                className="flex gap-2 font-sans text-[12px] leading-[1.5]"
                style={{ color: DIAGRAM_PALETTE.inkSoft }}
              >
                <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full" style={{ backgroundColor: DIAGRAM_PALETTE.inkFaint }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[10px] italic" style={{ color: DIAGRAM_PALETTE.inkMuted }}>
            <sup>1</sup> {futureFootnote}
          </p>
        </div>
      </div>

      {/* ─── Deliverables row ─── */}
      <div className="grid grid-cols-1 gap-10 border-t pt-8 md:grid-cols-2" style={{ borderColor: DIAGRAM_PALETTE.hairline }}>
        <DeliverablesBlock title="Discovery Phase Deliverables" items={discoveryDeliverables} />
        <DeliverablesBlock title="Implementation Deliverables" items={implementationDeliverables} />
      </div>

      {/* ─── Legend ─── */}
      <figcaption className="flex items-center justify-end gap-6">
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: DIAGRAM_PALETTE.inkMuted }}
        >
          <IconSprintCircle size={12} style={{ color: DIAGRAM_PALETTE.ink }} />
          {legend.sprintLabel}
        </span>
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: DIAGRAM_PALETTE.inkMuted }}
        >
          <IconStarMilestone size={12} style={{ color: DIAGRAM_PALETTE.red }} />
          {legend.milestoneLabel}
        </span>
      </figcaption>
    </figure>
  )
}

// ─────────────────── helpers ───────────────────

function DeliverablesBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4
        className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em]"
        style={{ color: DIAGRAM_PALETTE.inkMuted }}
      >
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 rounded-md bg-white p-3"
            style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}` }}
          >
            <IconDocument
              size={16}
              style={{ color: DIAGRAM_PALETTE.red, flexShrink: 0, marginTop: 2 }}
            />
            <FitText
              text={item}
              fontWeight={500}
              maxFontPx={11.5}
              minFontPx={9.5}
              maxLines={2}
              lineHeight={1.35}
              className="font-sans"
              style={{ color: DIAGRAM_PALETTE.ink }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
