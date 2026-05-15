'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronsUpDown,
  Image as ImageIcon,
  ImagePlus,
  Italic,
  Pencil,
  Replace,
  Search,
  Trash2,
  Underline,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useProject } from '@/context/project-context'
import { cn } from '@/lib/utils'
import { searchIcons, type IconLibraryEntry } from '@/lib/icons'
import { useLocalFonts } from '@/hooks/use-local-fonts'
import { BrandColorPicker } from './brand-color-picker'
import { EditorTooltip } from './editor-tooltip'
import {
  resolveBlockFromElement,
  writeIconToBlock,
  writeImageToBlock,
  writeTextToBlock,
  type IconPatch,
} from './block-dom-bridge'

/**
 * Cursor-style inline design mode.
 *
 * Sits as a sibling overlay to the preview content and listens for
 * `mouseover` / `mousedown` events on a target root. It walks the DOM
 * to pick a "good" target (real elements, not text nodes or wrapper
 * motion divs), draws a blue outline + tag label for hover, and a
 * solid outline + floating toolbar for selection.
 *
 * Style edits are applied directly to the picked element via inline
 * styles and contentEditable for text. This is intentionally
 * DOM-first so it works across every template section without
 * instrumenting every component.
 */

interface DesignModeOverlayProps {
  active: boolean
  contentRef: React.RefObject<HTMLElement | null>
  inspectorHost: HTMLElement | null
  onExit: () => void
}

type Rect = { top: number; left: number; width: number; height: number }

const SELECTABLE_TAGS = new Set([
  'SECTION',
  'ARTICLE',
  'HEADER',
  'FOOTER',
  'NAV',
  'MAIN',
  'ASIDE',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'SPAN',
  'A',
  'BUTTON',
  'IMG',
  'FIGURE',
  'UL',
  'OL',
  'LI',
  'BLOCKQUOTE',
  'LABEL',
  'INPUT',
  'TEXTAREA',
])

const TEXT_TAGS = new Set([
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'SPAN',
  'A',
  'BLOCKQUOTE',
  'LI',
  'LABEL',
])

/**
 * Walk up the DOM from `start` (usually the event target) to find the
 * most meaningful editable ancestor inside `root`. We skip through
 * pure layout divs (framer-motion wrappers, flex grids with no direct
 * text) and prefer semantic tags. If none of the ancestors are
 * semantic, we just pick the deepest `div` that has non-whitespace
 * text of its own.
 */
function pickTarget(start: Element, root: Element): HTMLElement | null {
  let node: Element | null = start
  let fallback: HTMLElement | null = null

  while (node && node !== root && root.contains(node)) {
    if (node instanceof HTMLElement) {
      const tag = node.tagName
      if (SELECTABLE_TAGS.has(tag)) {
        return node
      }
      if (!fallback) {
        const ownText = Array.from(node.childNodes).some(
          (c) => c.nodeType === Node.TEXT_NODE && (c.textContent ?? '').trim().length > 0,
        )
        if (ownText) fallback = node
      }
    }
    node = node.parentElement
  }

  return fallback
}

function rectOf(el: Element, origin: DOMRect): Rect {
  const r = el.getBoundingClientRect()
  return {
    top: r.top - origin.top,
    left: r.left - origin.left,
    width: r.width,
    height: r.height,
  }
}

/**
 * Convert a CSS color string (rgb/rgba/hex/named) into a normalized
 * 6-char hex (e.g. "#c52b09"). Returns null when the input is empty
 * or fully transparent. Used so the color picker can mark the active
 * swatch based on the currently-computed color of the selection.
 */
function rgbToHex(input: string | null | undefined): string | null {
  if (!input) return null
  const v = input.trim()
  if (!v) return null
  if (v.startsWith('#')) {
    if (v.length === 7) return v.toLowerCase()
    if (v.length === 4) {
      return (
        '#' +
        v
          .slice(1)
          .split('')
          .map((c) => c + c)
          .join('')
          .toLowerCase()
      )
    }
  }
  const match = v.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+))?\s*\)$/i,
  )
  if (match) {
    const [, r, g, b, a] = match
    if (a !== undefined && Number(a) === 0) return null
    const hex = (n: string) => Number(n).toString(16).padStart(2, '0')
    return `#${hex(r)}${hex(g)}${hex(b)}`.toLowerCase()
  }
  return null
}

/**
 * Walk up from `el` to find a container tagged with `data-icon-host`.
 * Returns the host element and the discriminated host-specific id so
 * the overlay can commit icon changes to the right schema sub-item.
 * Returns null if none of the ancestors are icon hosts.
 */
type IconHostTarget =
  | { host: 'slide-1-summary'; workstreamId: string }
  | { host: 'workstream-timeline'; barId: string }

function findIconHost(
  el: Element | null,
): { element: HTMLElement; target: IconHostTarget } | null {
  let node: Element | null = el
  while (node) {
    if (node instanceof HTMLElement) {
      if (node.dataset.iconHost === 'slide-1-summary') {
        const id = node.dataset.iconWorkstreamId
        if (id) {
          return {
            element: node,
            target: { host: 'slide-1-summary', workstreamId: id },
          }
        }
      }
      if (node.dataset.iconHost === 'workstream-timeline') {
        const id = node.dataset.iconBarId
        if (id) {
          return {
            element: node,
            target: { host: 'workstream-timeline', barId: id },
          }
        }
      }
    }
    node = node.parentElement
  }
  return null
}

/**
 * If `el` is (or contains, as a direct "background" layer) an image
 * used as a section backdrop, return that image element. Sections
 * often render their backdrop as an absolutely positioned `<img>`
 * with `pointer-events-none`, which makes it unreachable via normal
 * click events — this helper unearths it so the design-mode overlay
 * can still edit it when the user clicks the surrounding section.
 *
 * Heuristic:
 *   • If the element is itself an <img>, use it.
 *   • Otherwise look for a direct child <img> whose bounding box
 *     covers >= 80% of the element's area. That's enough to catch
 *     full-bleed hero backdrops without misidentifying small inline
 *     photos.
 */
