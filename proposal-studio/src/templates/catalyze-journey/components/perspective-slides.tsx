'use client'

import { PerspectiveSlide } from './perspective-slide'

/**
 * Renders the three perspective slides (Partner / Innovation Team
 * / Leadership) in order. Each slide is a single Figma-native
 * composition baked into a 16:9 PNG, so layout fidelity is perfect
 * — no responsive recomposition can drift from what was designed.
 */
export function PerspectiveSlides() {
  return (
    <div className="flex flex-col gap-2">
      <PerspectiveSlide
        id="vision-partner"
        ariaLabel="01 · Partner — One Coordinated Way to Work with Lilly"
        src="/vision/slide-1-partner.png"
        alt="Partner perspective: one coordinated way to work with Lilly. Shared context, ownership, and visible next steps across every door — Explore R&D, Gateway Labs, TuneLab, Ventures, BD."
      />
      <PerspectiveSlide
        id="vision-innovation-team"
        ariaLabel="02 · Innovation Team — Centralized triage and prioritization"
        src="/vision/slide-2-innovation.png"
        alt="Innovation Team perspective: centralized triage and prioritization with human confirmation. One partner record with clear owner, next step, and AI-assisted view of the full partner relationship."
      />
      <PerspectiveSlide
        id="vision-leadership"
        ariaLabel="03 · Leadership — A shared, enterprise view of every partner"
        src="/vision/slide-3-leadership.png"
        alt="Leadership perspective: a shared, enterprise view of every partner and team's trust. Real-time visibility into partner engagement, portfolio health, score distribution, and pipeline."
      />
    </div>
  )
}
