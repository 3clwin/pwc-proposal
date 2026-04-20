'use client'

import * as React from 'react'
import { ImagePlus, Plus, RefreshCw } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useProject } from '@/context/project-context'
import { makeId } from '@/lib/blocks'
import {
  ADDABLE_BLOCK_TYPES,
  createBlock,
  type ExecSummaryBlock,
} from '@/templates/catalyze-journey/sections/executive-summary.schema'
import { AssetUploadDialog } from './asset-upload-dialog'

interface BlockOverlayProps {
  active: boolean
  contentRef: React.RefObject<HTMLElement | null>
}

/**
 * A schema-aware overlay that complements the generic DOM overlay.
 * Two responsibilities:
 *
 *  1. Between every adjacent pair of sibling `[data-block-id]` blocks,
 *     render a thin orange "+ Add block" line that appears on hover
 *     and opens the Add Block picker anchored at that insertion point.
 *
 *  2. When the user selects an image block, the generic overlay's
 *     selection rect gets an in-situ "Replace image" button that
 *     opens the asset upload dialog, routed through
 *     `UPDATE_BLOCK` so changes persist.
 *
 * This file intentionally does not duplicate the hover/selection
 * handling that design-mode-overlay.tsx already does; it only adds
 * the schema-aware affordances.
 */
