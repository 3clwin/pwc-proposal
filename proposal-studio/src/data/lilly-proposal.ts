import type { BrandTokens, ThemeVariant, SiteContent } from '@/types'

export const CRAWL_DURATION_MS = 8500
export const GENERATION_DURATION_MS = 2000

export const LILLY_BRAND_TOKENS: BrandTokens = {
  clientSlug: 'lilly',
  tokenPrefix: '--lds',
  colors: {
    // Lilly's brand palette, verified against live lilly.com CSS custom
    // properties (--lds-color-lilly = #d31710, --lds-color-lilly-* for the
    // full named palette). The core slots map to the design-system slots
    // that templates consume; `named` carries the complete brand palette
    // as it appears in Lilly's brand guide for the proposal's design-system
    // section.
    primary: '#d31710',
    secondary: '#111111',
    tertiary: '#501009',
    neutral: '#818c94',
    accent: '#d31710',
    // The complete Lilly Design System (LDS) utility ramps, pulled verbatim
    // from --lds-color-{family}-{step} custom properties on lilly.com (12
    // steps per family, 005 → 105). These are the colors Lilly's own
    // products pull from for data viz, illustrations, and extended UI.
    palettes: {
      red: [
        '#fbf5f4', '#f9eeed', '#ffdad4', '#f6b8ae', '#fd9485',
        '#f7513f', '#d31710', '#9f180f', '#6e1911', '#501009',
        '#3d0101', '#2d0000',
      ],
      neutral: [
        '#f5f5f5', '#f0f0f0', '#e2e2e2', '#c5c5c5', '#afafaf',
        '#8a8a8a', '#6a6a6a', '#505050', '#3a3a3a', '#282828',
        '#191919', '#111111',
      ],
      stone: [
        '#f3f7fa', '#ebf2f7', '#d8e4ec', '#bbc7cf', '#a5b1b9',
        '#818c94', '#606c73', '#465158', '#303b42', '#1e2a30',
        '#0f1b21', '#071218',
      ],
      azure: [
        '#f5f6fc', '#edf1fd', '#d4e3ff', '#a4c9ff', '#86b3f2',
        '#468ee0', '#1b6cba', '#12518e', '#003a6c', '#00284e',
        '#021a35', '#001127',
      ],
      blue: [
        '#f2f7fc', '#e8f2fa', '#cde6f9', '#90cef4', '#4bbbf3',
        '#0696cc', '#00729e', '#025676', '#003e57', '#012c3f',
        '#031c28', '#00131d',
      ],
      teal: [
        '#f0f8fc', '#e5f3f9', '#c3e9f6', '#87d1e6', '#4fbed9',
        '#1899b3', '#00758a', '#0a5969', '#05404c', '#002c36',
        '#041c23', '#00131a',
      ],
      sage: [
        '#f0f8f6', '#e6f4f2', '#beebe6', '#81d5ce', '#54c2b9',
        '#299b93', '#007773', '#005a56', '#02413d', '#022d2c',
        '#011e1b', '#001412',
      ],
      green: [
        '#f0f9f2', '#e7f4ea', '#beeed3', '#79d9ad', '#21c88f',
        '#009f6f', '#007a55', '#005c3f', '#00422c', '#022f1e',
        '#031f13', '#00150b',
      ],
      lime: [
        '#f5f8eb', '#ecf3e1', '#ccebb1', '#9ed676', '#79c343',
        '#539d19', '#3c7908', '#2a5b00', '#1b4300', '#132f00',
        '#0c1e01', '#061400',
      ],
      gold: [
        '#fcf5ed', '#f9f0e0', '#f7e0ac', '#f4c003', '#daaa00',
        '#ac8700', '#846700', '#644d00', '#483700', '#332600',
        '#211801', '#171000',
      ],
      orange: [
        '#fcf5f2', '#fceee7', '#ffdcc6', '#fab88b', '#fb984d',
        '#d7700a', '#a55500', '#7e3f02', '#5b2d00', '#421f00',
        '#2c1201', '#210b00',
      ],
      pink: [
        '#fff4f4', '#fcedee', '#ffd8df', '#f1b8c2', '#f694ab',
        '#f15082', '#ce1562', '#9c1349', '#730932', '#540523',
        '#3a0118', '#26050f',
      ],
      magenta: [
        '#fcedf1', '#fcedf1', '#ffd9e9', '#f7b2d3', '#ff89c9',
        '#ee4baf', '#c2248b', '#970d6b', '#72024e', '#500637',
        '#370324', '#29001a',
      ],
      purple: [
        '#fcf4fc', '#f9edfc', '#d8bbf2', '#cc9bfd', '#cc9bfd',
        '#ab71e9', '#8c45d3', '#6a32a2', '#4d2475', '#371855',
        '#240e3b', '#1b0432',
      ],
      indigo: [
        '#f9f5fc', '#f1effc', '#e2e0f9', '#c1c2f9', '#a5a8ff',
        '#7b80f5', '#565adf', '#393dbd', '#2a2e86', '#1d205f',
        '#121441', '#080a38',
      ],
    },
    // The full Lilly brand palette as it appears in their design system,
    // pulled verbatim from lilly.com's --lds-color-lilly-* tokens. Proposal
    // sites render this through the BrandPalette section so the client
    // sees their real palette, not a derived approximation.
    named: [
      // Core brand
      { name: 'Lilly Red', hex: '#d31710', group: 'brand', reference: 'lilly-red' },
      { name: 'Lilly Pink', hex: '#ffdad4', group: 'brand', reference: 'lilly-pink' },
      { name: 'Lilly Black', hex: '#111111', group: 'brand', reference: 'lilly-black' },
      { name: 'Lilly White', hex: '#ffffff', group: 'brand', reference: 'lilly-white' },
      // Bold family — authoritative, assertive
      { name: 'Bold Brown', hex: '#501009', group: 'bold', reference: 'lilly-bold-brown' },
      { name: 'Bold Blue', hex: '#003a6c', group: 'bold', reference: 'lilly-bold-blue' },
      { name: 'Bold Green', hex: '#00422c', group: 'bold', reference: 'lilly-bold-green' },
      { name: 'Bold Gray', hex: '#818c94', group: 'bold', reference: 'lilly-bold-gray' },
      // Vibrant family — energetic, expressive
      { name: 'Vibrant Coral', hex: '#fd9485', group: 'vibrant', reference: 'lilly-vibrant-coral' },
      { name: 'Vibrant Orange', hex: '#ffdcc6', group: 'vibrant', reference: 'lilly-vibrant-orange' },
      { name: 'Vibrant Gold', hex: '#f4c003', group: 'vibrant', reference: 'lilly-vibrant-gold' },
      { name: 'Vibrant Azure', hex: '#86b3f2', group: 'vibrant', reference: 'lilly-vibrant-azure' },
      // Neutral family — backgrounds and surface tones (each has a paler "-tint" partner)
      { name: 'Neutral Rose', hex: '#f9eeed', group: 'neutral', reference: 'lilly-neutral-rose' },
      { name: 'Neutral Rose Tint', hex: '#fbf5f4', group: 'neutral', reference: 'lilly-neutral-rose-tint' },
      { name: 'Neutral Cream', hex: '#f9f0e0', group: 'neutral', reference: 'lilly-neutral-cream' },
      { name: 'Neutral Cream Tint', hex: '#fcf5ed', group: 'neutral', reference: 'lilly-neutral-cream-tint' },
      { name: 'Neutral Stone', hex: '#d8e4ec', group: 'neutral', reference: 'lilly-neutral-stone' },
      { name: 'Neutral Stone Tint', hex: '#f3f7fa', group: 'neutral', reference: 'lilly-neutral-stone-tint' },
      { name: 'Neutral Sage', hex: '#beebe6', group: 'neutral', reference: 'lilly-neutral-sage' },
      { name: 'Neutral Sage Tint', hex: '#f0f8f6', group: 'neutral', reference: 'lilly-neutral-sage-tint' },
    ],
    // Lilly's full semantic token set, resolved against live lilly.com computed
    // styles (`--lds-g-color-*`). These are the tokens LDS components read
    // directly, grouped the way Lilly's own design system organizes them.
    semantic: [
      {
        label: 'Brand Hierarchy',
        tokens: [
          { name: 'Brand 1', token: '--lds-g-color-brand-1', hex: '#d31710', usage: 'Primary brand fill (Lilly Red)' },
          { name: 'Brand 2', token: '--lds-g-color-brand-2', hex: '#9f180f', usage: 'Brand hover / pressed' },
          { name: 'Brand 3', token: '--lds-g-color-brand-3', hex: '#6e1911', usage: 'Brand deep accent' },
          { name: 'Brand Container 1', token: '--lds-g-color-brand-container-1', hex: '#d31710', usage: 'Container fill, matches Brand 1' },
          { name: 'Brand Container 2', token: '--lds-g-color-brand-container-2', hex: '#9f180f', usage: 'Container fill, matches Brand 2' },
          { name: 'Brand Container 3', token: '--lds-g-color-brand-container-3', hex: '#6e1911', usage: 'Container fill, matches Brand 3' },
          { name: 'On Brand 1', token: '--lds-g-color-on-brand-1', hex: '#ffffff', usage: 'Foreground on any brand fill' },
        ],
      },
      {
        label: 'Text & Surface',
        tokens: [
          { name: 'Surface 1', token: '--lds-g-color-surface-1', hex: '#191919', usage: 'Dark surface' },
          { name: 'Surface 2', token: '--lds-g-color-surface-2', hex: '#3a3a3a', usage: 'Elevated dark surface' },
          { name: 'Surface Inverse 1', token: '--lds-g-color-surface-inverse-1', hex: '#ffffff', usage: 'Light surface' },
          { name: 'Surface Inverse 2', token: '--lds-g-color-surface-inverse-2', hex: '#e2e2e2', usage: 'Elevated light surface' },
          { name: 'Surface Container 1', token: '--lds-g-color-surface-container-1', hex: '#ffffff', usage: 'Card surface' },
          { name: 'On Surface 1', token: '--lds-g-color-on-surface-1', hex: '#191919', usage: 'Primary text' },
          { name: 'On Surface 2', token: '--lds-g-color-on-surface-2', hex: '#3a3a3a', usage: 'Secondary text' },
          { name: 'On Surface 3', token: '--lds-g-color-on-surface-3', hex: '#6a6a6a', usage: 'Tertiary text' },
          { name: 'On Surface Inverse 1', token: '--lds-g-color-on-surface-inverse-1', hex: '#ffffff', usage: 'Text on dark surface' },
        ],
      },
      {
        label: 'Border',
        tokens: [
          { name: 'Border 1', token: '--lds-g-color-border-1', hex: '#111111', usage: 'Strong border' },
          { name: 'Border 2', token: '--lds-g-color-border-2', hex: '#6a6a6a', usage: 'Default border' },
          { name: 'Border 3', token: '--lds-g-color-border-3', hex: '#c5c5c5', usage: 'Subtle border' },
          { name: 'Border Brand 1', token: '--lds-g-color-border-brand-1', hex: '#d31710', usage: 'Brand border' },
          { name: 'Border Brand 2', token: '--lds-g-color-border-brand-2', hex: '#9f180f', usage: 'Brand border (hover)' },
          { name: 'Border Brand 3', token: '--lds-g-color-border-brand-3', hex: '#6e1911', usage: 'Brand border (pressed)' },
          { name: 'Border Disabled 1', token: '--lds-g-color-border-disabled-1', hex: '#6a6a6a', usage: 'Disabled border' },
          { name: 'Border Inverse 1', token: '--lds-g-color-border-inverse-1', hex: '#ffffff', usage: 'Border on dark surface' },
        ],
      },
      {
        label: 'Feedback',
        tokens: [
          { name: 'Success', token: '--lds-g-color-success-1', hex: '#007a55', usage: 'Success fill' },
          { name: 'Success Container', token: '--lds-g-color-success-container-1', hex: '#e7f4ea', usage: 'Success background' },
          { name: 'On Success', token: '--lds-g-color-on-success-1', hex: '#007a55', usage: 'Text on success container' },
          { name: 'On Success 2', token: '--lds-g-color-on-success-2', hex: '#ffffff', usage: 'Text on success fill' },
          { name: 'Warning', token: '--lds-g-color-warning-1', hex: '#a55500', usage: 'Warning fill' },
          { name: 'Warning Container', token: '--lds-g-color-warning-container-1', hex: '#fceee7', usage: 'Warning background' },
          { name: 'On Warning', token: '--lds-g-color-on-warning-1', hex: '#a55500', usage: 'Text on warning container' },
          { name: 'Error', token: '--lds-g-color-error-1', hex: '#9f180f', usage: 'Error fill' },
          { name: 'Error Container', token: '--lds-g-color-error-container-1', hex: '#ffdad4', usage: 'Error background' },
          { name: 'On Error', token: '--lds-g-color-on-error-1', hex: '#9f180f', usage: 'Text on error container' },
          { name: 'Info', token: '--lds-g-color-info-1', hex: '#1b6cba', usage: 'Info fill' },
          { name: 'Info Container', token: '--lds-g-color-info-container-1', hex: '#edf1fd', usage: 'Info background' },
          { name: 'On Info', token: '--lds-g-color-on-info-1', hex: '#1b6cba', usage: 'Text on info container' },
        ],
      },
      {
        label: 'Disabled',
        tokens: [
          { name: 'Disabled', token: '--lds-g-color-disabled-1', hex: '#6a6a6a', usage: 'Disabled fill' },
          { name: 'Disabled Container', token: '--lds-g-color-disabled-container-1', hex: '#c5c5c5', usage: 'Disabled background' },
          { name: 'On Disabled', token: '--lds-g-color-on-disabled-1', hex: '#6a6a6a', usage: 'Text on disabled container' },
          { name: 'On Disabled 2', token: '--lds-g-color-on-disabled-2', hex: '#ffffff', usage: 'Text on disabled fill' },
        ],
      },
    ],
  },
  typography: {
    // Verified against live lilly.com — they run TWO typography systems
    // side by side (inspected on real <h2> and <p> elements):
    //   • Garamond Narrow Condensed (serif) — hero + section HEADLINES
    //     e.g. --lds-g-typography-garamond-heading-1-desktop = 3.75rem / 1.1
    //   • Ringside Sans (sans) — BODY copy, lead paragraphs
    //     e.g. --lds-g-typography-ringside-body-large-desktop = 1.25rem / 1.5
    //   • Ringside Sans Extra Wide (wide-sans) — LABELS, eyebrows, CTAs
    // All three are paid. ProposalCanvas + TypographyTokens resolve these
    // through buildFontStack(), chaining to EB Garamond / Space Grotesk /
    // Bricolage Grotesque via next/font so previews render faithfully.
    headline: {
      family: 'Garamond Narrow Condensed',
      weight: '400',
      category: 'serif',
      source: 'Hoefler & Co — Garamond Narrow Condensed (paid)',
    },
    body: {
      family: 'Ringside Sans',
      weight: '400',
      category: 'sans',
      source: 'Hoefler & Co — Ringside Sans (paid)',
    },
    label: {
      family: 'Ringside Sans Extra Wide',
      weight: '400',
      category: 'wide-sans',
      source: 'Hoefler & Co — Ringside Extra Wide (paid)',
    },
    fontScale: {
      'display-1': { rem: '6.25rem', px: 100, usage: 'Hero headline (desktop)' },
      'display-2': { rem: '3.75rem', px: 60, usage: 'Section display (desktop)' },
      'heading-1': { rem: '3.75rem', px: 60, usage: 'Page heading' },
      'heading-2': { rem: '3rem', px: 48, usage: 'Section heading' },
      'heading-3': { rem: '2.25rem', px: 36, usage: 'Subsection heading' },
      'heading-4': { rem: '2rem', px: 32, usage: 'Card heading' },
      'heading-5': { rem: '1.75rem', px: 28, usage: 'Small heading' },
      'heading-6': { rem: '1.5rem', px: 24, usage: 'Label heading' },
      'body-large': { rem: '1.25rem', px: 20, usage: 'Lead paragraph' },
      'body-medium': { rem: '1rem', px: 16, usage: 'Body text' },
      'body-small': { rem: '0.875rem', px: 14, usage: 'Supporting text' },
      'caption': { rem: '0.875rem', px: 14, usage: 'Caption / footnote' },
      'eyebrow': { rem: '0.875rem', px: 14, usage: 'Eyebrow / overline' },
      'cta-button': { rem: '1.25rem', px: 20, usage: 'Button label (desktop)' },
      'cta-text-link': { rem: '1.25rem', px: 20, usage: 'Text link (desktop)' },
    },
  },
  spacing: {
    '0': { rem: '0', px: 0, usage: 'None' },
    '025': { rem: '0.125rem', px: 2, usage: 'Hairline' },
    '050': { rem: '0.25rem', px: 4, usage: 'Micro gap' },
    '100': { rem: '0.5rem', px: 8, usage: 'Tight element spacing' },
    '150': { rem: '0.75rem', px: 12, usage: 'Compact spacing' },
    '200': { rem: '1rem', px: 16, usage: 'Default content gap' },
    '250': { rem: '1.25rem', px: 20, usage: 'Medium gap' },
    '300': { rem: '1.5rem', px: 24, usage: 'Section internal padding' },
    '400': { rem: '2rem', px: 32, usage: 'Card padding' },
    '500': { rem: '2.5rem', px: 40, usage: 'Component group gap' },
    '600': { rem: '3rem', px: 48, usage: 'Section gap' },
    '700': { rem: '3.5rem', px: 56, usage: 'Large component gap' },
    '800': { rem: '4rem', px: 64, usage: 'Section vertical padding' },
    '900': { rem: '4.5rem', px: 72, usage: 'Feature block spacing' },
    '1000': { rem: '5rem', px: 80, usage: 'Hero vertical padding' },
    '1200': { rem: '6rem', px: 96, usage: 'Page section gap' },
    '1400': { rem: '7rem', px: 112, usage: 'Editorial section break' },
    '1500': { rem: '7.5rem', px: 120, usage: 'Large editorial spacing' },
    '1600': { rem: '8rem', px: 128, usage: 'Major section break' },
    '1700': { rem: '8.5rem', px: 136, usage: 'Hero top/bottom padding' },
    '1800': { rem: '9rem', px: 144, usage: 'Extended editorial hero' },
    '1900': { rem: '9.5rem', px: 152, usage: 'Spacious hero padding' },
    '2000': { rem: '10rem', px: 160, usage: 'Maximum vertical space' },
  },
  radius: {
    '1': { value: '0.75rem', usage: 'Small chips and tags' },
    '2': { value: '1rem', usage: 'Buttons and inputs' },
    '3': { value: '1.25rem', usage: 'Cards' },
    '4': { value: '1.5rem', usage: 'Panels' },
    '5': { value: '1.75rem', usage: 'Feature cards' },
    '6': { value: '2rem', usage: 'Modals' },
    '7': { value: '2.5rem', usage: 'Large containers' },
    '8': { value: '3rem', usage: 'Hero elements' },
    'full': { value: '624.9375rem', usage: 'Pills and avatars' },
  },
  shadow: {
    'bottom-1': { value: '0px 2px 4px 0px rgba(52, 63, 65, 0.2)', usage: 'Subtle elevation' },
    'bottom-2': { value: '0px 2px 4px 0px rgba(52, 63, 65, 0.16), 0px 4px 6px 0px rgba(52, 63, 65, 0.1)', usage: 'Card elevation' },
    'bottom-3': { value: '0px 4px 8px 0px rgba(52, 63, 65, 0.04), 0px 8px 12px 0px rgba(52, 63, 65, 0.12)', usage: 'Dropdown elevation' },
    'bottom-4': { value: '0px 4px 12px 0px rgba(52, 63, 65, 0.08), 0px 18px 28px 0px rgba(52, 63, 65, 0.12)', usage: 'Modal elevation' },
    'top-1': { value: '0px -2px 4px 0px rgba(52, 63, 65, 0.2)', usage: 'Bottom bar elevation' },
    'top-2': { value: '0px -2px 4px 0px rgba(52, 63, 65, 0.16), 0px -4px 6px 0px rgba(52, 63, 65, 0.1)', usage: 'Sticky header elevation' },
  },
  logo: {
    url: 'https://delivery-p137454-e1438138.adobeaemcloud.com/adobe/assets/urn:aaid:aem:2843cade-80ee-42b6-b285-a1450fef6b77/renditions/original/as/LillyLogo_RGB_Red_v3.svg',
    format: 'svg',
  },
  heroImages: [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=80',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1920&q=80',
  ],
  brandVoice: [
    'Science-first and evidence-driven',
    'Warm, human, and purposeful',
    'Confident without being corporate',
    'Clear and accessible — never jargon-heavy',
    'Optimistic about innovation and patient outcomes',
  ],
}

