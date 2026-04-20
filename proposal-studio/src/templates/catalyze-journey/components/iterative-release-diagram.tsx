'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { VIEWPORT_ONCE } from '../../shared/motion'
import { DIAGRAM_PALETTE } from './diagram-palette'
import { FitText } from './fit-text'

/**
 * Slide 28 — Iterative Release Operating Model.
 *
 * Premium rebuild. The earlier port had:
 *   • A pink trapezoid wedge that rendered empty (rotated label
 *     didn't fit inside the clip-path region).
 *   • A red diamond with rotated text that fought the criteria.
 *   • Decorative pink top/bottom bands with no information.
 *
 * New structure: a clean 5-column horizontal flow with explicit
 * track lanes (Iterative Release Team on top, Production Team on
 * bottom) shown by a thin left-edge bar instead of decorative
 * banner bands. The intake "funnel" becomes a properly-labeled
 * vertical chip. The Prioritization step is a small accent badge
 * beside its criteria, not a rotated diamond.
 */

interface RequestSource {
  label: string
  tone: 'pink' | 'grey'
}

interface RequestType {
  label: string
  track: 'top' | 'middle' | 'bottom'
}

interface ReleaseCard {
  label: string
  tone: 'grey'
}

interface IterativeReleaseDiagramProps {
  topBandLabel: string
  bottomBandLabel: string
  columnLabels: string[]
  requestSources: RequestSource[]
  intakeLabel: string
  requestTypes: RequestType[]
  epicLabel: string
  backlogLabel: string
  backlogBody: string
  reviewBoardLabel: string
  prioritization: { label: string; criteria: string[] }
  releases: ReleaseCard[]
  flagLabels: { release: string; sprint: string }
  legend: { production: string; iterative: string }
}

