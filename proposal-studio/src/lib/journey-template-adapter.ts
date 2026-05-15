import { CATALYZE_JOURNEY_CONTENT, type CatalyzeJourneyContent, type TeamMember } from '@/data/catalyze-journey-content'
import type { BrandTokens, ContentItem, SiteContent, SiteSection } from '@/types'
import type { ExecSummaryBlock } from '@/templates/catalyze-journey/sections/executive-summary.schema'

const JOURNEY_SECTION_TYPES: SiteSection['type'][] = [
  'hero',
  'executive-summary',
  'approach',
  'methodology',
  'timeline',
  'pricing',
  'team',
  'case-studies',
  'contact',
]

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function clientNameFrom(tokens: BrandTokens, site?: SiteContent): string {
  const title = site?.metadata.title?.replace(/\s+proposal$/i, '').trim()
  if (title && title.toLowerCase() !== 'proposal') return title
  return titleCase(tokens.clientSlug || 'Client')
}

function findSection(site: SiteContent | undefined, type: SiteSection['type']): SiteSection | undefined {
  return site?.sections.find((section) => section.type === type)
}

function sectionBody(section: SiteSection | undefined, fallback: string): string {
  return section?.content.body || section?.content.subheadline || fallback
}

function sectionHeadline(section: SiteSection | undefined, fallback: string): string {
  return section?.content.headline || section?.label || fallback
}

function sectionItems(section: SiteSection | undefined, fallback: ContentItem[]): ContentItem[] {
  return section?.content.items && section.content.items.length > 0 ? section.content.items : fallback
}

function monogram(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
  return letters || 'PS'
}

function toTeamMembers(site: SiteContent | undefined, clientName: string): TeamMember[] {
  const fallback = CATALYZE_JOURNEY_CONTENT.team.members
  const team = findSection(site, 'team')
  const items = team?.content.items
  if (!items || items.length === 0) return fallback

  return items.slice(0, 12).map((item, index) => {
    const name = item.title || `Proposal Lead ${index + 1}`
    return {
      name,
      role: item.description?.split('—')[0]?.trim() || (index < 3 ? 'PwC Engagement Lead' : 'PwC Specialist'),
      email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'proposal'}@pwc.com`,
      bio:
        item.description ||
        `Experienced delivery leader focused on helping ${clientName} turn proposal priorities into measurable outcomes.`,
      monogram: monogram(name),
      imageSrc: item.image,
      tier: index < 3 ? 'core' : index < 8 ? 'specialist' : 'lilly-sme',
    }
  })
}

function defaultApproachItems(clientName: string): ContentItem[] {
  return [
    {
      title: 'Grounded in the RFP',
      description: `Translate ${clientName}'s requirements into a clear delivery narrative, workplan, and measurable outcomes.`,
    },
    {
      title: 'Built around the brand',
      description: 'Use the public design system, typography, color semantics, and imagery cues as the proposal surface.',
    },
    {
      title: 'Designed for decision makers',
      description: 'Make the proposal scannable, executive-ready, and easy to evaluate against formal criteria.',
    },
    {
      title: 'Ready to refine',
      description: 'Keep every section editable so the team can tailor proof points, commercials, and delivery details.',
    },
  ]
}

