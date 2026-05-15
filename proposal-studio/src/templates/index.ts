import { CardPreview as CatalyzeCard } from './catalyze-journey/card-preview'
import { FullSite as CatalyzeFull } from './catalyze-journey/full-site'
import { CardPreview as ClinicalCard } from './clinical-authority/card-preview'
import { FullSite as ClinicalFull } from './clinical-authority/full-site'
import { CardPreview as EditorialCard } from './editorial-science/card-preview'
import { FullSite as EditorialFull } from './editorial-science/full-site'
import { CardPreview as BoldCard } from './bold-momentum/card-preview'
import { FullSite as BoldFull } from './bold-momentum/full-site'

import { TEMPLATE_IDS } from './types'
import type { TemplateDefinition, TemplateId } from './types'
import type { BrandTokens } from '@/types'

export const TEMPLATES: Record<TemplateId, TemplateDefinition> = {
  [TEMPLATE_IDS.CATALYZE_JOURNEY]: {
    id: TEMPLATE_IDS.CATALYZE_JOURNEY,
    label: 'Journey',
    description:
      'A scroll-driven editorial narrative that mirrors the underlying proposal deck. Cover, executive summary, call to action, foundation, vision, delivery, commercials, team, and case studies — rendered section-by-section with a sticky numbered table of contents and a Lilly Red progress rule.',
    accentPreview: ['#d31710', '#111111', '#fbf5f4', '#fcf5ed'],
    colorWeight: 'light',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'moderate',
    preview: {
      heroStyle: 'Warm rose cover with Garamond display title and Lilly Red "Begin" CTA',
      sectionLayout: 'Scroll-driven editorial narrative mirroring the deck, section-by-section with scroll-spy nav',
      navStyle: 'Sticky top bar with numbered TOC (01–08) and red progress rule',
    },
    // Lilly-only gate — this template is tuned to the Catalyze360 deck and
    // renders verbatim deck content, so it only appears for Lilly clients.
    isAvailable: (tokens: BrandTokens) => tokens.clientSlug?.toLowerCase() === 'lilly',
    CardPreview: CatalyzeCard,
    FullSite: CatalyzeFull,
  },
  [TEMPLATE_IDS.JOURNEY_ADAPTED]: {
    id: TEMPLATE_IDS.JOURNEY_ADAPTED,
    label: 'Journey',
    description:
      'The Lilly Journey narrative system adapted to a new client: editorial cover, numbered table of contents, executive-summary blocks, delivery roadmap, commercials, team, and proof sections using the client brand tokens.',
    accentPreview: ['#111111', '#6a6a6a', '#f5f5f5', '#ffffff'],
    colorWeight: 'light',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'moderate',
    preview: {
      heroStyle: 'Full-viewport editorial cover using the client brand accent',
      sectionLayout: 'Scroll-driven Journey structure populated from uploaded documents',
      navStyle: 'Sticky numbered table of contents with branded progress rule',
    },
    isAvailable: (tokens: BrandTokens) => tokens.clientSlug?.toLowerCase() !== 'lilly',
    CardPreview: CatalyzeCard,
    FullSite: CatalyzeFull,
  },
  [TEMPLATE_IDS.CLINICAL_AUTHORITY]: {
    id: TEMPLATE_IDS.CLINICAL_AUTHORITY,
    label: 'Editorial',
    description:
      'NYT Magazine meets a corporate white paper. Garamond display at editorial scale, italic drop-cap leads, 1px accent section hairlines, oversized Garamond stat numerals, and pull quotes with a hanging accent glyph. For executives who value clarity and credibility.',
    // Generic template preview used only when a theme has no client brand
    // tokens attached. ThemeCard derives the real dots from the client's
    // named brand palette whenever one is present.
    accentPreview: ['#d31710', '#111111', '#f3f7fa', '#d8e4ec'],
    colorWeight: 'light',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'minimal',
    preview: {
      heroStyle: 'Full-bleed photo hero with serif display headline and red accent CTA',
      sectionLayout: 'Editorial single-column with alternating white and warm stone sections',
      navStyle: 'Sticky minimal top bar with pill CTA',
    },
    CardPreview: ClinicalCard,
    FullSite: ClinicalFull,
  },
  [TEMPLATE_IDS.EDITORIAL_SCIENCE]: {
    id: TEMPLATE_IDS.EDITORIAL_SCIENCE,
    label: 'Atelier',
    description:
      'FT Weekend × gallery catalogue. Strict 60/40 split grid across every section, 4:5 editorial portraiture, accent-dot milestone timelines, Garamond italic display, and warm surfaces that alternate between white, rose, and cream. For partnership-minded decision makers.',
    accentPreview: ['#d31710', '#6e1911', '#fbf5f4', '#f9eeed'],
    colorWeight: 'medium',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'moderate',
    preview: {
      heroStyle: 'Split hero — serif headline with italic emphasis, image on the right',
      sectionLayout: 'Editorial columns with pull-quotes, photo-led case studies, grayscale portraits',
      navStyle: 'Centered serif wordmark with restrained link set',
    },
    CardPreview: EditorialCard,
    FullSite: EditorialFull,
  },
  [TEMPLATE_IDS.BOLD_MOMENTUM]: {
    id: TEMPLATE_IDS.BOLD_MOMENTUM,
    label: 'Vanguard',
    description:
      'Linear × Stripe, dark edition. Black canvas throughout with a floating white executive-summary card, accent-ramp horizontal data bars, vertical phase-stack roadmap, and no photography — type and color carry everything. For executives who read dense decks at speed.',
    accentPreview: ['#d31710', '#111111', '#191919', '#fd9485'],
    colorWeight: 'dark',
    layoutDensity: 'balanced',
    typeScale: 'modern',
    accentUsage: 'bold',
    preview: {
      heroStyle: 'Dark full-bleed hero with oversized red display type and teal accent divider',
      sectionLayout: 'Color-blocked dark sections with accent feature cards and horizontal roadmap',
      navStyle: 'Translucent overlay nav with bold CTA button',
    },
    CardPreview: BoldCard,
    FullSite: BoldFull,
  },
}

export const TEMPLATE_LIST: TemplateDefinition[] = Object.values(TEMPLATES)

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES[id as TemplateId]
}

/**
 * Return the templates available for a given client. Templates with an
 * `isAvailable` gate (e.g. Catalyze Journey, Lilly-only) are filtered
 * based on the provided brand tokens.
 */
export function getAvailableTemplates(
  tokens: BrandTokens
): TemplateDefinition[] {
  return TEMPLATE_LIST.filter(
    (t) => !t.isAvailable || t.isAvailable(tokens)
  )
}

export { TEMPLATE_IDS }
export type { TemplateDefinition, TemplateId, FullSiteProps } from './types'
