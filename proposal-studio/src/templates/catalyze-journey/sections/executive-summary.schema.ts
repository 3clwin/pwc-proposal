/**
 * Schema-backed block model for the Executive Summary section.
 *
 * This is the source of truth for rendering AND for the editor's
 * sidebar / inline editing. Each block is a discriminated union with
 * a stable `id`. Mutations to these blocks (insert / delete / reorder
 * / update) flow through the `project.siteContent` reducer and
 * persist to localStorage so edits survive refresh and deploy.
 *
 * Other Catalyze sections still render from the static
 * `CATALYZE_JOURNEY_CONTENT` constant — they're tagged
 * `editable: false` in the sidebar until they get their own schema.
 */

export type ExecSummaryBlock =
  | EyebrowBlock
  | DisplayTitleBlock
  | LedeBlock
  | LeadershipGridBlock
  | DifferentiatorBentoBlock
  | FeeHeadlineBlock
  | WorkstreamTimelineBlock
  | Slide1SummaryBlock
  | ImageBlock
  | TextBlock
  | SpacerBlock

export interface BlockBase {
  id: string
}

export interface Slide1Workstream {
  id: string
  label: string
  iconKey: 'shield' | 'sliders' | 'microscope' | 'users'
  /**
   * Optional override: the PascalCase name of any icon in the
   * curated lucide library (see `@/lib/icons`). When set, this takes
   * precedence over `iconKey`, allowing users to swap to any icon
   * without the schema enum having to track all 100+ options.
   */
  iconName?: string
  /** Optional CSS color applied to the icon stroke. */
  iconColor?: string
  /** Optional CSS background color applied to the icon tile. */
  iconBg?: string
}

export interface Slide1FeeRow {
  label: string
  amount: string
  tone?: 'default' | 'discount' | 'total'
}

export interface Slide1SummaryBlock extends BlockBase {
  type: 'slide-1-summary'
  /** 4 workstream icon cards */
  workstreams: Slide1Workstream[]
  /** 5 value proposition bullets on the left */
  valueProps: string[]
  /** Fee table heading, e.g. "Initial Phase Fees" */
  feeHeading: string
  /** Rows of fee line items — standard line items render default,
   *  discount rows render with parens and dimmed weight, total
   *  renders bold with a top border. */
  feeRows: Slide1FeeRow[]
}

export interface EyebrowBlock extends BlockBase {
  type: 'eyebrow'
  number?: string
  text: string
  rule?: boolean
}

export interface DisplayTitleBlock extends BlockBase {
  type: 'display-title'
  text: string
}

export interface LedeBlock extends BlockBase {
  type: 'lede'
  text: string
}

export interface Leader {
  id: string
  name: string
  role: string
  bio: string
  monogram: string
  imageSrc?: string
}

export interface LeadershipGridBlock extends BlockBase {
  type: 'leadership-grid'
  eyebrow: string
  leaders: Leader[]
}

export interface Differentiator {
  id: string
  number: string
  title: string
  body: string
}

export interface DifferentiatorBentoBlock extends BlockBase {
  type: 'differentiator-bento'
  heading: string
  countLabel?: string
  items: Differentiator[]
}

export interface FeeHeadlineBlock extends BlockBase {
  type: 'fee-headline'
  value: string
  caption: string
  sub: string
}

export interface WorkstreamMarker {
  /** Short label shown inside/near the diamond (e.g. "WS1", "S0", "MVP"). */
  label: string
  /** Position along the bar, 0–1 relative to full timeline. */
  phase: number
}

export interface Workstream {
  id: string
  label: string
  color: string
  /** Start phase (0–1). If omitted, defaults to 0 (beginning of timeline). */
  startPhase?: number
  /** End phase (0–1). If omitted, defaults to 1 (end of timeline). */
  endPhase?: number
  /** Diamond sprint markers positioned along the bar. */
  markers?: WorkstreamMarker[]
  /** Icon identifier for the legend card below the chart. */
  iconKey?: 'shield' | 'sliders' | 'microscope' | 'users'
  /**
   * Optional override: any PascalCase name from the curated lucide
   * library (see `@/lib/icons`). When set, takes precedence over
   * `iconKey` so the user can swap to any of 100+ icons from the
   * design-mode icon picker without having to extend the schema enum.
   */
  iconName?: string
  /** Optional CSS color for the legend icon stroke. */
  iconColor?: string
  /** Optional CSS background for the legend icon tile. */
  iconBg?: string
  /** 3-bullet description for the legend card below the chart. */
  bullets?: string[]
}