export const LILLY_THEMES: ThemeVariant[] = [
  {
    id: 'catalyze-journey',
    label: 'Journey',
    description:
      'A scroll-driven editorial narrative that mirrors the underlying proposal deck. Cover, executive summary, call to action, foundation, vision, delivery, commercials, team, and case studies — rendered section-by-section with sticky numbered TOC and progress rule.',
    colorWeight: 'light',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'moderate',
    preview: {
      heroStyle: 'Warm rose cover with Garamond display title and Lilly Red "Begin" CTA',
      sectionLayout: 'Scroll-driven editorial narrative with numbered chapter eyebrows and red progress rule',
      navStyle: 'Sticky top bar with TOC scroll-spy',
    },
    tokens: LILLY_BRAND_TOKENS,
  },
  {
    id: 'clinical-authority',
    label: 'Editorial',
    description:
      'NYT Magazine meets a corporate white paper. Garamond display at editorial scale, italic drop-cap leads, 1px accent section hairlines, oversized Garamond stat numerals, and pull quotes with a hanging accent glyph.',
    colorWeight: 'light',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'minimal',
    preview: {
      heroStyle: 'Full-bleed photo hero with serif display headline and red accent CTA',
      sectionLayout: 'Editorial single-column with alternating white and warm stone sections',
      navStyle: 'Sticky minimal top bar with pill CTA',
    },
    tokens: LILLY_BRAND_TOKENS,
  },
  {
    id: 'editorial-science',
    label: 'Atelier',
    description:
      'FT Weekend × gallery catalogue. Strict 60/40 split grid across every section, 4:5 editorial portraiture, accent-dot milestone timelines, Garamond italic display, and warm alternating surfaces.',
    colorWeight: 'medium',
    layoutDensity: 'spacious',
    typeScale: 'editorial',
    accentUsage: 'moderate',
    preview: {
      heroStyle: 'Split hero — serif headline with italic emphasis, image on the right',
      sectionLayout: 'Editorial columns with pull-quotes, photo-led case studies, grayscale portraits',
      navStyle: 'Centered serif wordmark with restrained link set',
    },
    tokens: LILLY_BRAND_TOKENS,
  },
  {
    id: 'bold-momentum',
    label: 'Vanguard',
    description:
      'Linear × Stripe, dark edition. Black canvas throughout with a floating white executive-summary card, accent-ramp horizontal data bars, vertical phase-stack roadmap, and no photography — type and color carry everything.',
    colorWeight: 'dark',
    layoutDensity: 'balanced',
    typeScale: 'modern',
    accentUsage: 'bold',
    preview: {
      heroStyle: 'Dark full-bleed hero with oversized red display type and teal accent divider',
      sectionLayout: 'Color-blocked dark sections with accent feature cards and horizontal roadmap',
      navStyle: 'Translucent overlay nav with bold CTA button',
    },
    tokens: LILLY_BRAND_TOKENS,
  },
]

