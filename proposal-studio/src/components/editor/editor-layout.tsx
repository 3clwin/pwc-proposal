'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Undo2, Redo2, PanelLeftClose, PanelLeftOpen, Paintbrush, X, Loader2, CheckCircle2, ExternalLink } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { AIChat } from './ai-chat'
import { CoverShimmer } from './cover-shimmer'
import { ViewportControls, type ViewportMode } from './viewport-controls'
import { DesignModeOverlay } from './design-mode-overlay'
import { BlockOverlay } from './block-overlay'
import { SectionsSidebar } from './sections-sidebar'
import { EditorTooltip } from './editor-tooltip'
import { RiskModal } from '@/components/editor/risk-modal'
import { DeploySuccessModal } from '@/components/editor/deploy-success-modal'
import { SiteRenderer } from '@/components/generated-site/site-renderer'
import { ApiKeyRequiredDialog } from '@/components/api-key-required-dialog'
import { useProject } from '@/context/project-context'
import { useLLM } from '@/context/llm-context'
import { LILLY_SITE_CONTENT } from '@/data/lilly-proposal'
import type { RiskFlag } from '@/types'

export function EditorLayout() {
  const router = useRouter()
  const { project, dispatch, canUndo, canRedo, hydrated } = useProject()
  const { activeProvider, activeModel, activeApiKey } = useLLM()
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [designMode, setDesignMode] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [inspectorHost, setInspectorHost] = useState<HTMLElement | null>(null)
  const previewContentRef = useRef<HTMLDivElement>(null)
  const previousViewportRef = useRef<Exclude<ViewportMode, 'fullscreen'>>('desktop')
  const generationStartedRef = useRef(false)
  const lillyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Deploy state
  const [scanning, setScanning] = useState(false)
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([])
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [showApiKeyGate, setShowApiKeyGate] = useState(false)
  const deployInFlight = useRef(false)

  const deployedUrl = project.deploymentUrl
  const hasDeployed = Boolean(deployedUrl)

  async function handleDeployClick() {
    if (hasDeployed) {
      setSuccessModalOpen(true)
      return
    }
    if (!project.siteContent || scanning || deploying || deployInFlight.current) return

    setScanning(true)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-llm-provider': activeProvider,
        'x-llm-model': activeModel,
      }
      if (activeApiKey) {
        headers['x-llm-api-key'] = activeApiKey
      }

      const res = await fetch('/api/scan-risk', {
        method: 'POST',
        headers,
        body: JSON.stringify({ siteContent: project.siteContent }),
      })

      const data = (await res.json()) as { flags?: RiskFlag[]; error?: string }

      if (!res.ok) {
        toast.error(data.error ?? 'Risk scan failed')
        return
      }

      const flags = data.flags ?? []
      setRiskFlags(flags)

      if (flags.length === 0) {
        await executeDeploy()
      } else {
        setShowRiskModal(true)
      }
    } catch {
      toast.error('Risk scan failed')
    } finally {
      setScanning(false)
    }
  }

  function handleResolveFlag(flagId: string, status: 'dismissed' | 'resolved') {
    setRiskFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, status } : f)))
    dispatch({ type: 'RESOLVE_RISK_FLAG', payload: { id: flagId, status } })
  }

  async function executeDeploy() {
    if (!project.siteContent || !project.brandTokens) return
    if (hasDeployed) {
      setShowRiskModal(false)
      setSuccessModalOpen(true)
      return
    }
    if (deployInFlight.current) return
    deployInFlight.current = true

    setDeploying(true)
    setShowRiskModal(false)

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteContent: project.siteContent,
          brandTokens: project.brandTokens,
          projectName: `ps-${project.clientSlug || project.id}`,
          projectId: project.id,
        }),
      })

      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        toast.error(data.error ?? 'Deployment failed')
        return
      }

      dispatch({ type: 'SET_DEPLOYMENT_URL', payload: data.url })
      setSuccessModalOpen(true)
      toast.success('Deployed successfully')
    } catch {
      toast.error('Deployment failed')
    } finally {
      setDeploying(false)
      deployInFlight.current = false
    }
  }

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
  const { brandTokens, selectedTheme, siteContent, uploadedFiles } = project

  // Build content. Lilly gets instant client-side content (no API round
  // trip); all other clients go through the server generation endpoint.
  useEffect(() => {
    if (!hydrated) return
    if (siteContent) return
    if (!selectedTheme || !brandTokens) {
      router.push('/theme')
      return
    }
    if (generationStartedRef.current) return
    generationStartedRef.current = true

    // Lilly fast path — content is local, but we still show the shimmer
    // for a few seconds so the build feels intentional. The timer is
    // stored in a ref so effect re-runs (React Strict Mode, dep changes)
    // don't clear it via the cleanup function.
    if (brandTokens.clientSlug?.toLowerCase().includes('lilly')) {
      if (!lillyTimerRef.current) {
        lillyTimerRef.current = setTimeout(() => {
          lillyTimerRef.current = null
          dispatch({ type: 'SET_SITE_CONTENT', payload: LILLY_SITE_CONTENT })
        }, 4500)
      }
      return
    }

    const controller = new AbortController()

    async function generateSite() {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (activeApiKey) {
          headers['x-llm-provider'] = activeProvider
          headers['x-llm-api-key'] = activeApiKey
          headers['x-llm-model'] = activeModel
        } else {
          headers['x-llm-provider'] = activeProvider
          headers['x-llm-model'] = activeModel
        }

        const rfpText = uploadedFiles
          .map((file) => {
            const text = file.extractedText?.trim()
            return text ? `# ${file.name}\n${text}` : ''
          })
          .filter(Boolean)
          .join('\n\n---\n\n')

        const res = await fetch('/api/generate-site', {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            rfpText,
            tokens: brandTokens,
            theme: selectedTheme,
          }),
        })

        const data = await res.json() as {
          site?: typeof siteContent
          error?: string
        }

        if (res.status === 402 || data.error === 'api-key-required') {
          setShowApiKeyGate(true)
          return
        }

        if (!res.ok || !data.site) {
          toast.error(data.error ?? 'Site generation failed')
          return
        }

        dispatch({ type: 'SET_SITE_CONTENT', payload: data.site })
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        toast.error('Site generation failed')
      }
    }

    generateSite()
    return () => controller.abort()
  }, [
    activeApiKey,
    activeModel,
    activeProvider,
    dispatch,
    hydrated,
    brandTokens,
    selectedTheme,
    siteContent,
    uploadedFiles,
    router,
  ])

  // Clean up the Lilly timer on true unmount.
  useEffect(() => {
    return () => {
      if (lillyTimerRef.current) {
        clearTimeout(lillyTimerRef.current)
        lillyTimerRef.current = null
      }
    }
  }, [])

  // Transition to the cover as soon as content is ready — no artificial delay.
  const minDurationElapsed = true

  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSection((prev) => (prev === sectionId ? null : sectionId))
  }, [])

  const handleSectionHover = useCallback((sectionId: string | null) => {
    setHoveredSection(sectionId)
  }, [])

  useEffect(() => {
    if (viewport !== 'fullscreen') {
      previousViewportRef.current = viewport
    }
  }, [viewport])

  const handleFullscreenToggle = useCallback(() => {
    setViewport((current) =>
      current === 'fullscreen' ? previousViewportRef.current : 'fullscreen',
    )
  }, [])

  useEffect(() => {
    if (viewport !== 'fullscreen') return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewport(previousViewportRef.current)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [viewport])

  const viewportWidth =
    viewport === 'tablet'
      ? '768px'
      : viewport === 'mobile'
        ? '375px'
        : '100%'

  const isFullscreen = viewport === 'fullscreen'
  const showChat = !collapsed && !isFullscreen
  const showInspector = designMode && !isFullscreen
  // `isBuilding` gates the preview content: while true, we render a
  // cover-shaped shimmer skeleton in place of the real template.
  // The rest of the editor chrome (chat, preview header) stays live
  // so users don't feel locked out. The min-duration guard guarantees
  // the shimmer plays for the full generation window every time the
  // user starts a new build. Pre-hydration we also treat the editor
  // as "building" so persisted content can land before we decide.
  const isBuilding = !hydrated || !project.siteContent || !minDurationElapsed
  const chatToggleLabel = collapsed ? 'Show chat panel' : 'Hide chat panel'

  return (
    <div className="fixed inset-x-0 top-14 bottom-0 flex overflow-hidden">
      <AnimatePresence initial={false}>
        {showChat && (
          <motion.aside
            key="editor-left-rail"
            initial={{ width: 0, minWidth: 0, x: -24, opacity: 0 }}
            animate={{ width: '20%', minWidth: 280, x: 0, opacity: 1 }}
            exit={{ width: 0, minWidth: 0, x: -24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 36, mass: 0.8 }}
            className={cn(
              'flex shrink-0 flex-col overflow-hidden border-r border-border bg-card',
              'absolute inset-y-0 left-0 z-30 w-[85%] max-w-[320px] shadow-xl',
              'md:relative md:z-auto md:w-auto md:max-w-none md:shadow-none',
            )}
          >
            {designMode ? <SectionsSidebar /> : <AIChat />}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile chat overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 bg-black/20 md:hidden"
            onClick={() => setCollapsed(true)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden bg-muted">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card px-3">
          <div className="flex items-center gap-2">
            <EditorTooltip label={chatToggleLabel}>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={chatToggleLabel}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4 text-muted-foreground" />
                ) : (
                  <PanelLeftClose className="size-4 text-muted-foreground" />
                )}
              </Button>
            </EditorTooltip>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 sm:flex">
            <ViewportControls
              activeViewport={viewport}
              onViewportChange={setViewport}
              url={previewUrl}
              onRefresh={() => setPreviewKey((k) => k + 1)}
              onToggleFullscreen={handleFullscreenToggle}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-0 sm:flex">
              <EditorTooltip label="Undo (⌘Z)" disabledTrigger={!canUndo}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={undo}
                  disabled={!canUndo}
                  aria-label="Undo"
                >
                  <Undo2 className="size-4 text-muted-foreground" />
                </Button>
              </EditorTooltip>
              <EditorTooltip label="Redo (⌘⇧Z)" disabledTrigger={!canRedo}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={redo}
                  disabled={!canRedo}
                  aria-label="Redo"
                >
                  <Redo2 className="size-4 text-muted-foreground" />
                </Button>
              </EditorTooltip>
            </div>
            <DesignModeToggle
              active={designMode}
              onToggle={() => setDesignMode((v) => !v)}
            />
            {hasDeployed ? (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSuccessModalOpen(true)}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="size-4 text-emerald-600" data-icon="inline-start" />
                  <span className="hidden xs:inline">Deployed</span>
                </Button>
                <Button size="sm" variant="outline" asChild className="hidden sm:inline-flex">
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" data-icon="inline-start" />
                    View site
                  </a>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleDeployClick}
                disabled={scanning || deploying || !project.siteContent}
              >
                {(scanning || deploying) && (
                  <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                )}
                {scanning ? 'Scanning…' : deploying ? 'Deploying…' : 'Deploy'}
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="editor-preview-scroll min-h-0 flex-1">
          <div className="relative">
            <motion.div
              layout
              ref={previewContentRef}
              className={cn(
                'mx-auto bg-card transition-[box-shadow] duration-300',
                isFullscreen && 'min-h-[calc(100vh-100px)] overflow-y-auto',
                designMode && 'select-none',
              )}
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8,
                },
              }}
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
            </motion.div>
            <DesignModeOverlay
              active={designMode && !isBuilding}
              contentRef={previewContentRef}
              inspectorHost={inspectorHost}
              onExit={() => setDesignMode(false)}
            />
            <BlockOverlay
              active={designMode && !isBuilding}
              contentRef={previewContentRef}
            />
          </div>
        </ScrollArea>
      </div>

      <AnimatePresence initial={false}>
        {showInspector && (
          <motion.aside
            key="design-inspector-rail"
            ref={setInspectorHost}
            initial={{ width: 0, x: 32, opacity: 0 }}
            animate={{ width: 360, x: 0, opacity: 1 }}
            exit={{ width: 0, x: 32, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 36, mass: 0.8 }}
            className="flex shrink-0 flex-col overflow-hidden border-l border-border bg-card"
          />
        )}
      </AnimatePresence>

      {/* Risk modal */}
      <RiskModal
        open={showRiskModal}
        onClose={() => setShowRiskModal(false)}
        flags={riskFlags}
        onResolve={handleResolveFlag}
        onDeploy={executeDeploy}
        deploying={deploying}
      />

      {/* API-key gate — surfaced when /api/generate-site returns 402 */}
      <ApiKeyRequiredDialog
        open={showApiKeyGate}
        onOpenChange={setShowApiKeyGate}
        returnPath="/editor"
      />

      {deployedUrl && (
        <DeploySuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          url={deployedUrl}
        />
      )}
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
      <EditorTooltip label="Enter Design Mode">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-pressed={false}
          aria-label="Enter Design Mode"
        >
          <Paintbrush className="size-4 text-muted-foreground" />
        </Button>
      </EditorTooltip>
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
      <EditorTooltip label="Exit Design Mode" side="top">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Exit Design Mode"
          className="ml-0.5 inline-flex size-6 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <X className="size-3.5" />
        </button>
      </EditorTooltip>
    </div>
  )
}
