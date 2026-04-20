'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Database, Layers, User } from 'lucide-react'
import { VIEWPORT_ONCE } from '../../shared/motion'
import { IconServerRack } from './deck-icons'
import { DIAGRAM_PALETTE, TIER_TOKENS } from './diagram-palette'
import { FitText } from './fit-text'

/**
 * Slide 27 — Future-State Architecture (Phased Approach).
 *
 * Premium rebuild. The deck packs ~50 elements onto one page; the
 * earlier port collapsed all of that into pink Excel cells with no
 * hierarchy. New approach:
 *
 *   • Layer the architecture top-down. Each layer has its own
 *     mono label and breathing room.
 *   • Drop the rotated ESB sideways spine — replace with a thin
 *     horizontal "integration" band labeled in the row.
 *   • One accent only: MVP capability tiles get a subtle red wash.
 *     Post-MVP tiles are plain white. Background stays surface-grey.
 *   • Right-rail "Key Highlights" becomes a clean bottom band of
 *     four equal cards with hairline dividers.
 *
 * The whole thing reads like an architecture page, not a deck slide.
 */

interface CrmCapability {
  label: string
  tier: 'mvp' | 'post-mvp'
}

interface FutureStateArchitectureDiagramProps {
  sourceSystems: string[]
  esbLabel: string
  internalUsers: string[]
  internalUserBarLabel: string
  externalUserLabel: string
  externalUserBarLabel: string
  crmCoreLabel: string
  crmCoreCapabilities: CrmCapability[]
  dataModelsLabel: string
  dataModelEntities: string[]
  dataModels: string[]
  coreCapabilitiesLabel: string
  coreCapabilities: string[]
  keyHighlightsLabel: string
  highlights: { title: string; body: string }[]
  legend: { mvpLabel: string; postMvpLabel: string }
}

export function FutureStateArchitectureDiagram({
  sourceSystems,
  esbLabel,
  internalUsers,
  internalUserBarLabel,
  externalUserLabel,
  externalUserBarLabel,
  crmCoreLabel,
  crmCoreCapabilities,
  dataModelsLabel,
  dataModelEntities,
  dataModels,
  coreCapabilitiesLabel,
  coreCapabilities,
  keyHighlightsLabel,
  highlights,
  legend,
}: FutureStateArchitectureDiagramProps) {
  const reduce = useReducedMotion()

  return (
    <figure
      role="img"
      aria-label="Future-state Salesforce architecture: layered stack from enterprise source systems through ESB middleware, CRM, foundational data models, and Salesforce core capabilities. Right-side highlights summarize the design intent."
      className="relative overflow-hidden rounded-4xl border border-foreground/5 bg-gradient-to-br from-white via-foreground/[0.01] to-foreground/[0.03] p-8 shadow-2xl shadow-foreground/10 ring-1 ring-foreground/5 sm:p-14"
    >
      {/* Decorative noise/texture overlay for premium editorial feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      />
      
      <div className="relative z-10 flex flex-col gap-10">
        {/* ─── Users layer (top) ─── */}
      <Layer label="Users">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[3fr_1fr]">
          <UserCluster
            users={internalUsers}
            barLabel={internalUserBarLabel}
            reduce={reduce}
          />
          <UserCluster
            users={[externalUserLabel]}
            barLabel={externalUserBarLabel}
            reduce={reduce}
          />
        </div>
      </Layer>

      {/* ─── CRM core layer ─── */}
      <Layer label={`Salesforce CRM · ${crmCoreLabel}`}>
        <div className="rounded-xl bg-white p-5" style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}` }}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {crmCoreCapabilities.map((cap, i) => {
              const tokens = TIER_TOKENS[cap.tier]
              return (
                <motion.div
                  key={cap.label}
                  initial={reduce ? undefined : { opacity: 0, y: 6 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.3, delay: 0.02 * i }}
                  className="rounded-md px-2.5 py-2"
                  style={{
                    backgroundColor: tokens.bg,
                    boxShadow: `inset 0 0 0 1px ${tokens.border}`,
                  }}
                >
                  <FitText
                    text={cap.label}
                    fontWeight={500}
                    maxFontPx={11}
                    minFontPx={9}
                    maxLines={2}
                    lineHeight={1.25}
                    className="font-sans text-center"
                    style={{ color: tokens.text }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </Layer>

      {/* ─── Data models layer ─── */}
      <Layer label={dataModelsLabel}>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {dataModelEntities.map((entity) => (
              <Tile key={entity} label={entity} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {dataModels.map((m) => (
              <Tile key={m} label={m} />
            ))}
          </div>
        </div>
      </Layer>

      {/* ─── Salesforce platform capabilities ─── */}
      <Layer label={coreCapabilitiesLabel}>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {coreCapabilities.map((c) => (
            <Tile key={c} label={c} />
          ))}
        </div>
      </Layer>

      {/* ─── ESB Middleware layer ─── */}
      <Layer label="Integration">
        <div
          className="flex items-center gap-3 rounded-md px-4 py-3"
          style={{
            backgroundColor: DIAGRAM_PALETTE.ink,
            color: DIAGRAM_PALETTE.white,
          }}
        >
          <span
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: DIAGRAM_PALETTE.inkFaint }}
          >
            ESB / ETL
          </span>
          <span className="font-sans text-[12px] leading-[1.4]">{esbLabel}</span>
        </div>
      </Layer>

      {/* ─── Source systems layer (bottom) ─── */}
      <Layer label="Enterprise Source Systems">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {sourceSystems.map((label) => (
            <div
              key={label}
              className="flex items-start gap-2 rounded-md bg-white p-3"
              style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}` }}
            >
              <IconServerRack
                size={14}
                style={{ color: DIAGRAM_PALETTE.inkSoft, flexShrink: 0, marginTop: 2 }}
              />
              <FitText
                text={label}
                fontWeight={500}
                maxFontPx={11}
                minFontPx={9}
                maxLines={3}
                lineHeight={1.3}
                className="font-sans"
                style={{ color: DIAGRAM_PALETTE.ink }}
              />
            </div>
          ))}
        </div>
      </Layer>

      {/* ─── Key Highlights footer ─── */}
      <div className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: DIAGRAM_PALETTE.hairline }}>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: DIAGRAM_PALETTE.red }}
        >
          {keyHighlightsLabel}
        </span>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl md:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: DIAGRAM_PALETTE.hairline }}>
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={reduce ? undefined : { opacity: 0, y: 6 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="flex flex-col gap-2 bg-white p-5"
            >
              <h5
                className="font-sans text-[13px] font-semibold"
                style={{ color: DIAGRAM_PALETTE.ink }}
              >
                {h.title}
              </h5>
              <p
                className="font-sans text-[12px] leading-[1.5]"
                style={{ color: DIAGRAM_PALETTE.inkSoft }}
              >
                {h.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      </div>

      {/* ─── Legend ─── */}
      <figcaption className="relative z-10 mt-8 flex items-center justify-end gap-5">
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: DIAGRAM_PALETTE.inkMuted }}
        >
          <span
            aria-hidden
            className="block size-2.5 rounded-sm"
            style={{
              backgroundColor: TIER_TOKENS.mvp.bg,
              boxShadow: `inset 0 0 0 1px ${TIER_TOKENS.mvp.border}`,
            }}
          />
          {legend.mvpLabel}
        </span>
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: DIAGRAM_PALETTE.inkMuted }}
        >
          <span
            aria-hidden
            className="block size-2.5 rounded-sm"
            style={{
              backgroundColor: TIER_TOKENS['post-mvp'].bg,
              boxShadow: `inset 0 0 0 1px ${TIER_TOKENS['post-mvp'].border}`,
            }}
          />
          {legend.postMvpLabel}
        </span>
      </figcaption>
    </figure>
  )
}

