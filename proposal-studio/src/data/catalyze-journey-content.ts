/**
 * Bespoke content object for the Catalyze Journey template.
 *
 * Mirrors the PwC Catalyze360 Go-to-Market Model RFQ deck (Feb 2026) 1:1,
 * preserving the deck's six-chapter narrative structure plus a cover and
 * close. Consumed only by `src/templates/catalyze-journey/full-site.tsx`
 * and gated to Lilly clients.
 *
 * Source: Lilly RFQ — Proposal Draft v2 (39 pages)
 */

export interface TeamMember {
  name: string
  role: string
  email: string
  /** Short editorial bio excerpt (2–3 lines from the deck). */
  bio: string
  /** Optional bullet highlights from the deck bio section. */
  highlights?: string[]
  /** Two-letter monogram for the portrait placeholder. */
  monogram: string
  /** Optional editorial headshot path served from /public. Falls back to monogram placeholder when omitted. */
  imageSrc?: string
  tier: 'core' | 'specialist' | 'lilly-sme'
}

export interface CaseStudy {
  id: string
  title: string
  challenge: string
  solution: string
  outcome: string
  /** Single pulled stat to render large. */
  stat?: { value: string; caption: string }
  /** Optional client quotes verbatim from the deck. */
  quotes?: { text: string; attribution: string }[]
}

export interface Differentiator {
  number: string
  title: string
  body: string
}

export interface JourneyPrinciple {
  title: string
  body: string
}

export interface OperatingPillar {
  title: string
  subtitle: string
  body: string
}

export interface UserPerspective {
  number: string
  audience: string
  title: string
  body: string
  bullets: string[]
}

export interface SprintPhase {
  number: string
  title: string
  body: string
  activities: string[]
}

export interface TimelinePhase {
  month: string
  title: string
  body: string
}

export interface FeeLine {
  name: string
  amount: string
  deliverables: string[]
}

export interface CatalyzeJourneyContent {
  /** §00 Cover */
  cover: {
    eyebrow: string
    titleMain: string
    titleItalic: string
    dateline: string
    tagline: string
    ctaLabel: string
  }

  /** §01 Executive Summary */
  executiveSummary: {
    eyebrow: string
    title: string
    lede: string
    leadershipEyebrow: string
    leaders: TeamMember[]
    differentiators: Differentiator[]
    feeHeadline: { value: string; caption: string; sub: string }
    /** Slide 8 — italic intro paragraph above the workstream timeline. */
    workstreamIntro: string
    /** Slide 8 — italic title with "Four Priority" italicized. */
    workstreamTitle: string
    workstreams: {
      id: string
      label: string
      color: string
      /** 3-4 bullet description for the slide-8 card. */
      bullets: string[]
    }[]
    timelineMonths: string[]
    /** Slide 8 — Hypercare label appended at the right end of the timeline. */
    hypercareLabel: string
    /** Slide 8 — workstream marker labels (WS1-WS5, S0-S3, MVP). */
    timelineMarkers: { id: string; label: string }[]
  }

  /** §02 Call to Action — slides 4-6 */
  callToAction: {
    eyebrow: string
    /** Slide 5 — opening pull quote (Genuine connection... innovation). */
    pullQuote: { text: string; attribution: string }
    /** Slide 5 — body paragraph after the pull quote. */
    bodyParagraph: string
    /** Slide 6 — section headline ("From Scientific Disconnect to Coordinated Discovery"). */
    transformationTitle: string
    /** Slide 6 — eyebrow above the headline ("OUR UNDERSTANDING"). */
    transformationEyebrow: string
    /** Slide 6 — center black banner over the diagram. */
    centerBanner: string
    /** Slide 6 — red-outline pill below the banner. */
    centerPill: string
    /** Slide 6 — left-panel label ("From a Complex Quagmire… …"). */
    quagmireLabel: string
    /** Slide 6 — right-panel label ("…To a One-Stop, Integrated Shop"). */
    oneStopLabel: string
    /** Slide 6 — left body paragraph ("Catalyze360 is at a critical juncture..."). */
    quagmireBody: string
    /** Slide 6 — italic emphasis pulled out of the quagmire body. */
    quagmireEmphasis: string
    /** Slide 6 — right body paragraph ("Going beyond a CRM implementation..."). */
    oneStopBody: string
    /** Slide 6 — italic emphasis pulled out of the one-stop body. */
    oneStopEmphasis: string
    /** Slide 6 — final italic line ("creating a powerful market differentiator"). */
    oneStopClosing: string
    from: { label: string; items: string[] }
    to: { label: string; items: string[] }
  }

  /** §03 Foundation — Tale of Two Experiences, Hexagon, Success Factors */
  foundation: {
    eyebrow: string
    title: string
    lede: string
    taleOfTwo: {
      title: string
      subtitle: string
      partner: {
        name: string
        context: string
        problem: { mood: string; quote: string; body: string }
        transformation: { mood: string; quote: string; body: string }
        outcome: { mood: string; quote: string; body: string }
      }
      navigator: {
        name: string
        context: string
        problem: { mood: string; quote: string; body: string }
        transformation: { mood: string; quote: string; body: string }
        outcome: { mood: string; quote: string; body: string }
      }
      outcome: string
    }
    operatingModel: {
      eyebrow: string
      title: string
      subtitle: string
      pillars: OperatingPillar[]
      /** Slide 11 — bold caption below the honeycomb diagram. */
      agenticCrmCaption: string
    }
    successFactors: {
      eyebrow: string
      title: string
      body: string
      factors: { title: string; body: string }[]
    }
    /** Slide 13 — Operating Model: Organization & Ways of Working */
    orgWaysOfWorking: {
      eyebrow: string
      titleA: string
      /** Italicized portion of the title. */
      titleB: string
      columns: {
        label: string
        tone: 'red' | 'pink' | 'grey'
        bullets: { title: string; body: string }[]
      }[]
    }
    /** Slide 14 — Operating Model: Governance & Value Realization */
    governanceValueRealization: {
      eyebrow: string
      titleA: string
      titleB: string
      /** Italic red intro line below the title. */
      intro: string
      columns: {
        label: string
        tone: 'red' | 'pink' | 'grey'
        bullets: { title: string; body: string }[]
      }[]
    }
    /** Slide 15 — How to Make the Future State the Status Quo */
    statusQuo: {
      eyebrow: string
      title: string
      titleItalic: string
      bannerLabel: string
      deliverables: { title: string; body: string; iconKey: string }[]
      sidebar: { title: string; body: string }
    }
  }

  /** §04 Imagine the Future — Vision, Architecture, Three Perspectives */
  vision: {
    eyebrow: string
    /** Slide 17 — title (rendered with italic split on `titleItalic`). */
    titleA: string
    titleItalic: string
    titleB: string
    subtitle: string
    /** Slide 17 — red-outline pill tagline ("One Lilly. Many Doors."). */
    tagline: string
    principles: JourneyPrinciple[]
    architecture: {
      /** Slide 18 — title ("One Coordinated External Innovation Experience"). */
      title: string
      /** Slide 18 — italic part of title ("Enabled by Catalyze360"). */
      titleItalic: string
      body: string
      pillars: { title: string; body: string }[]
      capabilities: { title: string; body: string }[]
      audiences: { label: string; imageSrc: string }[]
      /** Slide 18 — backbone bar label between audience clusters. */
      backboneLabel: string
      /** Slide 18 — section label above pillar cards. */
      pillarsHeading: string
      /** Slide 18 — footer caption below the diagram. */
      footerCaption: string
    }
    perspectives: UserPerspective[]
  }

  /** §05 Delivery Approach — slides 22-28 */
  delivery: {
    eyebrow: string
    title: string
    lede: string
    sprintZero: {
      eyebrow: string
      title: string
      titleItalic: string
      subtitle: string
      /** Slide 24 — red intro paragraph above the 3 phase cards. */
      intro: string
      phases: SprintPhase[]
      outcomes: string[]
      /** Slide 24 — top-right Sprint 0 stamp text. */
      stamp: { line1: string; line2: string; subtitle: string }
    }
    operatingModelDesign: {
      eyebrow: string
      title: string
      titleItalic: string
      body: string
      months: string[]
      /** Slide 25 — phase chevrons. */
      chevrons: { label: string; tone: 'pink' | 'red'; spans: string[]; markers: string[] }[]
      workstreams: { id: string; title: string; activities: string[] }[]
      /** Slide 25 — 6 deliverable cards in 3x2 grid. */
      deliverables: { title: string; iconKey: string }[]
      /** Slide 25 — playbook badge label. */
      playbookLabel: string
    }
    /** Slide 26 — CRM Implementation Timeline */
    implementationTimeline: {
      title: string
      titleItalic: string
      year: string
      months: string[]
      milestones: { label: string; month: string }[]
      phases: { label: string; sub: string; tone: 'red' | 'dark' | 'grey'; spanStart: string; spanEnd: string }[]
      sprints: string[]
      mvpStages: string[]
      capabilityCascade: string[]
      futureFeatures: string[]
      futureFootnote: string
      discoveryActivities: { week: string; bullets: string[] }[]
      discoveryDeliverables: string[]
      implementationDeliverables: string[]
      legend: { sprintLabel: string; milestoneLabel: string }
    }
    timeline: {
      eyebrow: string
      title: string
      phases: TimelinePhase[]
    }
    mvp: {
      eyebrow: string
      title: string
      capabilities: string[]
      futureCapabilities: string[]
    }
    /** Slide 27 — Future-State Architecture */
    architecture: {
      eyebrow: string
      title: string
      titleItalic: string
      sourceSystems: string[]
      esbLabel: string
      internalUsers: string[]
      internalUserBarLabel: string
      externalUserLabel: string
      externalUserBarLabel: string
      crmCoreLabel: string
      crmCoreCapabilities: { label: string; tier: 'mvp' | 'post-mvp' }[]
      dataModelsLabel: string
      dataModelEntities: string[]
      dataModels: string[]
      coreCapabilitiesLabel: string
      coreCapabilities: string[]
      keyHighlightsLabel: string
      highlights: { title: string; body: string }[]
      legend: { mvpLabel: string; postMvpLabel: string }
    }
    /** Slide 28 — Iterative Release Operating Model */
    iterativeRelease: {
      title: string
      titleItalic: string
      intro: string
      topBandLabel: string
      bottomBandLabel: string
      columnLabels: string[]
      requestSources: { label: string; tone: 'pink' | 'grey' }[]
      intakeLabel: string
      requestTypes: { label: string; track: 'top' | 'middle' | 'bottom' }[]
      epicLabel: string
      backlogLabel: string
      backlogBody: string
      reviewBoardLabel: string
      prioritization: { label: string; criteria: string[] }
      releases: { label: string; tone: 'grey' }[]
      flagLabels: { release: string; sprint: string }
      legend: { production: string; iterative: string }
    }
  }