function makeExecBlocks(site: SiteContent, tokens: BrandTokens): ExecSummaryBlock[] {
  const clientName = clientNameFrom(tokens, site)
  const hero = findSection(site, 'hero')
  const exec = findSection(site, 'executive-summary')
  const approach = findSection(site, 'approach') ?? findSection(site, 'methodology')
  const timeline = findSection(site, 'timeline')
  const pricing = findSection(site, 'pricing')
  const team = toTeamMembers(site, clientName)
  const approachItems = sectionItems(approach, defaultApproachItems(clientName))
  const timelineItems = sectionItems(timeline, approachItems)
  const pricingItems = sectionItems(pricing, [
    { title: 'Discovery & design', description: 'Scoped discovery, design, and executive alignment.' },
    { title: 'Implementation', description: 'Phased delivery with transparent checkpoints.' },
    { title: 'Ongoing support', description: 'Optional optimization and enablement support.' },
  ])

  return [
    {
      id: 'es-eyebrow',
      type: 'eyebrow',
      number: '01',
      text: 'Executive Summary',
      rule: true,
    },
    {
      id: 'es-title',
      type: 'display-title',
      text: sectionHeadline(exec, sectionHeadline(hero, `A proposal built for ${clientName}'s next chapter.`)),
    },
    {
      id: 'es-lede',
      type: 'lede',
      text: sectionBody(
        exec,
        sectionBody(hero, `PwC brings a focused team, a practical delivery plan, and a branded proposal experience tuned to ${clientName}'s priorities.`)
      ),
    },
    {
      id: 'es-slide-1-summary',
      type: 'slide-1-summary',
      workstreams: approachItems.slice(0, 4).map((item, index) => ({
        id: `summary-workstream-${index + 1}`,
        label: item.title || `Workstream ${index + 1}`,
        iconKey: (['shield', 'sliders', 'microscope', 'users'] as const)[index % 4],
        iconColor: tokens.colors.primary,
        iconBg: `${tokens.colors.primary}14`,
      })),
      valueProps: approachItems.slice(0, 5).map((item) => item.description || item.title || ''),
      feeHeading: sectionHeadline(pricing, 'Investment overview'),
      feeRows: pricingItems.slice(0, 5).map((item, index) => ({
        label: item.title || `Phase ${index + 1}`,
        amount: index === pricingItems.length - 1 ? 'TBD' : 'Scoped',
        tone: index === pricingItems.length - 1 ? 'total' : 'default',
      })),
    },
    {
      id: 'es-leadership',
      type: 'leadership-grid',
      eyebrow: `Your ${clientName} proposal team`,
      leaders: team.slice(0, 6).map((member, index) => ({
        id: `leader-${index + 1}`,
        name: member.name,
        role: member.role,
        bio: member.bio,
        monogram: member.monogram,
        imageSrc: member.imageSrc,
      })),
    },
    {
      id: 'es-differentiators',
      type: 'differentiator-bento',
      heading: `Why this approach fits ${clientName}`,
      countLabel: `${Math.min(approachItems.length, 4)} differentiators`,
      items: approachItems.slice(0, 4).map((item, index) => ({
        id: `diff-${index + 1}`,
        number: String(index + 1).padStart(2, '0'),
        title: item.title || `Differentiator ${index + 1}`,
        body: item.description || 'A practical advantage grounded in the client brief and delivery context.',
      })),
    },
    {
      id: 'es-workstream-timeline',
      type: 'workstream-timeline',
      eyebrow: 'Delivery plan',
      sectionEyebrow: 'Executive Summary',
      sectionTitle: `Organized around *${Math.min(timelineItems.length, 4)} priority* workstreams`,
      intro:
        sectionBody(timeline, 'The workplan is structured as a staged journey from discovery through launch, adoption, and optimization.'),
      rangeLabel: 'Indicative timeline',
      months: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
      bars: timelineItems.slice(0, 4).map((item, index) => ({
        id: `ws-${index + 1}`,
        label: item.title || `Workstream ${index + 1}`,
        color: [tokens.colors.primary, tokens.colors.secondary, tokens.colors.tertiary, tokens.colors.accent ?? tokens.colors.neutral][index % 4],
        startPhase: Math.max(0, index * 0.08),
        endPhase: Math.min(1, 0.58 + index * 0.12),
        markers: [
          { label: `S${index + 1}`, phase: Math.max(0.12, 0.2 + index * 0.08) },
          { label: 'MVP', phase: Math.min(0.9, 0.58 + index * 0.1) },
        ],
        iconKey: (['shield', 'sliders', 'microscope', 'users'] as const)[index % 4],
        iconColor: tokens.colors.primary,
        iconBg: `${tokens.colors.primary}14`,
        bullets: [
          item.description || 'Define scope, owners, and measurable outcomes.',
          'Sequence work into practical, reviewable increments.',
          'Build adoption and governance into delivery from day one.',
        ],
      })),
      hypercareAt: { barId: 'ws-1', label: 'Hypercare' },
    },
  ]
}

function adaptSectionsToJourney(site: SiteContent, tokens: BrandTokens): SiteSection[] {
  const byType = new Map(site.sections.map((section) => [section.type, section]))
  const existing = site.sections
  const sections = JOURNEY_SECTION_TYPES.map((type, index) => {
    const section = byType.get(type)
    if (section) {
      return {
        ...section,
        id: type === 'hero' ? 'cover' : type,
        order: index,
        blocks: type === 'executive-summary' ? makeExecBlocks(site, tokens) : section.blocks,
      }
    }
    return {
      id: type === 'hero' ? 'cover' : type,
      type,
      label: type
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      order: index,
      content: {},
      style: {},
      blocks: type === 'executive-summary' ? makeExecBlocks(site, tokens) : undefined,
    } satisfies SiteSection
  })

  const extras = existing.filter((section) => !JOURNEY_SECTION_TYPES.includes(section.type))
  return [...sections, ...extras.map((section, offset) => ({ ...section, order: sections.length + offset }))]
}

