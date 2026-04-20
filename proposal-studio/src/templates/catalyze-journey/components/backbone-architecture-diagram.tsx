'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Atom, FlaskConical, Microscope } from 'lucide-react'
import { VIEWPORT_ONCE } from '../../shared/motion'
import { DIAGRAM_PALETTE } from './diagram-palette'

/**
 * Slide 18 — One Coordinated External Innovation Experience
 * (Enabled by Catalyze360).
 *
 * Premium rebuild: 3-tier vertical stack with explicit hairline
 * connectors so the eye reads the system flow top → bottom.
 *
 *   Tier 1: 4 audience pills
 *     │ (4 hairlines down to the backbone)
 *   Tier 2: Salesforce CRM Backbone bar
 *     │ (3 hairlines down to the pillars)
 *   Tier 3: 3 pillar cards
 *
 * Bottom: 3 capability callouts as a single divided footer instead
 * of disconnected pink boxes.
 */

interface PillarInput {
  title: string
  body: string
}

interface CapabilityInput {
  title: string
  body: string
}

interface AudienceInput {
  label: string
  imageSrc: string
}

interface BackboneArchitectureDiagramProps {
  audiences: AudienceInput[]
  backboneLabel: string
  pillarsHeading: string
  pillars: PillarInput[]
  capabilities: CapabilityInput[]
  footerCaption: string
}

// Pillar icons (Lucide). Order matches the slide-18 pillar order:
//   1. Lilly Gateway Labs  → FlaskConical (physical / wet lab)
//   2. ExploR&D            → Microscope    (research collaboration + CMC)
//   3. TuneLab             → Atom          (TA consulting + scientific advisory)
const PILLAR_ICONS = [FlaskConical, Microscope, Atom] as const

