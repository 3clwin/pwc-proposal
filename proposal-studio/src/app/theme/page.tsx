'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ThemeGrid } from '@/components/theme-grid'
import { DesignSystemView } from '@/components/design-system-view'
import { ExtractionLoader } from '@/components/extraction-loader'
import { ProposalCanvas } from '@/components/proposal-canvas'
import { useProject } from '@/context/project-context'
import { useLLM } from '@/context/llm-context'
import { getAvailableTemplates } from '@/templates'
import type { BrandTokens, ThemeVariant } from '@/types'

export default function ThemePage() {
  const router = useRouter()
  const { project, dispatch, hydrated } = useProject()
  const { activeProvider, activeModel, activeApiKey } = useLLM()
  const [themes, setThemes] = useState<ThemeVariant[]>([])
  const [tokens, setTokens] = useState<BrandTokens | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<ThemeVariant | null>(null)
  const [loading, setLoading] = useState(true)
  const [building, setBuilding] = useState(false)
  const fetchDone = useRef(false)
  const animDone = useRef(false)
  const didStartExtraction = useRef(false)

  const maybeDismissLoader = useCallback(() => {
    if (fetchDone.current && animDone.current) setLoading(false)
  }, [])

  const handleLoaderComplete = useCallback(() => {
    animDone.current = true
    maybeDismissLoader()
  }, [maybeDismissLoader])

  useEffect(() => {
    if (!hydrated) return
    if (!project.clientSlug) {
      router.push('/intake')
      return
    }

    // Fast-path on reload: brand tokens already exist from a previous
    // session. Restore the theme grid immediately — but only when we
    // haven't kicked off a fresh extraction this session.
    if (project.brandTokens && !didStartExtraction.current) {
      const restoredTokens = project.brandTokens
      const restoredThemes: ThemeVariant[] = getAvailableTemplates(restoredTokens).map((t) => ({
        id: t.id,
        label: t.label,
        description: t.description,
        colorWeight: t.colorWeight,
        layoutDensity: t.layoutDensity,
        typeScale: t.typeScale,
        accentUsage: t.accentUsage,
        preview: t.preview,
        tokens: restoredTokens,
      }))
      setTokens(restoredTokens)
      setThemes(restoredThemes)
      if (project.selectedTheme) {
        const match = restoredThemes.find((t) => t.id === project.selectedTheme?.id)
        setSelectedTheme(match ?? project.selectedTheme)
      }
      setLoading(false)
      return
    }

    if (didStartExtraction.current) return

    async function extractBrand() {
      didStartExtraction.current = true
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'x-llm-provider': activeProvider,
          'x-llm-model': activeModel,
        }

        if (activeApiKey) {
          headers['x-llm-api-key'] = activeApiKey
        }

        const res = await fetch('/api/extract-brand', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            clientSlug: project.clientSlug,
            clientUrl: project.clientUrl,
            industry: project.industry,
          }),
        })

        const data = await res.json() as {
          tokens: BrandTokens
          themes: ThemeVariant[]
          source: string
          error?: string
        }

        if (!res.ok) {
          return
        }

        setTokens(data.tokens)
        setThemes(data.themes)
        dispatch({ type: 'SET_BRAND_TOKENS', payload: data.tokens })
      } catch {
        // Silent — loader already shows extraction in progress, and the
        // page falls back gracefully when tokens are unavailable.
      } finally {
        fetchDone.current = true
        maybeDismissLoader()
      }
    }

    extractBrand()
  }, [hydrated, project.clientSlug, project.clientUrl, project.industry, project.brandTokens, project.selectedTheme, activeProvider, activeModel, activeApiKey, dispatch, router, maybeDismissLoader])

  function handleSelectTheme(theme: ThemeVariant) {
    setSelectedTheme(theme)
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  function handleBuildSite() {
    if (!selectedTheme) return
    setBuilding(true)
    // Wipe any previously-generated site so the editor mounts in its
    // "building" state and re-plays the shimmer every time the user
    // starts a new build. Without this, a stale `siteContent` hydrated
    // from localStorage would skip the shimmer entirely.
    dispatch({ type: 'RESET_SITE_CONTENT' })
    // Go straight to the editor — the generation fetch now runs inside
    // `EditorLayout` with a shimmer skeleton in the preview pane. No
    // more dedicated loading-build route.
    router.push('/editor')
  }

  const activeTokens = selectedTheme?.tokens ?? tokens

  if (loading) {
    return (
      <ExtractionLoader
        caption={project.clientUrl || 'client website'}
        ariaPrefix="Brand extraction"
        onComplete={handleLoaderComplete}
      />
    )
  }

  // Page chrome (h1, description, Tabs shell, sticky footer) stays in
  // Proposal Studio's app chrome — Arial body + Georgia display. Only the
  // preview regions (theme grid, design system view) get wrapped in
  // <ProposalCanvas> so the client design system is shown faithfully in the
  // previews without bleeding into the surrounding UI.
  const previewTokens =
    activeTokens ?? themes[0]?.tokens ?? null

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <h1 className="mb-3 text-3xl font-medium leading-tight text-foreground">
              Choose your proposal direction
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Each theme is a complete design system — typography, layout, and
              tone tuned for a different kind of decision-maker. Pick the one
              that matches how this client thinks, and we&apos;ll build it
              exactly as you see it.
            </p>
          </div>

          <Tabs defaultValue="theme">
            <TabsList>
              <TabsTrigger value="theme">Themes</TabsTrigger>
              <TabsTrigger value="design-system">Design System</TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="mt-8">
              {previewTokens ? (
                <ProposalCanvas tokens={previewTokens}>
                  <ThemeGrid
                    themes={themes}
                    selectedThemeId={selectedTheme?.id ?? null}
                    onSelectTheme={handleSelectTheme}
                  />
                </ProposalCanvas>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No brand tokens available.
                </p>
              )}
            </TabsContent>

            <TabsContent value="design-system" className="mt-6">
              {activeTokens ? (
                <ProposalCanvas tokens={activeTokens}>
                  <DesignSystemView tokens={activeTokens} />
                </ProposalCanvas>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a theme to preview the design system.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border bg-card px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] sm:px-8">
        <div className="flex items-center justify-end">
          <Button
            size="lg"
            disabled={!selectedTheme || building}
            onClick={handleBuildSite}
          >
            {building && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
            Build my site
          </Button>
        </div>
      </div>
    </div>
  )
}
