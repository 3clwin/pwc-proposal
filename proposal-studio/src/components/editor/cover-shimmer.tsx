'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Preview-pane skeleton shown while the site is being generated.
 *
 * Roughly echoes the Catalyze Journey cover's composition — logo bar
 * at the top, large stacked title lines in the middle, dateline +
 * CTAs near the bottom — so the transition from "building" to the
 * real cover feels continuous rather than a screen-swap.
 *
 * White canvas with gray placeholder bars and a lighter-gray sheen
 * that sweeps across each bar on repeat. `prefers-reduced-motion`
 * collapses the sweep to a steady muted fill.
 */
export function CoverShimmer() {
  const reduce = useReducedMotion()

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Building your proposal"
      className="relative flex h-[100dvh] min-h-[640px] w-full flex-col overflow-hidden bg-white"
    >
      <div className="relative z-10 flex flex-1 flex-col px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        {/* Logo placeholder */}
        <Bar className="h-[40px] w-[96px] rounded-md" reduce={reduce} delay={0} />

        {/* Title block — three stacked bars echoing the three-line
            Catalyze 360 / Go-to-Market / Model heading. */}
        <div className="flex max-w-[820px] flex-1 flex-col justify-center gap-5 py-16">
          <Bar className="h-14 w-[60%] rounded-lg" reduce={reduce} delay={0.1} />
          <Bar className="h-14 w-[80%] rounded-lg" reduce={reduce} delay={0.2} />
          <Bar className="h-14 w-[40%] rounded-lg" reduce={reduce} delay={0.3} />

          {/* Dateline placeholder */}
          <Bar className="mt-6 h-3 w-[180px] rounded-full" reduce={reduce} delay={0.45} />

          {/* CTA pill placeholders */}
          <div className="mt-14 flex items-center gap-3">
            <Bar className="h-12 w-[140px] rounded-full" reduce={reduce} delay={0.55} />
            <Bar className="h-5 w-[120px] rounded-full" reduce={reduce} delay={0.6} />
          </div>
        </div>
      </div>

      <span className="sr-only">Building your proposal…</span>
    </div>
  )
}

interface BarProps {
  className?: string
  reduce: boolean | null
  /** Staggered delay so the bars reveal in a gentle cascade. */
  delay?: number
}

function Bar({ className, reduce, delay = 0 }: BarProps) {
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ backgroundColor: '#e5e7eb' }}
      className={`relative overflow-hidden ${className ?? ''}`}
    >
      {/* Lighter sheen that sweeps left-to-right across the base
          gray fill, looping for as long as the bar is mounted.
          Uses a CSS animation (not framer-motion) so the loop keeps
          running smoothly during AnimatePresence exit — framer's
          exit phase pauses motion.div transitions, which would
          freeze the shimmer mid-sweep. Skipped when the user
          prefers reduced motion. */}
      {!reduce && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 block w-1/2"
          style={{
            background:
              'linear-gradient(90deg, rgba(229,231,235,0) 0%, rgba(255,255,255,0.85) 50%, rgba(229,231,235,0) 100%)',
            animation: 'cover-shimmer-sweep 1.6s linear infinite',
            // Per-bar phase offset so neighboring bars don't flash in
            // perfect lockstep — gives the whole skeleton a living
            // feel while still looping every bar continuously.
            animationDelay: `-${(delay * 1000) % 1600}ms`,
          }}
        />
      )}
    </motion.div>
  )
}
