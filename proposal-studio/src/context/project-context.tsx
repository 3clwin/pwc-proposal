'use client'

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type {
  Project,
  BrandTokens,
  ThemeVariant,
  SiteContent,
  SiteSection,
  RiskFlag,
  UploadedFile,
} from '@/types'
import { insertAt, makeId, moveItem, removeAt, replaceAt } from '@/lib/blocks'
import { bootstrapExecSummaryBlocks } from '@/templates/catalyze-journey/sections/executive-summary.schema'

/**
 * Name → editorial headshot path for leadership-grid backfill. When the
 * bootstrap schema gains a new `imageSrc`, projects saved before that
 * change still hold the old shape in localStorage; this map lets us
 * repair those saved blocks on hydrate without clobbering unrelated edits.
 */
const LEADERSHIP_IMAGE_BY_NAME: Record<string, string> = {
  'Nisha Asher': '/team/nisha-asher.png',
  'Erica Yung': '/team/erica-yung.png',
  'Raj Muthuswamy': '/team/raj-muthuswamy.png',
  'Angela Lester': '/team/angela-lester.png',
  'Brandon Fisher': '/team/brandon-fisher.png',
  'Ian Bales': '/team/ian-bales.png',
  'Sanju PS': '/team/sanju-ps.png',
  'Siddhant Chugh': '/team/siddhant-chugh.png',
  'Matt Rich': '/team/matt-rich.png',
  'Gurpreet Singh': '/team/gurpreet-singh.png',
  'Tarun Sharma': '/team/tarun-sharma.png',
  'Sid Bhattacharya': '/team/sid-bhattacharya.png',
}

/**
 * Ensures every schema-backed section in the given `SiteContent`
 * has a `blocks` array populated with its bootstrap layout. Called
 * on SET_SITE_CONTENT and on hydration from localStorage so users
 * are always editing schema even if they generated the site before
 * the schema existed.
 *
 * Also backfills `imageSrc` on any pre-existing leadership-grid
 * leaders whose name matches `LEADERSHIP_IMAGE_BY_NAME`, so saved
 * projects pick up newly added editorial headshots automatically.
 */
