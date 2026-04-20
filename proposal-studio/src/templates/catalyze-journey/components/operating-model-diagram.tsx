'use client'

import { motion } from 'framer-motion'
import { type ComponentType, type SVGProps } from 'react'
import { VIEWPORT_ONCE } from '../../shared/motion'
import { LillyCatalyze360Lockup } from './lilly-wordmark'
import {
  IconClipboardChart,
  IconDollarBills,
  IconHoneycombPattern,
  IconPersonCheckbox,
  IconScaleBalance,
  IconSliders,
} from './deck-icons'
import { DIAGRAM_PALETTE } from './diagram-palette'

/**
 * §03 — Tomorrow's Connected Operating Model is Integrated (slide 11).
 *
 * Premium rebuild: six pillar hexes ringing a central black hex with
 * the real Lilly + catalyze360 lockup. The deck encodes hierarchy in
 * color (two primary, two secondary, two tertiary). We honor that but
 * with restraint — the accent red is reserved for the two primary
 * pillars; the rest are neutral surfaces with quiet hairlines.
 *
 * Spatial layout: pure SVG (replaces the clip-path-on-divs approach,
 * which leaked icons outside their containers when the surrounding
 * grid resized). SVG ensures hex shape, fill, and icon all stay
 * inside one `<g>` — no escape possible.
 */

interface PillarInput {
  title: string
  subtitle: string
  body: string
}

interface OperatingModelDiagramProps {
  pillars: PillarInput[]
  /** Italic red caption above the honeycomb. */
  subtitle?: string
  /** Bold caption below the honeycomb. */
  caption?: string
}

type DeckIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

interface PillarSlot {
  position: 'top-left' | 'top-right' | 'mid-left' | 'mid-right' | 'bottom-left' | 'bottom-right'
  side: 'left' | 'right'
  icon: DeckIcon
  /** Visual role from the deck. */
  role: 'primary' | 'secondary' | 'tertiary'
}

/**
 * Slot order matches the data file's `pillars[]` order:
 *   [0] Partner Intake          [1] Seamless Partner Experience
 *   [2] Pricing & Contracting   [3] Governance
 *   [4] Value Realization       [5] Org Model & Ways of Working
 *
 * Deck color logic (verified against slide 11):
 *   Top-left + Top-right     = primary (filled red, white icon)
 *   Right + Bottom-right     = secondary (red icon on cool wash)
 *   Left + Bottom-left       = tertiary (red icon on white)
 */
const SLOTS: PillarSlot[] = [
  { position: 'mid-left', side: 'left', icon: IconScaleBalance, role: 'tertiary' }, // Partner Intake
  { position: 'top-left', side: 'left', icon: IconSliders, role: 'primary' }, // Seamless Partner Experience
  { position: 'bottom-left', side: 'left', icon: IconDollarBills, role: 'tertiary' }, // Pricing & Contracting
  { position: 'top-right', side: 'right', icon: IconPersonCheckbox, role: 'primary' }, // Governance
  { position: 'bottom-right', side: 'right', icon: IconClipboardChart, role: 'secondary' }, // Value Realization
  { position: 'mid-right', side: 'right', icon: IconHoneycombPattern, role: 'secondary' }, // Org Model
]

interface RoleTokens {
  fill: string
  stroke: string
  iconColor: string
}

const ROLE_TOKENS: Record<PillarSlot['role'], RoleTokens> = {
  primary: { fill: DIAGRAM_PALETTE.red, stroke: DIAGRAM_PALETTE.red, iconColor: DIAGRAM_PALETTE.white },
  secondary: { fill: DIAGRAM_PALETTE.redSoft, stroke: '#f3c8c2', iconColor: DIAGRAM_PALETTE.red },
  tertiary: { fill: DIAGRAM_PALETTE.white, stroke: DIAGRAM_PALETTE.hairline, iconColor: DIAGRAM_PALETTE.red },
}

