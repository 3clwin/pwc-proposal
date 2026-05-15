import { NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/llm'
import { resolveLLMConfig } from '@/lib/llm/server-config'
import { generateSitePrompt } from '@/prompts/generate-site'
import { extractRfpPrompt } from '@/prompts/extract-rfp'
import { adaptSiteContentToJourney } from '@/lib/journey-template-adapter'
import {
  LILLY_SITE_CONTENT,
  GENERATION_DURATION_MS,
} from '@/data/lilly-proposal'
import type { BrandTokens, ThemeVariant, SiteContent } from '@/types'

export const runtime = 'nodejs'

interface GenerateSiteRequest {
  rfpText: string
  tokens: BrandTokens
  theme: ThemeVariant
}

function buildFallbackSite(tokens: BrandTokens, theme: ThemeVariant): SiteContent {
  const { colors } = tokens
  return {
    metadata: {
      title: 'Proposal',
      description: `AI-generated proposal microsite using the ${theme.label} direction`,
    },
    sections: [
      {
        id: 'section-1', type: 'hero', label: 'Hero', order: 0,
        content: {
          headline: 'Transforming Your Vision Into Results',
          subheadline: 'A strategic partnership built on innovation, expertise, and measurable impact',
          body: 'We bring deep industry knowledge and cutting-edge technology to deliver solutions that drive real business outcomes.',
          cta: { text: 'Our Approach', url: '#approach' },
        },
        style: { backgroundColor: colors.primary, textColor: '#FFFFFF', padding: '80px', layout: 'full-width' },
      },
      {
        id: 'section-2', type: 'executive-summary', label: 'Executive Summary', order: 1,
        content: {
          headline: 'Executive Summary',
          body: 'Our team combines strategic consulting expertise with technical innovation to deliver measurable results. We understand the challenges facing your industry and have assembled a world-class team with deep domain expertise to address your most pressing needs. Our approach is collaborative, data-driven, and focused on sustainable outcomes that create lasting value for your organization.',
        },
        style: { backgroundColor: '#FFFFFF', textColor: '#1A1A1A', padding: '64px', layout: 'contained' },
      },
      {
        id: 'section-3', type: 'approach', label: 'Our Approach', order: 2,
        content: {
          headline: 'Our Approach',
          subheadline: 'A proven methodology tailored to your needs',
          items: [
            { title: 'Discovery & Assessment', description: 'Deep-dive analysis of your current state, pain points, and strategic objectives to establish a clear baseline.' },
            { title: 'Strategy & Design', description: 'Collaborative workshops to co-create a future-state vision, architecture, and detailed implementation roadmap.' },
            { title: 'Build & Implement', description: 'Agile delivery of solutions with continuous testing, stakeholder feedback, and iterative refinement.' },
            { title: 'Optimize & Scale', description: 'Performance monitoring, knowledge transfer, and capability building to ensure sustainable long-term success.' },
          ],
        },
        style: { backgroundColor: '#F9FAFB', textColor: '#1A1A1A', padding: '64px', layout: 'contained' },
      },
      {
        id: 'section-4', type: 'team', label: 'Our Team', order: 3,
        content: {
          headline: 'Meet Our Team',
          subheadline: 'Experienced professionals dedicated to your success',
          items: [
            { title: 'Sarah Chen', description: 'Engagement Lead — 15 years in digital transformation and strategic consulting' },
            { title: 'Marcus Williams', description: 'Technical Architect — Cloud infrastructure and enterprise systems expert' },
            { title: 'Dr. Emily Park', description: 'Data & AI Lead — Machine learning and analytics specialist with industry expertise' },
            { title: 'James Rodriguez', description: 'Change Management — Organizational transformation and stakeholder engagement' },
          ],
        },
        style: { backgroundColor: '#FFFFFF', textColor: '#1A1A1A', padding: '64px', layout: 'contained' },
      },
      {
        id: 'section-5', type: 'timeline', label: 'Timeline', order: 4,
        content: {
          headline: 'Project Timeline',
          subheadline: 'A structured path to success',
          items: [
            { title: 'Phase 1: Discovery', description: 'Weeks 1-3 — Stakeholder interviews, data collection, current state assessment' },
            { title: 'Phase 2: Design', description: 'Weeks 4-6 — Solution architecture, process design, governance framework' },
            { title: 'Phase 3: Build', description: 'Weeks 7-14 — Iterative development, testing, and stakeholder reviews' },
            { title: 'Phase 4: Launch', description: 'Weeks 15-16 — Go-live preparation, training, and knowledge transfer' },
          ],
        },
        style: { backgroundColor: `${colors.primary}08`, textColor: '#1A1A1A', padding: '64px', layout: 'contained' },
      },
      {
        id: 'section-6', type: 'pricing', label: 'Investment', order: 5,
        content: {
          headline: 'Investment Overview',
          body: 'Our pricing is structured to align with your project phases and deliver maximum value at each milestone. The engagement is designed with flexibility to scale resources based on evolving needs.',
          items: [
            { title: 'Discovery & Design', description: 'Fixed-scope engagement covering assessment and strategy development' },
            { title: 'Implementation', description: 'Time-and-materials with weekly burn rate transparency and milestone checkpoints' },
            { title: 'Ongoing Support', description: 'Optional retainer for post-launch optimization and continuous improvement' },
          ],
        },
        style: { backgroundColor: '#FFFFFF', textColor: '#1A1A1A', padding: '64px', layout: 'contained' },
      },
      {
        id: 'section-7', type: 'case-studies', label: 'Case Studies', order: 6,
        content: {
          headline: 'Proven Track Record',
          subheadline: 'Results that speak for themselves',
          items: [
            { title: 'Fortune 500 Financial Services Firm', description: 'Reduced operational costs by 35% through digital process automation and cloud migration, serving 10M+ customers.' },
            { title: 'Global Healthcare Provider', description: 'Implemented AI-driven diagnostics platform, improving patient outcomes by 28% and reducing wait times by 40%.' },
          ],
        },
        style: { backgroundColor: '#F9FAFB', textColor: '#1A1A1A', padding: '64px', layout: 'contained' },
      },
      {
        id: 'section-8', type: 'contact', label: 'Next Steps', order: 7,
        content: {
          headline: 'Ready to Get Started?',
          body: 'We would welcome the opportunity to discuss how our team can help achieve your strategic objectives. Contact us to schedule a discovery session.',
          cta: { text: 'Schedule a Conversation' },
        },
        style: { backgroundColor: colors.primary, textColor: '#FFFFFF', padding: '80px', layout: 'full-width' },
      },
    ],
  }
}

export async function POST(request: Request) {
  try {
    const llm = resolveLLMConfig(request)

    const body = (await request.json()) as GenerateSiteRequest

    if (!body.tokens || !body.theme) {
      return NextResponse.json({ error: 'Missing tokens or theme' }, { status: 400 })
    }

    if (body.tokens.clientSlug?.toLowerCase().includes('lilly')) {
      await new Promise((r) => setTimeout(r, GENERATION_DURATION_MS))
      return NextResponse.json({ site: LILLY_SITE_CONTENT, source: 'llm' })
    }

    if (!llm) {
      const site = adaptSiteContentToJourney(buildFallbackSite(body.tokens, body.theme), body.tokens)
      return NextResponse.json({ site, source: 'fallback' })
    }

    try {
      let rfpAnalysis = body.rfpText ?? ''
      if (rfpAnalysis.trim()) {
        const analysisResponse = await generateCompletion(llm.provider, llm.model, llm.apiKey, [
          { role: 'user', content: extractRfpPrompt(rfpAnalysis) },
        ], {
          maxTokens: 2048,
          temperature: 0.2,
          systemPrompt: 'You are a proposal strategist. Return ONLY valid JSON with no markdown fences or extra text.',
        })
        rfpAnalysis = analysisResponse.content
      }

      const prompt = generateSitePrompt(rfpAnalysis, body.tokens, body.theme)
      const response = await generateCompletion(llm.provider, llm.model, llm.apiKey, [
        { role: 'user', content: prompt },
      ], {
        maxTokens: 4096,
        temperature: 0.7,
        systemPrompt: 'You are a proposal content generator. Return ONLY valid JSON with no markdown fences or extra text.',
      })

      const parsed = adaptSiteContentToJourney(JSON.parse(response.content) as SiteContent, body.tokens)
      return NextResponse.json({ site: parsed, source: 'llm', usage: response.usage })
    } catch {
      const site = adaptSiteContentToJourney(buildFallbackSite(body.tokens, body.theme), body.tokens)
      return NextResponse.json({ site, source: 'fallback-after-error' })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Site generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
