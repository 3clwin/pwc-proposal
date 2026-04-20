// ============================================================
// Proposal Studio — Type System
// All shared TypeScript interfaces (PRD Section 7)
// ============================================================

// --- Uploaded File ---

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  file: File
  extractedText?: string
}

// --- Brand Tokens ---

/**
 * A single named color from the client's real brand guide.
 * Preserves the human-readable name (e.g. "Lilly Red") and the role group
 * ("brand" | "bold" | "vibrant" | "neutral") so the design-system section
 * on the proposal site can render the palette the way the brand organizes it.
 */
export interface NamedColor {
  /** Human-readable name as it appears in the brand guide. */
  name: string
  /** Hex value (with leading #). */
  hex: string
  /**
   * Optional semantic role. Brand guides typically group colors into a few
   * named families; keeping the group makes the palette view scannable.
   */
  group?: 'brand' | 'bold' | 'vibrant' | 'neutral' | 'support'
  /** Optional reference (e.g. Pantone number or token ID). */
  reference?: string
}

/**
 * A named semantic color token (e.g. `--lds-g-color-text-1`).
 * Carries the human label, the exact CSS custom property name as it appears
 * in the client's design system, and the resolved hex. Populated when the
 * client exposes a full semantic token set (brand, text, surface, border,
 * feedback) so the proposal's design-system view renders their real tokens
 * verbatim instead of approximations.
 */
export interface SemanticColorToken {
  name: string
  token: string
  hex: string
  usage?: string
}

export interface SemanticColorGroup {
  label: string
  tokens: SemanticColorToken[]
}

/**
 * A single typography role (headline, body, label). Carries the real
 * declared family name plus a category hint that tells the font-stack
 * builder which web-safe substitute to chain (e.g. Garamond → EB Garamond
 * serif, Ringside Sans → Space Grotesk sans, Ringside Extra Wide →
 * Bricolage Grotesque wide-sans).
 */
export type FontCategory = 'sans' | 'serif' | 'wide-sans' | 'mono'

export interface TypographyRole {
  family: string
  weight: string
  /** Optional category — defaults to 'sans' when absent. */
  category?: FontCategory
  /** Free-text attribution, e.g. "Hoefler & Co — Ringside Sans (paid)". */
  source?: string
}

export interface BrandTokens {
  clientSlug: string
  tokenPrefix: string
  colors: {
    primary: string
    secondary: string
    tertiary: string
    neutral: string
    accent?: string
    palettes: Record<string, string[]>
    /**
     * The client's real brand palette, organized by name, as published in
     * their brand guide or extracted from their live site. When present,
     * the proposal's design-system section uses these directly so the
     * palette on the proposal matches the palette on the client's website.
     */
    named?: NamedColor[]
    /**
     * Semantic token groups pulled verbatim from the client's live stylesheet
     * (e.g. Brand Hierarchy, Text, Surface, Border, Feedback). Each group
     * becomes a labeled section in the Design System view. When a client
     * doesn't expose semantic tokens, leave this unset and the view falls
     * back to the four semantic slots above.
     */
    semantic?: SemanticColorGroup[]
  }
  typography: {
    headline: TypographyRole
    body: TypographyRole
    label: TypographyRole
    fontScale: Record<string, { rem: string; px: number; usage: string }>
  }
  spacing: Record<string, { rem: string; px: number; usage: string }>
  radius: Record<string, { value: string; usage: string }>
  shadow: Record<string, { value: string; usage: string }>
  logo: {
    url: string
    format: 'svg' | 'png' | 'jpg'
    base64?: string
  }
  heroImages: string[]
  brandVoice: string[]
}

// --- Theme Variant ---

export interface ThemeVariant {
  id: string
  label: string
  description: string
  colorWeight: 'light' | 'medium' | 'bold' | 'dark'
  layoutDensity: 'spacious' | 'balanced' | 'compact'
  typeScale: 'editorial' | 'corporate' | 'modern' | 'classic'
  accentUsage: 'minimal' | 'moderate' | 'bold'
  preview: {
    heroStyle: string
    sectionLayout: string
    navStyle: string
  }
  tokens: BrandTokens
}

// --- Site Content ---

export interface ContentItem {
  title?: string
  description?: string
  icon?: string
  image?: string
}

export interface SiteSection {
  id: string
  type:
    | 'hero'
    | 'executive-summary'
    | 'approach'
    | 'methodology'
    | 'team'
    | 'timeline'
    | 'pricing'
    | 'case-studies'
    | 'contact'
    | 'custom'
  label: string
  content: {
    headline?: string
    subheadline?: string
    body?: string
    items?: ContentItem[]
    cta?: { text: string; url?: string }
    images?: string[]
  }
  style: {
    backgroundColor?: string
    textColor?: string
    padding?: string
    layout?: 'full-width' | 'contained' | 'split'
  }
  order: number
  /**
   * Schema-backed block list. When present, the section renderer reads
   * its layout from these blocks instead of from a hardcoded layout.
   * Right now only the Catalyze "executive-summary" section is
   * schema-backed (`ExecSummaryBlock[]`); other sections leave this
   * undefined and continue to render from their static templates.
   *
   * `unknown[]` keeps this type generic across template families;
   * each template casts to its own block union.
   */
  blocks?: unknown[]
}