// SVG-space coordinates for the 6 outer hexes around a center at (200, 200).
// Hex points are at distance R from center, but we use side-by-side honeycomb
// packing where horizontal hexes share an edge.
//
// Hex with flat top has width 2*r and height r*sqrt(3) where r is the
// distance from center to a vertex. Pointy-top is rotated 30°.
//
// We use FLAT-TOP hexes here. Stage is 400×400. Center at (200, 200).
// Outer hex centers placed at standard honeycomb offsets.
const HEX_RADIUS = 56 // distance from hex center to vertex
const HEX_HEIGHT = HEX_RADIUS * Math.sqrt(3)
const HEX_DX = HEX_RADIUS * 1.5 // horizontal stride between adjacent hex columns
const HEX_DY = HEX_HEIGHT * 0.5 // vertical stride between rows

const CENTER_X = 200
const CENTER_Y = 200

const HEX_CENTERS: Record<PillarSlot['position'], { cx: number; cy: number }> = {
  'top-left': { cx: CENTER_X - HEX_DX, cy: CENTER_Y - HEX_DY * 2 },
  'top-right': { cx: CENTER_X + HEX_DX, cy: CENTER_Y - HEX_DY * 2 },
  'mid-left': { cx: CENTER_X - HEX_DX * 2, cy: CENTER_Y },
  'mid-right': { cx: CENTER_X + HEX_DX * 2, cy: CENTER_Y },
  'bottom-left': { cx: CENTER_X - HEX_DX, cy: CENTER_Y + HEX_DY * 2 },
  'bottom-right': { cx: CENTER_X + HEX_DX, cy: CENTER_Y + HEX_DY * 2 },
}

function hexPath(cx: number, cy: number, r: number) {
  // Flat-top hex: vertices at 0°, 60°, 120°, 180°, 240°, 300°.
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return points.join(' ')
}

