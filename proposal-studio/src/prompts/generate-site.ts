import type { BrandTokens, ThemeVariant } from '@/types'

export function generateSitePrompt(
  rfpAnalysis: string,
  tokens: BrandTokens,
  theme: ThemeVariant
): string {
  return `You are a proposal content generator. Create a complete proposal microsite based on the RFP analysis, brand tokens, and selected theme.

RFP Analysis:
${rfpAnalysis}

Brand tokens prefix: ${tokens.tokenPrefix}
Primary color: ${tokens.colors.primary}
Secondary color: ${tokens.colors.secondary}
Headline font: ${tokens.typography.headline.family}
Body font: ${tokens.typography.body.family}

Theme direction: ${theme.label} — ${theme.description}
- Color weight: ${theme.colorWeight}
- Layout density: ${theme.layoutDensity}
- Type scale: ${theme.typeScale}
- Accent usage: ${theme.accentUsage}

Generate a complete proposal site that can be adapted into the Journey template structure currently used by the Lilly demo. Keep the content client-specific and avoid Lilly-specific language unless the RFP is actually for Lilly. Return ONLY valid JSON with no markdown fences:
{
  "metadata": {
    "title": "Proposal title",
    "description": "Brief meta description"
  },
  "sections": [
    {
      "id": "section-uuid",
      "type": "hero",
      "label": "Hero",
      "order": 0,
      "content": {
        "headline": "Compelling proposal headline",
        "subheadline": "Supporting value proposition",
        "body": "Brief intro paragraph",
        "cta": { "text": "Learn More", "url": "#approach" }
      },
      "style": {
        "backgroundColor": "${tokens.colors.primary}",
        "textColor": "#FFFFFF",
        "padding": "80px",
        "layout": "full-width"
      }
    }
  ]
}

Include these section types in order: hero, executive-summary, approach, methodology, timeline, pricing, team, case-studies, contact.
Each section must have a unique id (use format "section-1", "section-2", etc.), meaningful content relevant to the RFP, and style properties using the brand colors.
For approach, methodology, timeline, pricing, team, and case-studies, include 3-6 content.items with specific titles and descriptions so the Journey adapter can populate the executive-summary bento, roadmap, commercials, team, and proof sections.
Write professional, persuasive proposal content. Be specific and detailed.`
}