export interface WorkstreamTimelineBlock extends BlockBase {
  type: 'workstream-timeline'
  eyebrow: string
  /** Italic intro paragraph above the timeline. */
  intro?: string
  rangeLabel: string
  months: string[]
  bars: Workstream[]
  /** "Hypercare" label anchored at the right end of a specific bar (by id). */
  hypercareAt?: { barId: string; label: string }
  /**
   * Slide-8-style section opener: the small uppercase label shown above
   * the display title. Typically repeats the parent section eyebrow
   * (e.g. "Executive Summary") so this moment reads as its own slide
   * while still living inside the Executive Summary section.
   */
  sectionEyebrow?: string
  /**
   * Display headline for the slide-8 opener, e.g.
   * "… Organized Across *Four Priority* Workstreams". Text wrapped in
   * single asterisks renders as inline italic (Garamond italic), matching
   * the deck's signature partial-italic display treatment.
   */
  sectionTitle?: string
}

export interface ImageBlock extends BlockBase {
  type: 'image'
  src: string
  alt: string
  /** width/height ratio, e.g. "16/9", "4/5", "1/1" */
  aspect?: string
  caption?: string
}

export interface TextBlock extends BlockBase {
  type: 'text'
  /** Plain text; line breaks are preserved. Kept as text (not HTML) for safety. */
  text: string
}

export interface SpacerBlock extends BlockBase {
  type: 'spacer'
  /** px height; snaps to 4px grid in the editor */
  height: number
}

/** All concrete block type ids that can appear in the "Add block" picker. */
export const ADDABLE_BLOCK_TYPES: Array<{
  type: ExecSummaryBlock['type']
  label: string
  description: string
}> = [
  { type: 'display-title', label: 'Display title', description: 'Large hero-style headline' },
  { type: 'eyebrow', label: 'Eyebrow', description: 'Small uppercase label' },
  { type: 'lede', label: 'Lede paragraph', description: 'Opening paragraph at larger size' },
  { type: 'text', label: 'Text', description: 'Body paragraph' },
  { type: 'image', label: 'Image', description: 'Upload an image from your computer' },
  { type: 'spacer', label: 'Spacer', description: 'Vertical breathing room' },
  { type: 'leadership-grid', label: 'Leadership grid', description: 'Two-column leader profiles' },
  { type: 'differentiator-bento', label: 'Differentiator bento', description: 'Asymmetric tile grid' },
  { type: 'fee-headline', label: 'Fee headline', description: 'Big fee number with caption' },
  { type: 'workstream-timeline', label: 'Workstream timeline', description: 'Horizontal phase bars' },
  { type: 'slide-1-summary', label: 'Slide 1 summary', description: 'Four workstream icons with value props and fee table' },
]

/**
 * Bootstrap blocks — mirror of the original hardcoded layout, in
 * schema form. Used the very first time a project loads (before the
 * user has made any edits).
 */
