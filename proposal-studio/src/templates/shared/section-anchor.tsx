'use client'

import type { ReactNode } from 'react'

interface SectionAnchorProps {
  id: string
  isHovered?: boolean
  isSelected?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children: ReactNode
  className?: string
}

export function SectionAnchor({
  id,
  isHovered,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  className,
}: SectionAnchorProps) {
  return (
    <div
      data-section-id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative cursor-pointer transition-all ${className ?? ''}`}
      style={{
        outline: isSelected
          ? '2px solid #2563EB'
          : isHovered
            ? '1px dashed #2563EB'
            : 'none',
        outlineOffset: isSelected ? '-2px' : '-1px',
      }}
    >
      {children}
    </div>
  )
}
