'use client'

import * as React from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronDown,
  ChevronRight,
  Copy,
  GripVertical,
  Lock,
  Plus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useProject } from '@/context/project-context'
import type { SiteSection } from '@/types'
import type { ExecSummaryBlock } from '@/templates/catalyze-journey/sections/executive-summary.schema'
import { AddBlockMenu } from './add-block-menu'

/**
 * Left-rail inspector for the editor. Shows every section in the
 * current site with drag-to-reorder, duplicate, delete, and a
 * nested list of blocks for schema-backed sections. Hardcoded
 * sections appear with a lock icon until they're converted to
 * schema.
 *
 * Clicking a section or block scrolls the preview to it (via a
 * `scrollIntoView` on the matching `data-section-id` /
 * `data-block-id` element in the preview root) so the sidebar and
 * canvas stay in sync.
 */
export function SectionsSidebar() {
  const { project, dispatch } = useProject()
  const sections = React.useMemo(
    () => project.siteContent?.sections ?? [],
    [project.siteContent],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const onDragEnd = React.useCallback(
    (e: DragEndEvent) => {
      if (!e.over || e.active.id === e.over.id) return
      const fromIndex = sections.findIndex((s) => s.id === e.active.id)
      const toIndex = sections.findIndex((s) => s.id === e.over!.id)
      if (fromIndex < 0 || toIndex < 0) return
      // Don't allow reordering into a locked section's slot? For now
      // we permit it — the UI clearly marks which ones are editable
      // and users can just drag back.
      dispatch({
        type: 'REORDER_SECTIONS',
        payload: { fromIndex, toIndex },
      })
    },
    [sections, dispatch],
  )

  if (!project.siteContent) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
        Generate a proposal to see its sections here.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Structure
          </p>
          <p className="text-sm font-medium text-foreground">
            {sections.length} section{sections.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1">
              {sections.map((section) => (
                <SortableSection key={section.id} section={section} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="border-t border-border p-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 rounded-md"
          disabled
          title="Add section — coming soon"
        >
          <Plus className="size-4" />
          Add section
          <span className="ml-auto text-[10px] text-muted-foreground">
            soon
          </span>
        </Button>
      </div>
    </div>
  )
}

/**
 * A single sortable section row + nested blocks (when schema-backed).
 */
function SortableSection({ section }: { section: SiteSection }) {
  const { dispatch } = useProject()
  const [open, setOpen] = React.useState(true)
  const editable = Array.isArray(section.blocks) && section.blocks.length > 0

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const scrollToSection = () => {
    if (typeof document === 'undefined') return
    const el = document.querySelector(
      `[data-section-id="${section.id}"], #${section.id}`,
    ) as HTMLElement | null
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-transparent hover:border-border"
    >
      <div className="flex items-center gap-1 px-1 py-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="inline-flex size-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted"
        >
          <GripVertical className="size-3.5" />
        </button>

        {editable ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Collapse' : 'Expand'}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
          >
            {open ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </button>
        ) : (
          <span
            className="inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground/60"
            title="Read-only — schema not yet defined"
          >
            <Lock className="size-3" />
          </span>
        )}

        <button
          type="button"
          onClick={scrollToSection}
          className="min-w-0 flex-1 truncate rounded px-1 text-left text-sm font-medium text-foreground hover:text-[#C52B09]"
        >
          {section.label}
        </button>

        {editable && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                dispatch({ type: 'DUPLICATE_SECTION', payload: { id: section.id } })
              }
              aria-label="Duplicate section"
              className="text-muted-foreground opacity-0 transition group-hover:opacity-100"
            >
              <Copy className="size-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                if (!window.confirm(`Delete section "${section.label}"?`)) return
                dispatch({ type: 'DELETE_SECTION', payload: { id: section.id } })
              }}
              aria-label="Delete section"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </Button>
          </>
        )}
      </div>

      {editable && open && (
        <BlocksList
          sectionId={section.id}
          blocks={section.blocks as ExecSummaryBlock[]}
        />
      )}
    </div>
  )
}

function BlocksList({
  sectionId,
  blocks,
}: {
  sectionId: string
  blocks: ExecSummaryBlock[]
}) {
  const { dispatch } = useProject()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return
    const fromIndex = blocks.findIndex((b) => b.id === e.active.id)
    const toIndex = blocks.findIndex((b) => b.id === e.over!.id)
    if (fromIndex < 0 || toIndex < 0) return
    dispatch({
      type: 'REORDER_BLOCKS',
      payload: { sectionId, fromIndex, toIndex },
    })
  }

  return (
    <div className="ml-8 mr-1 mb-1 flex flex-col gap-0.5 border-l border-border pl-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, i) => (
            <SortableBlockRow
              key={block.id}
              sectionId={sectionId}
              block={block}
              index={i}
            />
          ))}
        </SortableContext>
      </DndContext>

      <AddBlockMenu
        sectionId={sectionId}
        atIndex={blocks.length}
        trigger={
          <button
            type="button"
            className="mt-1 flex items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Plus className="size-3" />
            Add block
          </button>
        }
      />
    </div>
  )
}

function SortableBlockRow({
  sectionId,
  block,
}: {
  sectionId: string
  block: ExecSummaryBlock
  index: number
}) {
  const { dispatch } = useProject()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const label = blockLabel(block)

  const scrollToBlock = () => {
    if (typeof document === 'undefined') return
    const el = document.querySelector(
      `[data-block-id="${block.id}"]`,
    ) as HTMLElement | null
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/row flex items-center gap-1 rounded-md px-1 py-1 text-xs hover:bg-muted/50',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="inline-flex size-5 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted"
      >
        <GripVertical className="size-3" />
      </button>
      <button
        type="button"
        onClick={scrollToBlock}
        className="min-w-0 flex-1 truncate rounded px-1 text-left text-[12px] text-foreground/80 hover:text-[#C52B09]"
        title={label}
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {block.type}
        </span>
        <span className="ml-2">{label}</span>
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() =>
          dispatch({
            type: 'DUPLICATE_BLOCK',
            payload: { sectionId, blockId: block.id },
          })
        }
        aria-label="Duplicate block"
        className="text-muted-foreground opacity-0 transition group-hover/row:opacity-100"
      >
        <Copy className="size-3" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() =>
          dispatch({
            type: 'DELETE_BLOCK',
            payload: { sectionId, blockId: block.id },
          })
        }
        aria-label="Delete block"
        className="text-muted-foreground opacity-0 transition group-hover/row:opacity-100 hover:text-destructive"
      >
        <Trash2 className="size-3" />
      </Button>
    </div>
  )
}

function blockLabel(block: ExecSummaryBlock): string {
  switch (block.type) {
    case 'eyebrow':
    case 'display-title':
    case 'lede':
    case 'text':
      return truncate(block.text, 38)
    case 'spacer':
      return `${block.height}px`
    case 'image':
      return block.alt || '(no alt)'
    case 'leadership-grid':
      return `${block.leaders.length} leaders`
    case 'differentiator-bento':
      return `${block.items.length} tiles`
    case 'fee-headline':
      return block.value
    case 'workstream-timeline':
      return `${block.bars.length} workstreams`
    case 'slide-1-summary':
      return `${block.workstreams.length} workstreams`
    default:
      return ''
  }
}

function truncate(s: string, n: number): string {
  const t = s.trim().replace(/\s+/g, ' ')
  return t.length > n ? `${t.slice(0, n)}…` : t
}
