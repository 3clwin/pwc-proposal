'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Logo } from '@/components/logo'

export function GlobalNav() {
  return (
    <nav className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      {/* Left: logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto text-foreground" />
          <span className="text-sm font-medium tracking-tight text-foreground">
            Proposal Studio
          </span>
        </Link>
      </div>

      {/* Center: reserved for editor toolbar */}
      <div className="flex-1" />

      {/* Right: settings */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings">
            <Settings className="size-4" data-icon="inline-start" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </Button>
      </div>
    </nav>
  )
}
