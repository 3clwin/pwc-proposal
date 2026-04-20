'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  Building2,
  ClipboardList,
  FlaskConical,
  Laptop,
  Mail,
  MessageSquare,
  Smartphone,
  User,
} from 'lucide-react'
import { VIEWPORT_ONCE } from '../../shared/motion'
import { DIAGRAM_PALETTE } from './diagram-palette'

/**
 * Slide 6 — From Scientific Disconnect to Coordinated Discovery.
 *
 * Faithful adaptation of the deck's slide 6 visual metaphor:
 *
 *   LEFT  — "Quagmire": cursive Lilly mark sits at center as a
 *            chaotic hub. Around it orbit small icons representing the
 *            many tools, channels, and inboxes (people, email,
 *            laptops, clipboards, phones, multiple Lilly entry points).
 *            Three named biotechs (Helix Tx, BioMatrix, Axion Ph) are
 *            scattered among them. Light grey hairlines connect things
 *            in tangled, inconsistent paths.
 *            Reads as: "Lilly today — many doors, many tools, no
 *            shared map."
 *
 *   RIGHT — "One-Stop": the Catalyze360 platform (small red C360 mark
 *            top-left) presents one coordinated digital front door
 *            (laptop + phone icons feeding into it). All channels
 *            terminate at a single Lilly mark in the center, which
 *            then connects via a clean red bracket to four pillar
 *            capabilities stacked on the right. A single "Biotech"
 *            label below feeds in.
 *            Reads as: "One coordinated front door. One Lilly. Four
 *            organized pathways out."
 *
 * Both panels use HTML overlay for icons + labels (crisp typography,
 * native Lucide icon quality) and SVG only for the connector lines
 * (where we need curve geometry).
 */

interface QuagmireDiagramProps {
  eyebrow: string
  title: string
  quagmireLabel: string
  oneStopLabel: string
  centerBanner: string
  centerPill: string
  quagmireBody: string
  oneStopBody: string
}

