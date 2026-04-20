'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserChrome } from '../shared/browser-chrome'
import { JourneyNav } from '../catalyze-journey/journey-nav'
import { ExecutiveSummarySection } from '../catalyze-journey/sections/executive-summary'

const TOC = [
  { id: 'executive-summary', number: '01', label: 'Summary' },
  { id: 'call-to-action', number: '02', label: 'Call' },
  { id: 'foundation', number: '03', label: 'Foundation' },
  { id: 'vision', number: '04', label: 'Vision' },
  { id: 'delivery', number: '05', label: 'Delivery' },
  { id: 'commercials', number: '06', label: 'Commercials' },
  { id: 'team', number: '07', label: 'Team' },
  { id: 'experience', number: '08', label: 'Cases' },
]

/**
 * Vanguard card preview — Journey layout on a dark Lilly Black canvas.
 */
export function CardPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(474 / 1280)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setScale(entry.contentRect.width / 1280)
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <BrowserChrome viewportBg="#111111" style={{ colorScheme: 'dark' }}>
      <div 
        ref={containerRef}
        className="vanguard-preview absolute inset-0 overflow-hidden pointer-events-none"
        style={{ backgroundColor: '#111111' }}
      >
        <style>{`
          .vanguard-preview .tpl-root {
            background-color: #111111 !important;
          }
          .vanguard-preview .tpl-root section,
          .vanguard-preview .tpl-root [class*="bg-white"],
          .vanguard-preview .tpl-root [class*="bg-background"] {
            background-color: #111111 !important;
          }
          /* Differentiator bento tiles — elevated dark surface */
          .vanguard-preview .tpl-root .grid > [class*="bg-white"],
          .vanguard-preview .tpl-root .bg-white.p-8,
          .vanguard-preview .tpl-root .bg-white.p-7,
          .vanguard-preview .tpl-root .bg-white.p-10 {
            background-color: #191919 !important;
          }
          /* Sticky nav translucent black */
          .vanguard-preview .tpl-root .bg-white\\/80 {
            background-color: rgba(17,17,17,0.85) !important;
          }
          /* All text and headings to white */
          .vanguard-preview .tpl-root,
          .vanguard-preview .tpl-root h1,
          .vanguard-preview .tpl-root h2,
          .vanguard-preview .tpl-root h3,
          .vanguard-preview .tpl-root h4,
          .vanguard-preview .tpl-root p,
          .vanguard-preview .tpl-root span,
          .vanguard-preview .tpl-root a,
          .vanguard-preview .tpl-root li,
          .vanguard-preview .tpl-root div {
            color: #ffffff;
          }
          /* Override the hard-coded Eyebrow default ink (#1e2a30) */
          .vanguard-preview .tpl-root [class*="font-label"] {
            color: #ffffff !important;
          }
          /* Muted text stays readable on black */
          .vanguard-preview .tpl-root .text-muted-foreground,
          .vanguard-preview .tpl-root [class*="text-foreground\\/7"],
          .vanguard-preview .tpl-root [class*="text-foreground\\/8"] {
            color: rgba(255,255,255,0.72) !important;
          }
          /* Darken hairlines and borders so they read on dark */
          .vanguard-preview .tpl-root .border-black\\/5,
          .vanguard-preview .tpl-root .border-foreground\\/10,
          .vanguard-preview .tpl-root .border-foreground\\/20,
          .vanguard-preview .tpl-root [class*="border-border"] {
            border-color: rgba(255,255,255,0.1) !important;
          }
          .vanguard-preview .tpl-root .bg-foreground\\/10 {
            background-color: rgba(255,255,255,0.1) !important;
          }
          /* Logo SVG — make the dark "pwc" wordmark pop white */
          .vanguard-preview .tpl-root a[aria-label*="PwC"] svg path[fill="currentColor"] {
            fill: #ffffff;
          }
          .vanguard-preview .tpl-root a[aria-label*="PwC"] svg {
            color: #ffffff;
          }
        `}</style>
        <div 
          className="w-[1280px] origin-top-left tpl-root pointer-events-none"
          style={{ 
            transform: `scale(${scale})`,
            backgroundColor: '#111111',
            color: '#ffffff',
          }}
        >
          <JourneyNav entries={TOC} coverSectionId={null} />
          <div className="pb-16">
            <ExecutiveSummarySection />
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}
