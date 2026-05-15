import type {
  BrandTokens,
  FontCategory,
  NamedColor,
  SemanticColorGroup,
  SemanticColorToken,
} from '@/types'

export interface CrawledTypographyRole {
  family: string
  weight: string
  category: FontCategory
  source?: string
}

export interface CrawledDesignSystem {
  url: string
  finalUrl: string
  title: string
  description?: string
  colors: {
    primary?: string
    secondary?: string
    tertiary?: string
    neutral?: string
    accent?: string
    named: NamedColor[]
    semantic: SemanticColorGroup[]
    rawCustomProperties: Array<{ name: string; value: string; hex: string }>
  }
  typography: {
    headline?: CrawledTypographyRole
    body?: CrawledTypographyRole
    label?: CrawledTypographyRole
    observedFamilies: string[]
  }
  spacing: Record<string, { rem: string; px: number; usage: string }>
  radius: Record<string, { value: string; usage: string }>
  shadow: Record<string, { value: string; usage: string }>
  logo?: BrandTokens['logo']
  heroImages: string[]
  brandVoice: string[]
  warnings: string[]
}

interface CrawlOptions {
  timeoutMs?: number
  maxPages?: number
}

type BrowserExtractedDesignSystem = Omit<
  CrawledDesignSystem,
  'url' | 'warnings' | 'spacing' | 'radius' | 'shadow'
>

const DEFAULT_TIMEOUT_MS = 12_000
const MAX_COLORS = 16

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

