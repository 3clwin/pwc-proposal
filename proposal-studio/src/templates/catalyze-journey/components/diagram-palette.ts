/**
 * Diagram-only palette tokens for the Catalyze360 RFQ template.
 *
 * Premium, calm, single-accent design language shared across all
 * diagrams in this template. Inspired by the visual discipline of
 * tools like Linear and Stripe Press: greyscale surfaces + hairlines,
 * one red accent that carries semantic weight.
 *
 * Section backgrounds (cool blue / white) are NOT changed here —
 * those still come from the section files. These tokens only style
 * the diagrams that live inside those sections.
 */

export const DIAGRAM_PALETTE = {
  // ── Accent ───────────────────────────────────────────────────────
  // Lilly red. Reserved for the single most important element in
  // each diagram (active state, primary flow, MVP marker). Never
  // used as decoration.
  red: '#d31710',
  redDeep: '#9f180f',
  redSoft: '#fdebe9', // very pale red wash for primary-marked tiles

  // ── Surfaces ─────────────────────────────────────────────────────
  white: '#ffffff',
  surface: '#fafafa', // diagram canvas background when needed
  surfaceMuted: '#f4f5f7', // secondary tiles
  surfaceHover: '#eef0f3',

  // ── Ink (text + iconography) ─────────────────────────────────────
  ink: '#0f172a',
  inkSoft: '#475569',
  inkMuted: '#94a3b8',
  inkFaint: '#cbd5e1',

  // ── Hairlines ────────────────────────────────────────────────────
  hairline: '#e6e8eb', // 1px borders / connector lines
  hairlineSoft: '#f0f1f3', // dividers inside cards
  hairlineStrong: '#d1d5db', // primary card outlines

  // ── Section background echo (warm rose tint) — used sparingly
  //    inside diagrams when they need to blend with the surrounding
  //    section fill rather than sit as an island.
  sectionEcho: '#fbf2f0',
  /** @deprecated alias kept for any external imports — same value as sectionEcho. */
  coolBlue: '#fbf2f0',

  // ── Legacy (keep for back-compat with code that already reads it)
  // These mirror the new tokens to avoid breaking existing imports.
  pink: '#fdebe9',
  pinkLight: '#fdf5f4',
  pinkBorder: '#f5d6d2',
  greyChip: '#e6e8eb',
  greyChipSoft: '#f0f1f3',
  redDeeper: '#7a120b',
} as const

/**
 * Tier tokens for MVP vs Post-MVP cells (slides 26 + 27). MVP gets a
 * subtle red accent so it earns attention; Post-MVP is neutral.
 */
export const TIER_TOKENS = {
  mvp: {
    bg: DIAGRAM_PALETTE.redSoft,
    border: '#f5d6d2',
    text: DIAGRAM_PALETTE.redDeep,
  },
  'post-mvp': {
    bg: DIAGRAM_PALETTE.white,
    border: DIAGRAM_PALETTE.hairline,
    text: DIAGRAM_PALETTE.inkSoft,
  },
} as const

/**
 * Column tone for slide-13/14 banners. All three tones are now
 * monochrome with the accent reserved for primary; secondary +
 * tertiary distinguish via weight, not color.
 */
export const COLUMN_TOKENS = {
  red: { bg: DIAGRAM_PALETTE.ink, text: DIAGRAM_PALETTE.white },
  pink: { bg: DIAGRAM_PALETTE.surfaceMuted, text: DIAGRAM_PALETTE.ink },
  grey: { bg: DIAGRAM_PALETTE.surfaceHover, text: DIAGRAM_PALETTE.inkSoft },
} as const

export type ColumnTone = keyof typeof COLUMN_TOKENS
export type TierTone = keyof typeof TIER_TOKENS