export function BlockOverlay({ active, contentRef }: BlockOverlayProps) {
  const { project, dispatch } = useProject()
  const [insertSlots, setInsertSlots] = React.useState<InsertSlot[]>([])
  const [imageSlots, setImageSlots] = React.useState<ImageSlot[]>([])
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  const recompute = React.useCallback(() => {
    if (!rootRef.current || !contentRef.current) {
      setInsertSlots([])
      setImageSlots([])
      return
    }
    const origin = rootRef.current.getBoundingClientRect()
    const { inserts, images } = scanBlockSlots(contentRef.current, origin, project.siteContent?.sections ?? [])
    setInsertSlots(inserts)
    setImageSlots(images)
  }, [contentRef, project.siteContent])

  React.useEffect(() => {
    if (!active) return
    recompute()
    const ro = new ResizeObserver(recompute)
    if (contentRef.current) ro.observe(contentRef.current)
    window.addEventListener('resize', recompute)
    // Recompute on scroll of the preview viewport. The content is
    // inside a radix ScrollArea viewport; we find it by walking up.
    const scroller = findScrollParent(contentRef.current)
    scroller?.addEventListener('scroll', recompute, { passive: true })
    // Poll once after a beat to catch motion entrance animations.
    const t = window.setTimeout(recompute, 400)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
      scroller?.removeEventListener('scroll', recompute)
      window.clearTimeout(t)
    }
  }, [active, contentRef, recompute])

  if (!active) return null

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden
    >
      {insertSlots.map((slot, i) => (
        <InsertSlotAffordance key={`${slot.sectionId}-${i}-${slot.atIndex}`} slot={slot} />
      ))}
      {imageSlots.map((slot) => (
        <ImageReplaceAffordance
          key={slot.blockId}
          slot={slot}
          onReplace={(src, alt) => {
            dispatch({
              type: 'UPDATE_BLOCK',
              payload: {
                sectionId: slot.sectionId,
                blockId: slot.blockId,
                block: { ...slot.block, src, alt },
              },
            })
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────── Scanner ───────────────────

interface InsertSlot {
  sectionId: string
  atIndex: number
  top: number
  left: number
  width: number
}

interface ImageSlot {
  sectionId: string
  blockId: string
  block: Extract<ExecSummaryBlock, { type: 'image' }>
  top: number
  left: number
  width: number
  height: number
}

function scanBlockSlots(
  root: HTMLElement,
  origin: DOMRect,
  sections: { id: string; blocks?: unknown[] }[],
): { inserts: InsertSlot[]; images: ImageSlot[] } {
  const inserts: InsertSlot[] = []
  const images: ImageSlot[] = []

  for (const section of sections) {
    if (!section.blocks || section.blocks.length === 0) continue
    // Find the rendered section element by data-section-id.
    const sectionEl = root.querySelector(
      `[data-section-id="${section.id}"]`,
    ) as HTMLElement | null
    if (!sectionEl) continue

    // Collect all rendered block hosts inside this section (in DOM
    // order). We trust `data-block-id` to match what the schema says.
    const hostEls = Array.from(
      sectionEl.querySelectorAll<HTMLElement>('[data-block-id]'),
    ).filter((el) => {
      // Only top-level block hosts — skip nested hosts (a block can
      // contain another data-block-id if we ever render recursively).
      // Closest() returns el itself; we want nearest *ancestor* host.
      const parent = el.parentElement?.closest('[data-block-id]')
      return parent === null
    })

    if (hostEls.length === 0) continue

    // Insertion slots: one before each block (at top of first block),
    // and one after the last block.
    hostEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      inserts.push({
        sectionId: section.id,
        atIndex: i,
        top: rect.top - origin.top - 8,
        left: rect.left - origin.left,
        width: rect.width,
      })
    })
    const last = hostEls[hostEls.length - 1].getBoundingClientRect()
    inserts.push({
      sectionId: section.id,
      atIndex: hostEls.length,
      top: last.bottom - origin.top + 0,
      left: last.left - origin.left,
      width: last.width,
    })

    // Image slots: for each image block, record its rendered rect.
    const blocks = section.blocks as ExecSummaryBlock[]
    for (const block of blocks) {
      if (block.type !== 'image') continue
      const host = sectionEl.querySelector(
        `[data-block-id="${block.id}"]`,
      ) as HTMLElement | null
      if (!host) continue
      const rect = host.getBoundingClientRect()
      images.push({
        sectionId: section.id,
        blockId: block.id,
        block,
        top: rect.top - origin.top,
        left: rect.left - origin.left,
        width: rect.width,
        height: rect.height,
      })
    }
  }

  return { inserts, images }
}

function findScrollParent(el: Element | null): HTMLElement | null {
  let node: HTMLElement | null = el?.parentElement ?? null
  while (node) {
    const style = window.getComputedStyle(node)
    if (
      style.overflowY === 'auto' ||
      style.overflowY === 'scroll' ||
      style.overflowY === 'overlay'
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}

// ─────────────────── +Add block affordance ───────────────────

function InsertSlotAffordance({ slot }: { slot: InsertSlot }) {
  return (
    <div
      className="group pointer-events-auto absolute flex h-4 items-center justify-center"
      style={{ top: slot.top, left: slot.left, width: slot.width }}
    >
      {/* Hairline that fills the gap between blocks */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#C52B09] opacity-0 transition group-hover:opacity-60"
      />
      <InsertButton sectionId={slot.sectionId} atIndex={slot.atIndex} />
    </div>
  )
}

function InsertButton({
  sectionId,
  atIndex,
}: {
  sectionId: string
  atIndex: number
}) {
  const { dispatch } = useProject()
  const [open, setOpen] = React.useState(false)
  const [assetOpen, setAssetOpen] = React.useState(false)

  const insert = (block: ExecSummaryBlock) => {
    dispatch({
      type: 'INSERT_BLOCK',
      payload: { sectionId, index: atIndex, block },
    })
    setOpen(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative z-10 inline-flex size-5 items-center justify-center rounded-full bg-[#C52B09] text-white opacity-0 shadow-sm transition group-hover:opacity-100 hover:scale-110"
            aria-label="Add block here"
          >
            <Plus className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={6}
          className="w-[280px] gap-1 rounded-xl p-1.5"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Add block
          </p>
          <div className="flex flex-col">
            {ADDABLE_BLOCK_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => {
                  if (t.type === 'image') {
                    setOpen(false)
                    setAssetOpen(true)
                    return
                  }
                  insert(createBlock(t.type, makeId('blk')))
                }}
                className="flex flex-col gap-0.5 rounded-md px-2 py-1.5 text-left hover:bg-muted"
              >
                <span className="text-sm font-medium text-foreground">{t.label}</span>
                <span className="text-[11px] text-muted-foreground">{t.description}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <AssetUploadDialog
        open={assetOpen}
        onOpenChange={setAssetOpen}
        onUploaded={(src, alt) => {
          insert({
            id: makeId('blk'),
            type: 'image',
            src,
            alt,
            aspect: '16/9',
          })
        }}
      />
    </>
  )
}

// ─────────────────── Image replace affordance ───────────────────

function ImageReplaceAffordance({
  slot,
  onReplace,
}: {
  slot: ImageSlot
  onReplace: (src: string, alt: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const hasImage = Boolean(slot.block.src)

  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{
          top: slot.top,
          left: slot.left,
          width: slot.width,
          height: slot.height,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a]/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm transition hover:bg-[#1a1a1a]"
          aria-label={hasImage ? 'Replace image' : 'Upload image'}
        >
          {hasImage ? (
            <RefreshCw className="size-3" />
          ) : (
            <ImagePlus className="size-3" />
          )}
          {hasImage ? 'Replace' : 'Upload'}
        </button>
      </div>

      <AssetUploadDialog
        open={open}
        onOpenChange={setOpen}
        initialAlt={slot.block.alt}
        onUploaded={(src, alt) => onReplace(src, alt)}
      />
    </>
  )
}
