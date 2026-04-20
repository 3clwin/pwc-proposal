import type { SiteContent } from '@/types'

export function editSectionPrompt(
  siteContent: SiteContent,
  userRequest: string
): string {
  const sectionSummary = siteContent.sections
    .map((s) => `- [${s.id}] ${s.type}: "${s.content.headline ?? s.label}"`)
    .join('\n')

  return `You are a proposal editor. The user wants to modify their proposal site. Apply the requested change and return the updated sections.

Current site sections:
${sectionSummary}

Current site content (full JSON):
${JSON.stringify(siteContent, null, 2).slice(0, 8000)}

User request: "${userRequest}"

Return ONLY valid JSON with no markdown fences. Return the complete updated sections array — include ALL sections, not just changed ones:
{
  "sections": [...],
  "summary": "Brief description of what was changed"
}

If the user asks to add a new section, insert it at the appropriate position and update order values. If they ask to remove or modify, update accordingly.`
}