function pickColor(
  colors: Array<{ hex: string; count?: number; source?: string }>,
  fallback: string
): string {
  return colors.find((c) => c.hex && c.hex !== '#ffffff' && c.hex !== '#000000')?.hex ?? fallback
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

function makeSpacingScale(): CrawledDesignSystem['spacing'] {
  return {
    'spacing-1': { rem: '0.25rem', px: 4, usage: 'Minimal gaps' },
    'spacing-2': { rem: '0.5rem', px: 8, usage: 'Tight spacing' },
    'spacing-3': { rem: '0.75rem', px: 12, usage: 'Small padding' },
    'spacing-4': { rem: '1rem', px: 16, usage: 'Standard padding' },
    'spacing-5': { rem: '1.5rem', px: 24, usage: 'Medium sections' },
    'spacing-6': { rem: '2rem', px: 32, usage: 'Section spacing' },
    'spacing-7': { rem: '3rem', px: 48, usage: 'Large sections' },
    'spacing-8': { rem: '4rem', px: 64, usage: 'Page sections' },
  }
}

function makeRadiusScale(primaryRadius?: string): CrawledDesignSystem['radius'] {
  return {
    'radius-1': { value: '0.25rem', usage: 'Subtle rounding' },
    'radius-2': { value: primaryRadius ?? '0.375rem', usage: 'Buttons/inputs' },
    'radius-3': { value: '0.5rem', usage: 'Cards' },
    'radius-4': { value: '0.75rem', usage: 'Modals' },
    'radius-circle': { value: '9999px', usage: 'Avatars/pills' },
  }
}

function makeShadowScale(primaryShadow?: string): CrawledDesignSystem['shadow'] {
  return {
    'shadow-1': { value: '0 1px 2px rgba(0,0,0,0.05)', usage: 'Subtle elevation' },
    'shadow-2': { value: primaryShadow ?? '0 2px 8px rgba(0,0,0,0.08)', usage: 'Cards/tiles' },
    'shadow-3': { value: '0 4px 16px rgba(0,0,0,0.12)', usage: 'Dropdowns' },
    'shadow-4': { value: '0 8px 32px rgba(0,0,0,0.16)', usage: 'Modals/overlays' },
  }
}

function semanticGroupForName(name: string): string {
  const n = name.toLowerCase()
  if (/(text|copy|foreground|ink)/.test(n)) return 'Text'
  if (/(background|surface|canvas|page)/.test(n)) return 'Surface'
  if (/(border|stroke|outline|rule)/.test(n)) return 'Border'
  if (/(error|danger|success|warning|info|alert)/.test(n)) return 'Feedback'
  if (/(brand|primary|secondary|accent|color)/.test(n)) return 'Brand'
  return 'Support'
}

function buildSemanticGroups(
  raw: Array<{ name: string; value: string; hex: string }>
): SemanticColorGroup[] {
  const groups = new Map<string, SemanticColorToken[]>()
  for (const item of raw.slice(0, 80)) {
    const label = semanticGroupForName(item.name)
    const tokens = groups.get(label) ?? []
    tokens.push({
      name: item.name.replace(/^--/, ''),
      token: item.name,
      hex: item.hex,
      usage: item.value,
    })
    groups.set(label, tokens)
  }
  return Array.from(groups.entries()).map(([label, tokens]) => ({ label, tokens }))
}

function toNamedColors(
  raw: Array<{ name: string; value: string; hex: string }>,
  observed: Array<{ hex: string; count?: number; source?: string }>
): NamedColor[] {
  const named: NamedColor[] = []
  const seen = new Set<string>()

  for (const item of raw) {
    if (seen.has(item.hex)) continue
    seen.add(item.hex)
    named.push({
      name: item.name.replace(/^--/, '').replace(/[-_]/g, ' '),
      hex: item.hex,
      group: semanticGroupForName(item.name) === 'Brand' ? 'brand' : 'support',
      reference: item.name,
    })
    if (named.length >= MAX_COLORS) return named
  }

  for (const item of observed) {
    if (seen.has(item.hex)) continue
    seen.add(item.hex)
    named.push({
      name: item.source ?? `Observed color ${named.length + 1}`,
      hex: item.hex,
      group: named.length < 3 ? 'brand' : 'support',
    })
    if (named.length >= MAX_COLORS) return named
  }

  return named
}

function inferFontCategory(family: string): FontCategory {
  const f = family.toLowerCase()
  if (/(mono|code|jetbrains|consolas|courier)/.test(f)) return 'mono'
  if (/(serif|garamond|times|georgia|baskerville|bodoni)/.test(f)) return 'serif'
  if (/(wide|extended|condensed|display)/.test(f)) return 'wide-sans'
  return 'sans'
}

function cleanFamily(fontFamily: string | undefined): string | undefined {
  if (!fontFamily) return undefined
  return fontFamily
    .split(',')
    .map((part) => part.trim().replace(/^["']|["']$/g, ''))
    .find((part) => part && !/^(system-ui|sans-serif|serif|monospace)$/i.test(part))
}

function resolveImageUrl(src: string | null, baseUrl: string): string | null {
  if (!src) return null
  try {
    return new URL(src, baseUrl).toString()
  } catch {
    return null
  }
}

export async function crawlDesignSystem(
  clientUrl: string,
  options: CrawlOptions = {}
): Promise<CrawledDesignSystem> {
  const url = normalizeUrl(clientUrl)
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const warnings: string[] = []

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1200 },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
    })
    page.setDefaultTimeout(timeoutMs)
    await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs })

    const data = await page.evaluate<BrowserExtractedDesignSystem>(() => {
      function cssColorToHex(value: string): string | null {
        const el = document.createElement('span')
        el.style.color = value
        document.body.appendChild(el)
        const computed = getComputedStyle(el).color
        el.remove()
        const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (!match) return null
        const [, r, g, b] = match
        return `#${[r, g, b]
          .map((v) => Number(v).toString(16).padStart(2, '0'))
          .join('')}`
      }

      function pushColor(
        map: Map<string, { hex: string; count: number; source: string }>,
        value: string,
        source: string
      ) {
        const hex = cssColorToHex(value)
        if (!hex || hex === '#00000000') return
        const existing = map.get(hex)
        map.set(hex, {
          hex,
          count: (existing?.count ?? 0) + 1,
          source: existing?.source ?? source,
        })
      }

      const root = getComputedStyle(document.documentElement)
      const body = getComputedStyle(document.body)
      const rawCustomProperties: Array<{ name: string; value: string; hex: string }> = []

      for (const style of [root, body]) {
        for (let i = 0; i < style.length; i++) {
          const name = style.item(i)
          if (!name.startsWith('--')) continue
          const value = style.getPropertyValue(name).trim()
          const hex = cssColorToHex(value)
          if (hex) rawCustomProperties.push({ name, value, hex })
        }
      }

      const colorMap = new Map<string, { hex: string; count: number; source: string }>()
      const fontCounts = new Map<string, number>()
      const radiusCounts = new Map<string, number>()
      const shadowCounts = new Map<string, number>()
      const sampleElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          'body, main, header, nav, section, article, aside, footer, h1, h2, h3, p, a, button, [class*="card"], [class*="hero"]'
        )
      ).slice(0, 320)

      for (const el of sampleElements) {
        const cs = getComputedStyle(el)
        pushColor(colorMap, cs.color, 'text')
        pushColor(colorMap, cs.backgroundColor, 'surface')
        pushColor(colorMap, cs.borderTopColor, 'border')

        const family = cs.fontFamily
        if (family) fontCounts.set(family, (fontCounts.get(family) ?? 0) + 1)

        if (cs.borderRadius && cs.borderRadius !== '0px') {
          radiusCounts.set(cs.borderRadius, (radiusCounts.get(cs.borderRadius) ?? 0) + 1)
        }
        if (cs.boxShadow && cs.boxShadow !== 'none') {
          shadowCounts.set(cs.boxShadow, (shadowCounts.get(cs.boxShadow) ?? 0) + 1)
        }
      }

      const observedColors = Array.from(colorMap.values()).sort((a, b) => b.count - a.count)
      const fontFamilies = Array.from(fontCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([family]) => family)

      const headlineElement =
        document.querySelector<HTMLElement>('h1') ??
        document.querySelector<HTMLElement>('[class*="hero"] h1, [class*="headline"]')
      const bodyElement = document.querySelector<HTMLElement>('body')
      const labelElement =
        document.querySelector<HTMLElement>('nav, button, [class*="label"], [class*="eyebrow"]') ??
        bodyElement
      const headlineStyle = headlineElement ? getComputedStyle(headlineElement) : undefined
      const bodyStyle = bodyElement ? getComputedStyle(bodyElement) : undefined
      const labelStyle = labelElement ? getComputedStyle(labelElement) : undefined

      const logoCandidate =
        document.querySelector<HTMLImageElement>('img[alt*="logo" i], header img, nav img') ??
        document.querySelector<HTMLImageElement>('img')
      const ogImage = document
        .querySelector<HTMLMetaElement>('meta[property="og:image"], meta[name="twitter:image"]')
        ?.content
      const heroImages = Array.from(document.querySelectorAll<HTMLImageElement>('main img, section img'))
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean)
        .slice(0, 6)

      const title = document.title || document.querySelector('h1')?.textContent?.trim() || ''
      const description =
        document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ??
        document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content ??
        ''

      const primary =
        rawCustomProperties.find((item) => /primary|brand|accent|red|blue|green|orange|purple/i.test(item.name))
          ?.hex ?? observedColors[0]?.hex
      const secondary =
        rawCustomProperties.find((item) => /secondary/i.test(item.name))?.hex ?? observedColors[1]?.hex
      const accent =
        rawCustomProperties.find((item) => /accent|highlight|cta/i.test(item.name))?.hex ?? observedColors[2]?.hex

      return {
        finalUrl: window.location.href,
        title,
        description,
        colors: {
          primary,
          secondary,
          tertiary: observedColors[2]?.hex,
          neutral: observedColors.find((c) => c.source === 'text')?.hex,
          accent,
          named: [],
          semantic: [],
          rawCustomProperties,
        },
        typography: {
          headline: headlineStyle
            ? {
                family: headlineStyle.fontFamily,
                weight: headlineStyle.fontWeight,
                category: 'sans',
              }
            : undefined,
          body: bodyStyle
            ? {
                family: bodyStyle.fontFamily,
                weight: bodyStyle.fontWeight,
                category: 'sans',
              }
            : undefined,
          label: labelStyle
            ? {
                family: labelStyle.fontFamily,
                weight: labelStyle.fontWeight,
                category: 'sans',
              }
            : undefined,
          observedFamilies: fontFamilies,
        },
        logo: logoCandidate
          ? {
              url: logoCandidate.currentSrc || logoCandidate.src,
              format: 'png',
            }
          : undefined,
        heroImages: [...heroImages, ogImage].filter(Boolean) as string[],
        brandVoice: uniqueWords([title, description].join(' ')).slice(0, 6),
        radius: Array.from(radiusCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0],
        shadow: Array.from(shadowCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0],
      } as BrowserExtractedDesignSystem & {
        radius?: string
        shadow?: string
      }

      function uniqueWords(input: string): string[] {
        const words = input
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, ' ')
          .split(/\s+/)
          .filter((word) => word.length > 5)
        return Array.from(new Set(words))
      }
    })

    const observedColors = [
      data.colors.primary,
      data.colors.secondary,
      data.colors.tertiary,
      data.colors.neutral,
      data.colors.accent,
    ]
      .filter((hex): hex is string => Boolean(hex))
      .map((hex, index) => ({ hex, source: index === 0 ? 'Primary' : `Observed ${index + 1}` }))

    const raw = data.colors.rawCustomProperties
    const named = toNamedColors(raw, observedColors)
    const semantic = buildSemanticGroups(raw)
    const observedFamilies = data.typography.observedFamilies
      .map(cleanFamily)
      .filter((family): family is string => Boolean(family))

    const headlineFamily =
      cleanFamily(data.typography.headline?.family) ?? observedFamilies[0] ?? 'Inter'
    const bodyFamily = cleanFamily(data.typography.body?.family) ?? observedFamilies[1] ?? headlineFamily
    const labelFamily = cleanFamily(data.typography.label?.family) ?? bodyFamily

    return {
      url,
      finalUrl: data.finalUrl,
      title: data.title,
      description: data.description,
      colors: {
        primary: pickColor(observedColors, '#2563eb'),
        secondary: data.colors.secondary ?? data.colors.primary ?? '#111827',
        tertiary: data.colors.tertiary ?? '#f3f4f6',
        neutral: data.colors.neutral ?? '#1f2937',
        accent: data.colors.accent,
        named,
        semantic,
        rawCustomProperties: raw,
      },
      typography: {
        headline: {
          family: headlineFamily,
          weight: data.typography.headline?.weight ?? '700',
          category: inferFontCategory(headlineFamily),
          source: 'Crawled from website headline styles',
        },
        body: {
          family: bodyFamily,
          weight: data.typography.body?.weight ?? '400',
          category: inferFontCategory(bodyFamily),
          source: 'Crawled from website body styles',
        },
        label: {
          family: labelFamily,
          weight: data.typography.label?.weight ?? '500',
          category: inferFontCategory(labelFamily),
          source: 'Crawled from website navigation/control styles',
        },
        observedFamilies: unique(observedFamilies),
      },
      spacing: makeSpacingScale(),
      radius: makeRadiusScale(
        (data as BrowserExtractedDesignSystem & { radius?: string }).radius
      ),
      shadow: makeShadowScale(
        (data as BrowserExtractedDesignSystem & { shadow?: string }).shadow
      ),
      logo: data.logo?.url
        ? {
            url: resolveImageUrl(data.logo.url, data.finalUrl) ?? data.logo.url,
            format: data.logo.url.endsWith('.svg') ? 'svg' : 'png',
          }
        : undefined,
      heroImages: unique(
        data.heroImages
          .map((src) => resolveImageUrl(src, data.finalUrl))
          .filter((src): src is string => Boolean(src))
      ).slice(0, 6),
      brandVoice: data.brandVoice.length > 0 ? data.brandVoice : ['credible', 'focused', 'modern'],
      warnings,
    }
  } finally {
    await browser.close()
  }
}

