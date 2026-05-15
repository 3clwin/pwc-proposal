'use client'

import * as React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type TooltipSide = React.ComponentProps<typeof TooltipContent>['side']

interface EditorTooltipProps {
  label: React.ReactNode
  children: React.ReactElement
  side?: TooltipSide
  sideOffset?: number
  disabledTrigger?: boolean
  triggerClassName?: string
  className?: string
}

export function EditorTooltip({
  label,
  children,
  side = 'bottom',
  sideOffset = 6,
  disabledTrigger = false,
  triggerClassName,
  className,
}: EditorTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {disabledTrigger ? (
          <span className={cn('inline-flex cursor-not-allowed', triggerClassName ?? 'w-fit')}>
            {children}
          </span>
        ) : (
          children
        )}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className={cn('text-xs', className)}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
