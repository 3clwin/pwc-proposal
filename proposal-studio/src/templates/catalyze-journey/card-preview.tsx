'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserChrome } from '../shared/browser-chrome'
import { JourneyNav } from './journey-nav'
import { ExecutiveSummarySection } from './sections/executive-summary'

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
 * Journey card preview — miniature of the actual live Journey site.
 *
 * Renders the actual JourneyNav and ExecutiveSummary components exactly
 * as they appear on the live site, scaled down to fit the preview card
 * dynamically via ResizeObserver.
 */
export function CardPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Default scale roughly matches the expected 474px container width.
  // Real scale is calculated immediately on mount.
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
      url="lilly.proposals.pwc.com"
      accent="#d31710"
      chromeBg="#ecebe7"
      viewportBg="#ffffff"
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div 
          className="w-[1280px] origin-top-left bg-white tpl-root pointer-events-none"
          style={{ transform: `scale(${scale})` }}
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
