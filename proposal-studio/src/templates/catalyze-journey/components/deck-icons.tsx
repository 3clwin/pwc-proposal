/**
 * Deck-icon family for the Catalyze360 RFQ template.
 *
 * The source deck (PwC Catalyze360 Go-to-Market Model RFQ, Feb 2026)
 * uses a coherent custom outline-icon system across slides 11, 15, 18,
 * 25, 26, 27. These are NOT the Lucide icons we use elsewhere in the
 * app — they're proposal-deck specific, with thicker strokes, more
 * geometric construction, and editorial character.
 *
 * Each icon is a 24×24 viewBox, 1.5px stroke, `currentColor` so it
 * inherits from its parent. Sized via the `size` prop (default 24).
 *
 * Drawn from observation of the deck PNGs in
 * `/Users/ereyes032/Downloads/Lilly RFQ - Proposal Draft_v2/`.
 */
import type { SVGProps } from 'react'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number
}

function svgProps({ size = 24, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  }
}

/** Three-tier slider control. Slide 11 (Pricing) + 15 (Navigator Hub). */
export function IconSliders(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="9" cy="6" r="2" fill="currentColor" />
      <circle cx="16" cy="12" r="2" fill="currentColor" />
      <circle cx="7" cy="18" r="2" fill="currentColor" />
    </svg>
  )
}

/** Person silhouette with checkbox/list. Slide 11 Governance. */
export function IconPersonCheckbox(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <rect x="14" y="9" width="7" height="9" rx="1" />
      <path d="M16 13l1.2 1.2L19.5 12" />
    </svg>
  )
}

/** 7-cell honeycomb pattern. Slide 11 Org Model + 15 deliverables. */
export function IconHoneycombPattern(props: IconProps) {
  // Geometry: central hex + 6 surrounding.
  const hex = (cx: number, cy: number, r: number) => {
    const pts: string[] = []
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
    }
    return pts.join(' ')
  }
  const r = 2.4
  const dx = r * Math.sqrt(3)
  const dy = r * 1.5
  return (
    <svg {...svgProps(props)}>
      <polygon points={hex(12, 12, r)} />
      <polygon points={hex(12, 12 - 2 * dy, r)} />
      <polygon points={hex(12, 12 + 2 * dy, r)} />
      <polygon points={hex(12 - dx, 12 - dy, r)} />
      <polygon points={hex(12 + dx, 12 - dy, r)} />
      <polygon points={hex(12 - dx, 12 + dy, r)} />
      <polygon points={hex(12 + dx, 12 + dy, r)} />
    </svg>
  )
}

/** Stack of dollar bills. Slide 11 + 15 Pricing. */
export function IconDollarBills(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect x="3" y="9" width="18" height="11" rx="1" />
      <rect x="5" y="6" width="14" height="2" rx="0.5" opacity="0.6" />
      <rect x="6.5" y="3.5" width="11" height="1.5" rx="0.5" opacity="0.35" />
      <circle cx="12" cy="14.5" r="2.5" />
      <path d="M12 12.8v.6m0 2.6v.6M11 15.5h2" />
    </svg>
  )
}

/** Clipboard with bar chart. Slide 11 Value + 15 QoS. */
export function IconClipboardChart(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect x="5" y="4" width="14" height="17" rx="1.5" />
      <rect x="9" y="2.5" width="6" height="3" rx="0.5" />
      <line x1="8" y1="17" x2="8" y2="14" />
      <line x1="11.5" y1="17" x2="11.5" y2="11" />
      <line x1="15" y1="17" x2="15" y2="13" />
      <line x1="7" y1="17.5" x2="17" y2="17.5" />
    </svg>
  )
}

/** Balance scale. Slide 11 Value Realization. */
export function IconScaleBalance(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <line x1="12" y1="3.5" x2="12" y2="20" />
      <line x1="6" y1="20.5" x2="18" y2="20.5" />
      <line x1="4" y1="8" x2="20" y2="8" />
      <path d="M4 8L1.5 13h5z" />
      <path d="M20 8l-2.5 5h5z" />
      <path d="M1.5 13a2.5 2.5 0 0 0 5 0" />
      <path d="M17.5 13a2.5 2.5 0 0 0 5 0" />
    </svg>
  )
}

/** Triangles arranged to suggest analytics/tracker. Slide 15 KPI. */
export function IconTriangles(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <polygon points="6,18 10,10 14,18" />
      <polygon points="11,18 15,8 19,18" />
      <line x1="3" y1="20.5" x2="21" y2="20.5" />
      <path d="M5 6.5l2-2 2 2M7 4.5v3" opacity="0.5" />
    </svg>
  )
}

