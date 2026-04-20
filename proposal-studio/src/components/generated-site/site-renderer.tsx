'use client'

import React from 'react'
import type { BrandTokens, SiteContent, SiteSection, ThemeVariant } from '@/types'
import { getTemplate } from '@/templates'
import { ProposalCanvas } from '@/components/proposal-canvas'
import { SectionHero } from './section-hero'
import { SectionText } from './section-text'
import { SectionTeam } from './section-team'
import { SectionTimeline } from './section-timeline'
import { SectionPricing } from './section-pricing'
import { SectionCaseStudy } from './section-case-study'

interface SiteRendererProps {
  siteContent: SiteContent
  theme?: ThemeVariant | null
  tokens?: BrandTokens | null
  onSectionClick?: (sectionId: string) => void
  onSectionHover?: (sectionId: string | null) => void
  hoveredSectionId?: string | null
  selectedSectionId?: string | null
}

const SectionComponent = React.memo(function SectionComponent({
  section,
  isHovered,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  section: SiteSection
  isHovered: boolean
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  function renderSection() {
    switch (section.type) {
      case 'hero':
        return <SectionHero section={section} />
      case 'team':
        return <SectionTeam section={section} />
      case 'timeline':
        return <SectionTimeline section={section} />
      case 'pricing':
        return <SectionPricing section={section} />
      case 'case-studies':
        return <SectionCaseStudy section={section} />
      default:
        return <SectionText section={section} />
    }
  }

  return (
    <div
      data-section-id={section.id}
      className="relative cursor-pointer transition-all"
      style={{
        outline: isSelected
          ? '2px solid #2563EB'
          : isHovered
            ? '1px dashed #2563EB'
            : 'none',
        outlineOffset: isSelected ? '-2px' : '-1px',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderSection()}
    </div>
  )
})

export function SiteRenderer({
  siteContent,
  theme,
  tokens,
  onSectionClick,
  onSectionHover,
  hoveredSectionId,
  selectedSectionId,
}: SiteRendererProps) {
  const template = theme ? getTemplate(theme.id) : undefined
  const effectiveTokens = tokens || theme?.tokens

  if (template && effectiveTokens) {
    const TemplateFullSite = template.FullSite
    return (
      <ProposalCanvas tokens={effectiveTokens}>
        <TemplateFullSite
          site={siteContent}
          tokens={effectiveTokens}
          hoveredSectionId={hoveredSectionId}
          selectedSectionId={selectedSectionId}
          onSectionClick={onSectionClick}
          onSectionHover={onSectionHover}
        />
      </ProposalCanvas>
    )
  }

  // Fallback: generic section rendering for themes without a template
  const sortedSections = [...siteContent.sections].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col">
      {sortedSections.map((section) => (
        <SectionComponent
          key={section.id}
          section={section}
          isHovered={hoveredSectionId === section.id}
          isSelected={selectedSectionId === section.id}
          onClick={() => onSectionClick?.(section.id)}
          onMouseEnter={() => onSectionHover?.(section.id)}
          onMouseLeave={() => onSectionHover?.(null)}
        />
      ))}
    </div>
  )
}