export const LILLY_SITE_CONTENT: SiteContent = {
  metadata: {
    title: 'Catalyze360 Go-to-Market Transformation — Proposal for Eli Lilly',
    description:
      'A value-led approach grounded in real, day-one impact. Science-first design anchored in measurable outcomes with purposeful AI embedded where it drives real impact.',
    favicon: 'https://www.lilly.com/favicon.ico',
  },
  sections: [
    {
      id: 'hero',
      type: 'hero',
      label: 'Hero',
      content: {
        headline: 'Catalyze360 Go-to-Market Model',
        subheadline: 'Scientific Innovation Through Intelligent Execution',
        body: 'Request for Quote · Feb 6, 2026',
        items: [
          {
            title: 'Value-led execution',
            description: 'Grounded in real, day-one impact.',
          },
          {
            title: 'Science-first design',
            description: 'Anchored in measurable outcomes.',
          },
          {
            title: 'Purposeful AI',
            description: 'Embedded where it drives real impact.',
          },
          {
            title: 'Trusted delivery',
            description: 'In regulated, high-stakes environments.',
          },
          {
            title: 'Rapid innovation',
            description: 'Enabled by automation and AI experimentation.',
          },
        ],
        cta: { text: 'Begin the journey', url: '#executive-summary' },
      },
      style: {
        backgroundColor: '#d31710',
        textColor: '#ffffff',
        padding: '80px',
        layout: 'full-width',
      },
      order: 0,
    },
    {
      id: 'executive-summary',
      type: 'executive-summary',
      label: 'Executive Summary',
      content: {
        headline: 'Executive Summary',
        subheadline: 'PwC is uniquely positioned to deliver this critical External Innovation platform with speed and precision.',
        body: 'Unlocking sustainable R&D productivity, first-class partner experience, and a lasting scientific and competitive edge. Our proposed engagement spans Operating Model Strategy & Design, Organizational Change Management and User Adoption, Technology Assessment and Implementation, and Global Program Delivery — delivered for $1,386,501 after PwC Lilly Partnership Discount and additional investment.',
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 1,
    },
    {
      id: 'challenge',
      type: 'approach',
      label: 'The Challenge',
      content: {
        headline: 'From Scientific Disconnect to Coordinated Discovery',
        subheadline: 'Understanding Your Challenge',
        items: [
          {
            title: 'Fragmented Partner Experience',
            description:
              'Each pillar operates independently using disparate tools and processes, leading to inconsistent partner experiences and limited cross-pillar visibility.',
          },
          {
            title: 'Duplicate Outreach Risk',
            description:
              'Without a shared view, multiple teams may reach out to the same biotech partner, creating confusion and undermining Lilly\'s credibility as a coordinated organization.',
          },
          {
            title: 'No Single Source of Truth',
            description:
              'Partner information is scattered across email, SharePoint, and individual trackers — making it impossible to assess portfolio health or identify collaboration opportunities.',
          },
          {
            title: 'Manual Administrative Burden',
            description:
              'Teams spend excessive time on data entry and status chasing instead of strategic partner engagement and relationship building.',
          },
        ],
      },
      style: {
        backgroundColor: '#f3f7fa',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 2,
    },
    {
      id: 'methodology',
      type: 'methodology',
      label: 'Methodology',
      content: {
        headline: 'One Lilly. Many Doors.',
        subheadline: 'A Trusted Partner Experience Built on a Shared Backbone',
        body: 'Users enter through function-specific front doors that match how each group works, while writing to a shared partner and engagement backbone. This enables enterprise visibility without forcing every team into one rigid workflow. Each function — ExploR&D, Gateway Labs, TuneLab, Ventures, and Corporate BD — maintains its tailored intake and workflow, while all front doors write to shared objects for Partners, Engagements, Contacts, Activities, and Contracts.',
        items: [
          {
            title: 'Clarity Over Complexity',
            description:
              'Reduce internal friction by delivering visible ownership, clear stage definitions, and shared engagement history across all pillars.',
          },
          {
            title: 'Meet Users Where They Are',
            description:
              'Different roles engage differently — but all contribute to one truth. Respect how teams actually work while preserving enterprise visibility.',
          },
          {
            title: 'Human-in-the-Loop Intelligence',
            description:
              'AI is designed as an assistant, not an authority. Build trust with users, support governance, and reinforce accountability in scientific decision-making.',
          },
          {
            title: 'Reduced Cognitive Load',
            description:
              'Minimize manual data entry so teams can focus on relationships, science, and decision quality — driving adoption and long-term value realization.',
          },
          {
            title: 'Trust Through Transparency',
            description:
              'Trust is designed into the experience. Reinforce Lilly\'s credibility as a partner and ensure compliance without slowing innovation.',
          },
        ],
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 3,
    },
    {
      id: 'delivery-approach',
      type: 'approach',
      label: 'Delivery Approach',
      content: {
        headline: 'Delivery Approach',
        subheadline: 'Four Priority Workstreams Organized for Speed',
        items: [
          {
            title: 'Go-to-Market Operating Model Design',
            description:
              'Define the partner journey, QoS framework, Navigator model, cross-pillar pricing, and organizational capabilities. Embed Agile methodology aligned to sprint execution.',
          },
          {
            title: 'Technology Assessment & Implementation',
            description:
              'CRM platform assessment, Salesforce backbone configuration, data model design, integrations, dashboards, and iterative MVP delivery with monthly production releases.',
          },
          {
            title: 'Change Management & User Adoption',
            description:
              'Generate excitement through executive alignment, reinforce adoption by making new ways of working intuitive, and prioritize near-term impact with future enhancements planned.',
          },
          {
            title: 'Global Program Delivery',
            description:
              'Designed for pace and rapid execution while maintaining quality and control. Engage across pillars to align on consistency and scalability using rapid iteration.',
          },
        ],
      },
      style: {
        backgroundColor: '#0f1b21',
        textColor: '#ffffff',
        padding: '64px',
        layout: 'contained',
      },
      order: 4,
    },
    {
      id: 'timeline',
      type: 'timeline',
      label: 'Implementation Roadmap',
      content: {
        headline: 'Implementation Roadmap',
        subheadline: 'From Discovery to Iterative Delivery',
        items: [
          {
            title: 'February 2026 — Sprint 0 & Kickoff',
            description:
              'One-day immersive Innovation Sprint workshop. Discover and define challenges, ideate and design solutions, build clickable prototypes, and establish 30-60-90 day action plan.',
          },
          {
            title: 'March 2026 — Discovery Phase',
            description:
              '5-week discovery covering current-state assessment, L1-L3 capability mapping, CRM tool evaluation, technical architecture exploration, and future-state roadmap definition.',
          },
          {
            title: 'April 2026 — MVP Implementation Begins',
            description:
              'Foundation CRM setup, account and contact management, lead and opportunity management, intake flows, document management, and initial reports and dashboards.',
          },
          {
            title: 'May 2026 — MVP Go-Live',
            description:
              'System integration testing, user acceptance testing, deployment, and hypercare support. Transition to iterative release operating model.',
          },
          {
            title: 'June–August 2026 — Post-MVP Releases',
            description:
              'Monthly production releases: request management, chat collaboration, action alerts, AI smart recommendations, self-service, and additional system integrations.',
          },
          {
            title: 'September 2026+ — Scale & Optimize',
            description:
              'Portfolio and executive dashboards, advanced search and guided insights, workflow automation, external data enrichment, and partner experience portal.',
          },
        ],
      },
      style: {
        backgroundColor: '#f3f7fa',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 5,
    },
    {
      id: 'team',
      type: 'team',
      label: 'Your Leadership Team',
      content: {
        headline: 'Your Leadership Team',
        subheadline: 'Experienced professionals dedicated to Catalyze360\'s success',
        items: [
          {
            title: 'Nisha Asher',
            description:
              'Operating Model Lead — PwC R&D Advisory Partner driving R&D transformation, M&A, and large-scale organizational design. Led multi-year pharma data lake implementations and enterprise-wide operating model changes.',
          },
          {
            title: 'Erica Yung',
            description:
              'CRM Technology Lead — PwC Salesforce Partner for CRM, leading large-scale programs from discovery through deployment including core data models, integrations, security design, and role-based user experiences.',
          },
          {
            title: 'Brandon Fisher',
            description:
              'Engagement Manager — 15+ years guiding global pharma clients through complex digital transformations with expertise in maximizing ROI from alliance partner investments.',
          },
          {
            title: 'Ian Bales',
            description:
              'Strategy Specialist — 15+ years spanning clinical research and management consulting. Leads PwC\'s Fit for Launch Accelerator for emerging biopharma and process optimization initiatives.',
          },
          {
            title: 'Sanju PS',
            description:
              'Experience Designer — 17+ years leading Salesforce Experience Design. Recognized with Salesforce Partner Innovation Award for delivering industry-leading partner experiences.',
          },
          {
            title: 'Siddhant Chugh',
            description:
              'Technical Architect — 11+ years leading complex CRM and platform transformations for global pharma/biotech. Specialist in solution architecture, integrations, and data architecture.',
          },
        ],
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 6,
    },
    {
      id: 'pricing',
      type: 'pricing',
      label: 'Investment Overview',
      content: {
        headline: 'Investment Overview',
        body: 'Our pricing is structured to deliver maximum value at each milestone, with a significant partnership investment reflecting our long-term commitment to Catalyze360\'s success. Final fees include a 19% Lilly Partnership Discount and an additional $300,000 PwC investment.',
        items: [
          {
            title: 'Operational Model Strategy & Design',
            description:
              'Includes Global Program Delivery and OCM. Covers QoS framework, Navigator model, cross-pillar pricing, org model, engagement playbooks, and KPI design. Proposed fees: $909,650',
          },
          {
            title: 'CRM Assessment & Implementation',
            description:
              'Platform assessment and recommendation, core CRM configuration, data model, integrations, dashboards, testing, deployment, and post-MVP release planning. Proposed fees: $1,172,450',
          },
          {
            title: 'Total Investment (Post-Discount)',
            description:
              'After 19% Lilly Partnership Discount ($395,599) and PwC Additional Investment ($300,000). Final proposed fees: $1,386,501 excluding expenses.',
          },
        ],
      },
      style: {
        backgroundColor: '#f3f7fa',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 7,
    },
    {
      id: 'case-studies',
      type: 'case-studies',
      label: 'Proven Track Record',
      content: {
        headline: 'Proven Track Record',
        subheadline: 'Results that speak for themselves',
        items: [
          {
            title: 'End-to-End CRM Implementation — Top 5 Global Pharma',
            description:
              'Deployed a global CRM platform across 80+ affiliates in 120+ countries for 15,000 end users. Reduced release lead time from 14 months to 4 months, saved 1 year from deployment roadmap, and achieved 2-digit million CHF annual savings. Increased first-level resolution rate and enhanced CSAT score by 25% within 3 months.',
          },
          {
            title: 'Global CRM Migration — Pharma Separation',
            description:
              'Designed and implemented an integrated cloud-based CRM on Salesforce Health Cloud for a pharma company separating from its parent. Delivered 1,160 story points in first release across 7 countries, including Leads, Opportunities, HCP Profile, Case Management, and Reporting. Led global business process workshops across regions.',
          },
          {
            title: 'Operating Model Transformation — Pre-Clinical Assets',
            description:
              'Implemented a new venture-oriented operating model for a large pharma client to transform discovery-to-development pathways. Redefined stage-gates, candidate evaluation guidelines, and governance. Delivered change management strategy enabling cross-functional collaboration between Discovery, Development, and Pharmaceutical Technology.',
          },
        ],
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#0f1b21',
        padding: '64px',
        layout: 'contained',
      },
      order: 8,
    },
    {
      id: 'contact',
      type: 'contact',
      label: 'Next Steps',
      content: {
        headline: 'Ready to begin the journey.',
        body: 'We would welcome the opportunity to kick off with our Innovation Sprint 0 — a structured, one-day immersive workshop to move from strategic discovery through hands-on design to functional prototypes. Contact Nisha Asher or Erica Yung to schedule.',
        cta: { text: 'Schedule Innovation Sprint 0' },
      },
      style: {
        backgroundColor: '#d31710',
        textColor: '#ffffff',
        padding: '80px',
        layout: 'full-width',
      },
      order: 9,
    },
  ],
}
