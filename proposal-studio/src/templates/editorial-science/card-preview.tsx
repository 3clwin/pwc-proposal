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
 * Atelier card preview — Journey layout on a warm rose surface.
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
    <BrowserChrome viewportBg="#fbf5f4">
      <div 
        ref={containerRef}
        className="atelier-preview absolute inset-0 overflow-hidden pointer-events-none"
        style={{ backgroundColor: '#fbf5f4' }}
      >
        <style>{`
          .atelier-preview .tpl-root {
            background-color: #fbf5f4 !important;
          }
          .atelier-preview .tpl-root section,
          .atelier-preview .tpl-root [class*="bg-white"],
          .atelier-preview .tpl-root [class*="bg-background"] {
            background-color: #fbf5f4 !important;
          }
          /* Differentiator bento tiles — deeper rose */
          .atelier-preview .tpl-root .grid > [class*="bg-white"],
          .atelier-preview .tpl-root .bg-white.p-8,
          .atelier-preview .tpl-root .bg-white.p-7,
          .atelier-preview .tpl-root .bg-white.p-10 {
            background-color: #f9eeed !important;
          }
          /* Sticky nav slight translucent rose */
          .atelier-preview .tpl-root .bg-white\\/80 {
            background-color: rgba(251,245,244,0.85) !important;
          }
        `}</style>
        <div 
          className="w-[1280px] origin-top-left tpl-root pointer-events-none"
          style={{ 
            transform: `scale(${scale})`,
            backgroundColor: '#fbf5f4',
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
