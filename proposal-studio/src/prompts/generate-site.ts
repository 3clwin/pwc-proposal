import type { BrandTokens, ThemeVariant } from '@/types'

/**
 * Distilled rules from `.cursor/skills/frontend-design` and
 * `.codex/skills/ui-design-master` — embedded into every site-generation
 * prompt so the LLM's content + style hints follow real design discipline
 * instead of generic "AI-slop" defaults (generic fonts, purple gradients,
 * predictable layouts, vague headlines).
 *
 * Keep this in sync with the skills if they change. The skills themselves
 * live outside the repo's source code, so this is the runtime mirror.
 */
const DESIGN_DISCIPLINE = `
DESIGN DISCIPLINE — non-negotiable rules for every generated section.

Aesthetic direction (pick one, commit fully):
- The "theme direction" passed in is your aesthetic brief. Honor its colorWeight, layoutDensity, typeScale, and accentUsage in every styling choice.
- Avoid generic AI defaults: no purple-on-white gradients, no Inter-or-Roboto-by-default copy voice, no predictable "Hero → Features → CTA" cadence with bland headlines.
- A proposal that's restrained-and-precise wins over a proposal that's loud-but-vague. Maximalism only works when every element earns its place.

Typography (voice + hierarchy, not pixel sizes):
- Headlines are short, declarative, and specific. They name a value, not a category. "Reduce claim cycle time by 40%" beats "Driving Operational Excellence."
- Subheadlines support the headline with one concrete commitment, not marketing fluff.
- Body copy is active voice, scannable, and free of consultant cliches: no "synergies," "leverage," "best-in-class," "world-class," "unlock value," "transform your business."
- Every section's headline should make sense even if every other word on the page disappeared.

Layout & spacing (4px grid system):
- All paddings/margins snap to 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 80 / 96px. Never use 5, 6, 7, 9, 10, 11, 13, 15, 17, 18, 22, 30, 50, 70px.
- Font sizes: 12 / 14 / 16 / 20 / 24 / 32 / 40 / 48 / 64px.
- Border radii: 4 / 8 / 12 / 16 / 24px or 9999px (pill). Match the theme's overall personality — tight radii for editorial/corporate, generous for warm/playful.
- Hero/CTA sections: 80px or 96px padding. Standard sections: 64px. Inline cards: 24px or 32px.

Color usage:
- Primary brand color is reserved for high-intent moments (hero background, CTA buttons, accent rules). Don't carpet every section with it.
- Body sections should alternate: white surface → soft tint (use \`\${primary}08\` = 8% alpha) → white surface. Never two heavy color blocks in a row.
- Text-on-color must hit WCAG AA contrast. White on the brand primary is usually safe; pure black on a tint is usually wrong — use the brand's secondary/neutral instead.

Content density (theme-aware):
- spacious layout: 3-4 items per section, breathing room, longer descriptions (2 sentences each).
- balanced layout: 4-6 items, medium descriptions (1-2 sentences).
- compact layout: 6+ items, tight descriptions (1 sentence, ~80 chars).

Anti-patterns (never produce):
- Vague headlines: "Solutions That Drive Results", "Innovation Reimagined", "The Future of X".
- Bullet salad: 8+ items in a single section without grouping.
- Hollow CTAs: "Learn More" on its own. Use specific verbs: "See the 6-week plan", "Walk through pricing", "Meet the engagement lead".
- Section labels that just restate the type: a "Pricing" section labeled "Pricing". Give it a perspective: "Investment", "Engagement model", "How we charge".
`.trim()

export function generateSitePrompt(
  rfpAnalysis: string,
  tokens: BrandTokens,
  theme: ThemeVariant
): string {
  return `You are a proposal content director writing a microsite for ${tokens.clientSlug || 'this client'}. Generate the content + style hints for every section. The HTML rendering is handled by typed React templates downstream — your job is to nail the copy, hierarchy, and styling decisions so the templates produce a proposal that feels designed, not generated.

${DESIGN_DISCIPLINE}

RFP analysis (the buyer's actual asks — ground every section in this):
${rfpAnalysis || "(No RFP analysis provided — write a strong general-purpose proposal using the client's industry and brand voice as your only signal.)"}

Brand tokens:
- Token prefix: ${tokens.tokenPrefix}
- Primary color: ${tokens.colors.primary}
- Secondary color: ${tokens.colors.secondary}
- Headline font: ${tokens.typography.headline.family}
- Body font: ${tokens.typography.body.family}
- Brand voice adjectives: ${tokens.brandVoice?.join(', ') ?? 'credible, focused, modern'}

Theme direction: ${theme.label} — ${theme.description}
- Color weight: ${theme.colorWeight}
- Layout density: ${theme.layoutDensity}
- Type scale: ${theme.typeScale}
- Accent usage: ${theme.accentUsage}

Return ONLY valid JSON with no markdown fences. Schema:
{
  "metadata": {
    "title": "Proposal title — specific to this client and engagement",
    "description": "One-sentence meta description (≤155 chars)"
  },
  "sections": [
    {
      "id": "section-1",
      "type": "hero",
      "label": "Section label shown in nav (perspective, not category — e.g. 'Investment' not 'Pricing')",
      "order": 0,
      "content": {
        "headline": "Specific, declarative headline (value, not category)",
        "subheadline": "One concrete commitment — not marketing fluff",
        "body": "Active-voice paragraph, no consultant cliches",
        "cta": { "text": "Specific verb-led CTA", "url": "#approach" },
        "items": [
          { "title": "Item title", "description": "1-2 sentences depending on layout density" }
        ]
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

Section sequence (in this order, use these exact \`type\` values — IDs go section-1 through section-9):
1. hero — short declarative value statement + supporting commitment + CTA
2. executive-summary — 2-paragraph synthesis of why we'll win this work
3. approach — 3-6 items naming the phases or principles (depends on layout density)
4. methodology — 3-6 items naming concrete practices (e.g. "Weekly working sessions", "Stakeholder shadowing")
5. timeline — 3-6 items in phase format ("Phase 1: Discovery — Weeks 1-3 — ...")
6. pricing — body paragraph framing the model + 3 items (engagement type, billing rhythm, optional support)
7. team — 3-6 items with name, role, and one credibility detail per person
8. case-studies — 2-3 items: client type, outcome, magnitude (use real-feeling specifics)
9. contact — short close + specific verb-led CTA

Style guidance (apply per section, all values from the 4px grid):
- hero & contact: backgroundColor = ${tokens.colors.primary}, textColor = #FFFFFF, padding = "80px", layout = "full-width"
- executive-summary, team, case-studies: backgroundColor = #FFFFFF, textColor = #1A1A1A, padding = "64px", layout = "contained"
- approach, methodology: backgroundColor = #F9FAFB, textColor = #1A1A1A, padding = "64px", layout = "contained"
- timeline: backgroundColor = "${tokens.colors.primary}08" (8% alpha tint), textColor = #1A1A1A, padding = "64px"
- pricing: backgroundColor = #FFFFFF, textColor = #1A1A1A, padding = "64px", layout = "contained"

Critical: every \`items[].title\` and \`items[].description\` is what downstream React templates render in bento, roadmap, commercials, team, and proof sections. Make the item titles short and parallel in structure — they're scannable headings, not sentences.`
}
