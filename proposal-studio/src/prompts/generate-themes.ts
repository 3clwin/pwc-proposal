import type { BrandTokens } from '@/types'

export function generateThemesPrompt(tokens: BrandTokens): string {
  return `You are a design system expert. Given the following brand tokens extracted from a client website, generate exactly 4 theme variants for a proposal microsite.

Brand Tokens:
- Primary color: ${tokens.colors.primary}
- Secondary color: ${tokens.colors.secondary}
- Tertiary color: ${tokens.colors.tertiary}
- Neutral color: ${tokens.colors.neutral}
- Headline font: ${tokens.typography.headline.family}
- Body font: ${tokens.typography.body.family}
- Client slug: ${tokens.clientSlug}
- Token prefix: ${tokens.tokenPrefix}

Generate 4 theme variants with these directions:
1. "Corporate Minimal" — light color weight, spacious layout, editorial type scale, minimal accent
2. "Bold & Modern" — bold color weight, balanced layout, modern type scale, bold accent
3. "Editorial Clean" — medium color weight, spacious layout, editorial type scale, moderate accent
4. "Warm & Approachable" — light color weight, balanced layout, classic type scale, moderate accent

Return ONLY valid JSON with no markdown fences. Use this exact structure:
[
  {
    "id": "theme-1",
    "label": "Corporate Minimal",
    "description": "Clean and professional with generous whitespace",
    "colorWeight": "light",
    "layoutDensity": "spacious",
    "typeScale": "editorial",
    "accentUsage": "minimal",
    "preview": { "heroStyle": "centered-text", "sectionLayout": "single-column", "navStyle": "minimal" }
  }
]

Include all 4 themes. Each theme reuses the same brand tokens but varies the visual treatment.`
}
