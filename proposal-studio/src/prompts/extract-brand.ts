export function extractBrandPrompt(
  clientSlug: string,
  clientUrl: string,
  industry: string
): string {
  return `You are a brand identity analyst. Return ONLY brand tokens that actually exist in this client's public brand identity — logo, website, marketing materials, or published brand guidelines. Do not invent colors to "fill out" a palette.

Client: ${clientSlug}
Website: ${clientUrl}
Industry: ${industry || 'Not specified'}

CRITICAL BRAND FIDELITY RULES:
- Use the EXACT colors from the client's real brand. If Eli Lilly's red is Pantone 485 C (#f01716), use #f01716 — not "#d31710" or a close approximation.
- Do NOT add accent colors the brand does not use. Many brands (Lilly, Apple, Nike) are deliberately minimal — if the brand uses red + black + white, return red + black + white. Do not invent a teal, gold, or sage just because the template has a slot for it.
- If a slot (tertiary, accent) has no true brand equivalent, return a muted neutral derived from the brand's supporting palette (e.g. charcoal, warm gray) rather than a fabricated hue.
- When uncertain, err on the side of near-black, warm gray, or a tint of the primary — never introduce a hue the brand does not already use.
- Typography must be the brand's real typeface if known (e.g. Lilly uses Ringside). Only fall back to Google Fonts when the real typeface is unavailable.

Return ONLY valid JSON with no markdown fences:
{
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "tertiary": "#hex",
    "neutral": "#hex",
    "accent": "#hex"
  },
  "typography": {
    "headline": { "family": "Font Name", "weight": "700" },
    "body": { "family": "Font Name", "weight": "400" }
  },
  "brandVoice": ["adjective1", "adjective2", "adjective3"]
}

Slot semantics (use to guide which color goes where, not to invent colors):
- primary: the brand's signature color (the one most associated with the logo)
- secondary: the brand's darkest supporting color, usually near-black or deep charcoal
- tertiary: a muted supporting color — often warm gray, stone, or a desaturated shade already present on the site
- neutral: a mid gray used for borders, disabled states, secondary text
- accent: a highlight color the brand actually uses for CTAs or links. If the brand uses its primary for CTAs, set accent equal to primary.

Industry context (use only as a last-resort fallback when real brand data is unavailable):
- Financial services: conservative navies, deep greens
- Technology: modern blues, purples, clean sans-serif
- Healthcare: calming blues, restrained accents (do not default to teal)
- Commerce/retail: warm, engaging colors
- Public sector: trustworthy blues, greens

Brand voice: 3 adjectives describing the real tone of the client's communications. Use sufficient contrast between primary and neutral colors (WCAG AA). Fonts must be real Google Fonts or the client's real typeface.`
}

export function generateThemesFromBrandPrompt(
  clientSlug: string,
  primaryColor: string,
  secondaryColor: string,
  headlineFont: string,
  bodyFont: string
): string {
  return `You are a design system expert. Generate exactly 4 theme variants for a proposal microsite.

Brand:
- Client: ${clientSlug}
- Primary: ${primaryColor}
- Secondary: ${secondaryColor}
- Headline font: ${headlineFont}
- Body font: ${bodyFont}

Generate 4 distinct visual directions. Return ONLY valid JSON array with no markdown fences:
[
  {
    "id": "theme-1",
    "label": "Theme name",
    "description": "One-sentence description of the visual direction",
    "colorWeight": "light|medium|bold|dark",
    "layoutDensity": "spacious|balanced|compact",
    "typeScale": "editorial|corporate|modern|classic",
    "accentUsage": "minimal|moderate|bold",
    "preview": {
      "heroStyle": "centered-text|full-bleed-color|split-layout|gradient-overlay",
      "sectionLayout": "single-column|alternating|editorial|card-grid",
      "navStyle": "minimal|bold|rounded"
    }
  }
]

Make each theme genuinely different in feel — one corporate and restrained, one bold and modern, one editorial and elegant, one warm and approachable.`
}