export function IterativeReleaseDiagram({
  topBandLabel,
  bottomBandLabel,
  columnLabels,
  requestSources,
  intakeLabel,
  requestTypes,
  epicLabel,
  backlogLabel,
  backlogBody,
  reviewBoardLabel,
  prioritization,
  releases,
  flagLabels,
  legend,
}: IterativeReleaseDiagramProps) {
  const reduce = useReducedMotion()

  const topTypes = requestTypes.filter((t) => t.track === 'top')
  const middleTypes = requestTypes.filter((t) => t.track === 'middle')
  const bottomTypes = requestTypes.filter((t) => t.track === 'bottom')

  return (
    <figure
      role="img"
      aria-label="Iterative release operating model: request sources funnel into a centralized intake, then split into Iterative Release Team (top) and Production Team (bottom) tracks, each leading to a release outcome."
      className="flex flex-col gap-6"
    >
      {/* Track legend bands as thin labels (replacing decorative pink banners) */}
      <div className="flex flex-col gap-2">
        <TrackLabel
          color={DIAGRAM_PALETTE.red}
          dotColor={DIAGRAM_PALETTE.red}
          text={topBandLabel}
        />
      </div>

      {/* Main flow */}
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[920px] grid-cols-[1.1fr_60px_1.5fr_1.7fr_1fr] gap-3 rounded-xl bg-white p-5"
          style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}` }}
        >
          {/* Column header row */}
          {columnLabels.map((label, i) => (
            <div
              key={label}
              className="flex items-baseline gap-2 pb-2"
              style={{
                borderBottom: `1px solid ${DIAGRAM_PALETTE.hairlineSoft}`,
              }}
            >
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: DIAGRAM_PALETTE.inkSoft }}
              >
                {/* Hide the long intake label here — it lives inside the funnel chip. */}
                {i === 1 ? '' : label}
              </span>
              {i === 3 && <FlagPill text={flagLabels.release} />}
              {i === 4 && <FlagPill text={flagLabels.sprint} />}
            </div>
          ))}

          {/* ── Col 1: Request Source ── */}
          <div className="flex flex-col justify-center gap-2">
            {requestSources.map((src, i) => (
              <motion.div
                key={src.label}
                initial={reduce ? undefined : { opacity: 0, x: -6 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="rounded-md px-3 py-2.5 text-center"
                style={{
                  backgroundColor:
                    src.tone === 'pink' ? DIAGRAM_PALETTE.redSoft : DIAGRAM_PALETTE.surfaceMuted,
                  boxShadow: `inset 0 0 0 1px ${
                    src.tone === 'pink' ? '#f5d6d2' : DIAGRAM_PALETTE.hairline
                  }`,
                }}
              >
                <FitText
                  text={src.label}
                  fontWeight={500}
                  maxFontPx={11.5}
                  minFontPx={10}
                  maxLines={1}
                  lineHeight={1.25}
                  className="font-sans"
                  style={{
                    color:
                      src.tone === 'pink' ? DIAGRAM_PALETTE.redDeep : DIAGRAM_PALETTE.ink,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* ── Col 2: Centralized intake ── */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Thin labeled chip instead of a clip-path wedge that loses its label. */}
            <div
              className="flex h-full min-h-[200px] w-full max-w-[56px] flex-col items-center justify-center gap-3 rounded-md py-4"
              style={{
                backgroundColor: DIAGRAM_PALETTE.redSoft,
                boxShadow: `inset 0 0 0 1px #f5d6d2`,
              }}
            >
              <span
                className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  color: DIAGRAM_PALETTE.redDeep,
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  whiteSpace: 'nowrap',
                }}
              >
                Intake
              </span>
              <span
                aria-hidden
                className="block w-px flex-1"
                style={{ backgroundColor: '#f5d6d2', minHeight: 30 }}
              />
              <span
                className="font-sans text-[9.5px] leading-tight"
                style={{
                  color: DIAGRAM_PALETTE.redDeep,
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  textAlign: 'center',
                  maxHeight: 90,
                }}
              >
                Rationalize / prioritize
              </span>
            </div>
            {/* sr-only full label */}
            <span className="sr-only">{intakeLabel}</span>
          </motion.div>

          {/* ── Col 3: Request Type ── */}
          <div className="flex flex-col gap-2">
            <RequestTypeGroup items={topTypes} tone="pink" reduce={reduce} delay={0.3} />
            <RequestTypeGroup items={middleTypes} tone="pink" reduce={reduce} delay={0.36} />
            <RequestTypeGroup items={bottomTypes} tone="grey" reduce={reduce} delay={0.42} />
          </div>

          {/* ── Col 4: Demand Team ── */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1.2fr] gap-2">
              <div className="flex flex-col gap-1.5">
                <PinkPill label={epicLabel} reduce={reduce} delay={0.5} />
                <PinkPill label={epicLabel} reduce={reduce} delay={0.55} />
              </div>
              <motion.div
                initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.45, delay: 0.6 }}
                className="rounded-md p-3"
                style={{
                  backgroundColor: DIAGRAM_PALETTE.surfaceMuted,
                  boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
                }}
              >
                <div
                  className="font-sans text-[12px] font-semibold"
                  style={{ color: DIAGRAM_PALETTE.ink }}
                >
                  {backlogLabel}
                </div>
                <p
                  className="mt-1 font-sans text-[10.5px] leading-[1.4]"
                  style={{ color: DIAGRAM_PALETTE.inkSoft }}
                >
                  {backlogBody}
                </p>
              </motion.div>
            </div>

            {/* Architecture review board gate */}
            <div
              className="rounded-md py-1.5 text-center font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em]"
              style={{
                backgroundColor: DIAGRAM_PALETTE.surfaceHover,
                color: DIAGRAM_PALETTE.inkSoft,
              }}
            >
              {reviewBoardLabel}
            </div>

            {/* Prioritization — small accent badge + inline criteria */}
            <div className="mt-1 flex items-center gap-3 rounded-md p-2" style={{ backgroundColor: DIAGRAM_PALETTE.surfaceMuted }}>
              <motion.span
                initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.45, delay: 0.75 }}
                className="rounded-md px-2 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
                style={{ backgroundColor: DIAGRAM_PALETTE.red }}
              >
                {prioritization.label}
              </motion.span>
              <ul
                className="grid flex-1 grid-cols-2 gap-x-3 gap-y-0.5 font-sans text-[10.5px]"
                style={{ color: DIAGRAM_PALETTE.inkSoft }}
              >
                {prioritization.criteria.map((c) => (
                  <li key={c} className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="size-1 shrink-0 rounded-full"
                      style={{ backgroundColor: DIAGRAM_PALETTE.inkMuted }}
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Col 5: Releases ── */}
          <div className="flex flex-col justify-center gap-3">
            {releases.map((r, i) => (
              <motion.div
                key={r.label}
                initial={reduce ? undefined : { opacity: 0, x: 6 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.5, delay: 0.85 + 0.1 * i }}
                className="rounded-md px-3 py-4 text-center font-sans text-[12px] font-semibold"
                style={{
                  backgroundColor: DIAGRAM_PALETTE.ink,
                  color: DIAGRAM_PALETTE.white,
                }}
              >
                {r.label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom track band as a thin label (replacing decorative red banner) */}
      <TrackLabel
        color={DIAGRAM_PALETTE.inkSoft}
        dotColor={DIAGRAM_PALETTE.inkMuted}
        text={bottomBandLabel}
      />

      {/* Legend */}
      <figcaption className="flex items-center justify-end gap-5">
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: DIAGRAM_PALETTE.inkMuted }}
        >
          <span aria-hidden className="block size-2.5 rounded-sm" style={{ backgroundColor: DIAGRAM_PALETTE.surfaceMuted, boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}` }} />
          {legend.production}
        </span>
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: DIAGRAM_PALETTE.inkMuted }}
        >
          <span aria-hidden className="block size-2.5 rounded-sm" style={{ backgroundColor: DIAGRAM_PALETTE.redSoft, boxShadow: `inset 0 0 0 1px #f5d6d2` }} />
          {legend.iterative}
        </span>
      </figcaption>
    </figure>
  )
}

// ─────────────────── helpers ───────────────────

function TrackLabel({ color, dotColor, text }: { color: string; dotColor: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="block size-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
      <span
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{ backgroundColor: DIAGRAM_PALETTE.hairline }}
      />
    </div>
  )
}

function FlagPill({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white"
      style={{ backgroundColor: DIAGRAM_PALETTE.red }}
    >
      <span aria-hidden style={{ fontSize: 7 }}>
        ◆
      </span>
      {text}
    </span>
  )
}

function RequestTypeGroup({
  items,
  tone,
  reduce,
  delay,
}: {
  items: RequestType[]
  tone: 'pink' | 'grey'
  reduce: boolean | null
  delay: number
}) {
  if (items.length === 0) return null
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, x: -6 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col gap-1 rounded-md p-2"
      style={{
        backgroundColor:
          tone === 'pink' ? DIAGRAM_PALETTE.redSoft : DIAGRAM_PALETTE.surfaceMuted,
        boxShadow: `inset 0 0 0 1px ${
          tone === 'pink' ? '#f5d6d2' : DIAGRAM_PALETTE.hairline
        }`,
      }}
    >
      {items.map((t) => (
        <div
          key={t.label}
          className="rounded-sm bg-white px-2.5 py-1 text-center"
          style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairlineSoft}` }}
        >
          <FitText
            text={t.label}
            fontWeight={500}
            maxFontPx={11}
            minFontPx={9}
            maxLines={1}
            lineHeight={1.25}
            className="font-sans"
            style={{ color: DIAGRAM_PALETTE.ink }}
          />
        </div>
      ))}
    </motion.div>
  )
}

function PinkPill({
  label,
  reduce,
  delay,
}: {
  label: string
  reduce: boolean | null
  delay: number
}) {
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, x: -6 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.4, delay }}
      className="rounded-md px-2.5 py-1.5 text-center"
      style={{
        backgroundColor: DIAGRAM_PALETTE.redSoft,
        boxShadow: `inset 0 0 0 1px #f5d6d2`,
      }}
    >
      <FitText
        text={label}
        fontWeight={600}
        maxFontPx={10.5}
        minFontPx={9}
        maxLines={1}
        lineHeight={1.2}
        className="font-sans"
        style={{ color: DIAGRAM_PALETTE.redDeep }}
      />
    </motion.div>
  )
}