function ensureBlocks(content: SiteContent): SiteContent {
  let changed = false
  const sections = content.sections.map((s) => {
    if (s.type === 'executive-summary' && (!s.blocks || s.blocks.length === 0)) {
      changed = true
      return { ...s, blocks: bootstrapExecSummaryBlocks() }
    }

    if (s.type === 'executive-summary' && Array.isArray(s.blocks)) {
      // 1) Strip stray "Display title" placeholder blocks and any
      //    duplicate display-title blocks beyond the first non-empty one.
      //    These accumulate when the user adds a block but never fills
      //    it in; the renderer will hide them, but pruning the data
      //    keeps the editor block list clean.
      let seenTitle = false
      const cleaned: typeof s.blocks = []
      for (const b of s.blocks) {
        const block = b as { type?: string; text?: string }
        if (block.type === 'display-title') {
          const text = (block.text ?? '').trim()
          if (!text || text === 'Display title') {
            changed = true
            continue
          }
          if (seenTitle) {
            changed = true
            continue
          }
          seenTitle = true
        }
        cleaned.push(b)
      }

      // 1b) Upgrade any pre-existing `workstream-timeline` blocks to the
      //     new schema shape (phases, markers, bullets, intro, hypercare,
      //     slide-8 section opener). Projects saved before these additions
      //     will be missing fields; this restores them to the current
      //     deck-faithful version without the user having to reset.
      const fresh = bootstrapExecSummaryBlocks()
      const freshTimeline = fresh.find((b) => b.type === 'workstream-timeline')
      const upgradedForTimeline = cleaned.map((b) => {
        const block = b as {
          type?: string
          bars?: unknown[]
          intro?: string
          hypercareAt?: unknown
          sectionTitle?: string
          sectionEyebrow?: string
        }
        if (block.type !== 'workstream-timeline' || !freshTimeline) return b
        const bars = Array.isArray(block.bars) ? block.bars : []
        const needsUpgrade =
          !block.intro ||
          !block.hypercareAt ||
          !block.sectionTitle ||
          !block.sectionEyebrow ||
          bars.some((bar) => {
            const b2 = bar as Record<string, unknown>
            return (
              b2.startPhase === undefined ||
              b2.endPhase === undefined ||
              !Array.isArray(b2.bullets)
            )
          })
        if (needsUpgrade) {
          changed = true
          return { ...freshTimeline, id: (block as { id?: string }).id ?? freshTimeline.id }
        }
        return b
      })

      // 1c) Ensure the Slide-1 summary block exists. Projects saved
      //     before this block type existed won't have a
      //     `slide-1-summary`; inject the bootstrap version so the deck's
      //     at-a-glance summary appears where expected. Anchored to the
      //     fee-headline position if that legacy block still exists;
      //     otherwise appended at the end.
      const freshSlide1 = fresh.find((b) => b.type === 'slide-1-summary')
      const hasSlide1 = upgradedForTimeline.some(
        (b) => (b as { type?: string }).type === 'slide-1-summary',
      )
      let withSlide1 = upgradedForTimeline
      if (!hasSlide1 && freshSlide1) {
        const feeIdx = upgradedForTimeline.findIndex(
          (b) => (b as { type?: string }).type === 'fee-headline',
        )
        const insertAtIdx = feeIdx >= 0 ? feeIdx : upgradedForTimeline.length
        withSlide1 = [
          ...upgradedForTimeline.slice(0, insertAtIdx),
          freshSlide1,
          ...upgradedForTimeline.slice(insertAtIdx),
        ]
        changed = true
      }

      // 1d) Strip the legacy `fee-headline` block. The Slide-1 summary's
      //     fee table now carries the same information in a more compact
      //     form, so the big standalone fee moment is redundant. Removing
      //     it here migrates previously-saved projects automatically.
      const preFeeCount = withSlide1.length
      withSlide1 = withSlide1.filter(
        (b) => (b as { type?: string }).type !== 'fee-headline',
      )
      if (withSlide1.length !== preFeeCount) {
        changed = true
      }

      // 2) Backfill leadership headshots by name match.
      let sectionChanged = false
      const nextBlocks = withSlide1.map((b) => {
        const block = b as { type?: string; leaders?: unknown }
        if (block.type !== 'leadership-grid' || !Array.isArray(block.leaders)) {
          return b
        }
        let blockChanged = false
        const nextLeaders = (block.leaders as Array<Record<string, unknown>>).map(
          (leader) => {
            const name = typeof leader.name === 'string' ? leader.name : ''
            const mapped = LEADERSHIP_IMAGE_BY_NAME[name]
            if (mapped && leader.imageSrc !== mapped) {
              blockChanged = true
              return { ...leader, imageSrc: mapped }
            }
            return leader
          },
        )
        if (blockChanged) {
          sectionChanged = true
          return { ...block, leaders: nextLeaders }
        }
        return b
      })

      if (sectionChanged || cleaned.length !== s.blocks.length || withSlide1 !== cleaned) {
        changed = true
        return { ...s, blocks: nextBlocks }
      }
    }

    return s
  })
  return changed ? { ...content, sections } : content
}

// --- Actions ---

