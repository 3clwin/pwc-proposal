'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

// Sample proposal microsites. Each URL is a realistic-looking
// client subdomain — illustrative only, none of these resolve.
const SLIDES = [
  { src: '/Template 1.png', alt: 'Sample proposal for Northwind Biologics', url: 'northwind-bio.proposal.studio' },
  { src: '/Template 2.png', alt: 'Sample proposal for Axiom Retail Group', url: 'axiom-retail.proposal.studio' },
  { src: '/Template 3.png', alt: 'Sample proposal for Meridian Health', url: 'meridian-health.proposal.studio' },
  { src: '/Template 4.png', alt: 'Sample proposal for Vanta Capital', url: 'vanta-capital.proposal.studio' },
  { src: '/Template 5.png', alt: 'Sample proposal for Orbit Logistics', url: 'orbit-logistics.proposal.studio' },
  { src: '/Template 6.png', alt: 'Sample proposal for Helix Therapeutics', url: 'helix-tx.proposal.studio' },
]

interface SlotStyle {
  x: string
  scale: number
  rotate: number
  y: number
  opacity: number
  z: number
}

const SLOTS: SlotStyle[] = [
  { x: '-200%', scale: 0.80, rotate: -3.2, y: 52, opacity: 0, z: 0 },
  { x: '-100%', scale: 0.88, rotate: -1.8, y: 26, opacity: 1, z: 10 },
  { x: '0%',    scale: 1.00, rotate: 0,    y: 0,  opacity: 1, z: 20 },
  { x: '100%',  scale: 0.88, rotate: 1.8,  y: 26, opacity: 1, z: 10 },
  { x: '200%',  scale: 0.80, rotate: 3.2,  y: 52, opacity: 0, z: 0 },
]

const SPRING = { type: 'spring' as const, stiffness: 60, damping: 18, mass: 1.2 }

const NAV_LINKS = [
  { label: 'Templates', href: '#' },
  { label: 'Resources', href: '#' },
]

function getSlot(cardIndex: number, activeIndex: number, total: number): SlotStyle {
  let diff = cardIndex - activeIndex
  if (diff > Math.floor(total / 2)) diff -= total
  if (diff < -Math.floor(total / 2)) diff += total

  const slotIdx = diff + 2
  if (slotIdx < 0 || slotIdx > 4) {
    return { x: diff > 0 ? '300%' : '-300%', scale: 0.7, rotate: diff > 0 ? 5 : -5, y: 80, opacity: 0, z: 0 }
  }
  return SLOTS[slotIdx]
}

function BrowserCard({
  src,
  alt,
  url,
  onClick,
  priority,
}: {
  src: string
  alt: string
  url: string
  onClick: () => void
  /** True for the centered/near-center slides that need to paint
   *  immediately. Rear slides lazy-load so they don't block FCP. */
  priority: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.08] p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl transition-shadow hover:shadow-black/40"
    >
      {/* Browser chrome */}
      <div className="flex h-5 items-center gap-1.5 px-2 pb-1.5">
        <div className="flex items-center gap-1">
          <span className="size-[7px] rounded-full bg-white/20" />
          <span className="size-[7px] rounded-full bg-white/20" />
          <span className="size-[7px] rounded-full bg-white/20" />
        </div>
        <div className="mx-auto flex h-4 max-w-[60%] items-center justify-center rounded bg-white/[0.06] px-2">
          <span className="truncate text-[9px] tracking-wide text-white/40">{url}</span>
        </div>
      </div>
      {/* Page content — Next optimizes these 4K PNGs down to
          responsive AVIF/WebP variants served at the actual
          rendered size (~520px × 2x DPR). Priority only on the
          center-stage slides so rear cards don't block FCP. */}
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          sizes="(min-width: 1280px) 520px, 46vw"
          className="block h-auto w-full object-cover"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
      </div>
    </button>
  )
}

export function Hero() {
  const [active, setActive] = useState(0)

  const advance = useCallback(() => {
    setActive((p) => (p + 1) % SLIDES.length)
  }, [])

  useEffect(() => {
    const t = setInterval(advance, 5000)
    return () => clearInterval(t)
  }, [advance])

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* BG image */}
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      {/* Gradient overlay — heavier behind text center, lighter at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Nav */}
      <nav className="relative z-20 flex h-14 shrink-0 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto text-white" />
          <span className="text-sm font-medium tracking-tight text-white">
            Proposal Studio
          </span>
        </Link>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:bg-white/[0.06] hover:text-white/90"
            >
              {link.label}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          className="bg-white text-black hover:bg-black hover:text-white active:bg-[#626771] active:text-white"
          asChild
        >
          <Link href="/intake">Get Started</Link>
        </Button>
      </nav>

      {/* Headline + CTA */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex max-w-[720px] flex-col items-center gap-6 text-center"
        >
          <h1 className="font-display text-5xl font-normal leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl">
            Stop sending decks.
            <br />
            Start sending sites.
          </h1>
          <p className="max-w-[480px] text-base leading-relaxed text-white/80 drop-shadow-md">
            Turn any RFP into a deployed, client-branded microsite in minutes.
          </p>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/[0.06] text-white backdrop-blur-sm hover:bg-white/[0.12] hover:text-white"
              asChild
            >
              <Link href="#">Templates</Link>
            </Button>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-black hover:text-white active:bg-[#626771] active:text-white"
              asChild
            >
              <Link href="/intake">Get Started</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Frosted browser carousel */}
      <div className="relative z-10 overflow-hidden" style={{ height: 'clamp(260px, 32vw, 440px)' }}>
        <AnimatePresence initial={false}>
          {SLIDES.map((slide, cardIdx) => {
            const slot = getSlot(cardIdx, active, SLIDES.length)
            // Priority-load only the 3 cards closest to the center
            // stage. Rear cards lazy-load so initial paint stays
            // fast (they're tiny at their scaled-down positions).
            let diff = cardIdx - active
            const half = Math.floor(SLIDES.length / 2)
            if (diff > half) diff -= SLIDES.length
            if (diff < -half) diff += SLIDES.length
            const isNearStage = Math.abs(diff) <= 1

            return (
              <motion.div
                key={cardIdx}
                className="absolute top-0"
                style={{
                  width: 'clamp(300px, 46vw, 680px)',
                  left: '50%',
                  marginLeft: 'calc(clamp(300px, 46vw, 680px) / -2)',
                  zIndex: slot.z,
                }}
                animate={{
                  x: slot.x,
                  scale: slot.scale,
                  rotate: slot.rotate,
                  y: slot.y,
                  opacity: slot.opacity,
                }}
                transition={SPRING}
              >
                <BrowserCard
                  src={slide.src}
                  alt={slide.alt}
                  url={slide.url}
                  priority={isNearStage}
                  onClick={() => setActive(cardIdx)}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
