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
  return `You are a senior brand designer generating 4 distinct visual directions for a proposal microsite. Each direction is a complete design system — not a color swap of the others.

Brand:
- Client: ${clientSlug}
- Primary: ${primaryColor}
- Secondary: ${secondaryColor}
- Headline font: ${headlineFont}
- Body font: ${bodyFont}

DESIGN DISCIPLINE — apply to every theme:
- Commit to ONE aesthetic vision per theme. Refined minimalism, editorial maximalism, brutalist utility, warm hospitality — pick a real direction and execute it precisely.
- Avoid AI-generic defaults: no generic Inter-and-purple-gradient combos, no "modern + clean + minimal" labels that say nothing.
- The four themes should feel like four different design studios pitching the same client — same brand, four genuinely different points of view.

The four required directions (do not deviate from these archetypes):
1. EDITORIAL — long-form magazine feel. typeScale "editorial", layoutDensity "spacious", accentUsage "minimal", colorWeight "light". Hero is centered text on white/cream, navStyle "minimal".
2. CORPORATE — confident institutional weight. typeScale "corporate", layoutDensity "balanced", accentUsage "moderate", colorWeight "dark". Hero is full-bleed brand color, navStyle "bold".
3. MODERN — energetic, contemporary product feel. typeScale "modern", layoutDensity "balanced", accentUsage "bold", colorWeight "medium". Hero is split-layout or gradient-overlay, navStyle "rounded".
4. WARM — approachable, partnership-forward. typeScale "classic", layoutDensity "spacious", accentUsage "moderate", colorWeight "light". Hero is centered-text with a single brand accent rule, navStyle "minimal".

For each theme:
- Label is 1-2 words, specific to the aesthetic (e.g. "Editorial Quarterly", "Confident Pitch", "Working Brief", "Familiar Hand"). Never use the literal archetype name.
- Description is one sentence naming the FEEL and who it's for. Not "a clean modern design". Bad: "A clean modern theme." Good: "Press-release confidence for buyers who measure proposals against board memos."

Return ONLY valid JSON array with no markdown fences:
[
  {
    "id": "theme-1",
    "label": "Specific 1-2 word name",
    "description": "One-sentence description naming the feel and the buyer it speaks to",
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
]`
}