export function OperatingModelDiagram({ pillars, subtitle, caption }: OperatingModelDiagramProps) {
  const entries = pillars.map((p, i) => ({ ...p, ...(SLOTS[i] ?? SLOTS[0]!), index: i }))
  const leftEntries = entries.filter((e) => e.side === 'left')
  const rightEntries = entries.filter((e) => e.side === 'right')

  return (
    <figure
      role="img"
      aria-label="Six pillars of the Catalyze360 operating model arranged in a honeycomb around the Lilly Catalyze360 mark."
      className="relative"
    >
      {subtitle && (
        <p
          className="mb-12 text-center font-display text-lg italic sm:text-xl"
          style={{ color: DIAGRAM_PALETTE.red }}
        >
          {subtitle}
        </p>
      )}

      <div className="grid grid-cols-1 items-center gap-10 @4xl:grid-cols-[1fr_minmax(420px,520px)_1fr] @4xl:gap-12">
        {/* Left descriptions */}
        <div className="hidden flex-col gap-12 @4xl:flex">
          {leftEntries.map((entry) => (
            <PillarCopy key={entry.title} entry={entry} align="right" />
          ))}
        </div>

        {/* Honeycomb cluster — single SVG, no clip-path-on-div. */}
        <div className="hidden justify-center @4xl:flex">
          <HexCluster entries={entries} />
        </div>

        {/* Right descriptions */}
        <div className="hidden flex-col gap-12 @4xl:flex">
          {rightEntries.map((entry) => (
            <PillarCopy key={entry.title} entry={entry} align="left" />
          ))}
        </div>

        {/* Mobile fallback: stacked. */}
        <ul className="flex flex-col gap-6 @4xl:hidden">
          {entries.map((entry) => (
            <li key={entry.title} className="flex gap-4">
              <MobileHexBadge icon={entry.icon} role={entry.role} />
              <div className="flex flex-col gap-1.5">
                <h4 className="font-sans text-sm font-semibold" style={{ color: DIAGRAM_PALETTE.red }}>
                  {entry.title}
                </h4>
                <p className="font-display text-sm italic" style={{ color: DIAGRAM_PALETTE.ink }}>
                  &ldquo;{entry.subtitle}&rdquo;
                </p>
                <p className="font-sans text-[13px] leading-[1.6]" style={{ color: DIAGRAM_PALETTE.inkSoft }}>
                  {entry.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {caption && (
        <figcaption
          className="mx-auto mt-14 max-w-[760px] text-center font-sans text-[13px] leading-[1.6]"
          style={{ color: DIAGRAM_PALETTE.inkSoft }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─────────────────── Pillar copy ───────────────────

function PillarCopy({
  entry,
  align,
}: {
  entry: PillarInput & PillarSlot & { index: number }
  align: 'left' | 'right'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.55, delay: entry.index * 0.06 }}
      className={`flex flex-col gap-1.5 ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <h4 className="font-sans text-[13px] font-semibold" style={{ color: DIAGRAM_PALETTE.red }}>
        {entry.title}
      </h4>
      <p className="font-display text-[15px] italic" style={{ color: DIAGRAM_PALETTE.ink }}>
        &ldquo;{entry.subtitle}&rdquo;
      </p>
      <p className="font-sans text-[13px] leading-[1.6]" style={{ color: DIAGRAM_PALETTE.inkSoft }}>
        {entry.body}
      </p>
    </motion.div>
  )
}

// ─────────────────── Hex cluster (SVG) ───────────────────

function HexCluster({ entries }: { entries: (PillarInput & PillarSlot & { index: number })[] }) {
  return (
    <svg
      viewBox="-40 -40 480 480"
      className="size-full max-w-[520px]"
      style={{ aspectRatio: '1 / 1' }}
      aria-hidden
    >
      {entries.map((entry) => {
        const { cx, cy } = HEX_CENTERS[entry.position]
        const tokens = ROLE_TOKENS[entry.role]
        const Icon = entry.icon
        return (
          <motion.g
            key={entry.title}
            initial={{ opacity: 0, scale: 0.85, transformOrigin: `${cx}px ${cy}px` }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.08 + entry.index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <polygon
              points={hexPath(cx, cy, HEX_RADIUS)}
              fill={tokens.fill}
              stroke={tokens.stroke}
              strokeWidth={1}
            />
            {/* Icon centered in hex; embedded via foreignObject so the
                inline SVG icon set renders correctly with currentColor. */}
            <foreignObject x={cx - 18} y={cy - 18} width={36} height={36}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tokens.iconColor,
                }}
              >
                <Icon size={28} />
              </div>
            </foreignObject>
          </motion.g>
        )
      })}

      {/* Center hex — black with Lilly + catalyze360 lockup. */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85, transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <polygon
          points={hexPath(CENTER_X, CENTER_Y, HEX_RADIUS)}
          fill={DIAGRAM_PALETTE.ink}
        />
        <foreignObject x={CENTER_X - 56} y={CENTER_Y - 24} width={112} height={48}>
          <div
            style={{
              width: 112,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LillyCatalyze360Lockup height={20} tone="inverse" orientation="stacked" />
          </div>
        </foreignObject>
      </motion.g>
    </svg>
  )
}

// ─────────────────── Mobile hex badge ───────────────────

function MobileHexBadge({ icon: Icon, role }: { icon: DeckIcon; role: PillarSlot['role'] }) {
  const tokens = ROLE_TOKENS[role]
  return (
    <svg viewBox="0 0 64 64" className="size-14 shrink-0" aria-hidden>
      <polygon points={hexPath(32, 32, 28)} fill={tokens.fill} stroke={tokens.stroke} strokeWidth={1} />
      <foreignObject x={20} y={20} width={24} height={24}>
        <div
          style={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.iconColor,
          }}
        >
          <Icon size={20} />
        </div>
      </foreignObject>
    </svg>
  )
}