/** Lab flask. Slide 18 Gateway Labs. */
export function IconFlask(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M9 3h6" />
      <path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3" />
      <line x1="7.5" y1="14" x2="16.5" y2="14" opacity="0.5" />
      <circle cx="10" cy="17" r="0.6" fill="currentColor" />
      <circle cx="13" cy="18" r="0.5" fill="currentColor" />
    </svg>
  )
}

/** Microscope. Slide 18 ExploR&D. */
export function IconMicroscope(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M10 4l3 3-3 3-3-3z" />
      <line x1="11.5" y1="8.5" x2="14" y2="11" />
      <path d="M7 17h10v3H4z" />
      <path d="M14 11l-3 3.5a3 3 0 1 0 4.2 4.2L18.5 15" />
      <line x1="9" y1="14" x2="11" y2="16" opacity="0.5" />
    </svg>
  )
}

/** Four-point sparkle / star burst. Slide 18 TuneLab. */
export function IconSparkle(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" fill="currentColor" />
      <path d="M18.5 14.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

/** Stacked server racks. Slide 27 Enterprise Source Systems. */
export function IconServerRack(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect x="4" y="3.5" width="16" height="5" rx="1" />
      <rect x="4" y="9.5" width="16" height="5" rx="1" />
      <rect x="4" y="15.5" width="16" height="5" rx="1" />
      <circle cx="7" cy="6" r="0.6" fill="currentColor" />
      <circle cx="7" cy="12" r="0.6" fill="currentColor" />
      <circle cx="7" cy="18" r="0.6" fill="currentColor" />
      <line x1="10" y1="6" x2="17" y2="6" opacity="0.5" />
      <line x1="10" y1="12" x2="17" y2="12" opacity="0.5" />
      <line x1="10" y1="18" x2="17" y2="18" opacity="0.5" />
    </svg>
  )
}

/** Document with corner fold + lines. Slide 15 + 25 deliverables. */
export function IconDocument(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 3h9l5 5v13H5z" />
      <path d="M14 3v5h5" />
      <line x1="8" y1="13" x2="16" y2="13" opacity="0.6" />
      <line x1="8" y1="16" x2="16" y2="16" opacity="0.6" />
      <line x1="8" y1="19" x2="13" y2="19" opacity="0.4" />
    </svg>
  )
}

/** Single hex badge. Slide 25 Operating Model Playbook badge. */
export function IconHexBadge(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <polygon points="12,2.5 21,7 21,17 12,21.5 3,17 3,7" />
      <polygon points="12,7 17,9.5 17,15 12,17.5 7,15 7,9.5" opacity="0.5" />
    </svg>
  )
}

/** Sprint circle with curved-arrow inside. Slide 26 sprint markers. */
export function IconSprintCircle(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 7.5a6 6 0 1 0 1.5 6.5" />
      <polyline points="13 5 16 7.5 13.5 10" />
    </svg>
  )
}

/** Five-point star. Slide 26 milestone markers. */
export function IconStarMilestone(props: IconProps) {
  return (
    <svg {...props} {...svgProps(props)}>
      <polygon
        points="12,2.5 14.6,9.2 22,9.6 16.2,14 18.2,21 12,17.2 5.8,21 7.8,14 2,9.6 9.4,9.2"
        fill="currentColor"
      />
    </svg>
  )
}

/** Simple geometric "cloud" placeholder for Salesforce. NOT the SF logo. */
export function IconCloudSalesforce(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M7 18a4 4 0 0 1-1-7.85A5 5 0 0 1 16 9a4 4 0 0 1 0 8H7" fill="currentColor" />
    </svg>
  )
}

/** Index of icons by string key — useful when content data references icons by key. */
export const DECK_ICON_BY_KEY = {
  sliders: IconSliders,
  'person-checkbox': IconPersonCheckbox,
  honeycomb: IconHoneycombPattern,
  dollar: IconDollarBills,
  clipboard: IconClipboardChart,
  scale: IconScaleBalance,
  triangles: IconTriangles,
  flask: IconFlask,
  microscope: IconMicroscope,
  sparkle: IconSparkle,
  'server-rack': IconServerRack,
  document: IconDocument,
  'hex-badge': IconHexBadge,
  sprint: IconSprintCircle,
  star: IconStarMilestone,
  'cloud-salesforce': IconCloudSalesforce,
} as const

export type DeckIconKey = keyof typeof DECK_ICON_BY_KEY
