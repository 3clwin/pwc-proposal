'use client'

import { motion } from 'framer-motion'
import {
  Workflow,
  Brain,
  UserCheck,
  SlidersHorizontal,
  Database,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { VIEWPORT_ONCE } from '../../shared/motion'

/**
 * §03 — The Real Challenge: Lack of Buy-in & Adoption
 *
 * Six factors rendered as an interlocking zigzag hex chain in the
 * deck's style — odd-indexed factors sit higher, even-indexed lower,
 * so the row reads as a continuous honeycomb. Each hex carries a
 * Lucide icon in Lilly red; the body copy sits adjacent to each
 * hex (above for upper tiles, below for lower tiles) so the text
 * leads the eye across the row.
 *
 * Responsive behavior:
 *   • @4xl+ (≈896px container) : zigzag hex row.
 *   • below @4xl               : stacked cards with inline hex
 *     badges so the icon/factor pairing survives narrow widths.
 */

interface FactorInput {
  title: string
  body: string
}

interface SuccessFactorsDiagramProps {
  factors: FactorInput[]
  /** Optional italic lead caption displayed above the chain. */
  lead?: string
  /** Optional closing line rendered beneath the chain. */
  footer?: string
}

const FACTOR_ICONS: LucideIcon[] = [
  SlidersHorizontal, // Governance & Metrics  — decision-rights sliders
  UserCheck, // Accountability — named ownership
  Database, // Data Discipline — minimum viable data
  Brain, // Purpose-Built Capability — cognitive load
  TrendingUp, // Follow the Leader — leader behavior lifts the line
  Workflow, // Design-to-Adopt — path of least resistance
]

const HEX_CLIP =
  'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)'

export function SuccessFactorsDiagram({
  factors,
  lead,
  footer,
}: SuccessFactorsDiagramProps) {
  // Reorder factors to match the deck's chain on page 12.
  // Deck order: Governance & Metrics → Accountability → Data
  // Discipline → Purpose-Built Capability → Follow the Leader →
  // Design-to-Adopt. The input order (from the content file) is
  // different, so we match by fuzzy title keywords.
  const deckOrder = [
    'Governance',
    'Accountability',
    'Data Discipline',
    'Purpose-Built',
    'Follow the Leader',
    'Design-to-Adopt',
  ]
  const ordered = deckOrder
    .map((key) =>
      factors.find((f) => f.title.toLowerCase().includes(key.toLowerCase())),
    )
    .filter((f): f is FactorInput => f !== undefined)

  // Fall back to the raw input ordering if any keyword lookup missed
  // (defends against future edits to content titles).
  const finalFactors = ordered.length === factors.length ? ordered : factors

  return (
    <div className="relative">
      {lead && (
        <p className="mb-10 max-w-[900px] font-display text-lg italic leading-snug text-[#d31710] sm:text-xl">
          {lead}
        </p>
      )}

      {/* Desktop zigzag chain */}
      <div className="hidden @4xl:block">
        <ZigzagChain factors={finalFactors} />
      </div>

      {/* Mobile / tablet stack */}
      <ul className="flex flex-col gap-6 @4xl:hidden">
        {finalFactors.map((factor, i) => {
          const Icon = FACTOR_ICONS[i] ?? Workflow
          return (
            <li key={factor.title} className="flex gap-4">
              <HexBadge icon={Icon} size={56} />
              <div className="flex flex-col gap-1.5">
                <h4 className="font-display text-lg leading-tight text-foreground">
                  {factor.title}
                </h4>
                <p className="font-sans text-[13px] leading-[1.6] text-foreground/70">
                  {factor.body}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      {footer && (
        <p className="mt-10 max-w-[980px] font-display italic leading-snug text-[#d31710]">
          {footer}
        </p>
      )}
    </div>
  )
}

// ─────────────────── ZigzagChain ───────────────────

interface ZigzagChainProps {
  factors: FactorInput[]
}

function ZigzagChain({ factors }: ZigzagChainProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {factors.map((factor, i) => {
        const Icon = FACTOR_ICONS[i] ?? Workflow
        const isHigh = i % 2 === 0
        return (
          <motion.div
            key={factor.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{
              duration: 0.6,
              delay: 0.1 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center"
          >
            {/* When `isHigh`, the title sits ABOVE the hex (deck's
                upper row); otherwise BELOW. Keeps the zigzag reading
                order left-to-right across the chain. */}
            {isHigh && <FactorHeader factor={factor} align="above" />}

            <div
              className="relative mx-auto"
              style={{
                width: 128,
                height: 144,
                marginTop: isHigh ? 0 : 24,
                marginBottom: isHigh ? 24 : 0,
              }}
            >
              <HexCell icon={Icon} />
            </div>

            {!isHigh && <FactorHeader factor={factor} align="below" />}
          </motion.div>
        )
      })}
    </div>
  )
}

// ─────────────────── FactorHeader ───────────────────

interface FactorHeaderProps {
  factor: FactorInput
  align: 'above' | 'below'
}

function FactorHeader({ factor, align }: FactorHeaderProps) {
  return (
    <div
      className={`flex w-full flex-col gap-1.5 px-1 text-center ${
        align === 'above' ? 'mb-3' : 'mt-3'
      }`}
    >
      <h4 className="font-sans text-[13px] font-semibold leading-tight text-[#d31710]">
        {factor.title}
      </h4>
      <p className="font-sans text-[11px] leading-[1.55] text-foreground/70">
        {factor.body}
      </p>
    </div>
  )
}

// ─────────────────── HexCell ───────────────────

interface HexCellProps {
  icon: LucideIcon
}

function HexCell({ icon: Icon }: HexCellProps) {
  return (
    <div
      className="flex size-full items-center justify-center"
      aria-hidden
      style={{
        clipPath: HEX_CLIP,
        backgroundColor: 'rgba(211,23,16,0.08)',
      }}
    >
      <Icon strokeWidth={1.5} className="size-10" style={{ color: '#d31710' }} />
    </div>
  )
}

// ─────────────────── HexBadge (mobile) ───────────────────

interface HexBadgeProps {
  icon: LucideIcon
  size?: number
}

function HexBadge({ icon: Icon, size = 48 }: HexBadgeProps) {
  return (
    <div
      className="shrink-0"
      aria-hidden
      style={{
        width: size,
        height: size * 1.12,
        clipPath: HEX_CLIP,
        backgroundColor: 'rgba(211,23,16,0.1)',
      }}
    >
      <div className="flex size-full items-center justify-center">
        <Icon
          strokeWidth={1.5}
          style={{
            color: '#d31710',
            width: size * 0.42,
            height: size * 0.42,
          }}
        />
      </div>
    </div>
  )
}