function findBackgroundImage(el: HTMLElement | null): HTMLImageElement | null {
  if (!el) return null
  if (el instanceof HTMLImageElement) return el
  const parentRect = el.getBoundingClientRect()
  const parentArea = parentRect.width * parentRect.height
  if (!parentArea) return null
  const candidates = el.querySelectorAll<HTMLImageElement>(':scope > img')
  for (const img of candidates) {
    const r = img.getBoundingClientRect()
    const area = r.width * r.height
    if (area / parentArea >= 0.8) {
      return img
    }
  }
  return null
}

function describeElement(el: HTMLElement): { role: string; tag: string; preview: string } {
  const tag = el.tagName.toLowerCase()
  // Prefer a semantic role from className (e.g. "DisplayTitle", "Eyebrow")
  // or data attributes when present.
  const dataRole = el.dataset.role || el.dataset.component
  const ariaLabel = el.getAttribute('aria-label')
  const classFirst = (el.className || '')
    .toString()
    .split(/\s+/)
    .find((c) => /^[A-Z]/.test(c))
  const role = dataRole || ariaLabel || classFirst || tag
  const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ')
  const preview = text.length > 36 ? `${text.slice(0, 36)}…` : text
  return { role, tag, preview }
}

export function DesignModeOverlay({
  active,
  contentRef,
  inspectorHost,
  onExit,
}: DesignModeOverlayProps) {
  const { project, dispatch } = useProject()
  const reduceMotion = useReducedMotion()
  const [hoverRect, setHoverRect] = React.useState<Rect | null>(null)
  const [hoverLabel, setHoverLabel] = React.useState<string>('')
  const [hoveredEl, setHoveredEl] = React.useState<HTMLElement | null>(null)
  const [selectedEl, setSelectedEl] = React.useState<HTMLElement | null>(null)
  const [selectedRect, setSelectedRect] = React.useState<Rect | null>(null)
  const [selectedLabel, setSelectedLabel] = React.useState<string>('')
  const [editing, setEditing] = React.useState(false)

  const overlayRef = React.useRef<HTMLDivElement>(null)

  /**
   * Persist an inline text edit to the schema. Resolves the selected
   * DOM element to its owning block and dispatches UPDATE_BLOCK with
   * the new text value. No-op if the selection isn't inside a
   * schema-backed section (so generic inline edits in hardcoded
   * sections still work as ephemeral DOM changes).
   */
  const commitTextToSchema = React.useCallback(
    (el: HTMLElement, value: string) => {
      const sections = project.siteContent?.sections ?? []
      const loc = resolveBlockFromElement(el, sections)
      if (!loc) return
      const nextBlock = writeTextToBlock(loc.block, loc.field, value)
      if (nextBlock === loc.block) return
      dispatch({
        type: 'UPDATE_BLOCK',
        payload: {
          sectionId: loc.section.id,
          blockId: loc.block.id,
          block: nextBlock,
        },
      })
    },
    [project.siteContent, dispatch],
  )

  /**
   * Persist an image replacement to the schema (for schema-backed
   * image blocks). Falls back to setting the DOM `src` attribute when
   * the image isn't inside a schema-backed section, so arbitrary
   * hardcoded template images can still be swapped visually.
   *
   * For Next.js `<Image>` tags we also clear `srcset` so the new `src`
   * isn't ignored in favour of a cached responsive variant from the
   * original URL.
   */
  const commitImageToSchema = React.useCallback(
    (el: HTMLImageElement, src: string, alt: string) => {
      el.src = src
      if (src) el.removeAttribute('srcset')
      if (alt) el.alt = alt
      const sections = project.siteContent?.sections ?? []
      const loc = resolveBlockFromElement(el, sections)
      if (!loc) return
      const nextBlock = writeImageToBlock(loc.block, src, alt)
      if (nextBlock === loc.block) return
      dispatch({
        type: 'UPDATE_BLOCK',
        payload: {
          sectionId: loc.section.id,
          blockId: loc.block.id,
          block: nextBlock,
        },
      })
    },
    [project.siteContent, dispatch],
  )

  /**
   * Persist an icon replacement (name, stroke color, bg color) to the
   * schema. Walks up from the selected element to find a
   * `data-icon-host` / `data-icon-workstream-id` tagged container and
   * dispatches an UPDATE_BLOCK with the patched sub-item. No-op when
   * the selection isn't inside a known icon host — so we never
   * accidentally try to "iconify" arbitrary containers.
   */
  const commitIconToSchema = React.useCallback(
    (el: HTMLElement, patch: IconPatch) => {
      const host = findIconHost(el)
      if (!host) return
      const sections = project.siteContent?.sections ?? []
      const loc = resolveBlockFromElement(host.element, sections)
      if (!loc) return
      const nextBlock = writeIconToBlock(loc.block, host.target, patch)
      if (nextBlock === loc.block) return
      dispatch({
        type: 'UPDATE_BLOCK',
        payload: {
          sectionId: loc.section.id,
          blockId: loc.block.id,
          block: nextBlock,
        },
      })
    },
    [project.siteContent, dispatch],
  )

  const recomputeSelected = React.useCallback(() => {
    if (!selectedEl || !overlayRef.current) return
    const origin = overlayRef.current.getBoundingClientRect()
    setSelectedRect(rectOf(selectedEl, origin))
  }, [selectedEl])

  React.useEffect(() => {
    if (!active) {
      setHoverRect(null)
      setHoveredEl(null)
      setSelectedEl(null)
      setSelectedRect(null)
      setEditing(false)
      return
    }

    const root = contentRef.current
    if (!root) return

    function originRect(): DOMRect {
      return overlayRef.current!.getBoundingClientRect()
    }

    function onMove(e: MouseEvent) {
      if (editing) return
      const target = e.target as Element | null
      if (!target || !root!.contains(target)) {
        setHoverRect(null)
        setHoveredEl(null)
        return
      }
      const picked = pickTarget(target, root!)
      if (!picked) {
        setHoverRect(null)
        setHoveredEl(null)
        return
      }
      const o = originRect()
      setHoveredEl(picked)
      setHoverRect(rectOf(picked, o))
      const d = describeElement(picked)
      setHoverLabel(
        d.preview
          ? `${d.role} · ${d.tag} "${d.preview}"`
          : `${d.role} · ${d.tag}`,
      )
    }

    function onLeave() {
      setHoverRect(null)
      setHoveredEl(null)
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null
      if (!target || !root!.contains(target)) return
      const picked = pickTarget(target, root!)
      if (!picked) return
      e.preventDefault()
      e.stopPropagation()
      const o = originRect()
      setSelectedEl(picked)
      setSelectedRect(rectOf(picked, o))
      const d = describeElement(picked)
      setSelectedLabel(
        d.preview
          ? `${d.role} · ${d.tag} "${d.preview}"`
          : `${d.role} · ${d.tag}`,
      )
      setEditing(false)
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (editing) {
          setEditing(false)
          ;(document.activeElement as HTMLElement | null)?.blur()
          return
        }
        if (selectedEl) {
          setSelectedEl(null)
          setSelectedRect(null)
          return
        }
        onExit()
      }
    }

    root.addEventListener('mousemove', onMove, true)
    root.addEventListener('mouseleave', onLeave, true)
    root.addEventListener('click', onClick, true)
    window.addEventListener('resize', recomputeSelected)
    window.addEventListener('keydown', onKey)

    return () => {
      root.removeEventListener('mousemove', onMove, true)
      root.removeEventListener('mouseleave', onLeave, true)
      root.removeEventListener('click', onClick, true)
      window.removeEventListener('resize', recomputeSelected)
      window.removeEventListener('keydown', onKey)
    }
  }, [active, contentRef, onExit, editing, selectedEl, recomputeSelected])

  React.useEffect(() => {
    if (!active || !selectedEl) return
    const ro = new ResizeObserver(() => recomputeSelected())
    ro.observe(selectedEl)
    return () => ro.disconnect()
  }, [active, selectedEl, recomputeSelected])

  const startEditing = React.useCallback(() => {
    if (!selectedEl) return
    if (!TEXT_TAGS.has(selectedEl.tagName)) return
    selectedEl.setAttribute('contenteditable', 'true')
    selectedEl.focus()
    const range = document.createRange()
    range.selectNodeContents(selectedEl)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    setEditing(true)

    function onBlur() {
      selectedEl!.removeAttribute('contenteditable')
      setEditing(false)
      selectedEl!.removeEventListener('blur', onBlur)
      // Persist to schema if the edited element is inside a block host.
      const newValue = (selectedEl!.textContent ?? '').trim()
      commitTextToSchema(selectedEl!, newValue)
      recomputeSelected()
    }
    selectedEl.addEventListener('blur', onBlur)
  }, [selectedEl, recomputeSelected, commitTextToSchema])

  const applyStyle = React.useCallback(
    (patch: Partial<CSSStyleDeclaration>) => {
      if (!selectedEl) return
      Object.assign(selectedEl.style, patch)
      recomputeSelected()
    },
    [selectedEl, recomputeSelected],
  )

  const deleteSelected = React.useCallback(() => {
    if (!selectedEl) return
    selectedEl.remove()
    setSelectedEl(null)
    setSelectedRect(null)
    setHoverRect(null)
  }, [selectedEl])

  if (!active) return null

  const outlineTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 720, damping: 46, mass: 0.42 }

  const inspectorPortal = inspectorHost
    ? createPortal(
        selectedEl ? (
          <ElementInspectorSidebar
            element={selectedEl}
            editing={editing}
            onEditText={startEditing}
            onText={(value) => {
              if (selectedEl) {
                // eslint-disable-next-line react-hooks/immutability -- design mode intentionally edits the live preview DOM.
                selectedEl.textContent = value
                commitTextToSchema(selectedEl, value)
              }
              recomputeSelected()
            }}
            onImage={(src, alt) => {
              if (!selectedEl) return
              // Direct <img> selection — update it in place.
              if (selectedEl instanceof HTMLImageElement) {
                commitImageToSchema(selectedEl, src, alt)
                recomputeSelected()
                return
              }
              // Container selection (e.g. a section) that houses a
              // full-bleed background <img>. Update that backdrop so
              // section-level "replace image" works even when the
              // image itself is pointer-events-none.
              const bg = findBackgroundImage(selectedEl)
              if (bg) {
                commitImageToSchema(bg, src, alt)
                recomputeSelected()
              }
            }}
            onIcon={(patch) => {
              if (!selectedEl) return
              commitIconToSchema(selectedEl, patch)
              recomputeSelected()
            }}
            onBold={() =>
              applyStyle({
                fontWeight:
                  selectedEl && getComputedStyle(selectedEl).fontWeight === '700'
                    ? '400'
                    : '700',
              })
            }
            onItalic={() =>
              applyStyle({
                fontStyle:
                  selectedEl && selectedEl.style.fontStyle === 'italic'
                    ? 'normal'
                    : 'italic',
              })
            }
            onUnderline={() =>
              applyStyle({
                textDecoration:
                  selectedEl && selectedEl.style.textDecoration === 'underline'
                    ? 'none'
                    : 'underline',
              })
            }
            onAlign={(align) => applyStyle({ textAlign: align })}
            onFontFamily={(fontFamily) => applyStyle({ fontFamily })}
            onColor={(color) => applyStyle({ color })}
            brandTokens={project.brandTokens}
            onSpacing={(prop, value) =>
              applyStyle({ [prop]: value } as Partial<CSSStyleDeclaration>)
            }
            onDelete={deleteSelected}
            onClose={() => {
              setSelectedEl(null)
              setSelectedRect(null)
            }}
          />
        ) : (
          <InspectorEmptyState />
        ),
        inspectorHost,
      )
    : null

  return (
    <>
    <div
      ref={overlayRef}
      className="pointer-events-none absolute inset-0 z-40"
    >
      {/* Hover outline */}
      <AnimatePresence initial={false}>
        {hoverRect && hoveredEl !== selectedEl && (
          <motion.div
            className="absolute border-2 border-[#C52B09] shadow-[0_0_0_1px_rgba(197,43,9,0.08)]"
            aria-hidden
            initial={{
              opacity: 0,
              scale: 0.985,
              top: hoverRect.top,
              left: hoverRect.left,
              width: hoverRect.width,
              height: hoverRect.height,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              top: hoverRect.top,
              left: hoverRect.left,
              width: hoverRect.width,
              height: hoverRect.height,
            }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={outlineTransition}
          >
            <HoverLabel label={hoverLabel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection outline */}
      <AnimatePresence initial={false}>
        {selectedRect && (
          <motion.div
            className="absolute"
            aria-hidden
            initial={{
              opacity: 0,
              scale: 0.985,
              top: selectedRect.top,
              left: selectedRect.left,
              width: selectedRect.width,
              height: selectedRect.height,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              top: selectedRect.top,
              left: selectedRect.left,
              width: selectedRect.width,
              height: selectedRect.height,
            }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={outlineTransition}
          >
            <div className="absolute inset-0 border-2 border-[#C52B09] shadow-[0_0_0_1px_rgba(197,43,9,0.1),0_8px_24px_rgba(197,43,9,0.12)]" />
            <SelectionLabel label={selectedLabel} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    {inspectorPortal}
    </>
  )
}

function HoverLabel({ label }: { label: string }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-1/2 max-w-[70%] -translate-x-1/2 -translate-y-[calc(100%+4px)] truncate rounded-md bg-[#C52B09] px-2 py-0.5 font-mono text-[11px] font-medium text-white shadow-sm"
      title={label}
    >
      {label}
    </div>
  )
}

function SelectionLabel({ label }: { label: string }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 -translate-y-[calc(100%+6px)] max-w-[320px] truncate rounded-md bg-[#C52B09] px-2 py-0.5 font-mono text-[11px] font-medium text-white shadow-sm"
      title={label}
    >
      {label}
    </div>
  )
}

type SpacingProp =
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'marginBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'paddingBottom'
  | 'width'
  | 'height'

const TEMPLATE_FONT_OPTIONS = [
  { label: 'Inherit', value: '__inherit__', css: '' },
  {
    label: 'Sans (Space Grotesk)',
    value: 'template-sans',
    css: 'var(--font-template-fallback-sans), Arial, sans-serif',
  },
  {
    label: 'Display Wide (Bricolage)',
    value: 'template-wide',
    css: 'var(--font-template-fallback-wide), Arial, sans-serif',
  },
  {
    label: 'Serif (EB Garamond)',
    value: 'template-serif',
    css: 'var(--font-template-fallback-serif), Georgia, serif',
  },
  {
    label: 'Mono (JetBrains)',
    value: 'mono',
    css: 'var(--font-mono), ui-monospace, SFMono-Regular, monospace',
  },
  {
    label: 'System UI',
    value: 'system',
    css: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
] as const

interface ElementInspectorSidebarProps {
  element: HTMLElement | null
  editing: boolean
  onEditText: () => void
  onText: (value: string) => void
  onImage: (src: string, alt: string) => void
  onIcon: (patch: IconPatch) => void
  onBold: () => void
  onItalic: () => void
  onUnderline: () => void
  onAlign: (align: 'left' | 'center' | 'right') => void
  onFontFamily: (fontFamily: string) => void
  onColor: (color: string) => void
  /** Brand tokens from the project — powers the organized color picker. */
  brandTokens: import('@/types').BrandTokens | null | undefined
  onSpacing: (prop: SpacingProp, value: string) => void
  onDelete: () => void
  onClose: () => void
}

/**
 * Stable identity for an HTMLElement so we can `key` the panel and
 * force a remount of uncontrolled inputs when the user selects a
 * different element.
 */
const ELEMENT_KEYS = new WeakMap<HTMLElement, string>()
let elementKeyCounter = 0

function domKey(el: HTMLElement): string {
  const existing = ELEMENT_KEYS.get(el)
  if (existing) return existing
  const next = `${el.tagName}:${++elementKeyCounter}`
  ELEMENT_KEYS.set(el, next)
  return next
}

function InspectorEmptyState() {
  return (
    <aside
      className="pointer-events-auto h-full"
      role="complementary"
      aria-label="Element properties"
    >
      <div className="flex h-full flex-col bg-card text-foreground">
        <div className="border-b border-border px-3 py-3">
          <p className="text-sm font-semibold">Design Inspector</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Select an element on the canvas to edit its properties.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="max-w-[240px] text-xs leading-relaxed text-muted-foreground">
            Hover to preview an element, then click it to pin the selection and
            reveal typography, layout, fill, and effect controls here.
          </p>
        </div>
      </div>
    </aside>
  )
}

/**
 * Contextual properties sidebar for the selected element. Modeled
 * after a Figma-style inspector: tag chip + tabbed header, then
 * labeled property sections grouped by intent (Edit, Style, Layout).
 * It stays pinned to the editor edge so the selected element remains
 * visible and the controls don't fight the canvas for space.
 */
function ElementInspectorSidebar({
  element,
  editing,
  onEditText,
  onText,
  onImage,
  onIcon,
  onBold,
  onItalic,
  onUnderline,
  onAlign,
  onFontFamily,
  onColor,
  brandTokens,
  onSpacing,
  onDelete,
  onClose,
}: ElementInspectorSidebarProps) {
  const tag = element?.tagName ?? 'DIV'
  const isText = element ? TEXT_TAGS.has(tag) : false
  const isImage = tag === 'IMG'
  // An icon host is the decorated container rendered by the
  // Slide-1-summary workstreams (and any future host wired into
  // findIconHost). We also accept selections that are descendants of
  // a host (e.g. the inner <svg>) so clicking directly on the icon
  // still resolves to the host.
  const iconHost = React.useMemo(() => findIconHost(element), [element])
  const isIcon = Boolean(iconHost)
  // When the selection is a container that holds a full-bleed
  // backdrop <img> (common pattern for hero sections: absolutely
  // positioned, pointer-events-none), we treat that image as the
  // selection's image for the purposes of the Image panel. This
  // lets the user swap a section's backdrop by clicking the
  // section itself — since pointer-events-none makes the image
  // unreachable by direct click.
  const backgroundImage = React.useMemo<HTMLImageElement | null>(
    () => (isImage || isIcon ? null : findBackgroundImage(element)),
    [element, isImage, isIcon],
  )
  const effectiveImage = React.useMemo<HTMLImageElement | null>(
    () =>
      element instanceof HTMLImageElement
        ? element
        : (backgroundImage ?? null),
    [element, backgroundImage],
  )
  const showImagePanel = effectiveImage !== null && !isIcon
  const rect = element?.getBoundingClientRect()
  const styles = element ? getComputedStyle(element) : null
  const elementName = element
    ? describeElement(element)
    : { role: 'Selection', tag: 'div', preview: '' }
  const x = rect ? Math.round(rect.left) : 0
  const y = rect ? Math.round(rect.top) : 0
  const width = rect ? Math.round(rect.width) : 0
  const height = rect ? Math.round(rect.height) : 0
  const opacity = styles ? Math.round(Number(styles.opacity || '1') * 100) : 100

  return (
    <aside
      className="pointer-events-auto h-full"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      role="complementary"
      aria-label="Element properties"
    >
      <Card
        key={element ? domKey(element) : 'none'}
        size="sm"
        className="h-full gap-0 overflow-hidden rounded-none border-0 bg-card py-0 text-foreground shadow-none ring-0"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {elementName.role}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {tag.toLowerCase()}
              {elementName.preview ? ` · ${elementName.preview}` : ''}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <EditorTooltip label="Delete element" side="top">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Delete element"
                onClick={onDelete}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </EditorTooltip>
            <EditorTooltip label="Close panel" side="top">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Close panel"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X />
              </Button>
            </EditorTooltip>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <InspectorSection title="Position">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-1">
                <IconChip label="Align left">
                  <AlignLeft className="size-3.5" />
                </IconChip>
                <IconChip label="Align center">
                  <AlignCenter className="size-3.5" />
                </IconChip>
                <IconChip label="Align right">
                  <AlignRight className="size-3.5" />
                </IconChip>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Readout label="X" value={x} />
                <Readout label="Y" value={y} />
              </div>
              <Readout label="Rotation" value="0deg" />
            </div>
          </InspectorSection>

          <InspectorSection title="Layout">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Readout label="W" value={`${width}px`} />
                <Readout label="H" value={`${height}px`} />
              </div>
              <Section label="Margin">
                <div className="grid grid-cols-2 gap-2">
                  <SpacingInput
                    placeholder="X axis"
                    onCommit={(v) => {
                      onSpacing('marginLeft', v)
                      onSpacing('marginRight', v)
                    }}
                  />
                  <SpacingInput
                    placeholder="Y axis"
                    onCommit={(v) => {
                      onSpacing('marginTop', v)
                      onSpacing('marginBottom', v)
                    }}
                  />
                </div>
              </Section>
              <Section label="Padding">
                <div className="grid grid-cols-2 gap-2">
                  <SpacingInput
                    placeholder="X axis"
                    onCommit={(v) => {
                      onSpacing('paddingLeft', v)
                      onSpacing('paddingRight', v)
                    }}
                  />
                  <SpacingInput
                    placeholder="Y axis"
                    onCommit={(v) => {
                      onSpacing('paddingTop', v)
                      onSpacing('paddingBottom', v)
                    }}
                  />
                </div>
              </Section>
            </div>
          </InspectorSection>

          <InspectorSection title="Appearance">
            <div className="grid grid-cols-2 gap-2">
              <Readout label="Opacity" value={`${opacity}%`} />
              <Readout label="Radius" value={styles?.borderRadius || '0'} />
            </div>
          </InspectorSection>

          <InspectorSection title="Typography">
            <div className="flex flex-col gap-4">
              {isText ? (
                <>
                  <Section label="Text content">
                    <Textarea
                      defaultValue={element?.textContent ?? ''}
                      onChange={(e) => onText(e.target.value)}
                      rows={3}
                      className="min-h-[72px] rounded-md text-sm"
                      placeholder="Type text..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={onEditText}
                      aria-pressed={editing}
                      className="self-start rounded-md"
                    >
                      <Pencil className="size-3" />
                      {editing ? 'Editing inline...' : 'Edit inline'}
                    </Button>
                  </Section>

                  <Section label="Font family">
                    <FontFamilySelect
                      element={element}
                      onChange={onFontFamily}
                    />
                  </Section>

                  <Section label="Style">
                    <SegmentedGroup>
                      <SegmentButton label="Bold" onClick={onBold}>
                        <Bold className="size-3.5" />
                      </SegmentButton>
                      <SegmentButton label="Italic" onClick={onItalic}>
                        <Italic className="size-3.5" />
                      </SegmentButton>
                      <SegmentButton label="Underline" onClick={onUnderline}>
                        <Underline className="size-3.5" />
                      </SegmentButton>
                    </SegmentedGroup>
                  </Section>

                  <Section label="Alignment">
                    <SegmentedGroup>
                      <SegmentButton label="Align left" onClick={() => onAlign('left')}>
                        <AlignLeft className="size-3.5" />
                      </SegmentButton>
                      <SegmentButton label="Align center" onClick={() => onAlign('center')}>
                        <AlignCenter className="size-3.5" />
                      </SegmentButton>
                      <SegmentButton label="Align right" onClick={() => onAlign('right')}>
                        <AlignRight className="size-3.5" />
                      </SegmentButton>
                    </SegmentedGroup>
                  </Section>
                </>
              ) : (
                <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                  Text controls are not available for{' '}
                  <span className="font-mono text-foreground">{tag.toLowerCase()}</span>.
                </p>
              )}
            </div>
          </InspectorSection>

          {(isIcon || showImagePanel) && (
            <InspectorSection title={isIcon ? 'Icon' : 'Image'}>
              <div className="flex flex-col gap-4">
          {isIcon && iconHost && (
            <IconPanel host={iconHost.element} onIcon={onIcon} />
          )}
          {showImagePanel && effectiveImage && (
            <ImagePanel element={effectiveImage} onImage={onImage} />
          )}
              </div>
            </InspectorSection>
          )}

          {(isText || isIcon) && (
            <InspectorSection title="Fill">
              <UnifiedColorPanel
                brandTokens={brandTokens}
                element={element}
                isIcon={isIcon}
                onColor={onColor}
                onIcon={onIcon}
              />
            </InspectorSection>
          )}

          <InspectorSection title="Stroke" collapsed />
          <InspectorSection title="Effects" collapsed />

          <InspectorSection title="Code">
            <Section label="Tailwind classes">
              <code className="block max-h-24 overflow-auto rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/80">
              {element?.className?.toString().trim() || (
                <span className="text-muted-foreground">No classes</span>
              )}
              </code>
            </Section>

            <Section label="Inline CSS">
              <code className="block max-h-24 overflow-auto rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/80">
              {element?.style?.cssText?.trim() || (
                <span className="text-muted-foreground">None</span>
              )}
              </code>
            </Section>

            <Section label="Element ID">
              <Input
                defaultValue={element?.id ?? ''}
                onChange={(e) => {
                  // eslint-disable-next-line react-hooks/immutability -- design mode intentionally edits the live preview DOM.
                  if (element) element.id = e.target.value
                }}
                placeholder="element-id"
                className="h-8 rounded-md text-xs"
              />
            </Section>
          </InspectorSection>
        </div>
      </Card>
    </aside>
  )
}

function InspectorSection({
  title,
  children,
  collapsed = false,
}: {
  title: string
  children?: React.ReactNode
  collapsed?: boolean
}) {
  return (
    <section className="border-b border-border px-3 py-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {collapsed && (
          <span className="text-xl leading-none text-muted-foreground" aria-hidden>
            +
          </span>
        )}
      </div>
      {!collapsed && children && <div className="mt-3">{children}</div>}
    </section>
  )
}

function Readout({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2 text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-mono text-foreground">{value}</span>
    </div>
  )
}

function FontFamilySelect({
  element,
  onChange,
}: {
  element: HTMLElement | null
  onChange: (fontFamily: string) => void
}) {
  const { fonts: localFonts, loading: fontsLoading } = useLocalFonts()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const currentFamily = element?.style.fontFamily || ''
  const currentTemplate = TEMPLATE_FONT_OPTIONS.find(
    (o) => o.css === currentFamily,
  )
  const displayLabel = currentTemplate
    ? currentTemplate.label
    : currentFamily
      ? currentFamily.replace(/^"(.*)".*$/, '$1')
      : 'Inherit'

  const lowerQuery = query.toLowerCase()
  const filteredTemplate = TEMPLATE_FONT_OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(lowerQuery),
  )
  const filteredLocal = localFonts.filter((f) =>
    f.toLowerCase().includes(lowerQuery),
  )

  const handleSelectTemplate = (option: (typeof TEMPLATE_FONT_OPTIONS)[number]) => {
    onChange(option.css)
    setOpen(false)
    setQuery('')
  }

  const handleSelectLocal = (family: string) => {
    onChange(`"${family}", system-ui, sans-serif`)
    setOpen(false)
    setQuery('')
  }

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-8 w-full items-center justify-between rounded-md border border-border bg-background px-2.5 text-xs transition hover:bg-muted',
            open && 'ring-2 ring-ring',
          )}
          style={
            currentFamily ? { fontFamily: currentFamily } : undefined
          }
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="ml-1 size-3 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[280px] rounded-xl p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search fonts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[320px]">
          <div className="p-1">
            {/* Template fonts group */}
            {filteredTemplate.length > 0 && (
              <>
                <div className="px-2 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Template
                </div>
                {filteredTemplate.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelectTemplate(option)}
                    className={cn(
                      'flex w-full items-center rounded-md px-2 py-1.5 text-xs transition hover:bg-muted',
                      currentFamily === option.css && option.css !== '' && 'bg-muted font-medium',
                      currentFamily === '' && option.value === '__inherit__' && 'bg-muted font-medium',
                    )}
                  >
                    <span
                      className="truncate"
                      style={option.css ? { fontFamily: option.css } : undefined}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </>
            )}

            {/* Local / OS fonts group */}
            {fontsLoading ? (
              <div className="px-2 py-3 text-center text-[11px] text-muted-foreground">
                Detecting system fonts…
              </div>
            ) : filteredLocal.length > 0 ? (
              <>
                <div className="px-2 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  System Fonts ({filteredLocal.length})
                </div>
                {filteredLocal.map((family) => {
                  const cssVal = `"${family}", system-ui, sans-serif`
                  return (
                    <button
                      key={family}
                      type="button"
                      onClick={() => handleSelectLocal(family)}
                      className={cn(
                        'flex w-full items-center rounded-md px-2 py-1.5 text-xs transition hover:bg-muted',
                        currentFamily === cssVal && 'bg-muted font-medium',
                      )}
                    >
                      <span className="truncate" style={{ fontFamily: `"${family}"` }}>
                        {family}
                      </span>
                    </button>
                  )
                })}
              </>
            ) : query ? (
              <div className="px-2 py-3 text-center text-[11px] text-muted-foreground">
                No fonts matching &ldquo;{query}&rdquo;
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function IconChip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <EditorTooltip label={label} side="top">
      <button
        type="button"
        aria-label={label}
        className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </button>
    </EditorTooltip>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

/**
 * Rich image-editing panel — shown in the Edit tab whenever the
 * selected element is an `<img>`. Provides:
 *   • A preview of the current image (plus metadata: size + URL tail)
 *   • Replace via file picker OR URL paste
 *   • Remove (clears `src` + dispatches empty to schema so a schema
 *     image block falls back to its placeholder state)
 *   • Alt-text edit, persisted to schema
 *
 * All edits flow through `onImage(src, alt)` which the overlay wires
 * to `commitImageToSchema` — so changes are immediately persisted to
 * project state for schema-backed image blocks, and also reflected on
 * the DOM so unschema'd template images update live in the preview.
 */
function ImagePanel({
  element,
  onImage,
}: {
  element: HTMLImageElement
  onImage: (src: string, alt: string) => void
}) {
  const [currentSrc, setCurrentSrc] = React.useState(element.src || '')
  const [alt, setAlt] = React.useState(element.alt || '')
  const [urlDraft, setUrlDraft] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Re-sync when the selected image changes (user picks a different
  // <img> in the preview). We key the component by element identity
  // upstream so this is belt-and-suspenders for in-place src changes.
  React.useEffect(() => {
    setCurrentSrc(element.src || '')
    setAlt(element.alt || '')
    setUrlDraft('')
    setError(null)
  }, [element])

  const filename = React.useMemo(() => {
    if (!currentSrc) return ''
    if (currentSrc.startsWith('data:')) return 'Uploaded image'
    try {
      const u = new URL(currentSrc, window.location.origin)
      const parts = u.pathname.split('/').filter(Boolean)
      return parts[parts.length - 1] || u.hostname
    } catch {
      return currentSrc.slice(0, 48)
    }
  }, [currentSrc])

  const pickFile = () => fileInputRef.current?.click()

  const handleFile = (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('File must be an image.')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Max file size is 4MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result)
      setCurrentSrc(src)
      const nextAlt = alt || file.name.replace(/\.[^.]+$/, '')
      setAlt(nextAlt)
      onImage(src, nextAlt)
    }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsDataURL(file)
  }

  const commitUrl = () => {
    const v = urlDraft.trim()
    if (!v) return
    setError(null)
    setCurrentSrc(v)
    onImage(v, alt)
    setUrlDraft('')
  }

  const commitAlt = (value: string) => {
    setAlt(value)
    if (currentSrc) onImage(currentSrc, value)
  }

  const removeImage = () => {
    setCurrentSrc('')
    onImage('', alt)
  }

  return (
    <div className="flex flex-col gap-4">
      <Section label="Current image">
        <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
          {currentSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentSrc}
              alt={alt}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <ImageIcon className="size-5" />
              <span className="text-[11px] font-medium">No image</span>
            </div>
          )}
        </div>
        {currentSrc && (
          <p
            className="truncate font-mono text-[10px] text-muted-foreground"
            title={currentSrc}
          >
            {filename}
          </p>
        )}
      </Section>

      <Section label="Replace">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={pickFile}
            className="justify-center"
          >
            {currentSrc ? (
              <Replace className="size-3" />
            ) : (
              <ImagePlus className="size-3" />
            )}
            {currentSrc ? 'Replace' : 'Add image'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={removeImage}
            disabled={!currentSrc}
            className="justify-center text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3" />
            Remove
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            // Reset so the user can re-pick the same file after a
            // remove → add cycle.
            e.target.value = ''
          }}
        />
      </Section>

      <Section label="From URL">
        <div className="flex gap-2">
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitUrl()
              }
            }}
            placeholder="https://…"
            className="h-8 flex-1 rounded-lg text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={commitUrl}
            disabled={!urlDraft.trim()}
          >
            <Upload className="size-3" />
            Use
          </Button>
        </div>
      </Section>

      <Section label="Alt text">
        <Input
          value={alt}
          onChange={(e) => commitAlt(e.target.value)}
          placeholder="Describe the image for screen readers"
          className="h-8 rounded-lg text-xs"
        />
      </Section>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Icon swap + color panel. Shown in the Edit tab when the selection
 * is (or is descended from) a `data-icon-host` tagged container.
 *
 * Provides:
 *   • Current icon preview + identity
 *   • Searchable grid of ~100 curated lucide icons (filtered live)
 *   • Stroke color swatches (applied to `color:` on the host)
 *   • Background color swatches (applied to `backgroundColor:`)
 *
 * All edits flow through `onIcon(patch)` which the overlay wires to
 * `commitIconToSchema` — so changes are persisted to the schema
 * block's sub-item and survive refresh/redeploy.
 */
