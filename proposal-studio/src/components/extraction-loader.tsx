'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BrailleSpinner } from '@/components/braille-spinner'
import { Progress } from '@/components/ui/progress'

const EXTRACTION_STEPS = [
  'Visiting client website',
  'Extracting brand colors',
  'Pulling typography',
  'Capturing logo and imagery',
  'Reading your documents',
  'Building design tokens',
  'Composing theme directions',
] as const

interface ExtractionLoaderProps {
  /** Labels to cycle through. Defaults to the brand-extraction step list. */
  steps?: readonly string[]
  /** Optional caption below the progress bar (e.g. client URL). */
  caption?: string
  /** Milliseconds per step. Defaults to 2400. */
  intervalMs?: number
  /** Override for the aria-live label prefix. */
  ariaPrefix?: string
}

export function ExtractionLoader({
  steps = EXTRACTION_STEPS,
  caption,
  intervalMs = 2400,
  ariaPrefix,
}: ExtractionLoaderProps) {
  const [activeStep, setActiveStep] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [steps.length, intervalMs])

  const progress = ((activeStep + 1) / steps.length) * 100
  const currentLabel = steps[activeStep] ?? ''

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6"
      role="status"
      aria-live="polite"
      aria-label={`${ariaPrefix ? `${ariaPrefix} — ` : ''}${currentLabel}. Step ${activeStep + 1} of ${steps.length}.`}
    >
      <div className="flex w-full max-w-[400px] flex-col items-center gap-10">
        {/* Hero spinner — replaces the static brand mark with a live
            16-bit-style braille glyph in the primary color (matches the
            primary button). Subtle vertical float on the wrapper adds a
            second axis of motion that complements the frame cycling. */}
        <motion.div
          animate={reduce ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BrailleSpinner
            size="32px"
            className="text-primary"
            label={null}
          />
        </motion.div>

        <div className="flex w-full flex-col gap-4">
          {/* Step label — swaps cleanly with no ghosted overlap. The big
              spinner above does the "alive" work; the label just states
              what's happening right now. */}
          <div className="relative h-5 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute inset-x-0 text-center text-sm font-medium text-foreground"
              >
                {currentLabel}
              </motion.div>
            </AnimatePresence>
          </div>

          <Progress value={progress} className="h-1" />

          <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
            Step {activeStep + 1} of {steps.length}
          </p>
        </div>

        {caption && (
          <p className="font-mono text-xs text-muted-foreground/60">{caption}</p>
        )}
      </div>
    </div>
  )
}