export function bootstrapExecSummaryBlocks(): ExecSummaryBlock[] {
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
      text: 'A platform built for Lilly\u2019s scientific advantage.',
    },
    {
      id: 'es-lede',
      type: 'lede',
      text:
        'PwC is uniquely positioned to deliver this critical External Innovation platform with speed and precision, unlocking sustainable R&D productivity, first-class partner experience, and a lasting scientific and competitive edge.',
    },
    {
      id: 'es-leadership',
      type: 'leadership-grid',
      eyebrow: 'Your Leadership Team through this Journey',
      leaders: [
        {
          id: 'leader-nisha',
          name: 'Nisha Asher',
          role: 'PwC R&D Partner · Op Model Lead',
          bio: 'PwC R&D Advisory Partner, driving the intersection of R&D, M&A deals, and large-scale transformations.',
          monogram: 'NA',
          imageSrc: '/team/nisha-asher.png',
        },
        {
          id: 'leader-erica',
          name: 'Erica Yung',
          role: 'PwC CRM Partner · Tech Assessment & Implementation Lead',
          bio: 'Partner at PwC focused on CRM-enabled go-to-market transformation. Serves as PwC\u2019s Salesforce Partner for CRM.',
          monogram: 'EY',
          imageSrc: '/team/erica-yung.png',
        },
      ],
    },
    {
      id: 'es-bento',
      type: 'differentiator-bento',
      heading: 'Why PwC is uniquely positioned to deliver.',
      countLabel: '05 differentiators',
      items: [
        {
          id: 'diff-01',
          number: '01',
          title: 'Delivering Value from Day 1',
          body:
            'Our 15+ year, 400-engagement history gives us unparalleled institutional knowledge of Lilly. We will navigate your matrixed R&D, BD, and Digital functions, bringing an insider\u2019s perspective with an outsider\u2019s objectivity to break down silos and accelerate strategic outcomes for C360.',
        },
        {
          id: 'diff-02',
          number: '02',
          title: 'Designing for Scientific Outcomes',
          body:
            'Our R&D domain experts and vanguard scientific AI partnerships will architect the operating model and partner journey around one primary goal: advancing high-potential science. Our "Fit For Launch" offering enables us to build with a biotech-first mindset to create a platform that is a strategic magnet for top-tier innovators.',
        },
        {
          id: 'diff-03',
          number: '03',
          title: 'Embedding Targeted AI Throughout',
          body:
            'We will deploy pragmatic GenAI throughout to solve this program\u2019s biggest challenges \u2014 an intuitive user experience: accelerating QoS reviews, summarizing scientific documents, and predicting partnership readiness, to transform your platform into a proactive intelligence engine.',
        },
        {
          id: 'diff-04',
          number: '04',
          title: 'Navigating Regulated, High-Stakes Platforms with Proven Consistency',
          body:
            'We are not just configurators; we are experts in building robust CRM solutions for critical use cases. We will expertly navigate the specific demands of GxP compliance, data governance, and manual data migration to deliver a platform that is powerful, secure, and built to Lilly\u2019s enterprise standards.',
        },
        {
          id: 'diff-05',
          number: '05',
          title: 'Driving Innovation With Speed \u2014 Automation & AI PoCs',
          body:
            'Our commitment is to build a durable strategic advantage for Catalyze360. We will bring proprietary PwC accelerators \u2014 including rapid workflow prototyping tools and a library of pre-built AI agents \u2014 to continuously enhance this platform with speed and agility.',
        },
      ],
    },
    {
      id: 'es-slide1-summary',
      type: 'slide-1-summary',
      workstreams: [
        { id: 'ws-gpd', label: 'Global Program Delivery (GPD)', iconKey: 'shield' },
        { id: 'ws-opmodel', label: 'Go-to-Market Operating Model Design', iconKey: 'sliders' },
        { id: 'ws-tech', label: 'Technology Assessment and Implementation', iconKey: 'microscope' },
        { id: 'ws-ocm', label: 'Organizational Change Management (OCM) and User Adoption', iconKey: 'users' },
      ],
      valueProps: [
        'Value-led execution grounded in real, day-one impact',
        'Science-first design anchored in measurable outcomes',
        'Purposeful AI embedded where it drives real impact',
        'Trusted delivery in regulated, high-stakes environments',
        'Rapid innovation enabled by automation and AI experimentation',
      ],
      feeHeading: 'Initial Phase Fees',
      feeRows: [
        { label: 'WS1. Operational Model Strategy & Design (GPD & OCM Included)', amount: '$909,650' },
        { label: 'WS2. CRM Assessment and Implementation', amount: '$1,172,450' },
        { label: 'PwC Lilly Partnership Discount (19%)', amount: '($395,599)', tone: 'discount' },
        { label: 'PwC Additional Investment', amount: '($300,000)', tone: 'discount' },
        { label: 'Total Fees (excl. expenses)', amount: '$1,386,501', tone: 'total' },
      ],
    },
    {
      id: 'es-timeline',
      type: 'workstream-timeline',
      sectionEyebrow: 'Executive Summary',
      sectionTitle: '\u2026 Organized Across *Four Priority* Workstreams',
      eyebrow: 'Workstream timeline',
      intro:
        'Our agile approach is designed to deliver immediate value. We will rapidly automate Lilly\u2019s manual processes without creating complexity to quickly eliminate your operational burden and empower your teams to focus on what\u2019s most important — strategic partner engagement and the data-driven decisions that deliver business results.',
      rangeLabel: 'Feb · Jun 2026',
      months: ['Feb 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026'],
      bars: [
        {
          id: 'ws-gpd',
          label: 'Global Program Delivery & Strategy',
          color: '#fdd7cd',
          startPhase: 0,
          endPhase: 1,
          iconKey: 'shield',
          bullets: [
            'Designed for pace and rapid execution while maintaining quality & control',
            'Engages across pillars to integrate into one team to align on consistency and scalability',
            'Uses rapid iteration to converge on the North Star, ensuring each cycle sharpens alignment with business goals and scientific rigor',
          ],
        },
        {
          id: 'ws-opmodel',
          label: 'Go-to-Market Operating Model Design',
          color: '#fbb9ab',
          startPhase: 0,
          endPhase: 0.62,
          markers: [
            { label: 'WS1', phase: 0.06 },
            { label: 'WS2', phase: 0.18 },
            { label: 'WS3', phase: 0.3 },
            { label: 'WS4', phase: 0.42 },
            { label: 'WS5', phase: 0.56 },
          ],
          iconKey: 'sliders',
          bullets: [
            'Focuses on immediate usability while intentionally designing for long-term scale & future AI-enabled enhancements',
            'Embeds Agile methodology aligns ceremonies to tech sprint execution',
            'Reduces operational burden via streamlined workflows to improve experience for both partners & internal teams',
          ],
        },
        {
          id: 'ws-tech',
          label: 'Technology Assessment and Implementation',
          color: '#fba696',
          startPhase: 0,
          endPhase: 0.82,
          markers: [
            { label: 'S0', phase: 0.06 },
            { label: 'S1', phase: 0.22 },
            { label: 'S2', phase: 0.38 },
            { label: 'S3', phase: 0.54 },
            { label: 'MVP', phase: 0.76 },
          ],
          iconKey: 'microscope',
          bullets: [
            'Review how teams manage partner relationships today, identify what\u2019s slowing them down, and define a clear future-state CRM approach',
            'Design data model, intake and routing flows, and automation that quickly replaces manual trackers',
            'Deploy MVP, then iterate through short releases with training and governance',
          ],
        },
        {
          id: 'ws-ocm',
          label: 'Change Management & User Adoption',
          color: '#f99483',
          startPhase: 0.44,
          endPhase: 1,
          iconKey: 'users',
          bullets: [
            'Generate excitement about a simpler interaction experience through executive alignment and internal adoption',
            'Reinforce adoption by making new ways of working intuitive and easy',
            'Prioritize near-term impact, with future user-experience enhancements planned as the platform evolves',
          ],
        },
      ],
      hypercareAt: { barId: 'ws-tech', label: 'Hypercare' },
    },
  ]
}