type ProjectAction =
  | {
      type: 'SET_CLIENT_INFO'
      payload: {
        clientName: string
        clientSlug: string
        projectTitle: string
        industry: string
        sector?: string
        clientUrl: string
        clientContact?: string
        dueDate?: string
        description?: string
        uploadedFiles: UploadedFile[]
      }
    }
  | { type: 'SET_BRAND_TOKENS'; payload: BrandTokens }
  | { type: 'SET_THEME'; payload: ThemeVariant }
  | { type: 'SET_SITE_CONTENT'; payload: SiteContent }
  | { type: 'UPDATE_SECTION'; payload: SiteSection }
  | { type: 'ADD_RISK_FLAG'; payload: RiskFlag }
  | { type: 'RESOLVE_RISK_FLAG'; payload: { id: string; status: RiskFlag['status'] } }
  | { type: 'SET_DEPLOYMENT_URL'; payload: string }
  // --- Schema-backed editor mutations ---
  | { type: 'REORDER_SECTIONS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'DUPLICATE_SECTION'; payload: { id: string } }
  | { type: 'DELETE_SECTION'; payload: { id: string } }
  | {
      type: 'INSERT_BLOCK'
      payload: { sectionId: string; index: number; block: unknown }
    }
  | {
      type: 'UPDATE_BLOCK'
      payload: { sectionId: string; blockId: string; block: unknown }
    }
  | { type: 'DELETE_BLOCK'; payload: { sectionId: string; blockId: string } }
  | { type: 'DUPLICATE_BLOCK'; payload: { sectionId: string; blockId: string } }
  | { type: 'REORDER_BLOCKS'
      payload: { sectionId: string; fromIndex: number; toIndex: number }
    }
  // --- History ---
  | { type: 'UNDO' }
  | { type: 'REDO' }

// --- Initial State ---

function createInitialProject(): Project {
  return {
    id: crypto.randomUUID(),
    clientName: '',
    clientSlug: '',
    projectTitle: '',
    industry: '',
    clientUrl: '',
    uploadedFiles: [],
    brandTokens: null,
    selectedTheme: null,
    siteContent: null,
    riskFlags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// --- Reducer ---

function projectReducer(state: Project, action: ProjectAction): Project {
  const updatedAt = new Date().toISOString()

  switch (action.type) {
    case 'SET_CLIENT_INFO':
      return {
        ...state,
        ...action.payload,
        updatedAt,
      }

    case 'SET_BRAND_TOKENS':
      return {
        ...state,
        brandTokens: action.payload,
        updatedAt,
      }

    case 'SET_THEME':
      return {
        ...state,
        selectedTheme: action.payload,
        updatedAt,
      }

    case 'SET_SITE_CONTENT':
      return {
        ...state,
        siteContent: ensureBlocks(action.payload),
        updatedAt,
      }

    case 'UPDATE_SECTION': {
      if (!state.siteContent) return state
      return {
        ...state,
        siteContent: {
          ...state.siteContent,
          sections: state.siteContent.sections.map((s) =>
            s.id === action.payload.id ? action.payload : s
          ),
        },
        updatedAt,
      }
    }

    case 'ADD_RISK_FLAG':
      return {
        ...state,
        riskFlags: [...state.riskFlags, action.payload],
        updatedAt,
      }

    case 'RESOLVE_RISK_FLAG':
      return {
        ...state,
        riskFlags: state.riskFlags.map((f) =>
          f.id === action.payload.id
            ? { ...f, status: action.payload.status }
            : f
        ),
        updatedAt,
      }

    case 'SET_DEPLOYMENT_URL':
      return {
        ...state,
        deploymentUrl: action.payload,
        updatedAt,
      }

    case 'REORDER_SECTIONS': {
      if (!state.siteContent) return state
      const { fromIndex, toIndex } = action.payload
      const reordered = moveItem(state.siteContent.sections, fromIndex, toIndex).map(
        (s, i) => ({ ...s, order: i }),
      )
      return {
        ...state,
        siteContent: { ...state.siteContent, sections: reordered },
        updatedAt,
      }
    }

    case 'DUPLICATE_SECTION': {
      if (!state.siteContent) return state
      const index = state.siteContent.sections.findIndex(
        (s) => s.id === action.payload.id,
      )
      if (index < 0) return state
      const original = state.siteContent.sections[index]
      const copy: SiteSection = {
        ...original,
        id: makeId('section'),
        // Block ids need to be regenerated too so they remain unique.
        blocks: original.blocks?.map(
          (b) => ({ ...(b as object), id: makeId('blk') }) as unknown,
        ),
      }
      const next = insertAt(state.siteContent.sections, index + 1, copy).map(
        (s, i) => ({ ...s, order: i }),
      )
      return {
        ...state,
        siteContent: { ...state.siteContent, sections: next },
        updatedAt,
      }
    }

    case 'DELETE_SECTION': {
      if (!state.siteContent) return state
      const next = state.siteContent.sections
        .filter((s) => s.id !== action.payload.id)
        .map((s, i) => ({ ...s, order: i }))
      return {
        ...state,
        siteContent: { ...state.siteContent, sections: next },
        updatedAt,
      }
    }

    case 'INSERT_BLOCK': {
      if (!state.siteContent) return state
      const { sectionId, index, block } = action.payload
      const sections = state.siteContent.sections.map((s) => {
        if (s.id !== sectionId) return s
        const blocks = s.blocks ?? []
        return { ...s, blocks: insertAt(blocks, index, block) }
      })
      return {
        ...state,
        siteContent: { ...state.siteContent, sections },
        updatedAt,
      }
    }

    case 'UPDATE_BLOCK': {
      if (!state.siteContent) return state
      const { sectionId, blockId, block } = action.payload
      const sections = state.siteContent.sections.map((s) => {
        if (s.id !== sectionId || !s.blocks) return s
        const index = s.blocks.findIndex((b) => (b as { id: string }).id === blockId)
        if (index < 0) return s
        return { ...s, blocks: replaceAt(s.blocks, index, block) }
      })
      return {
        ...state,
        siteContent: { ...state.siteContent, sections },
        updatedAt,
      }
    }

    case 'DELETE_BLOCK': {
      if (!state.siteContent) return state
      const { sectionId, blockId } = action.payload
      const sections = state.siteContent.sections.map((s) => {
        if (s.id !== sectionId || !s.blocks) return s
        const index = s.blocks.findIndex((b) => (b as { id: string }).id === blockId)
        if (index < 0) return s
        return { ...s, blocks: removeAt(s.blocks, index) }
      })
      return {
        ...state,
        siteContent: { ...state.siteContent, sections },
        updatedAt,
      }
    }

    case 'DUPLICATE_BLOCK': {
      if (!state.siteContent) return state
      const { sectionId, blockId } = action.payload
      const sections = state.siteContent.sections.map((s) => {
        if (s.id !== sectionId || !s.blocks) return s
        const index = s.blocks.findIndex((b) => (b as { id: string }).id === blockId)
        if (index < 0) return s
        const copy = { ...(s.blocks[index] as object), id: makeId('blk') } as unknown
        return { ...s, blocks: insertAt(s.blocks, index + 1, copy) }
      })
      return {
        ...state,
        siteContent: { ...state.siteContent, sections },
        updatedAt,
      }
    }

    case 'REORDER_BLOCKS': {
      if (!state.siteContent) return state
      const { sectionId, fromIndex, toIndex } = action.payload
      const sections = state.siteContent.sections.map((s) => {
        if (s.id !== sectionId || !s.blocks) return s
        return { ...s, blocks: moveItem(s.blocks, fromIndex, toIndex) }
      })
      return {
        ...state,
        siteContent: { ...state.siteContent, sections },
        updatedAt,
      }
    }

    // UNDO/REDO are handled by the outer history reducer below and
    // never reach this inner reducer; listed here so the exhaustive
    // switch doesn't force a cast.
    case 'UNDO':
    case 'REDO':
      return state

    default:
      return state
  }
}

// --- History wrapper ---

/**
 * Actions that mutate `siteContent`. Any dispatch whose type is in
 * this set triggers a history snapshot so undo/redo can restore the
 * prior site state. Chrome-only actions (client info, brand tokens,
 * deployment URL, etc.) deliberately aren't included — they're
 * session setup, not content edits, and polluting the undo stack
 * with them would make the button feel unpredictable.
 */
const TRACKED_ACTIONS: ReadonlySet<ProjectAction['type']> = new Set<
  ProjectAction['type']
>([
  'UPDATE_SECTION',
  'REORDER_SECTIONS',
  'DUPLICATE_SECTION',
  'DELETE_SECTION',
  'INSERT_BLOCK',
  'UPDATE_BLOCK',
  'DELETE_BLOCK',
  'DUPLICATE_BLOCK',
  'REORDER_BLOCKS',
])

/** Max number of undo snapshots to retain. */
const HISTORY_LIMIT = 50

interface HistoryState {
  project: Project
  past: SiteContent[]
  future: SiteContent[]
}

function historyReducer(
  state: HistoryState,
  action: ProjectAction,
): HistoryState {
  if (action.type === 'UNDO') {
    const last = state.past[state.past.length - 1]
    if (!last || !state.project.siteContent) return state
    return {
      project: {
        ...state.project,
        siteContent: last,
        updatedAt: new Date().toISOString(),
      },
      past: state.past.slice(0, -1),
      future: [state.project.siteContent, ...state.future].slice(
        0,
        HISTORY_LIMIT,
      ),
    }
  }

  if (action.type === 'REDO') {
    const next = state.future[0]
    if (!next || !state.project.siteContent) return state
    return {
      project: {
        ...state.project,
        siteContent: next,
        updatedAt: new Date().toISOString(),
      },
      past: [...state.past, state.project.siteContent].slice(-HISTORY_LIMIT),
      future: state.future.slice(1),
    }
  }

  const next = projectReducer(state.project, action)
  if (next === state.project) return state

  // Snapshot prior siteContent only for tracked mutations that
  // actually changed siteContent. Non-tracked actions (or tracked
  // actions that coincidentally produced an identical siteContent)
  // update project state but don't touch the history stacks.
  const tracked = TRACKED_ACTIONS.has(action.type)
  if (!tracked || next.siteContent === state.project.siteContent) {
    return { ...state, project: next }
  }
  if (!state.project.siteContent) {
    // No prior content to remember (first-time SET_SITE_CONTENT is
    // handled by not being in TRACKED_ACTIONS, but belt-and-suspenders).
    return { ...state, project: next }
  }
  return {
    project: next,
    past: [...state.past, state.project.siteContent].slice(-HISTORY_LIMIT),
    // Any new edit clears the redo stack — classic undo/redo semantics.
    future: [],
  }
}

// --- Context ---

interface ProjectContextValue {
  project: Project
  dispatch: React.Dispatch<ProjectAction>
  canUndo: boolean
  canRedo: boolean
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

const SITE_CONTENT_STORAGE_KEY = 'proposal-studio.siteContent.v1'

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    historyReducer,
    undefined,
    (): HistoryState => ({
      project: createInitialProject(),
      past: [],
      future: [],
    }),
  )
  const { project } = state
  const hydratedRef = useRef(false)

  // Hydrate siteContent from localStorage on first mount. Runs once.
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as SiteContent
      if (parsed && Array.isArray(parsed.sections)) {
        dispatch({ type: 'SET_SITE_CONTENT', payload: parsed })
      }
    } catch {
      // Corrupt or incompatible storage; ignore and fall back to generation.
    }
  }, [])

  // Persist siteContent on every change after hydration. Debounced via
  // microtask so a burst of rapid dispatches only writes once per tick.
  useEffect(() => {
    if (!hydratedRef.current) return
    if (typeof window === 'undefined') return
    if (!project.siteContent) return
    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          SITE_CONTENT_STORAGE_KEY,
          JSON.stringify(project.siteContent),
        )
      } catch {
        // Storage full or disabled; silently degrade.
      }
    }, 120)
    return () => window.clearTimeout(handle)
  }, [project.siteContent])

  return (
    <ProjectContext.Provider
      value={{
        project,
        dispatch,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext)
  if (!ctx) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return ctx
}
