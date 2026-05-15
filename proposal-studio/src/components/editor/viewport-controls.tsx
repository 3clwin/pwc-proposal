'use client'

import {
  ChevronDown,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditorTooltip } from './editor-tooltip'

export type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'fullscreen'

interface ViewportControlsProps {
  activeViewport: ViewportMode
  onViewportChange: (viewport: ViewportMode) => void
  url?: string
  onRefresh?: () => void
  onToggleFullscreen?: () => void
}

const VIEWPORT_META: Record<
  Exclude<ViewportMode, 'fullscreen'>,
  { icon: typeof Monitor; label: string }
> = {
  desktop: { icon: Monitor, label: 'Current Size' },
  mobile: { icon: Smartphone, label: 'Mobile' },
  tablet: { icon: Tablet, label: 'Tablet' },
}

/**
 * Self-contained "address bar" inspired by Google AI Studio's preview
 * chrome. Layout, all inside one recessed pill:
 *   [viewport dropdown ▾] · [URL/path] · [refresh] [fullscreen]
 */
export function ViewportControls({
  activeViewport,
  onViewportChange,
  url = '/',
  onRefresh,
}: ViewportControlsProps) {
  const currentMeta =
    activeViewport === 'fullscreen'
      ? VIEWPORT_META.desktop
      : VIEWPORT_META[activeViewport]
  const ViewportIcon = currentMeta.icon
  return (
    <div className="flex h-7 w-full max-w-[320px] items-center gap-0.5 rounded-full border border-foreground/10 bg-muted px-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Viewport dropdown */}
      <DropdownMenu>
        <EditorTooltip label="Change viewport size">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              aria-label="Viewport size"
              className="h-5 gap-0.5 rounded-full px-1.5 text-muted-foreground hover:bg-background/60 hover:text-foreground"
            >
              <ViewportIcon className="size-3.5" />
              <ChevronDown className="size-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
        </EditorTooltip>
        <DropdownMenuContent
          align="start"
          className="min-w-[180px] bg-popover before:hidden"
        >
          <DropdownMenuItem onSelect={() => onViewportChange('desktop')}>
            <Monitor className="size-4" />
            Current Size
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onViewportChange('mobile')}>
            <Smartphone className="size-4" />
            Mobile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onViewportChange('tablet')}>
            <Tablet className="size-4" />
            Tablet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* URL / path */}
      <span
        className="min-w-0 flex-1 truncate px-1 font-mono text-[11px] text-muted-foreground"
        title={url}
      >
        {url}
      </span>

      {/* Inline actions */}
      <EditorTooltip label="Refresh preview">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRefresh}
          aria-label="Refresh preview"
          className="rounded-full text-muted-foreground hover:bg-background/60 hover:text-foreground"
        >
          <RotateCw className="size-3.5" />
        </Button>
      </EditorTooltip>

    </div>
  )
}
