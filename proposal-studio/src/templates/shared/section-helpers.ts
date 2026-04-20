import type { SiteContent, SiteSection } from '@/types'

export function findSection(
  site: SiteContent,
  type: SiteSection['type']
): SiteSection | undefined {
  return site.sections.find((s) => s.type === type)
}

export function findAllSections(
  site: SiteContent,
  type: SiteSection['type']
): SiteSection[] {
  return site.sections.filter((s) => s.type === type)
}

export function sortedSections(site: SiteContent): SiteSection[] {
  return [...site.sections].sort((a, b) => a.order - b.order)
}
