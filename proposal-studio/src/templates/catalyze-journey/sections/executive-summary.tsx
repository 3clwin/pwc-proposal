'use client'

import { motion } from 'framer-motion'
import { EditorialContainer } from '../../shared/typography'
import { STAGGER_PARENT, VIEWPORT_ONCE } from '../../shared/motion'
import { BlockRenderer } from './executive-summary.blocks'
import type { ExecSummaryBlock } from './executive-summary.schema'
import { bootstrapExecSummaryBlocks } from './executive-summary.schema'

interface ExecutiveSummarySectionProps {
  /**
   * Schema blocks for this section. When absent (e.g. the deployed
   * static site), falls back to the bootstrap layout so the page
   * still renders a sensible default.
   */
  blocks?: ExecSummaryBlock[]
}

/**
 * §01 · Executive Summary — schema-driven.
 *
 * Reads its layout from `blocks` when provided (editor path) and
 * otherwise falls back to the bootstrap snapshot. Each block is
 * rendered by `BlockRenderer` and tagged with `data-block-id` so the
 * design-mode overlay can resolve selection → schema entry.
 */
export function ExecutiveSummarySection({ blocks }: ExecutiveSummarySectionProps = {}) {
  const resolved = blocks && blocks.length > 0 ? blocks : bootstrapExecSummaryBlocks()

  return (
    <section
      id="executive-summary"
      className="relative bg-white py-24 sm:py-32"
      data-section-id="executive-summary"
      data-section-type="executive-summary"
    >
      <EditorialContainer measure="wide">
        <motion.div
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
        >
          {resolved.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </motion.div>
      </EditorialContainer>
    </section>
  )
}