export function BackboneArchitectureDiagram({
  audiences,
  backboneLabel,
  pillarsHeading,
  pillars,
  capabilities,
  footerCaption,
}: BackboneArchitectureDiagramProps) {
  const reduce = useReducedMotion()

  return (
    <figure
      role="img"
      aria-label="Salesforce backbone diagram showing four audiences converging into one CRM platform that powers three integrated pillars."
      className="relative flex flex-col overflow-hidden rounded-4xl border border-foreground/5 bg-gradient-to-b from-white to-foreground/[0.02] p-8 shadow-2xl shadow-foreground/5 ring-1 ring-foreground/5 sm:p-14"
    >
      {/* Decorative background grid/mesh for depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      
      <div className="relative z-10 flex flex-col">
        {/* ── Tier 1: Audience row ── */}
        <div className="flex flex-col gap-6">
        <Eyebrow>Audiences served</Eyebrow>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          {audiences.map((audience, i) => (
            <motion.div
              key={audience.label}
              initial={reduce ? undefined : { opacity: 0, y: -6 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="flex flex-col items-center gap-2.5 text-center"
            >
              <div
                className="relative aspect-square w-20 overflow-hidden rounded-full sm:w-24"
                style={{
                  backgroundColor: DIAGRAM_PALETTE.surfaceMuted,
                  boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={audience.imageSrc}
                  alt=""
                  aria-hidden
                  className="size-full object-cover"
                />
              </div>
              <span
                className="font-sans text-[12px] font-medium leading-[1.35]"
                style={{ color: DIAGRAM_PALETTE.ink }}
              >
                {audience.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Funnel-IN: 4 audience columns converge into the backbone bar.
          One continuous SVG owns the connector zone so the lines feel like
          they're flowing into the platform, not dead-ending in air. */}
      <FunnelConnectors
        topCount={4}
        bottomCount={1}
        height={56}
        direction="converge"
        reduce={reduce ?? false}
      />

      {/* ── Tier 2: Backbone bar ── */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, scaleX: 0.96, transformOrigin: 'center' }}
        whileInView={reduce ? undefined : { opacity: 1, scaleX: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.55, delay: 0.45 }}
        className="flex items-center justify-center gap-5 rounded-md px-6 py-5 sm:gap-6 sm:py-6"
        style={{
          backgroundColor: DIAGRAM_PALETTE.surface,
          color: DIAGRAM_PALETTE.ink,
          boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/salesforce-logo.svg"
          alt="Salesforce"
          className="block h-9 w-auto sm:h-11"
        />
        <span
          aria-hidden
          className="block h-7 w-px"
          style={{ backgroundColor: DIAGRAM_PALETTE.hairline }}
        />
        <span
          className="font-sans text-[14px] font-medium tracking-[0.01em] sm:text-[15px]"
          style={{ color: DIAGRAM_PALETTE.ink }}
        >
          {backboneLabel}
        </span>
      </motion.div>

      {/* ── Center spine: backbone → ExploR&D card.
          One continuous DOM element. Reserves 56px of layout space (so
          spacing matches the audience→backbone funnel above), then visually
          extends beyond that via overflow-visible to land flush on the card
          top. No SVG seams, no second-element joins. */}
      <CenterSpine reduce={reduce ?? false} />

      {/* ── Tier 3: Pillar cards ── */}
      <div className="mt-2 flex flex-col gap-4">
        <Eyebrow>{pillarsHeading}</Eyebrow>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = PILLAR_ICONS[i] ?? FlaskConical
            const bullets = pillar.body
              .split(/[\u00b7•]/)
              .map((s) => s.trim())
              .filter(Boolean)
            return (
              <motion.div
                key={pillar.title}
                initial={reduce ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.5, delay: 0.85 + 0.06 * i }}
                className="flex flex-col gap-4 rounded-xl border border-foreground/10 p-6"
                style={{ backgroundColor: DIAGRAM_PALETTE.sectionEcho }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-9 items-center justify-center rounded-md border border-foreground/10"
                    style={{
                      backgroundColor: DIAGRAM_PALETTE.white,
                      color: DIAGRAM_PALETTE.red,
                    }}
                    aria-hidden
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <h4 className="font-sans text-[14px] font-semibold" style={{ color: DIAGRAM_PALETTE.ink }}>
                    {pillar.title}
                  </h4>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 font-sans text-[12.5px] leading-[1.5]"
                      style={{ color: DIAGRAM_PALETTE.inkSoft }}
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 size-1 shrink-0 rounded-full"
                        style={{ backgroundColor: DIAGRAM_PALETTE.inkMuted }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Capability footer (single divided strip, no detached pink boxes) ── */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 8 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.55, delay: 1.1 }}
        className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl md:grid-cols-3"
        style={{
          backgroundColor: DIAGRAM_PALETTE.surfaceMuted,
          boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
        }}
      >
        {capabilities.map((cap, i) => (
          <div
            key={cap.title}
            className={`flex flex-col gap-1.5 p-5 ${
              i > 0 ? 'border-t md:border-l md:border-t-0' : ''
            }`}
            style={{ borderColor: DIAGRAM_PALETTE.hairline }}
          >
            <h5
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: DIAGRAM_PALETTE.red }}
            >
              {cap.title}
            </h5>
            <p className="font-sans text-[12.5px] leading-[1.5]" style={{ color: DIAGRAM_PALETTE.ink }}>
              {cap.body}
            </p>
          </div>
        ))}
      </motion.div>

      </div>
      
      <figcaption
        className="mt-8 text-center font-sans text-[12px] italic leading-[1.6]"
        style={{ color: DIAGRAM_PALETTE.inkMuted }}
      >
        {footerCaption}
      </figcaption>
    </figure>
  )
}

// ─────────────────── Eyebrow ───────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.24em]"
      style={{ color: DIAGRAM_PALETTE.inkMuted }}
    >
      {children}
    </span>
  )
}

// ─────────────────── CenterSpine ───────────────────
//
// Single continuous vertical hairline that visually connects the backbone
// bar to the center pillar (ExploR&D). Reserves only the layout space of
// the audience→backbone funnel above (matching vertical rhythm), then the
// line extends past its container via overflow-visible to land flush on
// the pillar card.
//
// One DOM element renders the full line — no SVG joins, no overlay seams.
// Two anchor dots (top + bottom) mark the connection points; their colors
// match the funnel dots above so the whole composition reads as one system.

function CenterSpine({ reduce }: { reduce: boolean }) {
  // Total visible spine length (top dot → bottom dot), in px.
  //
  // Tuned so the bottom dot's CENTER lands exactly on the ExploR&D card's
  // top edge — half the dot sits above (visible), half is occluded by the
  // card. Reads as a clean "thumbtack on paper" landing with no overshoot.
  //
  // Geometry: card-top sits 95px below the spine wrapper's top. Dot center
  // sits at `SPINE_TOTAL_PX − dotPx/2` from the wrapper's top. So:
  //   SPINE_TOTAL_PX − 1.8 = 95   →   SPINE_TOTAL_PX = 96.8 ≈ 97
  // If the surrounding spacing changes (eyebrow row height, pillar mt-2,
  // funnel layout height), re-measure and adjust this constant.
  const SPINE_TOTAL_PX = 97
  // Layout footprint — matches the audience→backbone funnel height so the
  // gap between the bar and the pillar block stays symmetric with the gap
  // above the bar.
  const LAYOUT_PX = 56
  const dotPx = 3.6

  return (
    <div
      aria-hidden
      className="relative hidden w-full sm:block"
      style={{ height: LAYOUT_PX }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{ height: SPINE_TOTAL_PX }}
      >
        {/* Top dot — sits flush against the bottom of the backbone bar */}
        <motion.span
          className="absolute left-1/2 top-0 block -translate-x-1/2 rounded-full"
          style={{
            width: dotPx,
            height: dotPx,
            backgroundColor: DIAGRAM_PALETTE.inkMuted,
          }}
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.3, delay: 0.55 }}
        />
        {/* Continuous hairline — one element, no seams */}
        <motion.span
          className="absolute left-1/2 block w-px -translate-x-1/2 origin-top"
          style={{
            top: dotPx / 2,
            height: SPINE_TOTAL_PX - dotPx,
            backgroundColor: DIAGRAM_PALETTE.hairline,
          }}
          initial={reduce ? undefined : { scaleY: 0 }}
          whileInView={reduce ? undefined : { scaleY: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
        />
        {/* Bottom dot — lands on the ExploR&D card top edge */}
        <motion.span
          className="absolute left-1/2 block -translate-x-1/2 rounded-full"
          style={{
            bottom: 0,
            width: dotPx,
            height: dotPx,
            backgroundColor: DIAGRAM_PALETTE.inkMuted,
          }}
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.3, delay: 1.1 }}
        />
      </div>
    </div>
  )
}

// ─────────────────── FunnelConnectors ───────────────────
//
// One continuous SVG that owns the connector zone between two tiers.
// Curves fan from `topCount` columns down to `bottomCount` columns
// (or vice versa). Uses smooth cubic Beziers so the lines feel like
// flow into the platform rather than a row of disconnected toothpicks.
//
// Anchor dots sit at every connection point — top of curves and bottom
// of curves — so the lines visually "land" on the avatars and the
// backbone bar instead of dead-ending in air.
//
// Stroke width stays 1px via `vectorEffect="non-scaling-stroke"`,
// regardless of how the SVG is stretched horizontally.

function FunnelConnectors({
  topCount,
  bottomCount,
  height,
  direction,
  reduce,
}: {
  topCount: number
  bottomCount: number
  height: number
  /** "converge" = many → one. "diverge" = one → many. */
  direction: 'converge' | 'diverge'
  reduce: boolean
}) {
  const VB_W = 1000
  const VB_H = height

  // Compute X positions for the top and bottom rows.
  // For a single-node row (the backbone), spread the anchors across
  // the middle 60% so the curves clearly resolve into "the bar" rather
  // than collapsing to one mathematical point.
  const xs = (count: number) => {
    if (count === 1) {
      return [0.2 * VB_W, 0.5 * VB_W, 0.8 * VB_W]
    }
    return Array.from({ length: count }, (_, i) => (VB_W / count) * (i + 0.5))
  }

  const topXs = xs(topCount)
  const bottomXs = xs(bottomCount)

  // Build curve segments from each top column-center to its corresponding
  // bottom landing point. The shape of the funnel emerges naturally from
  // pairing every "many" anchor with the nearest "one" anchor.
  type Edge = { x1: number; x2: number }
  const edges: Edge[] = []

  if (direction === 'converge') {
    // Many → One. Every top anchor flows into one of the 3 spread points
    // on the backbone bar (chosen by which third the audience falls into).
    for (let i = 0; i < topCount; i++) {
      const x1 = topXs[i]
      // Map i ∈ [0, topCount-1] → bottomIdx ∈ {0, 1, 2}
      const t = topCount === 1 ? 0.5 : i / (topCount - 1)
      const bottomIdx = Math.min(2, Math.max(0, Math.round(t * 2)))
      const x2 = bottomXs[bottomIdx] ?? bottomXs[0]
      edges.push({ x1, x2 })
    }
  } else {
    // One → Many. Three spread points on the backbone fan out to the
    // pillars; pillar i pulls from spread point that aligns with it.
    for (let j = 0; j < bottomCount; j++) {
      const x2 = bottomXs[j]
      const t = bottomCount === 1 ? 0.5 : j / (bottomCount - 1)
      const topIdx = Math.min(2, Math.max(0, Math.round(t * 2)))
      const x1 = topXs[topIdx] ?? topXs[0]
      edges.push({ x1, x2 })
    }
  }

  const dotR = 1.8
  const padY = 4 // breathing room so dots don't kiss the rows above/below

  return (
    <div
      className="relative hidden w-full sm:block"
      style={{ height: VB_H }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="block size-full"
      >
        {/* Edges */}
        {edges.map(({ x1, x2 }, i) => {
          // Cubic Bezier: control points sit halfway down, holding each
          // endpoint's X. That gives a graceful S-curve with no kinks.
          const yTop = padY
          const yBot = VB_H - padY
          const cy = VB_H / 2
          const d = `M ${x1} ${yTop} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${yBot}`
          return (
            <motion.path
              key={`${i}-${x1}-${x2}`}
              d={d}
              fill="none"
              stroke={DIAGRAM_PALETTE.hairline}
              strokeWidth={1}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              whileInView={
                reduce ? undefined : { pathLength: 1, opacity: 1 }
              }
              viewport={VIEWPORT_ONCE}
              transition={{
                duration: 0.7,
                delay: 0.1 + 0.04 * i,
                ease: 'easeOut',
              }}
            />
          )
        })}

        {/* Top anchor dots — sit just below each top-tier element so the
            curve visually attaches to it. */}
        {topXs.map((x, i) => (
          <motion.circle
            key={`t-${i}`}
            cx={x}
            cy={padY}
            r={dotR}
            fill={DIAGRAM_PALETTE.inkMuted}
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.3, delay: 0.05 * i }}
          />
        ))}

        {/* Bottom anchor dots */}
        {bottomXs.map((x, i) => (
          <motion.circle
            key={`b-${i}`}
            cx={x}
            cy={VB_H - padY}
            r={dotR}
            fill={DIAGRAM_PALETTE.inkMuted}
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.3, delay: 0.6 + 0.05 * i }}
          />
        ))}
      </svg>
    </div>
  )
}