// ─────────────────── helpers ───────────────────

function Layer({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <span
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: DIAGRAM_PALETTE.inkSoft }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}

function Tile({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-center shadow-sm transition-transform hover:-translate-y-0.5"
      style={{ boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}, 0 2px 4px rgba(0,0,0,0.02)` }}
    >
      {icon}
      <FitText
        text={label}
        fontWeight={500}
        maxFontPx={11}
        minFontPx={9.5}
        maxLines={2}
        lineHeight={1.25}
        className="font-sans"
        style={{ color: DIAGRAM_PALETTE.ink }}
      />
    </div>
  )
}

function UserCluster({
  users,
  barLabel,
  reduce,
}: {
  users: string[]
  barLabel: string
  reduce: boolean | null
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {users.map((u, i) => (
          <motion.div
            key={u}
            initial={reduce ? undefined : { opacity: 0, y: -4 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.4, delay: 0.05 + 0.03 * i }}
            className="flex h-[32px] items-center gap-1.5 rounded-full bg-white px-3 shadow-sm transition-transform hover:-translate-y-0.5"
            style={{
              boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}, 0 2px 4px rgba(0,0,0,0.02)`,
            }}
          >
            <User size={12} style={{ color: DIAGRAM_PALETTE.inkMuted }} />
            <span
              className="font-sans text-[10.5px] font-medium tracking-wide"
              style={{ color: DIAGRAM_PALETTE.ink }}
            >
              {u}
            </span>
          </motion.div>
        ))}
      </div>
      <div
        className="flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2 text-center font-sans text-[11.5px] font-semibold tracking-wide shadow-sm"
        style={{
          backgroundColor: DIAGRAM_PALETTE.white,
          color: DIAGRAM_PALETTE.ink,
          boxShadow: `inset 0 0 0 1px ${DIAGRAM_PALETTE.hairline}, 0 2px 4px rgba(0,0,0,0.02)`,
        }}
      >
        {barLabel}
      </div>
    </div>
  )
}