  /** §06 Commercials */
  commercials: {
    eyebrow: string
    title: string
    headlineFee: { value: string; caption: string }
    feeLines: FeeLine[]
    discount: { label: string; value: string }[]
    assumptions: string[]
  }

  /** §07 Team */
  team: {
    eyebrow: string
    title: string
    lede: string
    members: TeamMember[]
  }

  /** §08 Experience & Case Studies */
  experience: {
    eyebrow: string
    title: string
    lede: string
    cases: CaseStudy[]
    techAtLilly: { eyebrow: string; title: string; note: string }
  }

  /** §09 Close */
  close: {
    eyebrow: string
    title: string
    body: string
    contacts: { name: string; role: string; email: string }[]
    primaryCTA: string
    secondaryCTA: string
  }
}

// ─────────────────── THE CONTENT (verbatim from deck) ───────────────────

export const CATALYZE_JOURNEY_CONTENT: CatalyzeJourneyContent = {
  // §00 · COVER — deck page 1
  cover: {
    eyebrow: 'Catalyze360',
    titleMain: 'Go-to-Market',
    titleItalic: 'Model',
    dateline: 'Request for Quote · Feb 6, 2026',
    tagline: 'Scientific Innovation Through Intelligent Execution',
    ctaLabel: 'Begin',
  },

  // §01 · EXECUTIVE SUMMARY — deck pages 2, 7, 8
  executiveSummary: {
    eyebrow: 'Executive Summary',
    title: 'A platform built for Lilly\u2019s scientific advantage.',
    lede: 'PwC is uniquely positioned to deliver this critical External Innovation platform with speed and precision, unlocking sustainable R&D productivity, first-class partner experience, and a lasting scientific and competitive edge.',
    leadershipEyebrow: 'Your Leadership Team through this Journey',
    leaders: [
      {
        name: 'Nisha Asher',
        role: 'PwC R&D Partner · Op Model Lead',
        email: 'nisha.asher@pwc.com',
        bio: 'PwC R&D Advisory Partner, driving the intersection of R&D, M&A deals, and large-scale transformations.',
        monogram: 'NA',
        imageSrc: '/team/nisha-asher.png',
        tier: 'core',
      },
      {
        name: 'Erica Yung',
        role: 'PwC CRM Partner · Tech Assessment & Implementation Lead',
        email: 'erica.yung@pwc.com',
        bio: 'Partner at PwC focused on CRM-enabled go-to-market transformation. Serves as PwC\u2019s Salesforce Partner for CRM.',
        monogram: 'EY',
        imageSrc: '/team/erica-yung.png',
        tier: 'core',
      },
    ],
    differentiators: [
      {
        number: '01',
        title: 'Delivering Value from Day 1',
        body: 'Our 15+ year, 400-engagement history gives us unparalleled institutional knowledge of Lilly. We will navigate your matrixed R&D, BD, and Digital functions, bringing an insider\u2019s perspective with an outsider\u2019s objectivity to break down silos and accelerate strategic outcomes for C360.',
      },
      {
        number: '02',
        title: 'Designing for Scientific Outcomes',
        body: 'Our R&D domain experts and vanguard scientific AI partnerships will architect the operating model and partner journey around one primary goal: advancing high-potential science. Our "Fit For Launch" offering enables us to build with a biotech-first mindset to create a platform that is a strategic magnet for top-tier innovators.',
      },
      {
        number: '03',
        title: 'Embedding Targeted AI Throughout',
        body: 'We will deploy pragmatic GenAI throughout to solve this program\u2019s biggest challenges — an intuitive user experience: accelerating QoS reviews, summarizing scientific documents, and predicting partnership readiness, to transform your platform into a proactive intelligence engine.',
      },
      {
        number: '04',
        title: 'Navigating Regulated, High-Stakes Platforms with Proven Consistency',
        body: 'We are not just configurators; we are experts in building robust CRM solutions for critical use cases. We will expertly navigate the specific demands of GxP compliance, data governance, and manual data migration to deliver a platform that is powerful, secure, and built to Lilly\u2019s enterprise standards.',
      },
      {
        number: '05',
        title: 'Driving Innovation With Speed — Automation & AI PoCs',
        body: 'Our commitment is to build a durable strategic advantage for Catalyze360. We will bring proprietary PwC accelerators — including rapid workflow prototyping tools and a library of pre-built AI agents — to continuously enhance this platform with speed and agility.',
      },
    ],
    feeHeadline: {
      value: '$1.39M',
      caption: 'Final proposed fees',
      sub: 'After PwC Lilly Partnership Discount (19%) and PwC Additional Investment.',
    },
    workstreamIntro:
      'Our agile approach is designed to deliver immediate value. We will rapidly automate Lilly\u2019s manual processes without creating complexity to quickly eliminate your operational burden and empower your teams to focus on what\u2019s most important — strategic partner engagement and the data-driven decisions that deliver business results.',
    workstreamTitle: '\u2026 Organized Across Four Priority Workstreams',
    workstreams: [
      {
        id: 'gpd',
        label: 'Global Program Delivery & Strategy',
        color: '#d31710',
        bullets: [
          'Designed for pace and rapid execution while maintaining quality & control',
          'Engages across pillars to integrate into one team to align on consistency and scalability',
          'Uses rapid iteration to converge on the North Star, ensuring each cycle sharpens alignment with business goals and scientific rigor',
        ],
      },
      {
        id: 'opmodel',
        label: 'Go-to-Market Operating Model Design',
        color: '#9f180f',
        bullets: [
          'Focuses on immediate usability while intentionally designing for long-term scale & future AI-enabled enhancements',
          'Embeds Agile methodology aligns ceremonies to tech sprint execution',
          'Reduces operational burden via streamlined workflows to improve experience for both partners & internal teams',
        ],
      },
      {
        id: 'tech',
        label: 'Technology Assessment and Implementation',
        color: '#501009',
        bullets: [
          'Review how teams manage partner relationships today, identify what\u2019s slowing them down, and define a clear future-state CRM approach',
          'Design data model, intake and routing flows, and automation that quickly replaces manual trackers',
          'Deploy MVP, then iterate through short releases with training and governance',
        ],
      },
      {
        id: 'ocm',
        label: 'Change Management & User Adoption',
        color: '#6e1911',
        bullets: [
          'Generate excitement about a simpler interaction experience through executive alignment and internal adoption',
          'Reinforce adoption by making new ways of working intuitive and easy',
          'Prioritize near-term impact, with future user-experience enhancements planned as the platform evolves',
        ],
      },
    ],
    timelineMonths: ['Feb 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026'],
    hypercareLabel: 'Hypercare',
    timelineMarkers: [
      { id: 'WS1', label: 'WS1' },
      { id: 'WS2', label: 'WS2' },
      { id: 'WS3', label: 'WS3' },
      { id: 'WS4', label: 'WS4' },
      { id: 'WS5', label: 'WS5' },
      { id: 'S0', label: 'S0' },
      { id: 'S1', label: 'S1' },
      { id: 'S2', label: 'S2' },
      { id: 'S3', label: 'S3' },
      { id: 'MVP', label: 'MVP' },
    ],
  },

  // §02 · LILLY'S CALL TO ACTION — deck pages 4, 5, 6
  callToAction: {
    eyebrow: 'Lilly\u2019s Call to Action',
    pullQuote: {
      text: 'Genuine connection that sparks breakthrough ideas lies at the heart of innovation.',
      attribution: 'Our Understanding',
    },
    bodyParagraph:
      'Fragmented efforts risk dimming Catalyze 360\u2019s spark, even as the world\u2019s most promising biotech partners are seeking a true collaborator. This opportunity is about unlocking a unified, purpose-driven partnership experience that can transform how Lilly engages with rising biotechs to shape the future of science.',
    transformationTitle: 'From Scientific Disconnect to Coordinated Discovery',
    transformationEyebrow: 'Our Understanding',
    centerBanner: 'Trusted Partnership & Experience',
    centerPill: 'One Science • One Navigator • One Journey',
    quagmireLabel: 'From a Complex Quagmire\u2026 \u2026',
    oneStopLabel: '\u2026 To a One-Stop, Integrated Shop',
    quagmireBody:
      'Catalyze360 is at a critical juncture. Exponential growth and a fragmented partner experience threaten to undermine its strategic ambition and potential organization value. Siloed pillars, duplicate outreach risk, complex, manual tools, inconsistent experiences, and limited to no portfolio visibility creates an unsustainable engagement and operating model as the platform scales.',
    quagmireEmphasis:
      'Siloed pillars, duplicate outreach risk, complex, manual tools, inconsistent experiences, and limited to no portfolio visibility',
    oneStopBody:
      'Going beyond a CRM implementation. C360 requires a holistic model at the intersection of capability & engagement to systematically identify, prioritize, and collaborate with the most promising rising biotechs. Enabled by a streamlined approach operating as \u201cone unified entity\u201d from first contact through partnership, creating a powerful market differentiator.',
    oneStopEmphasis: 'the most promising rising biotechs',
    oneStopClosing: 'creating a powerful market differentiator',
    from: {
      label: 'From a Complex Quagmire\u2026',
      items: ['Helix Tx', 'BioMatrix', 'Axion Ph', 'Siloed pillars', 'Duplicate outreach', 'Manual tools', 'No portfolio visibility'],
    },
    to: {
      label: '\u2026To a One-Stop, Integrated Shop',
      items: ['Explo R&D', 'TuneLab', 'Gateway Labs', 'Future Capabilities', 'One Science', 'One Navigator', 'One Journey'],
    },
  },

  // §03 · BUILDING A FOUNDATION — deck pages 9–15
  foundation: {
    eyebrow: 'Catalyze360 · Building a Foundation',
    title: 'Enabling a Seamless Partner Experience',
    lede:
      'C360 requires a holistic model at the intersection of capability & engagement to systematically identify, prioritize, and collaborate with the most promising rising biotechs. Enabled by a streamlined approach operating as "one unified entity" from first contact through partnership.',
    taleOfTwo: {
      title: 'A Tale of Two Experiences',
      subtitle: 'From Intake, Contracting, to Long Term Partnership',
      partner: {
        name: 'Dr. Rachel Martinez',
        context:
          'Helix RNA Therapeutics · Immunology · Novel Lipid Nanoparticle · $35M Series A, 22 employees · Lead Asset: HLX-101 (Lead Optimization)',
        problem: {
          mood: 'Frustrated & Skeptical',
          quote: 'I\u2019ve tried Lilly before. My pitch falls into a black hole every time and I get stalled out.',
          body:
            'Rachel met multiple Lilly individuals, David, Sammy, Indira — great conversation at the time at multiple events, but no follow-up. Her data sits in someone\u2019s email. S&E reviewed them 18 months ago, but nobody connected the dots. She\u2019s considering CRL instead.',
        },
        transformation: {
          mood: 'Surprised & Hopeful',
          quote:
            'Wait... they remembered? This feels completely different. My scientific concierge (Navigator) actually gets us.',
          body:
            'Rachel ran into David at SCOPE 2026, who showed her a new C360 referral site. Rachel decides to try one last time and submits the form online. Within 48 hours, she receives a personalized response referencing her SCOPE conversation and prior S&E review from Marcus, her new "navigator".',
        },
        outcome: {
          mood: 'Valued & Accelerated',
          quote:
            'Lilly didn\u2019t just support our science, they became true partners in our success. We have been able to change the lives of so many patients because of them.',
          body:
            '18 months later: HLX-101 advanced through Gateway Labs validation, ExploR&D optimization, and is now in partnership discussions. Rachel has one point of contact who coordinates everything and has visibility to her company\u2019s performance and their pillar offerings.',
        },
      },
      navigator: {
        name: 'Marcus Chen',
        context: 'C360 Navigator',
        problem: {
          mood: 'Flying Blind',
          quote: 'I don\u2019t know what we\u2019ve already promised her or who she\u2019s talked to.',
          body:
            'Marcus hears rumblings about Helix from a colleague but has no visibility into past interactions. He searches SharePoint, emails colleagues, and finds fragmented notes. He can\u2019t tell if this is a warm lead or cold outreach.',
        },
        transformation: {
          mood: 'Confident & Prepared',
          quote:
            'I walked into that call knowing exactly where we left off, total game changer. I was even able to pull deep insights in a matter of minutes.',
          body:
            'The CRM auto-surfaced Helix\u2019s full history: 3 prior touchpoints, S&E assessment, and AI-generated scientific summary. QoS scores Helix at 84/100, a Tier 1 leading to prioritization and assignment to Marcus. The form auto created a new account with everything he needs for an informed first call.',
        },
        outcome: {
          mood: 'Empowered & Effective',
          quote: 'I can actually do strategic relationship management now, not just data entry.',
          body:
            'Marcus created a strategic 18-month roadmap and was able to facilitate auto-generated CBD briefing packs for a pre-validated BD pipeline/accelerated deal velocity specifically a multi-pillar support model that increase service revenue by 30% and maintaining a portfolio health score of 94%. He also managed 12 Tier 1 accounts this year across Pillars.',
        },
      },
      outcome:
        'The result is a seamless journey. Rachel feels supported and her science is accelerated. Marcus converts a frustrated biotech into a major strategic asset. This is tomorrow\u2019s operating model in action.',
    },
    operatingModel: {
      eyebrow: 'Vision',
      // Section heading on slide 11.
      title: 'Tomorrow\u2019s Connected Operating Model is Integrated',
      // Italic red caption shown directly above the honeycomb.
      subtitle: 'A GTM Approach Designed for Connection & Automation',
      pillars: [
        {
          title: 'Partner Intake & Strategic Alignment',
          subtitle: 'Focus On What Matters',
          body:
            'Scientific merit drives engagement in alignment with leadership expectations and strategic priorities, the Quality of Science review triages partners to the appropriate priority and support level.',
        },
        {
          title: 'Seamless Partner Experience',
          subtitle: 'Consistency & Transparency',
          body:
            'One coordinated journey driven by a dedicated Navigator to streamline interactions and accelerate feedback.',
        },
        {
          title: 'Pricing & Contracting',
          subtitle: 'Standardization',
          body:
            'Enable integrated pricing that rewards multi-pillar engagement and scientific merit through a harmonized framework.',
        },
        {
          title: 'Governance',
          subtitle: 'Fit for Scale',
          body:
            'Quality of Science reviews conducted within 5 days; Navigator portfolios limited to a maximum of 15–20 Tier 1 partners; Implement a formal handoff checklist with a required briefing.',
        },
        {
          title: 'Value Realization & Reporting',
          subtitle: 'Value & Insights',
          body:
            'Value realization & cross-pillar metrics (i.e., SLA met, value capture, health score) to identify risks and flag areas for leadership attention.',
        },
        {
          title: 'Org Model & Ways of Working',
          subtitle: 'Coordination & Connectivity',
          body:
            'Drive effective use of resources and limit redundancy through an optimized team structure, enabling technologies, and standardized processes.',
        },
      ],
      agenticCrmCaption:
        'At the heart of the platform is a powerful agentic CRM engine based off scientific and business development workflows.',
    },
    successFactors: {
      eyebrow: 'Key Success Factors',
      title: 'The Real Challenge: Lack of Buy-in & Adoption',
      body:
        'The C360 Go-to-Market Operating Model + enabling CRM will only create value if it becomes the default way teams work across Functions & Pillars, formed on the following key success factors to drive long-term alignment… and most importantly, the operating model is never "finished". Maintain room for evolution as market and business dynamics shift.',
      factors: [
        {
          title: 'Design-to-Adopt',
          body:
            'Adoption isn\u2019t about user desire; it\u2019s about removing alternatives. Make CRM the path of least resistance, enabling an intuitive user experience easier than the current state, and not seen as extra work or how teams work.',
        },
        {
          title: 'Purpose-Built Capability',
          body:
            'Users won\u2019t change behavior for "better reporting", only if their daily work is 10x easier — e.g., 30 sec vs. 5 min due to a one click to "log into CRM", auto-AI extracts & actions, auto-populated dashboards, global standardization with local usability.',
        },
        {
          title: 'Accountability',
          body:
            '"Shared ownership" = no ownership and follow-ups become orphaned; Navigators should never be fully hands off during pillar engagements. Tie accountability to actionable and visible outcomes (e.g., Intake-to-QoS Start: <24 hrs, Check-In Completion: 95%+).',
        },
        {
          title: 'Governance & Metrics',
          body:
            'Clear decision rights prevent "escalation theater." Document who decides what, with what criteria (including exceptions), in what timeframe.',
        },
        {
          title: 'Data Discipline',
          body:
            'Use the minimum viable data to get to 80% of your outcome, not maximum. Every additional required field reduces adoption by ~5%. Ruthlessly prioritize. AI should do the work, not the end user or the leader.',
        },
        {
          title: 'Follow the Leader',
          body:
            'Leadership behavior drives team behavior. If VP uses CRM dashboards in every meeting, teams will keep CRM updated. If regular review cadences are set up, coordination and calibration aren\u2019t an afterthought.',
        },
      ],
    },
    orgWaysOfWorking: {
      eyebrow: 'Operating Model \u2014 Organization & Ways of Working',
      titleA: 'From First Touch Forward:',
      titleB: 'Clear Roles. One Owner. Continuous Partnership.',
      columns: [
        {
          label: 'Built for Scale, Designed for Alignment',
          tone: 'red',
          bullets: [
            {
              title: 'Fit-for-Scale Organizational Model',
              body:
                'A clearly defined, Navigator-led operating model with embedded ownership, decision rights, and governance ensures resources scale with demand while minimizing duplication, preserving accountability, and enabling consistent execution as Catalyze360 grows.',
            },
            {
              title: 'Built-In Continuity',
              body:
                'Ownership is systematically embedded into every workflow, with a single, visible owner required at each step to ensure clear accountability, continuous coverage, and resilience through transitions, absences, or shifts in capacity.',
            },
            {
              title: 'Standardized End-to-End Processes',
              body:
                'Execution is streamlined from intake through delivery through standardized, end-to-end processes embedded in the operating model, driving speed, clear accountability, and consistent, repeatable outcomes across teams.',
            },
          ],
        },
        {
          label: 'Productivity Measures',
          tone: 'pink',
          bullets: [
            {
              title: 'Resource Management',
              body:
                'Actively manage navigator capacity and portfolio composition through regular portfolio reviews, ensuring resources are aligned to demand, workloads remain sustainable, and the model scales efficiently as volume and complexity increase.',
            },
            {
              title: 'Decisive, Science-Led Prioritization',
              body:
                'An AI-augmented Quality of Science model enables clear, consistent prioritization \u2014 combining evidence-based re-assessment with decisive accountability to support confident, transparent decisions.',
            },
            {
              title: 'Pricing Exceptions',
              body:
                'Pricing flexibility is enabled at the front line by anchoring accountability with the Navigator, while larger exceptions are consistently documented, reviewed, and governed to ensure transparency and control.',
            },
          ],
        },
        {
          label: 'Ways of Working',
          tone: 'grey',
          bullets: [
            {
              title: 'Performance Measured Where It Matters',
              body:
                'Performance is evaluated against a focused set of outcome-driven metrics (i.e., response time, resource utilization, SLA) to ensure accountability aligns with real impact.',
            },
            {
              title: 'Avoid Duplicate Outreach',
              body:
                'Clearly defined roles and interaction touchpoints prevent overlapping outreach, enforce single ownership, and proactively reduce duplicative engagement across teams.',
            },
            {
              title: 'Seamless Ownership Transitions',
              body:
                'Ownership transitions are governed through a formal handoff protocol, pairing standardized checklists with structured briefings to preserve context, decisions, and momentum across every stage.',
            },
            {
              title: 'Undiluted Service',
              body:
                'Navigators deliver a Tier 1 experience by sustaining the depth, responsiveness, and continuity of engagement, meeting the expectations of high-priority partners throughout the relationship lifecycle.',
            },
          ],
        },
      ],
    },
    governanceValueRealization: {
      eyebrow: 'Operating Model \u2014 Governance & Value Realization',
      titleA: 'Clear Routines and Metrics',
      titleB: 'that Drive Accountability',
      intro:
        'Success is not accidental. It is engineered through a system of clear ownership, disciplined routines, and visible metrics.',
      columns: [
        {
          label: 'Cross-Pillar by Design: Linking Price, Performance, Portfolio Value',
          tone: 'red',
          bullets: [
            {
              title: 'Partner 360\u00b0 View',
              body:
                'For the first time, Lilly users will have a complete, real-time history of every partner engagement across all touchpoints, eliminating silos and providing unparalleled portfolio intelligence.',
            },
            {
              title: 'Cross-Pillar Pricing',
              body:
                'Our integrated pricing model will reward multi-pillar engagement and high scientific merit, directly linking the platform\u2019s use to both revenue generation, discount structures, pillar growth opportunities, and strategic value capture.',
            },
            {
              title: 'Role-Based Dashboards',
              body:
                'From the Navigator\u2019s portfolio health alerts to the Leadership\u2019s pipeline funnel and the CBD team\u2019s handoff queue, every role will have a tailored, real-time view of the metrics that matter most to them.',
            },
          ],
        },
        {
          label: 'Discipline: Consistent, High-Impact Governance',
          tone: 'pink',
          bullets: [
            {
              title: 'Ownership Discipline Rituals',
              body:
                'A weekly, 30-minute Navigator Huddle and a monthly Portfolio Health Review ensure constant visibility, clear ownership, and proactive management of every asset in the pipeline.',
            },
            {
              title: 'Continued QoS Calibration',
              body:
                'Enable scoring consistency checks and refinement of scientific rubrics as more partners enter the ecosystem.',
            },
            {
              title: 'The Right People, The Right Cadence',
              body:
                'We will establish a clear framework for executive, account, and data quality meetings. This eliminates ad-hoc requests and creates a predictable rhythm for decision-making and roadblock removal.',
            },
            {
              title: 'Performance Accountability',
              body:
                'Individual performance metrics will be tied directly to data-driven behaviors and SLAs/outcomes tracked within the platform, ensuring what gets measured gets managed and recognized.',
            },
          ],
        },
        {
          label: 'Adoption & Adaptation: Enterprise Level Buy-in',
          tone: 'grey',
          bullets: [
            {
              title: 'Leadership Lock-In',
              body:
                'Executive reviews will run exclusively from the CRM dashboard, retiring shadow reports. If it\u2019s not in the system, it\u2019s invisible to leadership. This single behavior drives accountability more than any change management tactic could.',
            },
            {
              title: 'No Backdoor Policy',
              body:
                'All inquiries, intake, revenue, and contracts must flow through the CRM. We will integrate the system into the financial and operational bloodstream of Lilly, making it essential for doing business. Exceptions processes will be limited, if any.',
            },
            {
              title: 'Continuous Improvement Engine',
              body:
                'A formal process for user feedback, including product owner office hours and retrospectives, ensures the platform evolves to meet business needs and never goes stale.',
            },
          ],
        },
      ],
    },
    statusQuo: {
      eyebrow: 'Outcome',
      title: 'How to Make the Future State',
      titleItalic: 'the Status Quo\u2026',
      bannerLabel: 'Redesigned C360 Engagement Structure augmented by AI and best-in R&D assessment tools',
      deliverables: [
        {
          title: 'Leading Quality of Science Framework & Model',
          body:
            'Develop an overarching Quality of Science business process standardizing workflows, reporting structure, and engagement model with biotechs backed by PwC\u2019s depth in R&D.',
          iconKey: 'clipboard',
        },
        {
          title: 'End User Driven Navigator Hub Design & Execution Model',
          body:
            'Create a Partner & Lilly specific UI/UX and engagement experience to ease the evaluation and progression process while streamlining outcomes & previous interactions tracking.',
          iconKey: 'sliders',
        },
        {
          title: 'C360 Cross-Pillar Flexible Pricing Framework',
          body:
            'Formulate a foundational pricing model & deal health evaluation process leveraging deal shaping, FMV, and IPO readiness experience to create variable, but consistent pricing constructs for early-stage biotechs.',
          iconKey: 'dollar',
        },
        {
          title: 'C360 Navigator Hub Aligned Org Model & FTE Requirements',
          body:
            'Establish a streamlined & effective team supporting both internal activities and external engagement including role type/quantity, skill set considerations, and overall governance modeling.',
          iconKey: 'honeycomb',
        },
        {
          title: 'C360/Partner Engagement & Interaction Guidance Document',
          body:
            'Create an end-to-end partner engagement guidance document covering first contract through deal closure to give C360 a repeatable process across all partners and give each partner with an effective, smooth interaction.',
          iconKey: 'document',
        },
        {
          title: 'Novel C360 KPI & Success Tracker Models',
          body:
            'Operational, Engagement, and ROI based metrics designed to help C360 track not only expediency through the process, but also the effectiveness individual & aggregate partnerships.',
          iconKey: 'triangles',
        },
      ],
      sidebar: {
        title: 'Change Management & Adoption Planning',
        body:
          'Establish a targeted OCM and adoption support to guide Catalyze360 stakeholders through the transformation of the GTM Operating Model through development of an adoption plan, executive comms, \u201cwhat\u2019s changing / what\u2019s not\u201d guide, and stakeholder identification and training approach.',
      },
    },
  },

  // §04 · IMAGINE THE FUTURE — deck pages 16–22
  vision: {
    eyebrow: 'Vision',
    titleA: 'The Scientific',
    titleItalic: 'Backbone',
    titleB: 'of Partnership',
    subtitle: 'A Trusted Partner Experience',
    tagline: 'One Lilly. Many Doors.',
    principles: [
      {
        title: 'Clarity Over Complexity',
        body:
          'Reduce internal friction and eliminate the fragmented experience biotechs face today by delivering a CRM experience that prioritizes visible ownership and next steps, clear stage definitions with rationale, and a shared engagement history across pillars.',
      },
      {
        title: 'Meet Users Where They Are',
        body:
          'Many Doors, One Backbone. Different roles engage differently — but all contribute to one truth. Respect how humans actually work, while preserving enterprise visibility and trust.',
      },
      {
        title: 'Human-in-the-Loop Intelligence',
        body:
          'AI is designed as an assistant, not an authority. Build trust with users, support governance expectations, and reinforce accountability — especially critical in scientific and BD decision-making.',
      },
      {
        title: 'Reduced Cognitive & Administrative Load',
        body:
          'The system works for users, not the other way around. The experience minimizes manual data entry so teams can focus on relationships, science, and decision quality — driving adoption and long-term value realization.',
      },
      {
        title: 'Trust Through Transparency & Governance',
        body:
          'Trust is designed into the experience. Reinforce Lilly\u2019s credibility as a partner and ensure compliance without slowing innovation.',
      },
    ],
    architecture: {
      title: 'One Coordinated External Innovation Experience',
      titleItalic: 'Enabled by Catalyze360',
      body:
        'A shared Salesforce backbone that connects multiple front doors, roles, and workflows \u2014 enabling consistent partner engagement, clear ownership and trusted enterprise visibility.',
      pillars: [
        {
          title: 'Lilly Gateway Labs',
          body: 'Physical lab space \u00b7 Wet lab access \u00b7 Equipment & resource \u00b7 Peer community',
        },
        {
          title: 'ExploR&D',
          body: 'Research collaboration \u00b7 CMC expertise \u00b7 Capability sharing \u00b7 Technical support',
        },
        {
          title: 'TuneLab',
          body: 'TA-specific consulting \u00b7 Regulatory guidance \u00b7 Clinical strategy \u00b7 Development support',
        },
      ],
      capabilities: [
        {
          title: 'Unified CRM Platform',
          body: 'Single source of truth for all biotech partner relationships.',
        },
        {
          title: 'Cross-Pillar Pricing',
          body: 'Integrated pricing model with multi-pillar discounts.',
        },
        {
          title: 'User Experience',
          body: 'Navigator-led coordination across entire journey.',
        },
      ],
      audiences: [
        { label: 'Prospective Partner', imageSrc: '/audiences/prospective-partner.png' },
        { label: 'Active Partner', imageSrc: '/audiences/active-partner.png' },
        { label: 'Innovation Team', imageSrc: '/audiences/innovation-team.png' },
        { label: 'Leadership', imageSrc: '/audiences/leadership.png' },
      ],
      backboneLabel: 'Salesforce CRM Backbone',
      pillarsHeading: 'Three Integrated Pillars',
      footerCaption:
        'Designed for scale and growth \u2014 new pillars, programs, workflows, and partner models integrate seamlessly into a unified experience.',
    },
    perspectives: [
      {
        number: '01',
        audience: 'Partner',
        title: 'One Coordinated Way to Work with Lilly',
        body:
          'Every interaction builds on shared context, clear ownership, and visible next steps, so momentum is maintained across teams and stages without rework or confusion.',
        bullets: [
          'One Lilly, across every door. Your engagements across any and all (e.g., Explore R&D, Gateway Labs, TuneLab, Ventures, and BD) stay connected — shared context, shared history, and shared next steps.',
          'One assessment. Reused everywhere. Quality-of-Science and fit signals are captured once and carried through routing and review — fewer repeat asks, faster triage, clearer decisions.',
          'Proactive, Not Reactive, Engagements. A shared timeline and clear next steps keep work moving — risks and stalls surface early, with proactive outreach and escalation.',
          'Consistent signals across the lifecycle. Quality-of-Science and fit signals are captured once and carried forward, reducing repeat requests and keeping momentum.',
        ],
      },
      {
        number: '02',
        audience: 'Innovation Team',
        title: 'Centralized triage and prioritization with human confirmation',
        body: 'Consistent, accountable routing decisions for every external opportunity.',
        bullets: [
          'One partner record. Clear owner. Clear next step. Every opportunity has a single source of truth — ownership, last touch, next step, and full engagement history.',
          'An AI-assisted view of the full partner relationship. Bringing together current and upcoming engagements, partner tier, Quality-of-Science signals, activity history, and next steps, with quick actions available in context.',
        ],
      },
      {
        number: '03',
        audience: 'Leadership',
        title: 'A shared, enterprise view of every partner and team trust',
        body:
          'All engagement, status, and next steps are visible in one place — across teams and over time.',
        bullets: [
          'One trusted view of all partners, initiatives, and teams.',
          'Real-time visibility into status, priorities, risks, and next steps.',
          'Data-driven control of effort, capacity, and investment.',
          'Actionable insights that turn signals into timely decisions.',
          'Scalable governance as innovation volume and complexity grow.',
          'Consistent partner experience that strengthens Lilly\u2019s reputation.',
        ],
      },
    ],
  },

  // §05 · DELIVERY APPROACH — deck pages 23–28
  delivery: {
    eyebrow: 'Delivery Approach',
    title: 'From Vision to Value.',
    lede:
      'A structured, one-day immersive workshop kicks off Sprint 0 to move from strategic discovery through hands-on design to functional prototypes, delivering tangible outcomes at speed.',
    sprintZero: {
      eyebrow: 'Delivery Approach \u2014 Innovation Sprint',
      title: 'The Lilly Innovation Sprint 0:',
      titleItalic: 'From Vision to Value',
      subtitle: 'Our Immersive Sprint Journey',
      intro:
        'A structured, one-day immersive workshop to kick off Sprint 0 to move from strategic discovery through hands-on design to functional prototypes, delivering tangible outcomes at speed.',
      phases: [
        {
          number: '01',
          title: 'Discover & Define',
          body:
            'We\u2019ll immerse ourselves in your key challenges and strategic priorities, defining a focused problem statement to anchor our sprint 0.',
          activities: [
            'Stakeholder interviews & landscape review',
            'Challenge mapping & prioritization',
            'Focused problem statement definition',
          ],
        },
        {
          number: '02',
          title: 'Ideate & Design',
          body:
            'In a rapid, hands-on in-person workshop, we\u2019ll generate a broad set of innovative ideas and design the most promising concepts into concrete user journeys.',
          activities: [
            'Collaborative ideation workshop',
            'Concept evaluation & selection',
            'User journey & experience design',
          ],
        },
        {
          number: '03',
          title: 'Prototype & Test',
          body:
            'Our team will rapidly build functional, "art of the possible" prototypes that bring our shared vision to life for stakeholder feedback and iteration.',
          activities: [
            'Rapid functional prototyping',
            'Stakeholder feedback sessions',
            'Iterative refinement & roadmap',
          ],
        },
      ],
      outcomes: [
        'Vision-on-a-Page',
        'Prioritized Concept Designs',
        'Live, Clickable Prototype',
        '30-60-90 Day Action Plan',
      ],
      stamp: {
        line1: 'SPRINT',
        line2: '0',
        subtitle: 'One Day Workshop',
      },
    },
    operatingModelDesign: {
      eyebrow: 'Delivery Approach \u2014 Operational Model Strategy and Design',
      title: 'Design the',
      titleItalic: 'Future-State, Unified GTM Operating Model',
      body:
        'Facilitate a series of workshops to redefine the Partner Journey, with a focus on a unified, collaborative model that is enabled by technology \u2014 roles and responsibilities, cross-pillar engagement, governance, business process.',
      months: ['February', 'March', 'April', 'May', 'June'],
      chevrons: [
        {
          label: 'Current-State Discovery & Alignment',
          tone: 'pink',
          spans: ['February'],
          markers: ['WS1'],
        },
        {
          label: 'Design Future State Go-To-Market Operating Model',
          tone: 'red',
          spans: ['March', 'April', 'May', 'June'],
          markers: ['WS2', 'WS3', 'WS4', 'WS5'],
        },
      ],
      workstreams: [
        {
          id: 'WS1',
          title: 'Planning & Set-Up / Current-State Review',
          activities: [
            'Facilitate kickoff planning and establish project governance',
            'Develop and manage E2E project plan covering risk, changes, communication and escalation',
            'Review legacy workflows and processes (QoS Assessment, Navigator Assignment, Triaging to Pillars), inclusive of roles and responsibilities, relevant system interactions, reporting, and governance',
          ],
        },
        {
          id: 'WS2\u2013WS5',
          title: 'Re-Define the GTM Operating Model',
          activities: [
            'Facilitate a series of workshops to redefine the Partner Journey, with a focus on a unified, collaborative model that is enabled by technology (roles and responsibilities, cross-pillar engagement, governance, business process, etc.)',
            'Define the business process for the QoS Assessment, standardizing workflows, reporting structure, and engagement model with biotechs',
            'Redefine the Navigator engagement model, developing a streamlined process for managing biotechs, enabled by the CRM platform',
            'Develop repeatable engagement and interaction playbooks, standardizing the E2E engagement of the Catalyze360 process, internally and externally',
            'Develop C360 KPI\u2019s and metrics (operational, engagement, and ROI) to track partner engagement and success',
            'Define a transparent pricing model for biotechs to assess and evaluate the optionality of engaging and purchasing additional C360 pillar offerings',
          ],
        },
      ],
      deliverables: [
        { title: 'Leading Quality of Science Framework & Model', iconKey: 'clipboard' },
        { title: 'C360 Cross-Pillar Flexible Pricing Framework', iconKey: 'dollar' },
        { title: 'C360/Partner Engagement and Interaction Guidance Document', iconKey: 'document' },
        { title: 'End User Driven Navigator Hub Design & Execution Model', iconKey: 'sliders' },
        { title: 'C360 Navigator Hub Aligned Org Model & FTE Requirements', iconKey: 'honeycomb' },
        { title: 'Novel C360 KPI & Success Tracker Models', iconKey: 'triangles' },
      ],
      playbookLabel: 'C360 Operating Model Playbook, consisting of:',
    },
    implementationTimeline: {
      title: '\u2026and Delivered Through a Rapid MVP',
      titleItalic: 'with Iterative Releases',
      year: '2026',
      months: ['Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oct & Beyond'],
      milestones: [
        { label: 'Kickoff', month: 'Feb' },
        { label: 'Discovery Readout', month: 'March' },
        { label: 'MVP Go-live', month: 'June' },
        { label: 'Monthly Prod Release', month: 'July' },
        { label: 'Monthly Prod Release', month: 'August' },
        { label: 'Monthly Prod Release', month: 'September' },
        { label: 'Monthly Prod Release', month: 'Oct & Beyond' },
      ],
      phases: [
        { label: 'Discovery', sub: '(5 weeks)', tone: 'red', spanStart: 'Feb', spanEnd: 'March' },
        { label: 'MVP Implementation', sub: '(10 weeks + 2 weeks hypercare)', tone: 'dark', spanStart: 'March', spanEnd: 'June' },
        { label: 'Post MVP (Monthly Releases)', sub: '', tone: 'grey', spanStart: 'June', spanEnd: 'Oct & Beyond' },
      ],
      sprints: ['Sprint 0', 'Sprint 1', 'Sprint 2', 'Sprint 3'],
      mvpStages: ['SIT', 'UAT', 'Deploy', 'Hypercare'],
      capabilityCascade: [
        'Foundation CRM Setup',
        'Account & Contact Management',
        'Lead & Opportunity Management',
        'Intake Flow',
        'Document Management',
        'Activities/Interactions',
        'Reports & Dashboard',
      ],
      futureFeatures: [
        'Request and Follow-Up Management',
        'Chat Collaboration',
        'Action Alerts & Notifications',
        'AI & Smart Recommendations',
        'Self Service & Status Transparency',
        'Additional System Integrations',
        'Portfolio & Executive Dashboards',
        'Advanced Search & Guided Insights',
        'Workflow Automation & SLA Management',
        'External Data Enrichment',
        'Partner Experience Portal',
      ],
      futureFootnote: 'Non-exhaustive list',
      discoveryActivities: [
        {
          week: 'Week 1',
          bullets: [
            'Kickoff & discovery planning',
            'Current-state assessment and pain-point identification',
            'CRM tools evaluation alignment',
          ],
        },
        {
          week: 'Week 2',
          bullets: [
            'L1\u2013L3 capability & process discovery',
            'CRM tool selection',
            'Technical architecture exploration',
          ],
        },
        {
          week: 'Week 3',
          bullets: [
            'Architecture alignment',
            'High-level requirements discovery & Sprint 1 user-story shaping',
          ],
        },
        {
          week: 'Week 4 \u2013 5',
          bullets: [
            'Future-state roadmap discovery',
            'Innovation sprint definition to support implementation',
            'Discovery readouts',
          ],
        },
      ],
      discoveryDeliverables: [
        'Current State Summary',
        'L1 \u2013 L3 Capabilities',
        'Future State Process Flows',
        'CRM Tool Assessment',
        'Future State Roadmap',
        'High Level Architecture',
      ],
      implementationDeliverables: [
        'Admin Runbook',
        'Sprint Backlog',
        'Build Log',
        'Solution Design Document',
      ],
      legend: {
        sprintLabel: 'Sprints',
        milestoneLabel: 'Key Project Milestones',
      },
    },
    timeline: {
      eyebrow: 'Implementation Roadmap',
      title: 'Delivered Through a Rapid MVP with Iterative Releases',
      phases: [
        { month: 'Feb 2026', title: 'Kickoff', body: 'Sprint 0 Innovation Workshop · Discovery planning.' },
        {
          month: 'March 2026',
          title: 'Discovery Phase (5 weeks)',
          body:
            'Current-state assessment · L1–L3 capability & process discovery · CRM tool selection · Technical architecture alignment · Future-state roadmap.',
        },
        {
          month: 'April 2026',
          title: 'MVP Implementation Begins',
          body:
            'Foundation CRM Setup · Account & Contact Management · Lead & Opportunity Management · Intake Flow · Document Management · Activities/Interactions · Reports & Dashboard.',
        },
        {
          month: 'May 2026',
          title: 'MVP Go-Live',
          body: 'SIT · UAT · Deploy · 2 weeks Hypercare. Transition to iterative release operating model.',
        },
        {
          month: 'June–Aug 2026',
          title: 'Post-MVP Monthly Releases',
          body:
            'Request Management · Chat Collaboration · Action Alerts · AI Smart Recommendations · Self-Service · Additional Integrations.',
        },
        {
          month: 'Sept 2026+',
          title: 'Scale & Optimize',
          body:
            'Portfolio & Executive Dashboards · Advanced Search & Guided Insights · Workflow Automation · External Data Enrichment · Partner Experience Portal.',
        },
      ],
    },
    mvp: {
      eyebrow: 'MVP Capabilities',
      title: '10 Weeks of Build + 2 Weeks of Hypercare',
      capabilities: [
        'Foundation CRM Setup',
        'Account & Contact Management',
        'Lead & Opportunity Management',
        'Intake Flow',
        'Document Management',
        'Activities / Interactions',
        'Reports & Dashboard',
      ],
      futureCapabilities: [
        'Request and Follow-Up Management',
        'Chat Collaboration',
        'Action Alerts & Notifications',
        'AI & Smart Recommendations',
        'Self Service & Status Transparency',
        'Additional System Integrations',
        'Portfolio & Executive Dashboards',
        'Advanced Search & Guided Insights',
        'Workflow Automation & SLA Management',
        'External Data Enrichment',
        'Partner Experience Portal',
      ],
    },
    architecture: {
      eyebrow: 'Delivery Approach \u2014 Future-State Architecture',
      title: 'Future-State Architecture -',
      titleItalic: 'Phased Approach',
      sourceSystems: [
        'Websites',
        'Secure Document Repository',
        'Corporate Business Development (BD) / Impart Platform',
        'Search & Evaluate / Quality-of-Science Systems',
        'Email & Calendar Systems (e.g., Outlook / Exchange)',
        'Identity Provider (IdP / IAM Platform)',
        'Enterprise Data Platform',
      ],
      esbLabel:
        'ESB Middleware & ETL Tool: Responsible for Transformation, Orchestration, Error Handling, Event Monitoring with API & MCP Gateway',
      internalUsers: [
        'Lilly Ventures',
        'Corporate BD',
        'Scout / Explore R&D',
        'Gateway Labs',
        'TuneLabs',
        'S&E',
        'Operations',
        'Business users',
        'Legal Compliance',
        'IT Admins',
      ],
      internalUserBarLabel: 'Salesforce Lightning Console/App (IAM and SSO)',
      externalUserLabel: 'External Biotech Partner',
      externalUserBarLabel: 'Partner Portal on Experience Cloud (IAM and SSO)',
      crmCoreLabel: 'Core CRM',
      crmCoreCapabilities: [
        { label: 'Account Management', tier: 'mvp' },
        { label: 'Lead Management', tier: 'mvp' },
        { label: 'Opportunity Management', tier: 'mvp' },
        { label: 'Chat', tier: 'post-mvp' },
        { label: 'Case Management', tier: 'post-mvp' },
        { label: 'Self Service', tier: 'post-mvp' },
        { label: 'Contact Management', tier: 'mvp' },
        { label: 'Document Management', tier: 'mvp' },
        { label: 'Duplicate Management', tier: 'post-mvp' },
        { label: 'Alerts & Notifications', tier: 'post-mvp' },
        { label: 'Contract Management', tier: 'post-mvp' },
        { label: 'Vendor Engagement', tier: 'post-mvp' },
        { label: 'Activities/Task Management', tier: 'mvp' },
        { label: 'Intake Flows', tier: 'mvp' },
        { label: 'Smart Scoring', tier: 'post-mvp' },
        { label: 'Email to Case', tier: 'post-mvp' },
        { label: 'Web to Case', tier: 'post-mvp' },
        { label: 'Smart Recommendations', tier: 'post-mvp' },
        { label: 'Omni-Channel Routing', tier: 'post-mvp' },
        { label: 'Reports & Dashboard', tier: 'mvp' },
        { label: 'Assessments', tier: 'post-mvp' },
      ],
      dataModelsLabel: 'Foundational Data Models',
      dataModelEntities: [
        'Leads',
        'Opportunities',
        'Activities/Task',
        'Users',
        'Life Sciences Cloud Lists/Workflows',
        'Contracts',
      ],
      dataModels: ['Account Data Model', 'Contact Data Model', 'Case Data Model'],
      coreCapabilitiesLabel: 'Salesforce Core Capabilities, Utilities, & APIs',
      coreCapabilities: [
        'Salesforce Integrations Framework',
        'Lightning App Builder/LWCs',
        'Security & Compliance',
        'Apex/Flow/OmniStudio/BRE',
      ],
      keyHighlightsLabel: 'Key Highlights',
      highlights: [
        {
          title: 'Unified Partner Engagement',
          body:
            'A single, shared view across innovation pillars, while allowing each team to enter and work in the system through role-appropriate front doors.',
        },
        {
          title: 'Navigator-Led Intake and Routing',
          body:
            'A centralized intake and routing model reduces duplication, enforces ownership and SLAs, and ensures opportunities are directed to the right team.',
        },
        {
          title: 'Usability-First, Adoption-Driven Design',
          body:
            'The architecture prioritizes data capture, clear ownership, and next steps so the CRM becomes the default way teams work, not another system to manage.',
        },
        {
          title: 'Portfolio-Level Visibility and Leadership Insights',
          body:
            'Shared data and standardized stages enable dashboards for portfolio health, pipeline flow, and cross-pillar activity, supporting leadership reviews.',
        },
      ],
      legend: {
        mvpLabel: 'MVP Capabilities',
        postMvpLabel: 'Post MVP Capabilities',
      },
    },
    iterativeRelease: {
      title: 'Iterative Release',
      titleItalic: 'Operating Model',
      intro:
        'The Iterative Release or \u201cDemand\u201d team partners closely with the Innovation Pillars to shape a multi-release roadmap. Each set of priorities is then translated into well-defined, estimated story points before being handed to development for delivery.',
      topBandLabel: 'Post-MVP Iterative Production Release',
      bottomBandLabel: 'Technical Debt Remediation',
      columnLabels: [
        'Request Source',
        'Centralized intake for rationalizes / prioritizes requests',
        'Request Type',
        'Demand Team',
        'Delivery and Support Team',
      ],
      requestSources: [
        { label: 'Enhancement Intake', tone: 'pink' },
        { label: 'New Features', tone: 'pink' },
        { label: 'Production Support', tone: 'grey' },
      ],
      intakeLabel: 'Centralized intake for rationalizes / prioritizes requests',
      requestTypes: [
        { label: 'CRM Requirement', track: 'top' },
        { label: 'Impact Analysis', track: 'top' },
        { label: 'CRM Enhancement', track: 'middle' },
        { label: 'CRM Releases', track: 'middle' },
        { label: 'Technical Debt', track: 'middle' },
        { label: 'Compliance / Regulatory', track: 'middle' },
        { label: 'Ticket', track: 'bottom' },
        { label: 'Resolved', track: 'bottom' },
        { label: 'Problem fixes', track: 'bottom' },
        { label: 'Enhancements', track: 'bottom' },
        { label: 'Critical Incident / Service Request', track: 'bottom' },
      ],
      epicLabel: 'EPIC / User Stories',
      backlogLabel: 'Backlog',
      backlogBody: 'User stories become \u201cready\u201d by grooming priority',
      reviewBoardLabel: 'Architecture review board',
      prioritization: {
        label: 'Prioritization',
        criteria: ['Complexity', 'Effort', 'Severity', 'Business impact'],
      },
      releases: [
        { label: 'Monthly Release', tone: 'grey' },
        { label: 'Express Release', tone: 'grey' },
      ],
      flagLabels: {
        release: 'Release planning',
        sprint: 'Sprint planning',
      },
      legend: {
        production: 'Production Team',
        iterative: 'Iterative Release Team',
      },
    },
  },

  // §06 · COMMERCIALS — deck page 29
  commercials: {
    eyebrow: 'Commercials',
    title: 'Our Commercial Offer for Catalyze360.',
    headlineFee: {
      value: '$1,386,501',
      caption: 'Final proposed fees (excluding expenses)',
    },
    feeLines: [
      {
        name: 'Operational Model Strategy & Design',
        amount: '$909,650',
        deliverables: [
          'Catalyze 360 Go-to-Market Operating Model Playbook',
          'Quality of Science Framework and Model',
          'C360 Cross-Pillar Flexible Pricing Framework',
          'C360/Partner Engagement and Interaction Guidance Document',
          'End-User Driven Navigator Hub Design & Execution Model',
          'C360 Navigator Hub Aligned Org Model & FTE Requirement',
          'Value Realization & Reporting',
        ],
      },
      {
        name: 'CRM Assessment & Implementation',
        amount: '$1,172,450',
        deliverables: [
          'CRM platform assessment and recommendation',
          'Core CRM configuration and data model',
          'Integration(s) and data enablement',
          'Dashboards and reports',
          'Testing, deployment and MVP enablement',
          'Post-MVP iterative release planning',
        ],
      },
    ],
    discount: [
      { label: 'Proposed Total Fees', value: '$2,082,100' },
      { label: 'PwC Lilly Partnership Discount (19%)', value: '−$395,599' },
      { label: 'PwC Additional Investment', value: '−$300,000' },
      { label: 'Final Proposed Fees', value: '$1,386,501' },
    ],
    assumptions: [
      'Out of pocket travel & expenses will follow standard Lilly policies to be billed as 5% of post-discount, pre-investment fees.',
      'WO will adhere to the 2008 IT PSA.',
      'PwC will meet with Project Leadership monthly to confirm deliverable quality and acceptance prior to invoicing professional fees.',
      'PwC will bring proprietary PwC accelerators to enhance program delivery.',
    ],
  },

  // §07 · TEAM — deck pages 30–33
  team: {
    eyebrow: 'Team',
    title: 'Your Delivery Team.',
    lede:
      'A unified team combining deep R&D domain expertise, proven Salesforce implementation leadership, experience design craft, and Lilly subject-matter depth.',
    members: [
      {
        name: 'Nisha Asher',
        role: 'Op Model Lead',
        email: 'nisha.asher@pwc.com',
        bio:
          'PwC R&D Advisory Partner, driving the intersection of R&D, M&A deals, and large-scale transformations. Prior to PwC, worked across startups and Sponsors within Corporate Strategy / Development, R&D, and Medical functions.',
        highlights: [
          'Managed multi-year data lake implementation for a pharma co. with 50+ R&D operational/clinical data sources.',
          'Drove enterprise-wide operating model changes across Discovery through Pharmaceutical Technology.',
          'Led clinical data standardization and advanced analytics initiatives across 600+ studies.',
          'Advised on $4–$20B asset-focused diligence, integration, and divestitures.',
        ],
        monogram: 'NA',
        imageSrc: '/team/nisha-asher.png',
        tier: 'core',
      },
      {
        name: 'Erica Yung',
        role: 'CRM Tech Lead',
        email: 'erica.yung@pwc.com',
        bio:
          'Partner at PwC focused on CRM-enabled go-to-market transformation. Serves as PwC\u2019s Salesforce Partner for CRM, working with life sciences and technology organizations to build and scale enterprise CRM platforms.',
        highlights: [
          'Led large-scale Salesforce CRM programs from discovery through deployment — core data models, integrations, security design, and role-based user experiences.',
          'Oversees iterative delivery models translating business priorities into well-defined, estimated work and consistent release cycles.',
          'Trusted advisor to IT and platform leaders on system scalability, data governance, and delivery risk.',
        ],
        monogram: 'EY',
        imageSrc: '/team/erica-yung.png',
        tier: 'core',
      },
      {
        name: 'Raj Muthuswamy',
        role: 'Migration & Change Specialist',
        email: 'raj.muthuswamy@pwc.com',
        bio:
          'PwC partner advising Pharma and Life Sciences organizations on Digital Strategy and Execution across Marketing, Sales, Commerce and Service. 20+ years of experience.',
        highlights: [
          'Client-side experience as an IT Leader migrating Pharma CRM platforms.',
          'Ran several full life-cycle Enterprise CRM migrations from legacy platforms (Siebel, Cegedim, Dynamics, Sugar CRM).',
          'Specialty areas: CRM transformation, enterprise cloud strategy, system integration, digital strategy and architecture.',
        ],
        monogram: 'RM',
        imageSrc: '/team/raj-muthuswamy.png',
        tier: 'core',
      },
      {
        name: 'Angela Lester',
        role: 'Experience Specialist',
        email: 'angela.v.lester@pwc.com',
        bio:
          'Partner in PwC\u2019s Experience practice. 25+ years of experience in creating exceptional customer and employee experiences that drive meaningful business results.',
        highlights: [
          'Co-created an innovative product and service model and "single pane of glass" for staff.',
          'Created employee knowledge management, certification and onboarding experience including micro-sites.',
          'Led the development of a "path to purchase" strategy with focus on Taxonomy.',
        ],
        monogram: 'AL',
        imageSrc: '/team/angela-lester.png',
        tier: 'core',
      },
      {
        name: 'Brandon Fisher',
        role: 'Engagement Manager',
        email: 'brandon.fisher@pwc.com',
        bio:
          'Director with PwC\u2019s Customer & Service Excellence (CSX) practice. 15+ years of experience guiding global pharma clients through complex digital transformations.',
        highlights: [
          'Specializes in risk management and execution alignment for teaming engagements involving software vendor professional services and multi-SI environments.',
          'Deep expertise in helping life sciences organizations operationalize enterprise platforms.',
        ],
        monogram: 'BF',
        imageSrc: '/team/brandon-fisher.png',
        tier: 'core',
      },
      {
        name: 'Ian Bales',
        role: 'Strategy Specialist',
        email: 'ian.bales@pwc.com',
        bio:
          'Chicago-based management and strategy consultant in the Life Science R&D Practice. 15+ years spanning basic/clinical research and management consulting. Leads PwC\u2019s Fit for Launch Accelerator.',
        highlights: [
          'Leads process refinement/optimization & op model design for multiple global pharma functions.',
          'Defines Data Strategy & Utilization plans for global pharma organizations.',
          'Leads Growth Engine Strategy for early-stage to mid-sized bio pharma.',
          'Leads novel Simulative AI partnerships for drug discovery, repurposing, and due diligence.',
        ],
        monogram: 'IB',
        imageSrc: '/team/ian-bales.png',
        tier: 'core',
      },
      {
        name: 'Sanju PS',
        role: 'Experience Designer',
        email: 'sanju.ps@pwc.com',
        bio:
          'Director in PwC\u2019s Salesforce practice and leads the Salesforce Experience Design capability. 17+ years of professional experience. Recognized with a Salesforce Partner Innovation Award.',
        highlights: [
          'Led innovative experience design for a major pharma client to transform end-to-end business processes on Salesforce Life Sciences Cloud.',
          'Led partner relationship management programs and solutions across diverse industries.',
        ],
        monogram: 'SP',
        imageSrc: '/team/sanju-ps.png',
        tier: 'specialist',
      },
      {
        name: 'Siddhant Chugh',
        role: 'Technical Architect',
        email: 'siddhant.chugh@pwc.com',
        bio:
          'Director in PwC\u2019s Health Industry Advisory practice and serves as Chief Architect across PwC\u2019s Salesforce Health sector. 11+ years leading complex, regulated CRM and platform transformations.',
        highlights: [
          'Extensive experience delivering Salesforce-based platforms across commercial and R&D functions.',
          'Specializes in architecting enterprise CRM backbones that support multi-functional operating models.',
          'Approach emphasizes usability, governance, security, and extensibility.',
        ],
        monogram: 'SC',
        imageSrc: '/team/siddhant-chugh.png',
        tier: 'specialist',
      },
      {
        name: 'Matt Rich',
        role: 'Data & Analytics Specialist · Lilly SME',
        email: 'matthew.rich@pwc.com',
        bio:
          'Partner with PwC\u2019s Data and Analytics Technologies practice, based in Chicago. 27 years of professional experience. Leader with PwC\u2019s Health Industry Advisory group.',
        highlights: [
          'Experience working at the intersection of technology and pharmaceutical R&D.',
          'Led scientific and operational big data and analytics initiatives.',
          'Implemented digital technologies within clinical development, regulatory operations, and pharmacovigilance areas.',
        ],
        monogram: 'MR',
        imageSrc: '/team/matt-rich.png',
        tier: 'lilly-sme',
      },
      {
        name: 'Gurpreet Singh',
        role: 'Global Account Leader · Lilly SME',
        email: 'gurpreet.singh@pwc.com',
        bio:
          'Partner with PwC\u2019s Technology Strategy practice, based in Chicago. 31+ years of professional experience.',
        highlights: [
          'Technologies and AI to gain competitive advantage.',
          'Co-led the CDO transformation and change management program.',
          'Expertise in health information technology and digital strategies that drive innovation and improve patient outcomes.',
        ],
        monogram: 'GS',
        imageSrc: '/team/gurpreet-singh.png',
        tier: 'lilly-sme',
      },
      {
        name: 'Tarun Sharma',
        role: 'AI Customer Experience Lead · Lilly SME',
        email: 'sharma.k.tarun@pwc.com',
        bio:
          'Senior Manager in PwC\u2019s Data Analytics & AI practice, based in New York. 9+ years in Data Analytics, AI and Contact Center Transformation.',
        highlights: [
          'Scalable omnichannel and AI-fueled conversational experiences.',
          'Led a global retailer through Contact Center modernization.',
          'Managed stand-up of AI COE for a leading telecom provider.',
        ],
        monogram: 'TS',
        imageSrc: '/team/tarun-sharma.png',
        tier: 'lilly-sme',
      },
      {
        name: 'Sid Bhattacharya',
        role: 'R&D Specialist · Lilly SME',
        email: 'siddhartha.bhattacharya@pwc.com',
        bio:
          'Partner with PwC\u2019s Data, Analytics and AI practice, based in Philadelphia. 20+ years of professional experience.',
        highlights: [
          'Experience across pharmaceutical, biotechnology, and financial services sectors.',
          'Cross-functional skills focused on the intersection of R&D strategy, operations, and technology.',
          'Specializes in business strategy, operational due diligence, post-merger integration, and ERP-enabled transformation.',
        ],
        monogram: 'SB',
        imageSrc: '/team/sid-bhattacharya.png',
        tier: 'lilly-sme',
      },
    ],
  },

  // §08 · EXPERIENCE & CASE STUDIES — deck pages 34–38
  experience: {
    eyebrow: 'Experience & Case Studies',
    title: 'Proof in Partnership.',
    lede:
      'Selected engagements that demonstrate our capability to deliver complex CRM and operating-model transformations at Lilly scale.',
    cases: [
      {
        id: 'top5-pharma',
        title: 'End-to-End Planning and CRM Implementation for a Top 5 Pharma',
        challenge:
          'A top 5 global pharma was undergoing a company-wide customer engagement transformation effort — needing a standard and scalable approach to deploy, as well as post-go-live operation services to the affiliates impacted. To ensure the implementation led to real customer engagement and business value realization, there was a need for organizational change impact management and data measurement of the actual CRM platform utilization.',
        solution:
          'Devised a change approach with dedicated deployment steps grouped by stages and validated the model in a series of "simulation" workshops with 40 participants. Provided strategic support in defining and executing the master data management plan. Created program and enablement playbooks to empower PMO roles and affiliate resources. Implemented dashboards to support decision making across adoption, program health, operations stability, financials and value realization.',
        outcome:
          'For the first time, 80+ affiliates were in the same global platform. Delivered a consistent deployment experience for 120+ countries and 15,000 end users through 6 separate teams. Changed release strategy with lead time reduced from 14 months to 4 months. Changed rollout approach saving 1 year from the initial global deployment roadmap. Supported program savings achieving 2-digit millions CHF per year. Implemented a new operations model, enhancing CSAT score by 25% within the first 3 months.',
        stat: { value: '15,000', caption: 'end users across 120+ countries' },
        quotes: [
          {
            text:
              'I have found PwC to be a highly skilled and engaged consulting partner... they have been instrumental in achieving the full deployment of our MarTech transformation program. Ready to flex when needed, they lean into the problem and co-create solutions to ensure their clients\u2019 success.',
            attribution: 'IT Systems Lifecycle Lead',
          },
          {
            text:
              'The PwC team is integral to the success of our MarTech program... We work with other consultants too in this program, but they don\u2019t even come close to the expertise and support provided by PwC.',
            attribution: 'Head of Marketing Technologies',
          },
        ],
      },
      {
        id: 'global-crm-migration',
        title: 'Global CRM Migration Program — Strategy, Planning, and Execution',
        challenge:
          'Client was undergoing a separation from its parent company. Building an independent CRM platform became a critical step for successful front-office business operations. The client was looking for a trusted advisory partnership to drive end-to-end CRM transformation and design global business processes to drive success across 70+ countries.',
        solution:
          'Designed and implemented an integrated cloud-based CRM platform based on Marketing Cloud and Salesforce Health Cloud. Led business workshops across regions and proposed global process improvements. Delivered features like 360 HCP profile, Account Planning, Product Incident Reporting, Sample Request process, and Case Management. Platform includes integration with SAP, Pitcher, IQVIA, and others.',
        outcome:
          'Successful go-live on the first release for 7+ countries, delivering 1,160 story points (Leads, Opportunities, HCP Profile, Case Management, Reporting). Delivered 800+ story points in the second release (Quotes, Contracts, Reporting). Helped design HCPs, B2B contacts, and patient journeys on CRM to directly impact business revenues. Helped the client strike the right balance between globalizing business processes and catering to regional-specific requirements.',
        stat: { value: '1,960', caption: 'story points delivered across releases' },
      },
      {
        id: 'preclinical-op-model',
        title: 'Operating Model Transformation for Pre-Clinical Assets',
        challenge:
          'A large pharma client sought to evolve their corporate strategy to stay fit-for-purpose and competitive. They wanted to adopt a new venture-oriented model focused on innovating how they identify, acquire, advance, and deliver on new assets. By changing their model to enhanced collaboration (vs. a series of hand-offs between Discovery and Development), they hoped to implement more efficient, streamlined pathways for novel compounds.',
        solution:
          'Defined the new global operating model, inclusive of updated governance, roles and responsibilities, project team and organizational structure. Re-designed the stage-gates from discovery to development, outlining the future-state definitions for candidate nomination and the minimum data package requirements to drive go/no-go decisions. Developed candidate evaluation guidelines and change management and adoption strategy.',
        outcome:
          'Newly defined ways of working and operating model across discovery to Phase 0 — drug discovery, development, and pharmaceutical technology working cohesively within a new ecosystem that fosters open communication, close collaboration, and sharing of resources.',
      },
      {
        id: 'preclinical-ma',
        title: 'Supporting M&A Efforts of a Pre-Clinical Business Unit and Assets',
        challenge:
          'Client was looking to externalize their pre-clinical gene therapy assets to better align with corporate strategy and free up cash flow. The deal was primarily an IP deal but also included transfer of physical assets (lab materials, specimens, reagents, equipment, research contracts, regulatory documentation). 70% of milestone earnings were contingent on R&D milestones (BLA / IND, NDA).',
        solution:
          'Supported the Business Development function to centrally coordinate across multiple teams (Digital, CorpDev, Clinical Development, BioMedicine Design, Pharmaceutical Sciences). To ensure all pre-clinical R&D separation considerations were accounted for, helped the client answer test questions on cell line transferability, third-party relationships given IP ownership, and retention-vs-auction decisions for rare disease equipment.',
        outcome:
          'Reduced R&D and operational expenses while allowing the company to retain a share of the profit of the commercialized drug product they had licensed out. Allowed the client to invest more resources into a smaller number of therapeutic areas with larger market share.',
      },
    ],
    techAtLilly: {
      eyebrow: 'Business Technology · Tech@Lilly',
      title: 'We\u2019ve supported global and local matters spanning various functions across the business.',
      note:
        'Our 15+ year, 400+ engagement history with Lilly spans Manufacturing, Commercial, G&A, LRL, and Lilly International — representative list includes Next Gen QMS, Global MFG Assessments, Plant Lighthouses, GIS Org Assessment, Oncology MA KOL, Future State G2N Strategy, Connected Care HCO/GTM, Digital Health Capabilities, Website of the Future Benchmark, Real World Evidence Strategy, GPS Mosaic Design, CTMS IT Strategy, Generative AI Opportunities at Lilly, CRM of the Future Strategy Assessment, ServiceNow Implementation, and many more.',
    },
  },

  // §09 · CLOSE
  close: {
    eyebrow: 'Next Steps',
    title: 'Ready to begin the journey.',
    body:
      'We would welcome the opportunity to kick off with our Innovation Sprint 0 — a structured, one-day immersive workshop to move from strategic discovery through hands-on design to functional prototypes.',
    contacts: [
      { name: 'Nisha Asher', role: 'Op Model Lead', email: 'nisha.asher@pwc.com' },
      { name: 'Erica Yung', role: 'CRM Tech Lead', email: 'erica.yung@pwc.com' },
    ],
    primaryCTA: 'Schedule Innovation Sprint 0',
    secondaryCTA: 'Download Proposal PDF',
  },
}