export function adaptSiteContentToJourney(site: SiteContent, tokens: BrandTokens): SiteContent {
  if (tokens.clientSlug?.toLowerCase() === 'lilly') return site
  return {
    ...site,
    sections: adaptSectionsToJourney(site, tokens),
  }
}

export function deriveJourneyContent(site: SiteContent, tokens: BrandTokens): CatalyzeJourneyContent {
  if (tokens.clientSlug?.toLowerCase() === 'lilly') return CATALYZE_JOURNEY_CONTENT

  const clientName = clientNameFrom(tokens, site)
  const hero = findSection(site, 'hero')
  const exec = findSection(site, 'executive-summary')
  const approach = findSection(site, 'approach') ?? findSection(site, 'methodology')
  const methodology = findSection(site, 'methodology') ?? approach
  const timeline = findSection(site, 'timeline')
  const pricing = findSection(site, 'pricing')
  const cases = findSection(site, 'case-studies')
  const contact = findSection(site, 'contact')
  const teamMembers = toTeamMembers(site, clientName)
  const approachItems = sectionItems(approach, defaultApproachItems(clientName))
  const timelineItems = sectionItems(timeline, approachItems)
  const pricingItems = sectionItems(pricing, [
    { title: 'Discovery & design', description: 'Scoped discovery, design, and executive alignment.' },
    { title: 'Implementation', description: 'Phased delivery with transparent checkpoints.' },
  ])
  const caseItems = sectionItems(cases, CATALYZE_JOURNEY_CONTENT.experience.cases.map((c) => ({
    title: c.title,
    description: c.outcome,
  })))

  return {
    ...CATALYZE_JOURNEY_CONTENT,
    cover: {
      ...CATALYZE_JOURNEY_CONTENT.cover,
      titleMain: sectionHeadline(hero, `A proposal for ${clientName}`),
      titleItalic: sectionBody(hero, 'Built around your priorities.'),
      dateline: site.metadata.description || `Prepared for ${clientName}`,
      tagline: sectionBody(hero, CATALYZE_JOURNEY_CONTENT.cover.tagline),
      ctaLabel: hero?.content.cta?.text || 'Begin',
    },
    executiveSummary: {
      ...CATALYZE_JOURNEY_CONTENT.executiveSummary,
      title: sectionHeadline(exec, `A practical path to outcomes for ${clientName}.`),
      lede: sectionBody(exec, CATALYZE_JOURNEY_CONTENT.executiveSummary.lede),
      leadershipEyebrow: `Your ${clientName} proposal team`,
      leaders: teamMembers.slice(0, 6),
      differentiators: approachItems.slice(0, 4).map((item, index) => ({
        number: String(index + 1).padStart(2, '0'),
        title: item.title || `Differentiator ${index + 1}`,
        body: item.description || 'Grounded in the RFP and tailored to the buyer context.',
      })),
      workstreams: timelineItems.slice(0, 4).map((item, index) => ({
        id: `workstream-${index + 1}`,
        label: item.title || `Workstream ${index + 1}`,
        color: [tokens.colors.primary, tokens.colors.secondary, tokens.colors.tertiary, tokens.colors.accent ?? tokens.colors.neutral][index % 4],
        bullets: [
          item.description || 'Define the workstream scope and outcomes.',
          'Sequence delivery into accountable milestones.',
          'Anchor execution in governance and adoption.',
        ],
      })),
    },
    callToAction: {
      ...CATALYZE_JOURNEY_CONTENT.callToAction,
      eyebrow: 'The opportunity',
      pullQuote: {
        text: sectionBody(exec, `The opportunity is to give ${clientName} a proposal that feels native to its brand, grounded in its documents, and clear enough for fast executive evaluation.`),
        attribution: 'Proposal Studio',
      },
      bodyParagraph: sectionBody(exec, CATALYZE_JOURNEY_CONTENT.callToAction.bodyParagraph),
      transformationTitle: `From fragmented response inputs to a unified ${clientName} proposal story`,
      quagmireLabel: 'From scattered inputs...',
      oneStopLabel: '...to one branded proposal system',
      quagmireBody: 'RFP requirements, prior examples, website design language, and stakeholder priorities often live in separate places.',
      oneStopBody: 'Proposal Studio brings those signals together into a narrative, editable microsite with brand-faithful design tokens.',
    },
    foundation: {
      ...CATALYZE_JOURNEY_CONTENT.foundation,
      eyebrow: 'Foundation',
      title: sectionHeadline(approach, `A proposal foundation tailored to ${clientName}`),
      lede: sectionBody(approach, CATALYZE_JOURNEY_CONTENT.foundation.lede),
      operatingModel: {
        ...CATALYZE_JOURNEY_CONTENT.foundation.operatingModel,
        title: sectionHeadline(methodology, 'Operating model for the work'),
        pillars: approachItems.slice(0, 6).map((item) => ({
          title: item.title || 'Workstream',
          subtitle: clientName,
          body: item.description || 'Defined scope, owners, and outcomes.',
        })),
      },
      successFactors: {
        ...CATALYZE_JOURNEY_CONTENT.foundation.successFactors,
        factors: approachItems.slice(0, 6).map((item) => ({
          title: item.title || 'Success factor',
          body: item.description || 'A focused requirement or differentiator from the client brief.',
        })),
      },
    },
    delivery: {
      ...CATALYZE_JOURNEY_CONTENT.delivery,
      eyebrow: 'Delivery approach',
      title: sectionHeadline(timeline, `A sequenced delivery plan for ${clientName}`),
      lede: sectionBody(timeline, CATALYZE_JOURNEY_CONTENT.delivery.lede),
      sprintZero: {
        ...CATALYZE_JOURNEY_CONTENT.delivery.sprintZero,
        phases: timelineItems.slice(0, 3).map((item, index) => ({
          number: String(index + 1).padStart(2, '0'),
          title: item.title || `Phase ${index + 1}`,
          body: item.description || 'A practical phase in the delivery roadmap.',
          activities: [
            'Confirm scope and success measures',
            'Align owners and governance',
            'Prepare the next delivery increment',
          ],
        })),
      },
    },
    commercials: {
      ...CATALYZE_JOURNEY_CONTENT.commercials,
      eyebrow: 'Commercials',
      title: sectionHeadline(pricing, 'Investment model aligned to outcomes'),
      feeLines: pricingItems.slice(0, 2).map((item, index) => ({
        name: item.title || `Workstream ${index + 1}`,
        amount: 'Scoped',
        deliverables: [
          item.description || 'Defined deliverables and acceptance criteria.',
          'Transparent assumptions and checkpoints.',
          'Delivery governance and reporting.',
        ],
      })),
      headlineFee: {
        value: 'Scoped',
        caption: sectionBody(pricing, 'Investment to be finalized against confirmed scope.'),
      },
      discount: pricingItems.slice(0, 4).map((item, index) => ({
        label: item.title || `Line ${index + 1}`,
        value: index === pricingItems.length - 1 ? 'TBD' : 'Scoped',
      })),
    },
    team: {
      ...CATALYZE_JOURNEY_CONTENT.team,
      eyebrow: 'Team',
      title: sectionHeadline(findSection(site, 'team'), `The team behind the ${clientName} response`),
      lede: sectionBody(findSection(site, 'team'), CATALYZE_JOURNEY_CONTENT.team.lede),
      members: teamMembers,
    },
    experience: {
      ...CATALYZE_JOURNEY_CONTENT.experience,
      eyebrow: 'Proof',
      title: sectionHeadline(cases, 'Relevant experience and proof points'),
      lede: sectionBody(cases, CATALYZE_JOURNEY_CONTENT.experience.lede),
      cases: caseItems.slice(0, 4).map((item, index) => ({
        id: `case-${index + 1}`,
        title: item.title || `Proof point ${index + 1}`,
        challenge: 'The client needed a clear path from current-state complexity to a measurable outcome.',
        solution: item.description || 'PwC combined industry knowledge, technology delivery, and change management into a practical delivery model.',
        outcome: item.description || 'A focused outcome aligned to executive priorities.',
        stat: { value: `${index + 1}`, caption: 'Relevant proof point' },
      })),
      techAtLilly: {
        ...CATALYZE_JOURNEY_CONTENT.experience.techAtLilly,
        eyebrow: `Experience for ${clientName}`,
        title: `A proposal grounded in ${clientName}'s design system and requirements`,
      },
    },
    close: {
      ...CATALYZE_JOURNEY_CONTENT.close,
      eyebrow: 'Next steps',
      title: sectionHeadline(contact, `Ready to move ${clientName} forward.`),
      body: sectionBody(contact, CATALYZE_JOURNEY_CONTENT.close.body),
      contacts: teamMembers.slice(0, 2).map((member) => ({
        name: member.name,
        role: member.role,
        email: member.email,
      })),
    },
  }
}
