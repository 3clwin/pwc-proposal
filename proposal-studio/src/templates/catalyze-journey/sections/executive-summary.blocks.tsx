'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, SlidersHorizontal, Microscope, Users } from 'lucide-react'
import { PlaceholderImage } from '../../shared/placeholder-image'
import {
  DisplayTitle,
  Eyebrow,
  Lede,
  SectionHeading,
} from '../../shared/typography'
import { FADE_UP, STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { findIconByName } from '@/lib/icons'
import type {
  DifferentiatorBentoBlock,
  DisplayTitleBlock,
  EyebrowBlock,
  ExecSummaryBlock,
  FeeHeadlineBlock,
  ImageBlock,
  LeadershipGridBlock,
  LedeBlock,
  Slide1SummaryBlock,
  SpacerBlock,
  TextBlock,
  WorkstreamTimelineBlock,
} from './executive-summary.schema'

/**
 * Schema-driven render surface for the Executive Summary section.
 *
 * Each block in the schema maps to a named renderer here. Text-bearing
 * blocks render their text into a host element tagged with
 * `data-block-id` / `data-block-field`, which the design-mode overlay
 * uses to locate the right schema slot when the user makes an inline
 * edit.
 *
 * Motion wrappers are applied at the block-renderer level (not by the
 * caller) so blocks keep their original editorial entrance feel after
 * rearranging.
 */

export function BlockRenderer({ block }: { block: ExecSummaryBlock }) {
  switch (block.type) {
    case 'eyebrow':
      return <EyebrowRenderer block={block} />
    case 'display-title':
      return <DisplayTitleRenderer block={block} />
    case 'lede':
      return <LedeRenderer block={block} />
    case 'text':
      return <TextRenderer block={block} />
    case 'spacer':
      return <SpacerRenderer block={block} />
    case 'image':
      return <ImageRenderer block={block} />
    case 'leadership-grid':
      return <LeadershipGridRenderer block={block} />
    case 'differentiator-bento':
      return <DifferentiatorBentoRenderer block={block} />
    case 'fee-headline':
      return <FeeHeadlineRenderer block={block} />
    case 'workstream-timeline':
      return <WorkstreamTimelineRenderer block={block} />
    case 'slide-1-summary':
      return <Slide1SummaryRenderer block={block} />
  }
}

/**
 * Shared block wrapper. Tags the outermost element with the block id
 * so the design-mode overlay can locate the block's schema entry on
 * hover/click.
 */
function BlockHost({
  block,
  children,
  className,
}: {
  block: ExecSummaryBlock
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-block-id={block.id}
      data-block-type={block.type}
      className={className}
    >
      {children}
    </div>
  )
}

// ─────────────────── Text primitives ───────────────────

function EyebrowRenderer({ block }: { block: EyebrowBlock }) {
  return (
    <BlockHost block={block}>
      <motion.div
        variants={FADE_UP}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
      >
        <Eyebrow number={block.number} rule={block.rule}>
          <span data-block-field="text">{block.text}</span>
        </Eyebrow>
      </motion.div>
    </BlockHost>
  )
}

function DisplayTitleRenderer({ block }: { block: DisplayTitleBlock }) {
  // An empty title would still render an h2 that takes vertical space,
  // and a literal "Display title" placeholder text would leak into the
  // proposal. Drop unfilled titles entirely; the editor still shows the
  // block's outline + actions on hover via BlockHost.
  const text = block.text?.trim()
  if (!text || text === 'Display title') return null
  return (
    <BlockHost block={block} className="mt-8 max-w-[900px]">
      <motion.div
        variants={FADE_UP}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
      >
        <DisplayTitle>
          <span data-block-field="text">{block.text}</span>
        </DisplayTitle>
      </motion.div>
    </BlockHost>
  )
}

function LedeRenderer({ block }: { block: LedeBlock }) {
  return (
    <BlockHost block={block} className="mt-8">
      <motion.div
        variants={FADE_UP}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
      >
        <Lede>
          <span data-block-field="text">{block.text}</span>
        </Lede>
      </motion.div>
    </BlockHost>
  )
}

function TextRenderer({ block }: { block: TextBlock }) {
  return (
    <BlockHost block={block} className="mt-6 max-w-[680px]">
      <p
        className="whitespace-pre-wrap font-sans text-[15px] leading-[1.65] text-foreground/80"
        data-block-field="text"
      >
        {block.text}
      </p>
    </BlockHost>
  )
}

function SpacerRenderer({ block }: { block: SpacerBlock }) {
  return (
    <BlockHost block={block}>
      <div style={{ height: `${block.height}px` }} aria-hidden />
    </BlockHost>
  )
}

// ─────────────────── Image ───────────────────

function ImageRenderer({ block }: { block: ImageBlock }) {
  const aspect = block.aspect ?? '16/9'
  return (
    <BlockHost block={block} className="mt-10">
      {block.src ? (
        <figure className="flex flex-col gap-3">
          {/* User-uploaded data URLs can't be optimized by next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            data-block-field="src"
            className="w-full rounded-md object-cover"
            style={{ aspectRatio: aspect }}
          />
          {block.caption && (
            <figcaption
              className="font-label text-[12px] uppercase tracking-[0.24em] text-muted-foreground"
              data-block-field="caption"
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      ) : (
        <div
          data-block-field="src"
          className="flex w-full items-center justify-center rounded-md border border-dashed border-foreground/20 bg-foreground/5 text-sm text-muted-foreground"
          style={{ aspectRatio: aspect }}
        >
          Click image in Design Mode → Replace image to upload
        </div>
      )}
    </BlockHost>
  )
}

// ─────────────────── Leadership grid ───────────────────

function LeadershipGridRenderer({ block }: { block: LeadershipGridBlock }) {
  return (
    <BlockHost block={block} className="mt-24">
      <Eyebrow className="mb-6">
        <span data-block-field="eyebrow">{block.eyebrow}</span>
      </Eyebrow>
      <motion.div
        variants={STAGGER_PARENT}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        className="grid grid-cols-1 gap-10 @sm:grid-cols-2 sm:grid-cols-2"
      >
        {block.leaders.map((leader) => (
          <motion.div key={leader.id} variants={FADE_UP} className="flex gap-6">
            {leader.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={leader.imageSrc}
                alt={leader.name}
                className="h-40 w-32 shrink-0 rounded object-cover"
              />
            ) : (
              <PlaceholderImage
                aspect="4/5"
                tone="stone"
                monogram={leader.monogram}
                rounded
                className="w-32 shrink-0"
              />
            )}
            <div className="flex flex-col justify-center gap-2">
              <h3 className="font-display text-2xl leading-tight text-foreground">
                {leader.name}
              </h3>
              <p className="font-label text-[12px] uppercase tracking-[0.24em] text-muted-foreground">
                {leader.role}
              </p>
              <p className="mt-1 max-w-[380px] font-sans text-sm leading-[1.6] text-foreground/70">
                {leader.bio}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </BlockHost>
  )
}

// ─────────────────── Differentiator bento ───────────────────

function DifferentiatorBentoRenderer({
  block,
}: {
  block: DifferentiatorBentoBlock
}) {
  return (
    <BlockHost block={block} className="mt-32">
      <div className="mb-10 flex items-end justify-between gap-6">
        <SectionHeading>
          <span data-block-field="heading">{block.heading}</span>
        </SectionHeading>
        {block.countLabel && (
          <span
            data-block-field="countLabel"
            className="hidden shrink-0 font-mono text-[12px] uppercase tracking-[0.24em] text-muted-foreground sm:block"
          >
            {block.countLabel}
          </span>
        )}
      </div>

      <motion.div
        variants={STAGGER_PARENT}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-foreground/10 @sm:grid-cols-2 @lg:grid-cols-6 sm:grid-cols-2 lg:grid-cols-6"
      >
        {block.items.map((diff, i) => {
          const firstTile = i === 0
          return (
            <motion.div
              key={diff.id}
              variants={FADE_UP}
              className={
                firstTile
                  ? 'relative bg-white p-8 lg:col-span-2 lg:row-span-2 lg:p-10'
                  : 'relative bg-white p-7 lg:col-span-2'
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-display text-2xl leading-none"
                  style={{ color: '#d31710' }}
                >
                  {diff.number}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 opacity-30"
                  style={{ backgroundColor: '#d31710' }}
                />
              </div>
              <h4
                className={
                  firstTile
                    ? 'mt-6 font-display text-[clamp(24px,2.2vw,32px)] leading-[1.15] text-foreground'
                    : 'mt-5 font-display text-xl leading-[1.2] text-foreground'
                }
              >
                {diff.title}
              </h4>
              <p
                className={
                  firstTile
                    ? 'mt-4 font-sans text-[15px] leading-[1.65] text-foreground/70'
                    : 'mt-3 font-sans text-[13px] leading-[1.6] text-foreground/70'
                }
              >
                {diff.body}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </BlockHost>
  )
}

// ─────────────────── Fee headline ───────────────────

function FeeHeadlineRenderer({ block }: { block: FeeHeadlineBlock }) {
  return (
    <BlockHost block={block} className="mt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl p-10 sm:p-14 lg:p-16"
        style={{ backgroundColor: '#fbf2f0' }}
      >
        {/* Split composition: massive Garamond numeral on the left,
            editorial label + subcaption stack on the right. Gives the
            fee moment the presence it deserves without the dead white
            space that the old left-aligned, full-width version created. */}
        <div className="grid grid-cols-1 items-center gap-10 @md:grid-cols-[1.2fr,1fr] @md:gap-16 md:grid-cols-[1.2fr,1fr] md:gap-16">
          <div className="flex flex-col gap-4">
            <span
              className="font-mono text-[12px] uppercase tracking-[0.28em]"
              style={{ color: '#d31710' }}
            >
              Final Fee
            </span>
            <span
              className="font-display tabular-nums leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: 'clamp(72px, 10vw, 160px)',
                color: '#1e2a30',
                fontWeight: 400,
              }}
            >
              {block.value}
            </span>
          </div>

          <div className="flex flex-col gap-4 md:border-l md:border-foreground/10 md:pl-16">
            <span className="font-label text-[12px] uppercase tracking-[0.24em] text-[#d31710]">
              {block.caption}
            </span>
            <p className="max-w-[380px] font-sans text-[15px] leading-[1.6] text-foreground/70">
              {block.sub}
            </p>
          </div>
        </div>
      </motion.div>
    </BlockHost>
  )
}

// ─────────────────── Workstream timeline ───────────────────

const ICON_MAP = {
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  microscope: Microscope,
  users: Users,
} as const

/**
 * Slide 8 — "Organized Across Four Priority Workstreams".
 *
 * Full 1:1 rebuild of the deck:
 *  • Italic red intro paragraph above the chart
 *  • Month axis with red hairline
 *  • 4 peach-ramp bars with start/end phases matching deck offsets
 *  • Diamond sprint markers (WS1-WS5, S0-S3, MVP) centered on their bars
 *  • "Hypercare" callout anchored at the end of the Tech bar
 *  • 4 legend cards below with icons + 3-bullet descriptions
 */
function WorkstreamTimelineRenderer({
  block,
}: {
  block: WorkstreamTimelineBlock
}) {
  return (
    <BlockHost block={block} className="mt-32">
      {/* Slide-8 opener: small repeated eyebrow + Garamond display title
          with inline partial italic (e.g. "Four Priority"). Renders only
          when the block carries these fields so legacy timelines keep
          their previous, headerless appearance. */}
      {(block.sectionEyebrow || block.sectionTitle) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-6"
        >
          {block.sectionEyebrow && (
            <Eyebrow>
              <span data-block-field="sectionEyebrow">
                {block.sectionEyebrow}
              </span>
            </Eyebrow>
          )}
          {block.sectionTitle && (
            <DisplayTitle>
              <span data-block-field="sectionTitle">
                {renderItalicRuns(block.sectionTitle)}
              </span>
            </DisplayTitle>
          )}
        </motion.div>
      )}

      {/* Italic red intro — matches the deck's opening line */}
      {block.intro && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-[960px] font-sans text-[15px] italic leading-[1.6]"
          style={{ color: '#d31710' }}
        >
          {block.intro}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex flex-col gap-10"
      >
        {/* Header meta — stays up top for context */}
        <div className="flex items-baseline justify-between gap-6">
          <Eyebrow>
            <span data-block-field="eyebrow">{block.eyebrow}</span>
          </Eyebrow>
          {block.rangeLabel && (
            <span
              data-block-field="rangeLabel"
              className="shrink-0 font-mono text-[12px] uppercase tracking-[0.24em] text-muted-foreground"
            >
              {block.rangeLabel}
            </span>
          )}
        </div>

        {/* Chart container — premium card with integrated month grid
            background. The dashed vertical month guides + horizontal
            row guides render once at this level as a continuous
            background, giving the chart a proper "architectural
            blueprint" feel instead of per-bar repeated guides. */}
        <div
          className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-white to-foreground/[0.02] p-6 shadow-xl shadow-foreground/5 sm:p-10"
        >
          {/* Decorative blueprint dot pattern behind the chart */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative">
            {/* Month axis row */}
            <div
              className="relative grid pb-3"
              style={{
                gridTemplateColumns: `repeat(${block.months.length}, minmax(0,1fr))`,
              }}
            >
              {block.months.map((m, i) => (
                <span
                  key={`${m}-${i}`}
                  className="font-sans text-[13px] font-medium text-foreground"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Red hairline between axis and bars */}
            <div
              aria-hidden
              className="h-px w-full"
              style={{ backgroundColor: '#d31710' }}
            />

            {/* Bar stack — wrapped in a relative parent with a
                continuous dashed month-grid background that spans the
                full chart height. This replaces the per-row guides
                below so the grid reads as one architectural system. */}
            <div className="relative pt-6">
              {/* Month grid background — spans the full bar stack
                  height. Dashed 1px verticals at each month boundary,
                  sitting behind the bars at low opacity. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${block.months.length}, minmax(0,1fr))`,
                }}
              >
                {block.months.map((_, m) => (
                  <div
                    key={m}
                    className={
                      m === 0
                        ? ''
                        : 'border-l border-dashed border-foreground/10'
                    }
                  />
                ))}
              </div>

              <div className="relative flex flex-col gap-6">
                {block.bars.map((ws, i) => {
                  const startPct = (ws.startPhase ?? 0) * 100
                  const endPct = (ws.endPhase ?? 1) * 100
                  const widthPct = endPct - startPct
                  const isHypercareBar = block.hypercareAt?.barId === ws.id

                  return (
                    <div key={ws.id} className="relative">
                      {/* Workstream label — sits ABOVE the bar so diamond
                          markers never collide with text. Indented to start
                          at the bar's left edge so the label visually anchors
                          to its row. */}
                      <div
                        className="mb-1.5"
                        style={{ paddingLeft: `${startPct}%` }}
                      >
                        <span className="font-sans text-[12.5px] font-semibold text-foreground">
                          {ws.label}
                        </span>
                      </div>

                      {/* Track row (bar + diamonds + hypercare) */}
                      <div className="relative h-10">
                        {/* The bar itself — pill shape */}
                        <motion.div
                          initial={{ scaleX: 0, transformOrigin: 'left' }}
                          whileInView={{ scaleX: 1 }}
                          viewport={VIEWPORT_ONCE}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
                          className="absolute inset-y-0 rounded-full shadow-sm"
                          style={{
                            left: `${startPct}%`,
                            width: `${widthPct}%`,
                            backgroundColor: ws.color,
                          }}
                        />

                        {/* Sprint diamond markers — overlaid on top of the bar
                            at specific phase positions along the timeline. */}
                        {ws.markers?.map((marker, mi) => (
                          <motion.div
                            key={marker.label}
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={VIEWPORT_ONCE}
                            transition={{ duration: 0.35, delay: 0.7 + i * 0.1 + mi * 0.05 }}
                            className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${marker.phase * 100}%` }}
                          >
                            <SprintDiamond label={marker.label} />
                          </motion.div>
                        ))}

                        {/* Hypercare label — floats just off the right edge of
                            its bar. White pill background so it sits cleanly
                            over any dashed month guides behind it. */}
                        {isHypercareBar && block.hypercareAt && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={VIEWPORT_ONCE}
                            transition={{ duration: 0.4, delay: 1 }}
                            className="absolute top-1/2 z-10 flex -translate-y-1/2 items-center whitespace-nowrap rounded-md bg-white px-3 py-0.5 font-sans text-[13px] font-semibold text-[#1a1a1a] shadow-sm"
                            style={{
                              left: `calc(${endPct}% + 8px)`,
                            }}
                          >
                            {block.hypercareAt.label}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend cards — 4 shadcn Card tiles mirroring the deck's bottom
            panels. Using Card size="sm" (gap-4, py-4) keeps the compact
            legend rhythm, and the card's own ring + shadow replace the
            previous 1px-gap grid-divider trick. Motion-per-card so they
            stagger in beneath the timeline. */}
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          className="mt-4 grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-4"
        >
          {block.bars.map((ws) => {
            const overrideIcon = ws.iconName
              ? findIconByName(ws.iconName)?.Icon
              : undefined
            const Icon = overrideIcon ?? ICON_MAP[ws.iconKey ?? 'shield']
            const iconColor = ws.iconColor ?? '#d31710'
            const iconBg = ws.iconBg ?? '#fbf2f0'
            return (
              <motion.div key={ws.id} variants={FADE_UP}>
                <Card size="sm" className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        data-icon-host="workstream-timeline"
                        data-icon-bar-id={ws.id}
                        className="flex size-10 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: iconBg }}
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.75}
                          style={{ color: iconColor }}
                        />
                      </span>
                      <CardTitle className="font-sans text-[14px] font-semibold leading-[1.25] text-foreground">
                        {ws.label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  {ws.bullets && ws.bullets.length > 0 && (
                    <CardContent>
                      <ul className="flex flex-col gap-2">
                        {ws.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="flex gap-2 font-sans text-[12.5px] leading-[1.5] text-foreground/75"
                          >
                            <span
                              aria-hidden
                              className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/40"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </BlockHost>
  )
}

/**
 * Split a title string on single-asterisk runs (`*word*`) and render the
 * wrapped runs as inline italic (`<em>`), the rest as plain text. Matches
 * the deck's signature partial-italic display treatment (e.g. "Four
 * Priority" in Garamond italic inside "… Organized Across Four Priority
 * Workstreams"). Non-asterisked input passes through unchanged.
 */
function renderItalicRuns(text: string): ReactNode {
  if (!text.includes('*')) return text
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} style={{ fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={i}>{part}</span>
  })
}

/**
 * Diamond-shaped sprint marker sized to sit on a timeline bar. White
 * diamond with black outline and small centered label — matches the
 * deck's sprint milestone chips.
 */
function SprintDiamond({ label }: { label: string }) {
  return (
    <span
      aria-hidden={false}
      className="relative flex size-7 items-center justify-center"
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-white"
        style={{
          transform: 'rotate(45deg)',
          boxShadow: 'inset 0 0 0 1px #1a1a1a',
        }}
      />
      <span className="relative font-sans text-[9px] font-semibold tracking-[0.04em] text-[#1a1a1a]">
        {label}
      </span>
    </span>
  )
}

// ─────────────────── Slide 1 summary ───────────────────

/**
 * Slide 1 — "Scientific Innovation Through Intelligent Execution".
 *
 * Composes the deck's one-page summary beneath the display title:
 *   • 4 workstream icon cards in a 4-col grid (full width)
 *   • 2-col split below: 5 value-prop bullets (left) + itemized
 *     Initial Phase Fees table (right, rose tint)
 *
 * This is the "at-a-glance" deck slide — separate from the deeper
 * differentiator bento and full workstream timeline further down.
 */
function Slide1SummaryRenderer({ block }: { block: Slide1SummaryBlock }) {
  return (
    <BlockHost block={block} className="mt-24">
      <motion.div
        variants={STAGGER_PARENT}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        className="flex flex-col gap-10"
      >
        {/* 4 workstream icon cards — always full row once container is
            wide enough for icons + label to fit comfortably. */}
        <motion.div
          variants={FADE_UP}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 @sm:grid-cols-2 @2xl:grid-cols-4"
        >
          {block.workstreams.map((ws) => {
            const overrideIcon = ws.iconName
              ? findIconByName(ws.iconName)?.Icon
              : undefined
            const Icon = overrideIcon ?? ICON_MAP[ws.iconKey]
            const iconColor = ws.iconColor ?? '#d31710'
            const iconBg = ws.iconBg ?? '#ffffff'
            return (
              <div
                key={ws.id}
                className="flex items-start gap-4 bg-white p-6"
              >
                <span
                  aria-hidden
                  data-icon-host="slide-1-summary"
                  data-icon-workstream-id={ws.id}
                  className="flex size-12 shrink-0 items-center justify-center rounded-md border border-foreground/10"
                  style={{ color: iconColor, backgroundColor: iconBg }}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h4 className="font-sans text-[14px] font-semibold leading-[1.3] text-foreground">
                  {ws.label}
                </h4>
              </div>
            )
          })}
        </motion.div>

        {/* Two-column split — value props (left) + fee table (right).
            Flips to two columns at @sm container width so the deck's
            side-by-side composition holds even in the editor preview.
            Note: Tailwind v4 arbitrary values use `_` (not `,`) as the
            space separator inside `[]`, so `[1.2fr_1fr]` is required for
            the two-column split to actually apply. */}
        <div className="grid grid-cols-1 gap-8 @sm:grid-cols-[1.2fr_1fr] @sm:gap-10">
          {/* Value props — red square bullets */}
          <motion.ul variants={FADE_UP} className="flex flex-col gap-4 pt-2">
            {block.valueProps.map((prop, i) => (
              <li
                key={i}
                className="flex items-start gap-3 font-sans text-[14px] leading-[1.5] text-foreground"
              >
                <span
                  aria-hidden
                  className="mt-1.5 size-1.5 shrink-0"
                  style={{ backgroundColor: '#1a1a1a' }}
                />
                <span>{prop}</span>
              </li>
            ))}
          </motion.ul>

          {/* Fee table — rose tint background matching deck */}
          <motion.div
            variants={FADE_UP}
            className="rounded-2xl p-8"
            style={{ backgroundColor: '#fbf2f0' }}
          >
            <h4
              className="font-sans text-[14px] font-semibold tracking-[0.01em]"
              style={{ color: '#d31710' }}
            >
              {block.feeHeading}
            </h4>
            <div className="mt-4 flex flex-col">
              {block.feeRows.map((row, i) => {
                const isTotal = row.tone === 'total'
                const isDiscount = row.tone === 'discount'
                return (
                  <div
                    key={i}
                    className={`flex items-baseline justify-between gap-4 py-2.5 ${
                      isTotal
                        ? 'mt-1 border-t border-foreground/20 pt-3'
                        : 'border-t border-foreground/5 first:border-t-0'
                    }`}
                  >
                    <span
                      className={`font-sans text-[13px] leading-[1.4] ${
                        isTotal ? 'font-semibold text-foreground' : 'text-foreground/80'
                      }`}
                    >
                      {row.label}
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap font-sans text-[13px] tabular-nums ${
                        isTotal
                          ? 'font-semibold text-foreground'
                          : isDiscount
                            ? 'text-foreground/60'
                            : 'text-foreground'
                      }`}
                    >
                      {row.amount}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </BlockHost>
  )
}
