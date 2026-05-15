'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { CATALYZE_JOURNEY_CONTENT, type CatalyzeJourneyContent } from '@/data/catalyze-journey-content'
import { deriveJourneyContent } from '@/lib/journey-template-adapter'
import type { BrandTokens, SiteContent } from '@/types'

const JourneyContentContext = createContext<CatalyzeJourneyContent>(CATALYZE_JOURNEY_CONTENT)

export function JourneyContentProvider({
  site,
  tokens,
  children,
}: {
  site: SiteContent
  tokens: BrandTokens
  children: ReactNode
}) {
  const content = useMemo(() => deriveJourneyContent(site, tokens), [site, tokens])

  return (
    <JourneyContentContext.Provider value={content}>
      {children}
    </JourneyContentContext.Provider>
  )
}

export function useJourneyContent(): CatalyzeJourneyContent {
  return useContext(JourneyContentContext)
}
