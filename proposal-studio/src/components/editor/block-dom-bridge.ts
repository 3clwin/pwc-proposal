/**
 * Bridges between DOM nodes in the preview and schema blocks in
 * project state. The design-mode overlay operates on DOM; the editor
 * state operates on schema. Every schema-rendered block wraps its
 * output in an element tagged with `data-block-id` (and optionally
 * `data-block-field` on the specific text slot) — these helpers walk
 * those tags back to the schema entry so the overlay can commit
 * persistent edits.
 */

import type { ExecSummaryBlock } from '@/templates/catalyze-journey/sections/executive-summary.schema'
import type { SiteSection } from '@/types'

export interface BlockLocation {
  section: SiteSection
  blockIndex: number
  block: ExecSummaryBlock
  /** The `data-block-field` attr on the selected element, if any. */
  field: string | null
}

/**
 * Walk up from `el` to find the nearest ancestor with `data-block-id`.
 * Returns both the block element and the selected element's
 * `data-block-field` (for fine-grained commits like "just the
 * `eyebrow` field").
 */
export function findBlockHost(el: Element | null): {
  host: HTMLElement
  field: string | null
} | null {
  let node: Element | null = el
  let field: string | null = null
  while (node) {
    if (node instanceof HTMLElement) {
      if (!field && node.dataset.blockField) {
        field = node.dataset.blockField
      }
      if (node.dataset.blockId) {
        return { host: node, field }
      }
    }
    node = node.parentElement
  }
  return null
}

/** Resolve a DOM target to its owning block in the given site content. */
export function resolveBlockFromElement(
  el: Element | null,
  sections: SiteSection[],
): BlockLocation | null {
  const found = findBlockHost(el)
  if (!found) return null
  const blockId = found.host.dataset.blockId!
  for (const section of sections) {
    const blocks = (section.blocks ?? []) as ExecSummaryBlock[]
    const idx = blocks.findIndex((b) => b.id === blockId)
    if (idx >= 0) {
      return {
        section,
        blockIndex: idx,
        block: blocks[idx],
        field: found.field,
      }
    }
  }
  return null
}

/**
 * Commit a new text value onto a block. For most blocks we write to
 * `.text`; for blocks with named fields (leadership grid eyebrow,
 * bento heading, etc.) we write to the field matching
 * `data-block-field`. Returns a new block; does not mutate.
 */
export function writeTextToBlock(
  block: ExecSummaryBlock,
  field: string | null,
  value: string,
): ExecSummaryBlock {
  switch (block.type) {
    case 'eyebrow':
    case 'display-title':
    case 'lede':
    case 'text':
      return { ...block, text: value }
    case 'leadership-grid':
      if (field === 'eyebrow') return { ...block, eyebrow: value }
      return block
    case 'differentiator-bento':
      if (field === 'heading') return { ...block, heading: value }
      if (field === 'countLabel') return { ...block, countLabel: value }
      return block
    case 'workstream-timeline':
      if (field === 'eyebrow') return { ...block, eyebrow: value }
      if (field === 'rangeLabel') return { ...block, rangeLabel: value }
      return block
    case 'image':
      if (field === 'caption') return { ...block, caption: value }
      if (field === 'alt') return { ...block, alt: value }
      return block
    case 'slide-1-summary':
      return block
    case 'fee-headline':
    case 'slide-1-summary':
    case 'spacer':
      return block
  }
  return block
}

/** Commit a new image `src` + `alt` onto an image block. */
export function writeImageToBlock(
  block: ExecSummaryBlock,
  src: string,
  alt: string,
): ExecSummaryBlock {
  if (block.type !== 'image') return block
  return { ...block, src, alt }
}

export interface IconPatch {
  /** PascalCase lucide icon name (e.g. "FlaskConical"). Optional. */
  iconName?: string
  /** CSS color for the icon stroke. */
  iconColor?: string
  /** CSS background color for the icon tile. */
  iconBg?: string
}

/**
 * Commit icon overrides to a specific sub-item of a block. Supports:
 *   • `slide-1-summary`       → `workstreams[workstreamId]`
 *   • `workstream-timeline`   → `bars[barId]`
 *
 * Returns a new block; does not mutate. If the target id isn't found
 * in the block's sub-items, the original block is returned
 * unchanged (no-op).
 */
export function writeIconToBlock(
  block: ExecSummaryBlock,
  target:
    | { host: 'slide-1-summary'; workstreamId: string }
    | { host: 'workstream-timeline'; barId: string },
  patch: IconPatch,
): ExecSummaryBlock {
  if (target.host === 'slide-1-summary' && block.type === 'slide-1-summary') {
    const workstreams = block.workstreams.map((ws) => {
      if (ws.id !== target.workstreamId) return ws
      return {
        ...ws,
        ...(patch.iconName !== undefined ? { iconName: patch.iconName } : {}),
        ...(patch.iconColor !== undefined ? { iconColor: patch.iconColor } : {}),
        ...(patch.iconBg !== undefined ? { iconBg: patch.iconBg } : {}),
      }
    })
    return { ...block, workstreams }
  }
  if (
    target.host === 'workstream-timeline' &&
    block.type === 'workstream-timeline'
  ) {
    const bars = block.bars.map((bar) => {
      if (bar.id !== target.barId) return bar
      return {
        ...bar,
        ...(patch.iconName !== undefined ? { iconName: patch.iconName } : {}),
        ...(patch.iconColor !== undefined ? { iconColor: patch.iconColor } : {}),
        ...(patch.iconBg !== undefined ? { iconBg: patch.iconBg } : {}),
      }
    })
    return { ...block, bars }
  }
  return block
}