export interface SiteContent {
  sections: SiteSection[]
  metadata: {
    title: string
    description: string
    favicon?: string
  }
}

// --- Risk Flag ---

export interface RiskFlag {
  id: string
  sectionId: string
  text: string
  rule: string
  severity: 'high' | 'medium' | 'low'
  status: 'open' | 'dismissed' | 'resolved'
  suggestedReplacement?: string
  position: { start: number; end: number }
}

// --- Saved Client (persisted across sessions) ---

export interface SavedClient {
  id: string
  clientName: string
  clientSlug: string
  industry: string
  /** Optional sector within the industry vertical (e.g. "Pharma and Life Sciences"). */
  sector?: string
  clientUrl: string
  clientContact?: string
}

// --- Project ---

export interface Project {
  id: string
  clientName: string
  clientSlug: string
  projectTitle: string
  industry: string
  /** Optional sector within the industry vertical. */
  sector?: string
  clientUrl: string
  clientContact?: string
  dueDate?: string
  description?: string
  uploadedFiles: UploadedFile[]
  brandTokens: BrandTokens | null
  selectedTheme: ThemeVariant | null
  siteContent: SiteContent | null
  riskFlags: RiskFlag[]
  deploymentUrl?: string
  createdAt: string
  updatedAt: string
}

// --- LLM Configuration ---

export type LLMProvider = 'anthropic' | 'google' | 'openai'

export interface LLMModel {
  id: string
  label: string
  provider: LLMProvider
}

export interface LLMProviderConfig {
  provider: LLMProvider
  label: string
  apiKey: string
  isVerified: boolean
  selectedModel: string
  availableModels: LLMModel[]
}

export interface LLMSettings {
  providers: Record<LLMProvider, LLMProviderConfig>
  defaultProvider: LLMProvider
  defaultModel: string
}

export const AVAILABLE_MODELS: Record<LLMProvider, LLMModel[]> = {
  anthropic: [
    { id: 'claude-4.6-sonnet-medium', label: 'claude-4.6-sonnet-medium', provider: 'anthropic' },
    { id: 'claude-4.6-sonnet-medium-thinking', label: 'claude-4.6-sonnet-medium-thinking', provider: 'anthropic' },
    { id: 'claude-4.6-opus-high', label: 'claude-4.6-opus-high', provider: 'anthropic' },
    { id: 'claude-4.6-opus-max', label: 'claude-4.6-opus-max', provider: 'anthropic' },
    { id: 'claude-4.6-opus-high-thinking', label: 'claude-4.6-opus-high-thinking', provider: 'anthropic' },
    { id: 'claude-4.6-opus-max-thinking', label: 'claude-4.6-opus-max-thinking', provider: 'anthropic' },
  ],
  google: [
    { id: 'gemini-3.1-pro-preview', label: 'gemini-3.1-pro-preview', provider: 'google' },
    { id: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview', provider: 'google' },
  ],
  openai: [
    { id: 'gpt-5.3-codex-high', label: 'gpt-5.3-codex-high', provider: 'openai' },
    { id: 'gpt-5.3-codex-high-fast', label: 'gpt-5.3-codex-high-fast', provider: 'openai' },
    { id: 'gpt-5.4-medium', label: 'gpt-5.4-medium', provider: 'openai' },
    { id: 'gpt-5.4-medium-fast', label: 'gpt-5.4-medium-fast', provider: 'openai' },
    { id: 'gpt-5.4-high', label: 'gpt-5.4-high', provider: 'openai' },
  ],
}

// --- Industry Options ---

/**
 * Two-level industry taxonomy: industry vertical → sector.
 * Matches PwC's public industry grouping so saved clients carry
 * enough detail for tone-of-voice defaults and theme suggestions.
 */
export const INDUSTRY_SECTORS = {
  'Financial Services': [
    'Banking and Capital Markets',
    'Insurance',
    'Asset and Wealth Management',
  ],
  'Health Industries': [
    'Pharma and Life Sciences',
    'Payers and Providers',
    'Medical Technology',
  ],
  'Consumer Markets': [
    'Retail and Consumer',
    'Commerce',
    'Hospitality and Leisure',
  ],
  'Technology, Media & Telecommunications': [
    'Technology',
    'Media and Entertainment',
    'Telecommunications',
  ],
  'Industrial Products': [
    'Manufacturing',
    'Chemicals',
    'Energy and Utilities',
  ],
  'Government & Public Services': ['Public sector', 'Non-profit'],
  Other: ['Other'],
} as const

export const INDUSTRIES = Object.keys(INDUSTRY_SECTORS) as Industry[]

export type Industry = keyof typeof INDUSTRY_SECTORS
export type Sector = (typeof INDUSTRY_SECTORS)[Industry][number]
