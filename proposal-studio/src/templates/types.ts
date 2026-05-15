import type { ComponentType } from 'react'
import type { BrandTokens, SiteContent } from '@/types'

export interface FullSiteProps {
  site: SiteContent
  tokens: BrandTokens
  hoveredSectionId?: string | null
  selectedSectionId?: string | null
  onSectionClick?: (id: string) => void
  onSectionHover?: (id: string | null) => void
}

export interface TemplateDefinition {
  id: string
  label: string
  description: string
  accentPreview: string[]
  colorWeight: 'light' | 'medium' | 'bold' | 'dark'
  layoutDensity: 'spacious' | 'balanced' | 'compact'
  typeScale: 'editorial' | 'corporate' | 'modern' | 'classic'
  accentUsage: 'minimal' | 'moderate' | 'bold'
  preview: {
    heroStyle: string
    sectionLayout: string
    navStyle: string
  }
  CardPreview: ComponentType
  FullSite: ComponentType<FullSiteProps>
  /**
   * Optional gate — return false to hide this template from a client's
   * theme picker. Used for bespoke templates tuned to a specific client
   * (e.g. Catalyze Journey is Lilly-only).
   */
  isAvailable?: (tokens: BrandTokens) => boolean
}

export const TEMPLATE_IDS = {
  CATALYZE_JOURNEY: 'catalyze-journey',
  JOURNEY_ADAPTED: 'journey-adapted',
  CLINICAL_AUTHORITY: 'clinical-authority',
  EDITORIAL_SCIENCE: 'editorial-science',
  BOLD_MOMENTUM: 'bold-momentum',
} as const

export type TemplateId = (typeof TEMPLATE_IDS)[keyof typeof TEMPLATE_IDS]