export function QuagmireDiagram({
  eyebrow,
  title,
  quagmireLabel,
  oneStopLabel,
  centerBanner,
  centerPill,
  quagmireBody,
  oneStopBody,
}: QuagmireDiagramProps) {
  const reduce = useReducedMotion()

  return (
    <figure
      role="img"
      aria-label={title}
      className="flex flex-col gap-12"
    >
      {/* Eyebrow + headline */}
      <div className="flex flex-col gap-3">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: DIAGRAM_PALETTE.inkSoft }}
        >
          {eyebrow}
        </span>
        <h3 className="font-display text-[clamp(28px,3.6vw,48px)] leading-[1.1] text-foreground">
          From Scientific{' '}
          <em style={{ fontStyle: 'italic' }}>
            Disconnect to Coordinated Discovery
          </em>
        </h3>
        <span className="sr-only">{title}</span>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
        {/* ── Quagmire panel ── */}
        <Panel label={quagmireLabel} align="left">
          <QuagmireCluster reduce={reduce ?? false} />
        </Panel>

        {/* ── Synthesis column ── */}
        <div className="flex items-center justify-center lg:px-2">
          <div className="flex flex-col items-center gap-3">
            <div
              className="rounded-md px-5 py-2.5 text-center font-sans text-[13px] font-semibold text-white"
              style={{ backgroundColor: DIAGRAM_PALETTE.ink }}
            >
              {centerBanner}
            </div>
            <div
              className="rounded-full border px-4 py-1.5 text-center font-sans text-[11px]"
              style={{
                borderColor: DIAGRAM_PALETTE.red,
                color: DIAGRAM_PALETTE.red,
              }}
            >
              {centerPill}
            </div>
          </div>
        </div>

        {/* ── One-Stop panel ── */}
        <Panel label={oneStopLabel} align="right">
          <OneStopCluster reduce={reduce ?? false} />
        </Panel>
      </div>

      {/* Body copy under each panel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
        <p
          className="font-sans text-[13.5px] leading-[1.7]"
          style={{ color: DIAGRAM_PALETTE.inkSoft }}
        >
          {quagmireBody}
        </p>
        <span aria-hidden className="hidden lg:block" />
        <p
          className="font-sans text-[13.5px] leading-[1.7]"
          style={{ color: DIAGRAM_PALETTE.inkSoft }}
        >
          {oneStopBody}
        </p>
      </div>
    </figure>
  )
}

// ─────────────────── Panel chrome ───────────────────

function Panel({
  label,
  align,
  children,
}: {
  label: string
  align: 'left' | 'right'
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <p
        className={`font-display text-base italic ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
        style={{ color: DIAGRAM_PALETTE.inkSoft }}
      >
        {label}
      </p>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl"
        style={{
          backgroundColor: DIAGRAM_PALETTE.white,
          boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─────────────────── Reusable: Lilly wordmark ───────────────────
//
// Uses the OFFICIAL Lilly cursive wordmark (vendored at
// /lilly-wordmark.svg). Two variants:
//   • "anchored" — wordmark inside a thin red circular ring
//   • "scattered" — wordmark on its own, no ring, for orbit positions
//
// In both cases the wordmark's intrinsic 97×52 aspect ratio is
// preserved via `width: auto`, so the brand mark never distorts.

function LillyMark({
  size,
  variant = 'anchored',
  className,
}: {
  size: number
  variant?: 'anchored' | 'scattered'
  className?: string
}) {
  if (variant === 'scattered') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/lilly-wordmark.svg"
        alt="Lilly"
        className={`block ${className ?? ''}`}
        style={{ height: size * 0.42, width: 'auto' }}
      />
    )
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        backgroundColor: DIAGRAM_PALETTE.white,
        boxShadow: `inset 0 0 0 2px ${DIAGRAM_PALETTE.red}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lilly-wordmark.svg"
        alt="Lilly"
        className="block"
        style={{ height: size * 0.42, width: 'auto' }}
      />
    </div>
  )
}

// ─────────────────── Reusable: orbit icon node ───────────────────
//
// Small grey circle with a Lucide icon inside it. Used for the
// scattered tool/channel touchpoints in Quagmire and the channel
// inputs in One-Stop. Positioned via percentage coords inside the
// parent panel.

function OrbitIcon({
  Icon,
  x,
  y,
  size = 28,
  delay = 0,
  variant = 'outline',
  reduce,
}: {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  x: number
  y: number
  size?: number
  delay?: number
  variant?: 'solid' | 'outline'
  reduce: boolean
}) {
  const iconSize = Math.round(size * 0.5)
  const isSolid = variant === 'solid'
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: isSolid ? '#555555' : DIAGRAM_PALETTE.surfaceMuted,
        boxShadow: isSolid ? 'none' : `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
        color: isSolid ? DIAGRAM_PALETTE.white : DIAGRAM_PALETTE.inkSoft,
      }}
      initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.35, delay }}
    >
      <Icon size={iconSize} strokeWidth={isSolid ? 2 : 1.5} />
    </motion.div>
  )
}

// ─────────────────── Reusable: named biotech bubble ───────────────────
//
// Larger grey circle with the biotech name inside. Used for the named
// partner bubbles in both panels.

function BiotechBubble({
  label,
  x,
  y,
  size = 56,
  delay = 0,
  reduce,
}: {
  label: string
  x: number
  y: number
  size?: number
  delay?: number
  reduce: boolean
}) {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full text-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: DIAGRAM_PALETTE.surfaceMuted,
        boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}`,
      }}
      initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.4, delay }}
    >
      <span
        className="font-sans text-[10.5px] font-medium leading-tight"
        style={{ color: DIAGRAM_PALETTE.ink }}
      >
        {label}
      </span>
    </motion.div>
  )
}

// ─────────────────── Quagmire cluster ───────────────────

function trimLine(
  ax: number,
  ay: number,
  rA: number,
  bx: number,
  by: number,
  rB: number,
): [number, number, number, number] {
  const dx = bx - ax
  const dy = by - ay
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return [ax, ay, bx, by]
  const ux = dx / dist
  const uy = dy / dist
  return [ax + ux * rA, ay + uy * rA, bx - ux * rB, by - uy * rB]
}

const R_HUB = 10.5
const R_BIOTECH = 8
const R_ICON = 4
const R_LILLY = 5

function QuagmireCluster({ reduce }: { reduce: boolean }) {
  const nodes = [
    { id: 'hub', type: 'lilly_hub' as const, x: 50, y: 50 },
    
    { id: 'helix', type: 'biotech' as const, label: 'Helix Tx', x: 50, y: 18 },
    { id: 'axion', type: 'biotech' as const, label: 'Axion Ph', x: 30, y: 80 },
    { id: 'biomatrix', type: 'biotech' as const, label: 'BioMatrix', x: 75, y: 70 },
    
    // Helix
    { id: 'h_user1', type: 'icon_outline' as const, Icon: User, x: 35, y: 8 },
    { id: 'h_sci', type: 'icon_solid' as const, Icon: FlaskConical, x: 35, y: 20 },
    { id: 'h_chat', type: 'icon_solid' as const, Icon: MessageSquare, x: 65, y: 15 },
    { id: 'h_user2', type: 'icon_outline' as const, Icon: User, x: 65, y: 28 },
    { id: 'h_lilly1', type: 'lilly_scattered' as const, x: 22, y: 15 },
    { id: 'h_lilly2', type: 'lilly_scattered' as const, x: 78, y: 20 },

    // Axion
    { id: 'a_user1', type: 'icon_outline' as const, Icon: User, x: 20, y: 68 },
    { id: 'a_clip', type: 'icon_solid' as const, Icon: ClipboardList, x: 45, y: 72 },
    { id: 'a_sci', type: 'icon_solid' as const, Icon: FlaskConical, x: 45, y: 90 },
    { id: 'a_lilly1', type: 'lilly_scattered' as const, x: 20, y: 92 },
    { id: 'a_user2', type: 'icon_outline' as const, Icon: User, x: 38, y: 63 },
    { id: 'a_lap', type: 'icon_solid' as const, Icon: Laptop, x: 20, y: 45 },
    { id: 'a_user3', type: 'icon_outline' as const, Icon: User, x: 28, y: 32 },

    // BioMatrix
    { id: 'b_user1', type: 'icon_outline' as const, Icon: User, x: 75, y: 50 },
    { id: 'b_sci', type: 'icon_solid' as const, Icon: FlaskConical, x: 88, y: 58 },
    { id: 'b_lilly1', type: 'lilly_scattered' as const, x: 62, y: 80 },
    { id: 'b_user2', type: 'icon_outline' as const, Icon: User, x: 62, y: 60 },
    { id: 'b_mail', type: 'icon_solid' as const, Icon: Mail, x: 68, y: 48 },
  ]

  const edges = [
    // Hub to biotechs & connecting users
    ['hub', 'helix'],
    ['hub', 'a_user2'],
    ['a_user2', 'axion'],
    ['hub', 'b_user2'],
    ['b_user2', 'biomatrix'],
    
    // Helix
    ['helix', 'h_sci'],
    ['helix', 'h_user1'],
    ['h_user1', 'h_lilly1'],
    ['helix', 'h_chat'],
    ['helix', 'h_user2'],
    ['h_user2', 'h_lilly2'],
    
    // Axion
    ['axion', 'a_user1'],
    ['axion', 'a_clip'],
    ['axion', 'a_sci'],
    ['a_user2', 'a_lap'],
    ['a_lap', 'a_user3'],
    
    // BioMatrix
    ['biomatrix', 'b_user1'],
    ['biomatrix', 'b_sci'],
    ['b_user2', 'b_mail'],
    ['biomatrix', 'b_lilly1'],
  ]

  const getRadius = (type: string) => {
    if (type === 'lilly_hub') return R_HUB
    if (type === 'biotech') return R_BIOTECH
    if (type === 'lilly_scattered') return R_LILLY
    return R_ICON
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {edges.map(([idA, idB], i) => {
          const a = nodeMap[idA]!
          const b = nodeMap[idB]!
          const rA = getRadius(a.type)
          const rB = getRadius(b.type)
          const [x1, y1, x2, y2] = trimLine(a.x, a.y, rA, b.x, b.y, rB)
          return (
            <motion.line
              key={`${idA}-${idB}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={DIAGRAM_PALETTE.hairline}
              strokeWidth="1.5"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.7, delay: 0.05 * i, ease: 'easeOut' }}
            />
          )
        })}
      </svg>

      {nodes.map((n, i) => {
        const delay = 0.2 + 0.02 * i
        if (n.type === 'lilly_hub') {
          const size = 76
          return (
            <motion.div
              key={n.id}
              className="absolute"
              style={{ left: `${n.x}%`, top: `${n.y}%`, marginLeft: -size / 2, marginTop: -size / 2 }}
              initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.5, delay }}
            >
              <LillyMark size={size} variant="anchored" />
            </motion.div>
          )
        }
        if (n.type === 'biotech') {
          return (
            <BiotechBubble
              key={n.id}
              label={n.label!}
              x={n.x}
              y={n.y}
              size={56}
              delay={delay}
              reduce={reduce}
            />
          )
        }
        if (n.type === 'lilly_scattered') {
          const size = 36
          return (
            <motion.div
              key={n.id}
              className="absolute"
              style={{ left: `${n.x}%`, top: `${n.y}%`, marginLeft: -size / 2, marginTop: -size / 2 }}
              initial={reduce ? undefined : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 0.7 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.4, delay }}
            >
              <LillyMark size={size} variant="scattered" />
            </motion.div>
          )
        }
        if (n.type === 'icon_solid' || n.type === 'icon_outline') {
          return (
            <OrbitIcon
              key={n.id}
              Icon={n.Icon!}
              x={n.x}
              y={n.y}
              size={28}
              variant={n.type === 'icon_solid' ? 'solid' : 'outline'}
              delay={delay}
              reduce={reduce}
            />
          )
        }
        return null
      })}
    </div>
  )
}

// ─────────────────── One-Stop cluster ───────────────────
//
// Literal recreation of the coordinated experience right panel:
// - Top-left: C360 badge + "Catalyze360"
// - Top: Laptop & Smartphone icons in light grey circles
// - Bottom: Biotech building icon in light grey circle
// - Center: Catalyze360 hub (red Lilly ring)
// - Right: 4 pillar capabilities connected directly from the hub
// - Faint lines connect the input channels to the hub
// - The hub fans out to the 4 pillars (direct red lines)

function OneStopCluster({ reduce }: { reduce: boolean }) {
  const hubX = 40
  const hubY = 50
  const hubSize = 88 // px

  // Channel inputs (left)
  const channels = [
    { id: 'l', Icon: Laptop, x: 12, y: 35, delay: 0.15 },
    { id: 'p', Icon: Smartphone, x: 12, y: 65, delay: 0.18 },
  ]

  // Pillar bracket positions on the right
  const pillars = [
    { label: 'Explo R&D', y: 26 },
    { label: 'Gateway Labs', y: 42 },
    { label: 'Tune Lab', y: 58 },
    { label: 'Future Cap.', y: 74 },
  ]
  const pillarLabelX = 65

  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {/* Channel inputs → hub (smooth horizontal curves) */}
        {channels.map((ch, i) => {
          const cx = (ch.x + hubX) / 2
          const d = `M ${ch.x + 5} ${ch.y} C ${cx} ${ch.y}, ${cx} ${hubY}, ${hubX - 12} ${hubY}`
          return (
            <motion.path
              key={`ch-${i}`}
              d={d}
              fill="none"
              stroke={DIAGRAM_PALETTE.hairlineStrong}
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.25 + 0.06 * i, ease: 'easeOut' }}
            />
          )
        })}

        {/* Hub → 4 Pillars directly (straight solid red lines) */}
        {pillars.map((p, i) => {
          const [x1, y1, x2, y2] = trimLine(hubX, hubY, 13, pillarLabelX - 2, p.y, 0)
          return (
            <motion.line
              key={`pillar-line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={DIAGRAM_PALETTE.red}
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? undefined : { pathLength: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.5, delay: 0.5 + 0.05 * i }}
            />
          )
        })}
      </svg>

      {/* C360 mark + label, top-left */}
      <motion.div
        className="absolute flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm"
        style={{ left: '6%', top: '6%', borderColor: DIAGRAM_PALETTE.hairline }}
        initial={reduce ? undefined : { opacity: 0, y: -4 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <span
          className="flex h-5 items-center justify-center rounded px-1.5 font-sans text-[9px] font-bold text-white"
          style={{ backgroundColor: DIAGRAM_PALETTE.red }}
        >
          C360
        </span>
        <span
          className="font-sans text-[11px] font-semibold tracking-wide"
          style={{ color: DIAGRAM_PALETTE.ink }}
        >
          Catalyze360
        </span>
      </motion.div>

      {/* Channel input icons */}
      {channels.map((ch) => (
        <OrbitIcon
          key={ch.id}
          Icon={ch.Icon}
          x={ch.x}
          y={ch.y}
          size={36}
          delay={ch.delay}
          variant="outline"
          reduce={reduce}
        />
      ))}

      {/* Central Lilly hub */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full bg-white"
        style={{
          left: `${hubX}%`,
          top: `${hubY}%`,
          width: hubSize,
          height: hubSize,
          marginLeft: -hubSize / 2,
          marginTop: -hubSize / 2,
          boxShadow: `inset 0 0 0 2px ${DIAGRAM_PALETTE.red}, 0 6px 16px rgba(211, 23, 16, 0.1)`,
        }}
        initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lilly-wordmark.svg"
          alt="Lilly"
          className="block"
          style={{ height: hubSize * 0.45, width: 'auto' }}
        />
      </motion.div>

      {/* Pillar labels on the right */}
      {pillars.map((p, i) => (
        <motion.div
          key={p.label}
          className="absolute flex items-center rounded-md border bg-white px-3 py-1.5 shadow-sm"
          style={{
            left: `${pillarLabelX}%`,
            top: `${p.y}%`,
            transform: 'translateY(-50%)',
            borderColor: DIAGRAM_PALETTE.hairline,
          }}
          initial={reduce ? undefined : { opacity: 0, x: 4 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.4, delay: 0.85 + 0.05 * i }}
        >
          <span
            className="font-sans text-[11px] font-semibold tracking-wide"
            style={{ color: DIAGRAM_PALETTE.ink }}
          >
            {p.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
