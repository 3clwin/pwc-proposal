'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Undo2, Redo2, PanelLeftClose, PanelLeftOpen, Paintbrush, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { AIChat } from './ai-chat'
import { CoverShimmer } from './cover-shimmer'
import { ViewportControls, type ViewportMode } from './viewport-controls'
import { DesignModeOverlay } from './design-mode-overlay'
import { BlockOverlay } from './block-overlay'
import { SectionsSidebar } from './sections-sidebar'
import { SiteRenderer } from '@/components/generated-site/site-renderer'
import { useProject } from '@/context/project-context'
import {
  LILLY_SITE_CONTENT,
  GENERATION_DURATION_MS,
} from '@/data/lilly-proposal'

export function EditorLayout() {
  const router = useRouter()
  const { project, dispatch, canUndo, canRedo } = useProject()
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [designMode, setDesignMode] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const previewContentRef = useRef<HTMLDivElement>(null)

  const undo = useCallback(() => {
    if (!canUndo) return
    dispatch({ type: 'UNDO' })
  }, [canUndo, dispatch])

  const redo = useCallback(() => {
    if (!canRedo) return
    dispatch({ type: 'REDO' })
  }, [canRedo, dispatch])

  // Global keyboard shortcuts: ⌘Z / Ctrl+Z for undo, ⌘⇧Z or Ctrl+Y
  // for redo. Ignored when the user is typing in an input, textarea,
  // or contentEditable element so native field undo still works.
  useEffect(() => {
    function isEditableTarget(e: KeyboardEvent): boolean {
      const t = e.target as HTMLElement | null
      if (!t) return false
      const tag = t.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return true
      if (t.isContentEditable) return true
      return false
    }

    function onKey(e: KeyboardEvent) {
      if (isEditableTarget(e)) return
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return
      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  // Pretty preview URL for the address-bar control. Falls back to
  // root if no client slug yet.
  const previewUrl = project.deploymentUrl
    ? project.deploymentUrl.replace(/^https?:\/\//, '')
    : project.clientSlug
      ? `proposal.studio/p/${project.clientSlug}`
      : 'proposal.studio/preview'

  // Simulated "agent is building" state. The content is hardcoded in
  // `LILLY_SITE_CONTENT` — this is a demo flow, not a real LLM call.
  // We run a single client-side timer: shimmer shows for
  // `GENERATION_DURATION_MS`, then dispatch the static content and
  // the AnimatePresence below crossfades to the cover.
  useEffect(() => {
    if (project.siteContent) return
    if (!project.selectedTheme || !project.brandTokens) {
      router.push('/theme')
      return
    }
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_SITE_CONTENT', payload: LILLY_SITE_CONTENT })
    }, GENERATION_DURATION_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSection((prev) => (prev === sectionId ? null : sectionId))
  }, [])

  const handleSectionHover = useCallback((sectionId: string | null) => {
    setHoveredSection(sectionId)
  }, [])

  const viewportWidth =
    viewport === 'tablet'
      ? '768px'
      : viewport === 'mobile'
        ? '375px'
        : '100%'

  const isFullscreen = viewport === 'fullscreen'
  const showChat = !collapsed && !isFullscreen
  // `isBuilding` gates the preview content: while true, we render a
  // cover-shaped shimmer skeleton in place of the real template.
  // The rest of the editor chrome (chat, preview header) stays live
  // so users don't feel locked out.
  const isBuilding = !project.siteContent

  return (
    <div className="fixed inset-x-0 top-14 bottom-0 flex overflow-hidden">
      {showChat && (
        <div className="flex w-1/5 min-w-[280px] shrink-0 flex-col overflow-hidden border-r border-border bg-card">
          {designMode ? <SectionsSidebar /> : <AIChat />}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden bg-muted">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card px-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4 text-muted-foreground" />
              ) : (
                <PanelLeftClose className="size-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <ViewportControls
              activeViewport={viewport}
              onViewportChange={setViewport}
              url={previewUrl}
              onRefresh={() => setPreviewKey((k) => k + 1)}
            />
          </div>

          <div className="flex items-center gap-3">
            <DesignModeToggle
              active={designMode}
              onToggle={() => setDesignMode((v) => !v)}
            />
            <div className="flex items-center gap-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                title="Undo (⌘Z)"
              >
                <Undo2 className="size-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                title="Redo (⌘⇧Z)"
              >
                <Redo2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="editor-preview-scroll min-h-0 flex-1">
          <div className="relative">
            <div
              ref={previewContentRef}
              className={cn(
                'mx-auto bg-card transition-all duration-300',
                designMode && 'select-none',
              )}
              style={{
                maxWidth: viewportWidth,
                boxShadow:
                  viewport !== 'desktop' && viewport !== 'fullscreen'
                    ? '0 0 0 1px var(--border)'
                    : 'none',
              }}
            >
              {/* Short crossfade between the shimmer and the real
                  site renderer: shimmer fades out, then the cover
                  fades in. `mode="wait"` ensures the swap reads as a
                  single transition rather than two overlapping
                  layers. */}
              <AnimatePresence mode="wait" initial={false}>
                {isBuilding ? (
                  <motion.div
                    key="shimmer"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <CoverShimmer />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    <SiteRenderer
                      key={previewKey}
                      siteContent={project.siteContent!}
                      theme={project.selectedTheme}
                      tokens={project.brandTokens}
                      onSectionClick={designMode ? undefined : handleSectionClick}
                      onSectionHover={designMode ? undefined : handleSectionHover}
                      hoveredSectionId={designMode ? null : hoveredSection}
                      selectedSectionId={designMode ? null : selectedSection}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <DesignModeOverlay
              active={designMode && !isBuilding}
              contentRef={previewContentRef}
              onExit={() => setDesignMode(false)}
            />
            <BlockOverlay
              active={designMode && !isBuilding}
              contentRef={previewContentRef}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

/**
 * Toggle in the editor toolbar. Icon-only when inactive; expands to a
 * labeled pill with an X affordance when active, using the brand
 * orange (#C52B09) that the app chrome already uses.
 */
function DesignModeToggle({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  if (!active) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggle}
        aria-pressed={false}
        title="Design Mode"
        aria-label="Enter Design Mode"
      >
        <Paintbrush className="size-4 text-muted-foreground" />
      </Button>
    )
  }

  return (
    <div
      role="group"
      aria-label="Design Mode active"
      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#C52B09] pl-2.5 pr-1 text-xs font-medium text-white shadow-[0_0_0_3px_rgba(197,43,9,0.15)]"
    >
      <Paintbrush className="size-3.5" />
      <span className="leading-none">Design Mode</span>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Exit Design Mode"
        title="Exit Design Mode"
        className="ml-0.5 inline-flex size-6 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
