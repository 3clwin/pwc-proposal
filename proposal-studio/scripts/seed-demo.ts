/**
 * Seed Demo Data for Proposal Studio
 *
 * Pre-populates a demo project with realistic data for the hackathon presentation.
 * Uses Stripe as the example client with pre-extracted brand tokens and a pre-generated site.
 *
 * Usage: Copy the output JSON and set it in localStorage, or import the data
 * into the project context programmatically.
 */

import type { Project, BrandTokens, ThemeVariant, SiteContent } from '../src/types'

const STRIPE_BRAND_TOKENS: BrandTokens = {
  clientSlug: 'stripe',
  tokenPrefix: '--ps-stripe-',
  colors: {
    primary: '#635BFF',
    secondary: '#0A2540',
    tertiary: '#00D4AA',
    neutral: '#425466',
    accent: '#FF6F61',
    palettes: {
      primary: ['#F5F4FF', '#E8E7FF', '#CBC8FF', '#9E99FF', '#7A73FF', '#635BFF', '#4F48CC', '#3B3699', '#282466', '#141233'],
      secondary: ['#F0F4F8', '#D9E2EC', '#BCCCDC', '#9FB3C8', '#829AB1', '#627D98', '#486581', '#334E68', '#243B53', '#0A2540'],
      tertiary: ['#E6FCF5', '#C3FAE8', '#96F2D7', '#63E6BE', '#38D9A9', '#20C997', '#12B886', '#0CA678', '#099268', '#087F5B'],
      neutral: ['#F8F9FA', '#F1F3F5', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#868E96', '#495057', '#343A40', '#212529'],
    },
  },
  typography: {
    headline: { family: 'Inter', weight: '700', source: 'google' },
    body: { family: 'Inter', weight: '400', source: 'google' },
    label: { family: 'Inter', weight: '500', source: 'google' },
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
  logo: { url: 'https://stripe.com/img/v3/home/twitter.png', format: 'png' },
  heroImages: [],
  brandVoice: ['innovative', 'developer-first', 'reliable', 'global'],
}

const STRIPE_THEME: ThemeVariant = {
  id: 'theme-2',
  label: 'Bold & Modern',
  description: 'High-impact visuals with strong color blocks and modern typography',
  colorWeight: 'bold',
  layoutDensity: 'balanced',
  typeScale: 'modern',
  accentUsage: 'bold',
  preview: { heroStyle: 'full-bleed-color', sectionLayout: 'alternating', navStyle: 'bold' },
  tokens: STRIPE_BRAND_TOKENS,
}

const STRIPE_SITE_CONTENT: SiteContent = {
  metadata: {
    title: 'Cloud Infrastructure Modernization — Stripe',
    description: 'A comprehensive proposal for Stripe\'s cloud infrastructure modernization initiative',
  },
  sections: [
    {
      id: 'section-1', type: 'hero', label: 'Hero', order: 0,
      content: {
        headline: 'Modernizing Stripe\'s Cloud Infrastructure',
        subheadline: 'A strategic partnership to scale payment processing for the next billion transactions',
        body: 'Leveraging deep fintech expertise and cloud-native architecture to build infrastructure that matches Stripe\'s ambition.',
        cta: { text: 'View Our Approach', url: '#approach' },
      },
      style: { backgroundColor: '#635BFF', textColor: '#FFFFFF', padding: '96px 24px', layout: 'full-width' },
    },
    {
      id: 'section-2', type: 'executive-summary', label: 'Executive Summary', order: 1,
      content: {
        headline: 'Executive Summary',
        body: 'We propose a 16-week engagement to modernize Stripe\'s core payment processing infrastructure, reducing latency by 40% while improving system resilience to 99.999% uptime. Our team of cloud architects and fintech specialists will work alongside Stripe\'s engineering team to redesign the data pipeline, implement event-driven microservices, and establish automated deployment practices that ensure regulatory compliance across all markets.',
      },
      style: { backgroundColor: '#FFFFFF', textColor: '#0A2540', padding: '64px 24px', layout: 'contained' },
    },
    {
      id: 'section-3', type: 'approach', label: 'Our Approach', order: 2,
      content: {
        headline: 'Our Approach',
        subheadline: 'Four phases designed for minimal disruption and maximum impact',
        items: [
          { title: 'Phase 1: Infrastructure Audit', description: 'Comprehensive analysis of current architecture, identifying bottlenecks, single points of failure, and optimization opportunities across the payment stack.' },
          { title: 'Phase 2: Architecture Design', description: 'Co-design sessions with Stripe engineering to define the target state: event-driven microservices, multi-region failover, and zero-downtime deployment pipelines.' },
          { title: 'Phase 3: Migration & Build', description: 'Incremental migration using blue-green deployment patterns. Each service is migrated independently with automated rollback capabilities.' },
          { title: 'Phase 4: Optimization & Handoff', description: 'Performance tuning, chaos engineering tests, runbook creation, and comprehensive knowledge transfer to Stripe\'s platform team.' },
        ],
      },
      style: { backgroundColor: '#F5F4FF', textColor: '#0A2540', padding: '64px 24px', layout: 'contained' },
    },
    {
      id: 'section-4', type: 'team', label: 'Team', order: 3,
      content: {
        headline: 'Your Dedicated Team',
        subheadline: 'Senior practitioners with deep fintech and cloud infrastructure experience',
        items: [
          { title: 'Sarah Chen', description: 'Engagement Lead — Former VP Engineering at a top-5 payment processor. 18 years in fintech infrastructure.' },
          { title: 'Alex Kumar', description: 'Cloud Architect — AWS/GCP certified. Led $2B+ payment platform migrations for Fortune 100 clients.' },
          { title: 'Dr. Mia Zhang', description: 'Data Engineering Lead — Specialist in real-time streaming architectures processing 1M+ TPS.' },
          { title: 'James O\'Brien', description: 'Security & Compliance — PCI-DSS QSA. Deep expertise in financial regulatory requirements across 40+ markets.' },
        ],
      },
      style: { backgroundColor: '#FFFFFF', textColor: '#0A2540', padding: '64px 24px', layout: 'contained' },
    },
    {
      id: 'section-5', type: 'timeline', label: 'Timeline', order: 4,
      content: {
        headline: 'Project Timeline',
        subheadline: '16 weeks to production-ready infrastructure',
        items: [
          { title: 'Weeks 1-3: Discovery', description: 'Infrastructure audit, stakeholder alignment, and technical deep-dives with each platform team.' },
          { title: 'Weeks 4-6: Architecture', description: 'Target state design, technology selection, and migration strategy with risk mitigation plans.' },
          { title: 'Weeks 7-13: Build & Migrate', description: 'Iterative migration sprints with weekly demos, automated testing, and continuous monitoring.' },
          { title: 'Weeks 14-16: Optimize & Launch', description: 'Performance benchmarking, chaos engineering, documentation, and team enablement.' },
        ],
      },
      style: { backgroundColor: '#0A2540', textColor: '#FFFFFF', padding: '64px 24px', layout: 'contained' },
    },
    {
      id: 'section-6', type: 'pricing', label: 'Investment', order: 5,
      content: {
        headline: 'Investment Overview',
        body: 'Our engagement is structured to align investment with value delivery at each milestone. We operate with full transparency on resource allocation and weekly burn reporting.',
        items: [
          { title: 'Discovery & Architecture', description: 'Fixed scope — Comprehensive audit and future-state design deliverables' },
          { title: 'Build & Migration', description: 'Time-and-materials with sprint-level forecasting and weekly financial reporting' },
          { title: 'Post-Launch Support', description: '90-day warranty period with optional ongoing optimization retainer' },
        ],
      },
      style: { backgroundColor: '#FFFFFF', textColor: '#0A2540', padding: '64px 24px', layout: 'contained' },
    },
    {
      id: 'section-7', type: 'case-studies', label: 'Case Studies', order: 6,
      content: {
        headline: 'Proven at Scale',
        subheadline: 'We\'ve delivered similar transformations for leading technology companies',
        items: [
          { title: 'Global Payment Processor — 99.999% Uptime', description: 'Migrated legacy monolith to event-driven microservices, achieving five-nines availability while processing 500M daily transactions. Reduced p99 latency from 850ms to 120ms.' },
          { title: 'Digital Banking Platform — 10x Throughput', description: 'Redesigned real-time payment infrastructure to handle 10x transaction volume growth. Implemented multi-region active-active architecture with <100ms cross-region replication.' },
        ],
      },
      style: { backgroundColor: '#F5F4FF', textColor: '#0A2540', padding: '64px 24px', layout: 'contained' },
    },
    {
      id: 'section-8', type: 'contact', label: 'Next Steps', order: 7,
      content: {
        headline: 'Let\'s Build the Future of Payments Together',
        body: 'We\'re ready to start as soon as you are. Schedule a technical deep-dive with our team to discuss your specific infrastructure challenges and goals.',
        cta: { text: 'Schedule a Technical Deep-Dive' },
      },
      style: { backgroundColor: '#635BFF', textColor: '#FFFFFF', padding: '80px 24px', layout: 'full-width' },
    },
  ],
}

export const SEED_PROJECT: Omit<Project, 'uploadedFiles'> & { uploadedFiles: never[] } = {
  id: 'demo-stripe-2026',
  clientName: 'Stripe',
  clientSlug: 'stripe',
  projectTitle: 'Cloud Infrastructure Modernization',
  industry: 'Technology',
  clientUrl: 'https://stripe.com',
  clientContact: 'Patrick Collison',
  dueDate: '2026-05-15',
  description: 'Comprehensive cloud infrastructure modernization to support Stripe\'s next phase of growth in global payment processing.',
  uploadedFiles: [],
  brandTokens: STRIPE_BRAND_TOKENS,
  selectedTheme: STRIPE_THEME,
  siteContent: STRIPE_SITE_CONTENT,
  riskFlags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Print to stdout for easy copy-paste into localStorage
console.log(JSON.stringify(SEED_PROJECT, null, 2))
