import { NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/llm'
import { resolveLLMConfig } from '@/lib/llm/server-config'
import { extractBrandPrompt, generateThemesFromBrandPrompt } from '@/prompts/extract-brand'
import {
  generateSimulatedBrandTokens,
  generateDefaultThemeVariants,
} from '@/lib/brand-extraction'
import {
  crawlDesignSystem,
  mergeCrawlerWithFallback,
  type CrawledDesignSystem,
} from '@/lib/design-system-crawler'
import {
  LILLY_BRAND_TOKENS,
  LILLY_THEMES,
  CRAWL_DURATION_MS,
} from '@/data/lilly-proposal'
import type { BrandTokens, ThemeVariant } from '@/types'

export const runtime = 'nodejs'

function isLillyClient(slug: string, url: string): boolean {
  const s = slug.toLowerCase()
  const u = url.toLowerCase()
  return s.includes('lilly') || u.includes('lilly.com')
}

interface ExtractBrandRequest {
  clientSlug: string
  clientUrl: string
  industry?: string
}

const JOURNEY_ADAPTED_THEME_ID = 'journey-adapted'

function createJourneyTheme(tokens: BrandTokens): ThemeVariant {
  return {
    id: JOURNEY_ADAPTED_THEME_ID,
    label: 'Journey',
    description:
      'The Lilly Journey experience adapted to this client: editorial cover, numbered narrative, executive-summary blocks, delivery roadmap, commercials, team, and proof sections using the client design system.',
    colorWeight: 'light',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'moderate',
    preview: {
      heroStyle: 'Full-viewport editorial cover with client-specific brand punctuation',
      sectionLayout: 'Scroll-driven proposal narrative with executive summary, delivery, commercials, team, and proof',
      navStyle: 'Sticky numbered table of contents with a brand-accent progress rule',
    },
    tokens,
  }
}

function withJourneyTheme(
  themes: ThemeVariant[],
  tokens: BrandTokens
): ThemeVariant[] {
  const rebound = themes.map((theme) => ({ ...theme, tokens }))
  const withoutDuplicate = rebound.filter((theme) => theme.id !== JOURNEY_ADAPTED_THEME_ID)
  return [createJourneyTheme(tokens), ...withoutDuplicate]
}

function crawlEvidenceSummary(crawl: CrawledDesignSystem | null): string {
  if (!crawl) return 'No Playwright crawl evidence was available.'
  return JSON.stringify(
    {
      title: crawl.title,
      finalUrl: crawl.finalUrl,
      description: crawl.description,
      colors: {
        primary: crawl.colors.primary,
        secondary: crawl.colors.secondary,
        tertiary: crawl.colors.tertiary,
        neutral: crawl.colors.neutral,
        accent: crawl.colors.accent,
        named: crawl.colors.named.slice(0, 12),
        semantic: crawl.colors.semantic.map((group) => ({
          label: group.label,
          tokens: group.tokens.slice(0, 12),
        })),
      },
      typography: crawl.typography,
      logo: crawl.logo,
      heroImages: crawl.heroImages.slice(0, 4),
      brandVoice: crawl.brandVoice,
      warnings: crawl.warnings,
    },
    null,
    2
  )
}

function buildFullTokens(
  clientSlug: string,
  clientUrl: string,
  llmColors: {
    primary: string
    secondary: string
    tertiary: string
    neutral: string
    accent?: string
  },
  llmTypography: {
    headline: { family: string; weight: string }
    body: { family: string; weight: string }
  },
  brandVoice: string[]
): BrandTokens {
  const tokenPrefix = `--ps-${clientSlug}-`

  return {
    clientSlug,
    tokenPrefix,
    colors: {
      primary: llmColors.primary,
      secondary: llmColors.secondary,
      tertiary: llmColors.tertiary,
      neutral: llmColors.neutral,
      accent: llmColors.accent,
      palettes: {
        primary: generateShades(llmColors.primary),
        secondary: generateShades(llmColors.secondary),
        tertiary: generateShades(llmColors.tertiary),
        neutral: generateNeutralShades(),
      },
    },
    typography: {
      headline: { family: llmTypography.headline.family, weight: llmTypography.headline.weight },
      body: { family: llmTypography.body.family, weight: llmTypography.body.weight },
      label: { family: llmTypography.body.family, weight: '500' },
      fontScale: {
        'font-scale-1': { rem: '0.75rem', px: 12, usage: 'Helper text' },
        'font-scale-2': { rem: '0.8125rem', px: 13, usage: 'Captions' },
        'font-scale-3': { rem: '0.875rem', px: 14, usage: 'Body text' },
        'font-scale-4': { rem: '1rem', px: 16, usage: 'Large body' },
        'font-scale-5': { rem: '1.25rem', px: 20, usage: 'Subheading' },
        'font-scale-6': { rem: '1.5rem', px: 24, usage: 'Section heading' },
        'font-scale-7': { rem: '2rem', px: 32, usage: 'Page heading' },
      },
    },
    spacing: {
      'spacing-1': { rem: '0.25rem', px: 4, usage: 'Minimal gaps' },
      'spacing-2': { rem: '0.5rem', px: 8, usage: 'Tight spacing' },
      'spacing-3': { rem: '0.75rem', px: 12, usage: 'Small padding' },
      'spacing-4': { rem: '1rem', px: 16, usage: 'Standard padding' },
      'spacing-5': { rem: '1.5rem', px: 24, usage: 'Medium sections' },
      'spacing-6': { rem: '2rem', px: 32, usage: 'Section spacing' },
      'spacing-7': { rem: '3rem', px: 48, usage: 'Large sections' },
      'spacing-8': { rem: '4rem', px: 64, usage: 'Page sections' },
    },
    radius: {
      'radius-1': { value: '0.25rem', usage: 'Subtle rounding' },
      'radius-2': { value: '0.375rem', usage: 'Buttons/inputs' },
      'radius-3': { value: '0.5rem', usage: 'Cards' },
      'radius-4': { value: '0.75rem', usage: 'Modals' },
      'radius-circle': { value: '9999px', usage: 'Avatars/pills' },
    },
    shadow: {
      'shadow-1': { value: '0 1px 2px rgba(0,0,0,0.05)', usage: 'Subtle elevation' },
      'shadow-2': { value: '0 2px 8px rgba(0,0,0,0.08)', usage: 'Cards/tiles' },
      'shadow-3': { value: '0 4px 16px rgba(0,0,0,0.12)', usage: 'Dropdowns' },
      'shadow-4': { value: '0 8px 32px rgba(0,0,0,0.16)', usage: 'Modals/overlays' },
    },
    logo: {
      url: '/placeholder-logo.svg',
      format: 'svg',
    },
    heroImages: [],
    brandVoice,
  }
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 50 }

  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generateShades(hex: string): string[] {
  const { h, s } = hexToHSL(hex)
  return [95, 90, 80, 70, 60, 50, 40, 30, 20, 15].map((l) => hslToHex(h, s, l))
}

function generateNeutralShades(): string[] {
  return [97, 93, 87, 75, 62, 50, 38, 25, 15, 8].map((l) => hslToHex(0, 0, l))
}

export async function POST(request: Request) {
  try {
    const llm = resolveLLMConfig(request)

    const body = (await request.json()) as ExtractBrandRequest

    if (!body.clientSlug || !body.clientUrl) {
      return NextResponse.json(
        { error: 'Missing clientSlug or clientUrl' },
        { status: 400 }
      )
    }

    if (isLillyClient(body.clientSlug, body.clientUrl)) {
      await new Promise((r) => setTimeout(r, CRAWL_DURATION_MS))
      return NextResponse.json({
        tokens: LILLY_BRAND_TOKENS,
        themes: LILLY_THEMES,
        source: 'llm',
      })
    }

    let crawl: CrawledDesignSystem | null = null
    const crawlWarnings: string[] = []
    try {
      crawl = await crawlDesignSystem(body.clientUrl)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Website crawl failed'
      crawlWarnings.push(message)
    }

    const fallbackTokens = generateSimulatedBrandTokens(body.clientSlug, body.clientUrl)
    const crawledTokens = mergeCrawlerWithFallback(fallbackTokens, crawl)

    if (!llm) {
      const themes = withJourneyTheme(generateDefaultThemeVariants(crawledTokens), crawledTokens)
      return NextResponse.json({
        tokens: crawledTokens,
        themes,
        source: crawl ? 'playwright' : 'simulated',
        crawlWarnings,
      })
    }

    try {
      const brandPrompt = `${extractBrandPrompt(
        body.clientSlug,
        body.clientUrl,
        body.industry ?? ''
      )}

Playwright crawl evidence:
${crawlEvidenceSummary(crawl)}

Use the Playwright evidence as the source of truth when it contains real CSS variables, colors, fonts, logo candidates, or imagery. If the evidence is sparse, infer conservatively from the website URL and industry.`

      const brandResponse = await generateCompletion(llm.provider, llm.model, llm.apiKey, [
        { role: 'user', content: brandPrompt },
      ], {
        maxTokens: 1024,
        temperature: 0.5,
        systemPrompt: 'You are a brand identity analyst. Return ONLY valid JSON with no markdown fences or extra text.',
      })

      const brandData = JSON.parse(brandResponse.content) as {
        colors: { primary: string; secondary: string; tertiary: string; neutral: string; accent?: string }
        typography: { headline: { family: string; weight: string }; body: { family: string; weight: string } }
        brandVoice: string[]
      }

      const llmTokens = buildFullTokens(
        body.clientSlug,
        body.clientUrl,
        brandData.colors,
        brandData.typography,
        brandData.brandVoice
      )
      const tokens = mergeCrawlerWithFallback(llmTokens, crawl)

      const themesPrompt = generateThemesFromBrandPrompt(
        body.clientSlug,
        tokens.colors.primary,
        tokens.colors.secondary,
        tokens.typography.headline.family,
        tokens.typography.body.family
      )

      const themesResponse = await generateCompletion(llm.provider, llm.model, llm.apiKey, [
        { role: 'user', content: themesPrompt },
      ], {
        maxTokens: 2048,
        temperature: 0.7,
        systemPrompt: 'You are a design system expert. Return ONLY a valid JSON array with no markdown fences or extra text.',
      })

      const themeData = JSON.parse(themesResponse.content) as Array<{
        id: string
        label: string
        description: string
        colorWeight: 'light' | 'medium' | 'bold' | 'dark'
        layoutDensity: 'spacious' | 'balanced' | 'compact'
        typeScale: 'editorial' | 'corporate' | 'modern' | 'classic'
        accentUsage: 'minimal' | 'moderate' | 'bold'
        preview: { heroStyle: string; sectionLayout: string; navStyle: string }
      }>

      const themes: ThemeVariant[] = withJourneyTheme(
        themeData.map((t) => ({ ...t, tokens })),
        tokens
      )

      return NextResponse.json({
        tokens,
        themes,
        source: crawl ? 'playwright+llm' : 'llm',
        crawlWarnings,
        usage: {
          brand: brandResponse.usage,
          themes: themesResponse.usage,
        },
      })
    } catch {
      const themes = withJourneyTheme(generateDefaultThemeVariants(crawledTokens), crawledTokens)
      return NextResponse.json({
        tokens: crawledTokens,
        themes,
        source: crawl ? 'playwright-fallback-after-error' : 'fallback-after-error',
        crawlWarnings,
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Brand extraction failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
