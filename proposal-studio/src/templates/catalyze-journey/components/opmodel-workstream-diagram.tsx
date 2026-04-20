'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { VIEWPORT_ONCE } from '../../shared/motion'
import {
  IconClipboardChart,
  IconDocument,
  IconDollarBills,
  IconHexBadge,
  IconHoneycombPattern,
  IconSliders,
} from './deck-icons'
import { DIAGRAM_PALETTE } from './diagram-palette'
import { FitText } from './fit-text'

/**
 * Slide 25 — Design the Future-State, Unified GTM Operating Model.
 *
 * Premium rebuild. The deck uses 3 swim rows (Phase, Key Activities,
 * Deliverables) with rotated row labels in grey blocks — bureaucratic.
 * We keep the 3-row structure but use thin top-aligned labels and
 * generous breathing room between rows.
 */

const DELIVERABLE_ICON_BY_KEY: Record<string, typeof IconClipboardChart> = {
  clipboard: IconClipboardChart,
  dollar: IconDollarBills,
  document: IconDocument,
  sliders: IconSliders,
  honeycomb: IconHoneycombPattern,
  triangles: IconClipboardChart,
}

interface ChevronInput {
  label: string
  tone: 'pink' | 'red'
  spans: string[]
  markers: string[]
}

interface WorkstreamInput {
  id: string
  title: string
  activities: string[]
}

interface DeliverableInput {
  title: string
  iconKey: string
}

interface OpmodelWorkstreamDiagramProps {
  months: string[]
  chevrons: ChevronInput[]
  workstreams: WorkstreamInput[]
  deliverables: DeliverableInput[]
  playbookLabel: string
}

export function OpmodelWorkstreamDiagram({
  months,
  chevrons,
  workstreams,
  deliverables,
  playbookLabel,
}: OpmodelWorkstreamDiagramProps) {
  const reduce = useReducedMotion()
  const planning = workstreams[0]
  const redefine = workstreams[1]

  return (
    <figure
      role="img"
      aria-label="Three-row swim diagram of the operating-model design workstreams: phase chevrons across Feb-June, key activities, and the deliverable playbook."
      className="flex flex-col gap-12"
    >
      {/* ─── Row 1: Phase ─── */}
      <Row label="Phase">
        <div className="flex flex-col gap-2">
          {/* Month axis */}
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
          >
            {months.map((m) => (
              <div
                key={m}
                className="border-b py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: DIAGRAM_PALETTE.hairline, color: DIAGRAM_PALETTE.inkSoft }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Chevrons */}
          <div className="relative flex flex-col gap-2 pt-3">
            {chevrons.map((chev, i) => {
              const startIdx = months.indexOf(chev.spans[0]!)
              const endIdx = months.indexOf(chev.spans[chev.spans.length - 1]!)
              const colSpan = endIdx - startIdx + 1
              const isPrimary = chev.tone === 'red'
              return (
                <motion.div
                  key={chev.label}
                  initial={reduce ? undefined : { opacity: 0, x: -12 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  className="grid"
                  style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
                >
                  <div
                    className="flex items-center px-4 py-2.5 font-display text-[13px] italic"
                    style={{
                      gridColumn: `${startIdx + 1} / span ${colSpan}`,
                      backgroundColor: isPrimary ? DIAGRAM_PALETTE.red : DIAGRAM_PALETTE.redSoft,
                      color: isPrimary ? DIAGRAM_PALETTE.white : DIAGRAM_PALETTE.redDeep,
                      clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)',
                    }}
                  >
                    {chev.label}
                  </div>
                </motion.div>
              )
            })}

            {/* WS marker row */}
            <div
              className="grid pt-2"
              style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
            >
              {months.map((m) => {
                const allMarkers = chevrons.flatMap((c) =>
                  c.spans.map((s, i) => ({ month: s, marker: c.markers[i] })),
                )
                const marker = allMarkers.find((mk) => mk.month === m)?.marker
                return (
                  <div key={m} className="flex flex-col items-center gap-1">
                    {marker ? (
                      <>
                        <span
                          aria-hidden
                          className="block size-2 rotate-45"
                          style={{ backgroundColor: DIAGRAM_PALETTE.ink }}
                        />
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.18em]"
                          style={{ color: DIAGRAM_PALETTE.inkSoft }}
                        >
                          {marker}
                        </span>
                      </>
                    ) : (
                      <span aria-hidden className="block h-2" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Row>

      {/* ─── Row 2: Key Activities ─── */}
      <Row label="Key Activities">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
          {planning && (
            <div className="flex flex-col gap-5 md:border-r md:pr-8" style={{ borderColor: DIAGRAM_PALETTE.hairline }}>
              <ActivityBlock
                title="Planning & Set-Up"
                bullets={planning.activities.slice(0, 2)}
              />
              <ActivityBlock
                title="Current-State Review"
                bullets={planning.activities.slice(2)}
              />
            </div>
          )}
          {redefine && <ActivityBlock title={redefine.title} bullets={redefine.activities} />}
        </div>
      </Row>

      {/* ─── Row 3: Deliverables ─── */}
      <Row label="Deliverables">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] md:items-start md:gap-10">
          {/* Playbook anchor */}
          <div className="flex items-start gap-3">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-md"
              style={{
                backgroundColor: DIAGRAM_PALETTE.surfaceMuted,
                color: DIAGRAM_PALETTE.red,
              }}
              aria-hidden
            >
              <IconHexBadge size={28} />
            </span>
            <span className="font-sans text-[12.5px] leading-[1.5]" style={{ color: DIAGRAM_PALETTE.ink }}>
              {playbookLabel}
            </span>
          </div>

          {/* 3×2 deliverable grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {deliverables.map((d, i) => {
              const Icon = DELIVERABLE_ICON_BY_KEY[d.iconKey] ?? IconDocument
              return (
                <motion.div
                  key={d.title}
                  initial={reduce ? undefined : { opacity: 0, y: 10 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.45, delay: 0.05 * i }}
                  className="flex items-start gap-3 rounded-lg bg-white p-4"
                  style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}` }}
                >
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0"
                    style={{ color: DIAGRAM_PALETTE.red }}
                  >
                    <Icon size={18} />
                  </span>
                  <FitText
                    text={d.title}
                    fontWeight={600}
                    maxFontPx={12.5}
                    minFontPx={10}
                    maxLines={3}
                    lineHeight={1.35}
                    className="font-sans"
                    style={{ color: DIAGRAM_PALETTE.ink }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </Row>
    </figure>
  )
}

// ─────────────────── helpers ───────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-t pt-6 first:border-t-0 first:pt-0" style={{ borderColor: DIAGRAM_PALETTE.hairline }}>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.24em]"
        style={{ color: DIAGRAM_PALETTE.inkMuted }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}

function ActivityBlock({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-sans text-[14px] font-semibold" style={{ color: DIAGRAM_PALETTE.ink }}>
        {title}
      </h4>
      <ul className="flex flex-col gap-1.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex gap-2 font-sans text-[12.5px] leading-[1.55]"
            style={{ color: DIAGRAM_PALETTE.inkSoft }}
          >
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full" style={{ backgroundColor: DIAGRAM_PALETTE.inkMuted }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
