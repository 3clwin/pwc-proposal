import type { Variants, Transition } from 'framer-motion'

/**
 * Shared motion contract for premium templates. Respect this across all of
 * them so the system feels composed rather than inconsistent.
 *
 * Principles:
 *  • Motion is almost-invisible until a moment earns theatre
 *  • Fades and translates are preferred over scales
 *  • Spring physics reserved for interactive responses; sections use easing
 *  • All motion respects prefers-reduced-motion via framer-motion's
 *    useReducedMotion() — components pick that up themselves
 */

export const EASE_OUT_EDITORIAL: Transition['ease'] = [0.22, 1, 0.36, 1]

export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EDITORIAL },
  },
}

export const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EDITORIAL },
  },
}

export const FADE_RIGHT: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EDITORIAL },
  },
}

export const STAGGER_PARENT: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

export const SLOW_STAGGER_PARENT: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
}

/** Default viewport trigger — fire once when 30% of the element is in view. */
export const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const

/** Late trigger for big hero moments where we want the reveal to feel deliberate. */
export const VIEWPORT_LATE = { once: true, amount: 0.5 } as const
