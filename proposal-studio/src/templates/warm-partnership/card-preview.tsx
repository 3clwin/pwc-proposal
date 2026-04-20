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
 * Pavilion card preview — Journey executive summary re-tinted with
 * Pavilion's warm cream + gold hairline aesthetic.
 *
 * Uses the same live JourneyNav + ExecutiveSummarySection components
 * scaled via ResizeObserver so the content matches Journey 1:1.
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
    <BrowserChrome
      url="lilly.com/proposals/pavilion"
      accent="#daaa00"
      chromeBg="#ecebe7"
      viewportBg="#fcf5ed"
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div 
          className="w-[1280px] origin-top-left tpl-root pointer-events-none"
          style={{ 
            transform: `scale(${scale})`,
            backgroundColor: '#fcf5ed',
          }}
        >
          <JourneyNav entries={TOC} coverSectionId={null} />
          <div className="pb-16" style={{ backgroundColor: '#fcf5ed' }}>
            <ExecutiveSummarySection />
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}