/** Factory for newly-added blocks. Keeps defaults in one place. */
export function createBlock(type: ExecSummaryBlock['type'], id: string): ExecSummaryBlock {
  switch (type) {
    case 'eyebrow':
      return { id, type, text: 'Eyebrow', rule: false }
    case 'display-title':
      // Empty string by default so a freshly-added block doesn't render
      // the literal placeholder word "Display title" if the user never
      // fills it in. The editor surfaces an "Edit" affordance regardless.
      return { id, type, text: '' }
    case 'lede':
      return { id, type, text: 'Lede paragraph — set the tone in one sentence.' }
    case 'text':
      return { id, type, text: 'Body text. Click to edit.' }
    case 'image':
      return {
        id,
        type,
        src: '',
        alt: 'Image',
        aspect: '16/9',
      }
    case 'spacer':
      return { id, type, height: 48 }
    case 'leadership-grid':
      return {
        id,
        type,
        eyebrow: 'Your team',
        leaders: [
          {
            id: `${id}-l1`,
            name: 'First Last',
            role: 'Role',
            bio: 'Short bio.',
            monogram: 'FL',
          },
        ],
      }
    case 'differentiator-bento':
      return {
        id,
        type,
        heading: 'Why we win.',
        items: [
          { id: `${id}-i1`, number: '01', title: 'First differentiator', body: 'Body copy.' },
        ],
      }
    case 'fee-headline':
      return {
        id,
        type,
        value: '$1.0M',
        caption: 'Proposed fees',
        sub: 'Subcaption text.',
      }
    case 'workstream-timeline':
      return {
        id,
        type,
        sectionEyebrow: 'Executive Summary',
        sectionTitle: 'Organized Across *Priority* Workstreams',
        eyebrow: 'Workstream timeline',
        rangeLabel: '',
        months: ['Phase 1', 'Phase 2', 'Phase 3'],
        bars: [{ id: `${id}-b1`, label: 'Workstream', color: '#C52B09' }],
      }
    case 'slide-1-summary':
      return {
        id,
        type,
        workstreams: [
          { id: `${id}-ws1`, label: 'Workstream One', iconKey: 'shield' },
          { id: `${id}-ws2`, label: 'Workstream Two', iconKey: 'sliders' },
          { id: `${id}-ws3`, label: 'Workstream Three', iconKey: 'microscope' },
          { id: `${id}-ws4`, label: 'Workstream Four', iconKey: 'users' },
        ],
        valueProps: [
          'First value proposition',
          'Second value proposition',
          'Third value proposition',
          'Fourth value proposition',
          'Fifth value proposition',
        ],
        feeHeading: 'Initial Phase Fees',
        feeRows: [
          { label: 'Line item one', amount: '$0' },
          { label: 'Line item two', amount: '$0' },
          { label: 'Total', amount: '$0', tone: 'total' },
        ],
      }
  }
}