export function mergeCrawlerWithFallback(
  fallback: BrandTokens,
  crawl: CrawledDesignSystem | null
): BrandTokens {
  if (!crawl) return fallback

  return {
    ...fallback,
    colors: {
      ...fallback.colors,
      primary: crawl.colors.primary ?? fallback.colors.primary,
      secondary: crawl.colors.secondary ?? fallback.colors.secondary,
      tertiary: crawl.colors.tertiary ?? fallback.colors.tertiary,
      neutral: crawl.colors.neutral ?? fallback.colors.neutral,
      accent: crawl.colors.accent ?? fallback.colors.accent,
      named: crawl.colors.named.length > 0 ? crawl.colors.named : fallback.colors.named,
      semantic:
        crawl.colors.semantic.length > 0 ? crawl.colors.semantic : fallback.colors.semantic,
    },
    typography: {
      ...fallback.typography,
      headline: crawl.typography.headline ?? fallback.typography.headline,
      body: crawl.typography.body ?? fallback.typography.body,
      label: crawl.typography.label ?? fallback.typography.label,
    },
    spacing: crawl.spacing,
    radius: crawl.radius,
    shadow: crawl.shadow,
    logo: crawl.logo ?? fallback.logo,
    heroImages: crawl.heroImages.length > 0 ? crawl.heroImages : fallback.heroImages,
    brandVoice: crawl.brandVoice.length > 0 ? crawl.brandVoice : fallback.brandVoice,
  }
}
