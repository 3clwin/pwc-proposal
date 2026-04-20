# Agent Operating Guide — Proposal Studio

This file is the entry point for any coding agent working in this repository.

Proposal Studio is an AI-powered RFP response generator that builds brand-aware proposal microsites. The project lives in `proposal-studio/`.

## Boot Sequence

Before doing any design or UI work, read:

1. `.cursor/rules/design-execution.mdc` — skill routing, planning sequence, quality gates
2. `.cursor/rules/design-system.mdc` — design system compliance, tech stack, token rules
3. `proposal-studio/.cursorrules` — full project configuration, routes, component tree, coding rules

## Skills Available

Skills are loaded on demand — not at session start. The routing table in `.cursor/rules/design-execution.mdc` specifies exactly which skill to read for each task type. Two skill directories are in play:

- **`.cursor/skills/`** — project-local skills (workspace root). 31 design skills + 5 stack skills pinned to Proposal Studio's Next.js + AI SDK stack.
- **`~/.cursor/skills/`** — global stack skills shared across all your projects (shadcn, deploy-to-vercel).

The 7 stack skills are installed via [skills.sh](https://skills.sh/) and maintained by upstream teams (Vercel, shadcn). Update with `npx skills update`.

### Core Design Intelligence (auto-activate on UI work)

| Skill | Purpose |
|-------|---------|
| `design-taste-engine` | Visual intent, mood, palette, typography pairing, spatial composition |
| `design-simulation-engine` | Human experience simulation — eye tracking, cognitive load, decision modeling |
| `frontend-design` | Anthropic's official skill — distinctive, production-grade frontend code that avoids generic AI aesthetics (global, `~/.cursor/skills/`) |
| `wcag-accessibility` | WCAG 2.2 Level AA compliance for every UI output |

### Design Execution

| Skill | Purpose |
|-------|---------|
| `ui-design-master` | 4px grid, responsive design, usability heuristics, component thinking |
| `layout-patterns` | Pattern decision engine — layouts, navigation, forms, data display, overlays |
| `rad-spacing` | Hierarchical spacing using Gestalt proximity, 8px/4px increments |
| `design-orchestration` | Multi-agent parallel design with sprint contracts and scoring rubrics |
| `shadcn-ui` | shadcn/ui component discovery, installation, and usage via MCP |
| `ui-ux-pro-max` | Queryable design encyclopedia — 50+ styles, 161 palettes, 57 font pairings, 99 UX guidelines. BM25 search via `python3 scripts/search.py`. Reference only, not auto-activate. |

### Design System

| Skill | Purpose |
|-------|---------|
| `apply-design-system` | Connect designs to design system components |
| `audit-design-system` | Detect drift — missing shared components, local overrides, unbound tokens |
| `fix-design-system-finding` | Fix specific design-system integration findings |

### Stack Skills — Project (`.cursor/skills/` at workspace root)

Pinned to Proposal Studio's stack. Sit alongside the 31 design skills.

| Skill | Purpose |
|-------|---------|
| `next-best-practices` | Next.js App Router — file conventions, RSC boundaries, data patterns, async APIs, metadata, bundling |
| `next-cache-components` | Next.js 16+ caching — PPR, `use cache`, `cacheLife`, `cacheTag`, `updateTag` |
| `vercel-react-best-practices` | React/Next.js performance optimization from Vercel Engineering |
| `vercel-composition-patterns` | Compound components, flexible APIs, solving boolean prop proliferation |
| `ai-sdk` | Vercel AI SDK — `generateText`, `streamText`, tools, agents, `useChat`, structured output |

### Stack Skills — Global (`~/.cursor/skills/`)

Available in every project on this machine. Not committed to any repo.

| Skill | Purpose |
|-------|---------|
| `shadcn` | Official shadcn/ui skill — components, registries, presets, project context |
| `deploy-to-vercel` | Official Vercel deployment skill — preview and production |
| `frontend-design` | Anthropic's official frontend design skill (also listed under Core Design Intelligence) |

Notes:
- The upstream `shadcn` and `deploy-to-vercel` skills supersede the older `shadcn-ui` and `vercel-deploy` in `.cursor/skills/`. Prefer the upstream ones.
- The `skills` CLI installs by default to `.agents/skills/` (project) or `~/.agents/skills/` (global). Cursor 3.1 doesn't reliably discover those, so we move skills to `.cursor/skills/` paths after install.

Manage with:
- `npx skills list` / `npx skills list -g` — see what the CLI tracks
- `npx skills update` — refresh to latest (then move any new installs to `.cursor/skills/`)
- `npx skills find <query>` — discover more
- `npx skills add <owner/repo@skill> -a cursor -y` — install, then `mv ~/.agents/skills/<name> .cursor/skills/`
- `npx skills remove <name>` — uninstall

### Figma Workflow

| Skill | Purpose |
|-------|---------|
| `figma` | Core Figma MCP — fetch context, screenshots, variables, assets |
| `figma-implement-design` | Figma → production code with 1:1 visual fidelity |
| `figma-generate-design` | Code/description → Figma screens, section by section |
| `figma-generate-library` | Build/update design system libraries in Figma |
| `edit-figma-design` | Create/update Figma designs from text descriptions |
| `figma-code-connect-components` | Map Figma components to code components |
| `figma-create-design-system-rules` | Generate project-specific design system rules |
| `figma-augment-parallel` | Parallel agent workflows from Figma files |
| `cc-figma-component` | Build Figma components from contracts |
| `cc-figma-tokens` | Sync token definitions into Figma variables |
| `sync-figma-token` | Bidirectional token sync between code and Figma |
| `wizard-figma-tools` | Wizard-specific Figma plugin tools |
| `uspec` | Generate design system documentation specs in Figma |

### Visual & Interactive

| Skill | Purpose |
|-------|---------|
| `playwright` | Browser automation — navigation, screenshots, data extraction |
| `playwright-interactive` | Persistent browser for fast iterative UI debugging |
| `screenshot` | OS-level screen captures |
| `imagegen` | AI image generation |
| `product-demo-animation` | Animated product demos as self-contained HTML |
| `canvas` | Live React apps rendered beside chat for rich data presentation |

### Deployment

| Skill | Purpose |
|-------|---------|
| `vercel-deploy` | Deploy to Vercel with preview and production URLs |

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript (strict)
- **Package Manager:** pnpm
- **UI:** shadcn/ui (preset b1VlIwYS) + Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **AI:** Multi-LLM (Anthropic, Google, OpenAI) via unified client
- **Rich Text:** Tiptap
- **Code Viewer:** Monaco Editor
- **DnD:** @dnd-kit

## Working Rules

- Keep edits scoped. Do not mix unrelated refactors into a feature change.
- Prefer updating existing docs over creating overlapping new docs.
- Simplicity first. Reach for complexity only when simplicity has been tried and failed.
- Verify, do not self-report. Run checks, previews, and screenshots.
- When generating UI, the design skills are not optional — they are the difference between generic output and premium output.