function IconPanel({
  host,
  onIcon,
}: {
  host: HTMLElement
  onIcon: (patch: IconPatch) => void
}) {
  const [query, setQuery] = React.useState('')

  // Reset search when the selection changes (different host).
  React.useEffect(() => {
    setQuery('')
  }, [host])

  const results = React.useMemo(() => searchIcons(query), [query])

  const applyIcon = (entry: IconLibraryEntry) => {
    onIcon({ iconName: entry.name })
  }

  // Read current fg/bg live so the preview always matches what the
  // user sees on the page, even after the unified color picker at
  // the bottom of the toolbar updates them.
  const [{ color, bg }, setStyle] = React.useState(() => ({
    color: getComputedStyle(host).color || '#d31710',
    bg: getComputedStyle(host).backgroundColor || '#ffffff',
  }))

  React.useEffect(() => {
    const sync = () => {
      setStyle({
        color: getComputedStyle(host).color || '#d31710',
        bg: getComputedStyle(host).backgroundColor || '#ffffff',
      })
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(host, { attributes: true, attributeFilter: ['style', 'class'] })
    return () => mo.disconnect()
  }, [host])

  return (
    <div className="flex flex-col gap-4">
      <Section label="Current icon">
        <div
          className="flex h-16 w-full items-center justify-center rounded-lg border border-border"
          style={{ backgroundColor: bg }}
        >
          {/* Render whatever the host is currently showing — we
              clone the SVG from the DOM so the preview always matches
              what the user sees on the page. */}
          <IconHostPreview host={host} color={color} />
        </div>
      </Section>

      <Section label="Swap icon">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className="h-8 rounded-lg pl-7 text-xs"
          />
        </div>
        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-border bg-background p-1.5">
          {results.length === 0 ? (
            <p className="py-6 text-center text-[11px] text-muted-foreground">
              No icons match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {results.map((entry) => {
                const Icon = entry.Icon
                return (
                  <EditorTooltip key={entry.name} label={entry.label} side="top">
                    <button
                      type="button"
                      aria-label={`Use ${entry.label} icon`}
                      onClick={() => applyIcon(entry)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-foreground/80 transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon size={16} strokeWidth={1.75} />
                    </button>
                  </EditorTooltip>
                )
              })}
            </div>
          )}
          <p className="mt-2 px-1 text-[10px] text-muted-foreground">
            {results.length} icon{results.length === 1 ? '' : 's'} · powered by Lucide
          </p>
        </div>
      </Section>
    </div>
  )
}

/**
 * Unified color picker that sits at the bottom of the Edit tab and
 * adapts its binding based on what the user has selected:
 *
 *   • Icon selection → routes changes through `onIcon` as
 *     `iconColor` (Foreground) or `iconBg` (Background). A
 *     segmented toggle lets the user switch which slot they're
 *     editing without opening a second picker.
 *   • Text selection → binds to the element's CSS `color` via
 *     `onColor`. No target toggle because text only has one
 *     meaningful foreground slot here.
 *
 * Keeps the toolbar visually calm: one color library, not three.
 */
function UnifiedColorPanel({
  brandTokens,
  element,
  isIcon,
  onColor,
  onIcon,
}: {
  brandTokens: import('@/types').BrandTokens | null | undefined
  element: HTMLElement | null
  isIcon: boolean
  onColor: (color: string) => void
  onIcon: (patch: IconPatch) => void
}) {
  const [target, setTarget] = React.useState<'fg' | 'bg'>('fg')

  // Reset target to foreground whenever the selection changes so the
  // panel always opens in the predictable "edit the stroke" mode.
  React.useEffect(() => {
    setTarget('fg')
  }, [element])

  // Compute the currently-applied color for the active target so the
  // picker can mark it with a ring. Reads from computed style so any
  // mid-session updates (schema commit, react rerender) reflect
  // immediately without manual polling.
  const selected = React.useMemo<string | null>(() => {
    if (!element) return null
    const cs = getComputedStyle(element)
    if (isIcon && target === 'bg') return rgbToHex(cs.backgroundColor ?? null)
    return rgbToHex(cs.color ?? null)
  }, [element, target, isIcon])

  const handleSelect = (hex: string) => {
    if (isIcon) {
      if (target === 'bg') onIcon({ iconBg: hex })
      else onIcon({ iconColor: hex })
      return
    }
    onColor(hex)
  }

  return (
    <Section label="Color">
      {isIcon && (
        <SegmentedGroup>
          <SegmentButton
            label="Foreground"
            onClick={() => setTarget('fg')}
          >
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider',
                target === 'fg' ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              Foreground
            </span>
          </SegmentButton>
          <SegmentButton
            label="Background"
            onClick={() => setTarget('bg')}
          >
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider',
                target === 'bg' ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              Background
            </span>
          </SegmentButton>
        </SegmentedGroup>
      )}
      <BrandColorPicker
        tokens={brandTokens}
        selected={selected}
        onSelect={handleSelect}
      />
    </Section>
  )
}

/**
 * Renders a live preview of whatever SVG icon the host currently
 * contains by cloning it into the panel. Updates whenever the host
 * re-renders (post-schema commit) via a MutationObserver.
 */
function IconHostPreview({
  host,
  color,
}: {
  host: HTMLElement
  color: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const sync = () => {
      const svg = host.querySelector('svg')
      node.innerHTML = ''
      if (svg) {
        const clone = svg.cloneNode(true) as SVGElement
        clone.removeAttribute('class')
        clone.setAttribute('width', '28')
        clone.setAttribute('height', '28')
        node.appendChild(clone)
      }
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(host, { childList: true, subtree: true, attributes: true })
    return () => mo.disconnect()
  }, [host])

  return (
    <span
      ref={ref}
      aria-hidden
      className="inline-flex size-8 items-center justify-center"
      style={{ color }}
    />
  )
}

function SegmentedGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex w-full items-center justify-between gap-1 rounded-md border border-border bg-background p-1">
      {children}
    </div>
  )
}

function SegmentButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <EditorTooltip label={label} side="top">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="inline-flex h-7 flex-1 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </button>
    </EditorTooltip>
  )
}

function SpacingInput({
  placeholder,
  onCommit,
}: {
  placeholder: string
  onCommit: (value: string) => void
}) {
  const [value, setValue] = React.useState('')
  const commit = () => {
    if (!value.trim()) return
    const v = /^\d+$/.test(value.trim()) ? `${value.trim()}px` : value.trim()
    onCommit(v)
  }
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          commit()
        }
      }}
      placeholder={placeholder}
      className="h-8 rounded-md text-xs"
    />
  )
}
