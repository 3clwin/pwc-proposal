'use client'

import * as React from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useProject } from '@/context/project-context'
import { cn } from '@/lib/utils'
import { searchIcons, type IconLibraryEntry } from '@/lib/icons'
import { BrandColorPicker } from './brand-color-picker'
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
  onExit,
}: DesignModeOverlayProps) {
  const { project, dispatch } = useProject()
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

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none absolute inset-0 z-40"
      aria-hidden
    >
      {/* Hover outline */}
      {hoverRect && hoveredEl !== selectedEl && (
        <div
          className="absolute border-2 border-[#C52B09]"
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        >
          <HoverLabel label={hoverLabel} />
        </div>
      )}

      {/* Selection outline */}
      {selectedRect && (
        <div
          className="absolute"
          style={{
            top: selectedRect.top,
            left: selectedRect.left,
            width: selectedRect.width,
            height: selectedRect.height,
          }}
        >
          <div className="absolute inset-0 border-2 border-[#C52B09]" />
          <SelectionLabel label={selectedLabel} />
          <FloatingToolbar
            element={selectedEl}
            editing={editing}
            onEditText={startEditing}
            onText={(value) => {
              if (selectedEl) {
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
        </div>
      )}
    </div>
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

interface FloatingToolbarProps {
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
function domKey(el: HTMLElement): string {
  // Icon host — include the host type + sub-item id so swapping
  // between different icon tiles re-mounts the picker state.
  const iconHost = findIconHost(el)
  if (iconHost) {
    const t = iconHost.target
    const id =
      t.host === 'slide-1-summary' ? t.workstreamId : t.barId
    return `ICON:${t.host}:${id}`
  }
  // For <img>, include src so selecting a different image forces a
  // remount (the ImagePanel's internal state is keyed off of the
  // element reference too, but we belt-and-suspenders it here).
  if (el instanceof HTMLImageElement) {
    return `IMG:${el.src.slice(0, 160)}`
  }
  // Container with a backdrop image (e.g. a <section> with an
  // absolutely-positioned <img> child). Key off the backdrop's src so
  // swapping between hero sections re-mounts the ImagePanel cleanly.
  const bg = findBackgroundImage(el)
  if (bg) {
    return `SECTION_IMG:${el.id || el.tagName}:${bg.src.slice(0, 160)}`
  }
  // Otherwise tagName + first 80 chars of textContent is uniquely
  // identifying for the lifetime of a selection within a page.
  return `${el.tagName}:${(el.textContent ?? '').slice(0, 80)}`
}

/**
 * Contextual properties panel for the selected element. Modeled
 * after a Figma / DesignBuddy-style inspector: tag chip + tabbed
 * header, then labeled property sections grouped by intent (Edit,
 * Style, Layout). Each section follows a consistent
 * `<SectionLabel /> + <Control />` pattern with generous breathing
 * room.
 */
function FloatingToolbar({
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
  onColor,
  brandTokens,
  onSpacing,
  onDelete,
  onClose,
}: FloatingToolbarProps) {
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

  return (
    <Card
      key={element ? domKey(element) : 'none'}
      size="sm"
      className="pointer-events-auto absolute right-0 top-full z-50 mt-3 w-[300px] gap-0 overflow-hidden rounded-xl border border-foreground/10 bg-slate-50 py-0 shadow-2xl ring-0"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Element properties"
    >
      <Tabs defaultValue="edit" className="gap-0">
        {/* Header — tag chip · tabs · actions */}
        <div className="flex items-center justify-between gap-2 border-b border-foreground/10 px-3 py-2">
          <span className="inline-flex h-5 items-center rounded bg-[#C52B09] px-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
            {tag.toLowerCase()}
          </span>

          <TabsList variant="line" className="h-7 gap-0 bg-transparent p-0">
            <TabsTrigger
              value="edit"
              className="h-7 px-2 text-[10px] font-semibold uppercase tracking-wider"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="h-7 px-2 text-[10px] font-semibold uppercase tracking-wider"
            >
              Layout
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="h-7 px-2 text-[10px] font-semibold uppercase tracking-wider"
            >
              Style
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-0.5">
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
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Close"
              onClick={onClose}
              className="text-muted-foreground"
            >
              <X />
            </Button>
          </div>
        </div>

        {/* EDIT */}
        <TabsContent value="edit" className="flex flex-col gap-4 px-4 py-4">
          {isIcon && iconHost && (
            <IconPanel host={iconHost.element} onIcon={onIcon} />
          )}
          {showImagePanel && effectiveImage && (
            <ImagePanel element={effectiveImage} onImage={onImage} />
          )}
          {isText && (
            <>
              <Section label="Text content">
                <Textarea
                  defaultValue={element?.textContent ?? ''}
                  onChange={(e) => onText(e.target.value)}
                  rows={3}
                  className="min-h-[72px] rounded-lg text-sm"
                  placeholder="Type text…"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={onEditText}
                  aria-pressed={editing}
                  className="self-start"
                >
                  <Pencil className="size-3" />
                  {editing ? 'Editing inline…' : 'Edit inline'}
                </Button>
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
          )}
          {!isText && !showImagePanel && !isIcon && (
            <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
              Text editing isn&apos;t available for{' '}
              <span className="font-mono">{tag.toLowerCase()}</span> elements.
              Try the <span className="font-medium text-foreground">Layout</span>{' '}
              tab.
            </p>
          )}

          {/* Unified color picker — renders once per toolbar.
              Context determines what the color binds to:
                • Icon selection → iconColor / iconBg (via onIcon)
                • Text selection → CSS color (via onColor)
              A Foreground/Background toggle appears only when the
              context supports both (icons). For text the picker
              simply binds to color. */}
          {(isText || isIcon) && (
            <UnifiedColorPanel
              brandTokens={brandTokens}
              element={element}
              isIcon={isIcon}
              onColor={onColor}
              onIcon={onIcon}
            />
          )}
        </TabsContent>

        {/* LAYOUT */}
        <TabsContent value="layout" className="flex flex-col gap-4 px-4 py-4">
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

          <Section label="Size">
            <div className="grid grid-cols-2 gap-2">
              <SpacingInput
                placeholder="Width"
                onCommit={(v) => onSpacing('width', v)}
              />
              <SpacingInput
                placeholder="Height"
                onCommit={(v) => onSpacing('height', v)}
              />
            </div>
          </Section>
        </TabsContent>

        {/* STYLE */}
        <TabsContent value="style" className="flex flex-col gap-4 px-4 py-4">
          <Section label="Tailwind classes">
            <code className="block max-h-24 overflow-auto rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/80">
              {element?.className?.toString().trim() || (
                <span className="text-muted-foreground">No classes</span>
              )}
            </code>
          </Section>

          <Section label="Inline CSS">
            <code className="block max-h-24 overflow-auto rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/80">
              {element?.style?.cssText?.trim() || (
                <span className="text-muted-foreground">None</span>
              )}
            </code>
          </Section>

          <Section label="Element ID">
            <Input
              defaultValue={element?.id ?? ''}
              onChange={(e) => {
                if (element) element.id = e.target.value
              }}
              placeholder="element-id"
              className="h-8 rounded-lg text-xs"
            />
          </Section>
        </TabsContent>
      </Tabs>
    </Card>
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
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                  <button
                    key={entry.name}
                    type="button"
                    title={entry.label}
                    aria-label={`Use ${entry.label} icon`}
                    onClick={() => applyIcon(entry)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-foreground/80 transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </button>
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
    <div className="inline-flex w-full items-center justify-between gap-1 rounded-lg border border-border bg-background p-1">
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
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-7 flex-1 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
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
      className="h-8 rounded-lg text-xs"
    />
  )
}
