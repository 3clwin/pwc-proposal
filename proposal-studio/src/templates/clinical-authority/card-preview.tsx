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
 * Editorial card preview — Journey layout on a cool stone surface.
 * No hue-rotate filter so images stay natural; differentiation
 * comes from the stone-tint background and bento surfaces.
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
    <BrowserChrome viewportBg="#f3f7fa">
      <div 
        ref={containerRef}
        className="editorial-preview absolute inset-0 overflow-hidden pointer-events-none"
        style={{ backgroundColor: '#f3f7fa' }}
      >
        <style>{`
          .editorial-preview .tpl-root {
            background-color: #f3f7fa !important;
          }
          .editorial-preview .tpl-root section,
          .editorial-preview .tpl-root [class*="bg-white"],
          .editorial-preview .tpl-root [class*="bg-background"] {
            background-color: #f3f7fa !important;
          }
          /* Differentiator bento tiles — use subtly elevated stone */
          .editorial-preview .tpl-root .grid > [class*="bg-white"],
          .editorial-preview .tpl-root .bg-white.p-8,
          .editorial-preview .tpl-root .bg-white.p-7,
          .editorial-preview .tpl-root .bg-white.p-10 {
            background-color: #d8e4ec !important;
          }
          /* Sticky nav slight translucent stone */
          .editorial-preview .tpl-root .bg-white\\/80 {
            background-color: rgba(243,247,250,0.85) !important;
          }
          /* Disable sticky/fixed positioning inside the preview. */
          .editorial-preview .tpl-root .sticky,
          .editorial-preview .tpl-root [class*="sticky"] {
            position: relative !important;
            top: auto !important;
          }
          .editorial-preview .tpl-root .fixed,
          .editorial-preview .tpl-root [class*="fixed"] {
            position: absolute !important;
          }
        `}</style>
        <div 
          className="w-[1280px] origin-top-left tpl-root pointer-events-none"
          style={{ 
            transform: `scale(${scale})`,
            backgroundColor: '#f3f7fa',
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
