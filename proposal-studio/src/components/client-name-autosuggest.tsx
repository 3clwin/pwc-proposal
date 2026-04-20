'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { searchDirectory, type DirectoryEntry } from '@/data/client-directory'
import type { SavedClient } from '@/types'

export interface ClientSuggestion {
  /** Display label — what the user sees in the dropdown. */
  label: string
  /** Origin: saved (from localStorage) or a well-known company from the directory. */
  source: 'saved' | 'directory'
  /** Canonical fields to fill in when the user picks this entry. */
  fill: {
    clientName: string
    industry?: string
    sector?: string
    clientUrl?: string
  }
  /** For saved clients — the ID so the caller can route through handleSelectClient. */
  savedClientId?: string
}

interface ClientNameAutosuggestProps {
  value: string
  onChange: (name: string) => void
  /**
   * Fires when the user explicitly picks a suggestion from the dropdown.
   * The consumer is expected to merge `fill` into their form state.
   */
  onPickSuggestion: (suggestion: ClientSuggestion) => void
  savedClients: SavedClient[]
  placeholder?: string
  id?: string
}

const MAX_SUGGESTIONS = 7

/**
 * Client name field with inline autosuggest — shows matches from saved
 * clients first, then from the canonical company directory. Picking a
 * suggestion pre-fills the matching fields (industry/sector/website).
 */
export function ClientNameAutosuggest({
  value,
  onChange,
  onPickSuggestion,
  savedClients,
  placeholder = 'Stripe, Shopify, etc.',
  id = 'clientName',
}: ClientNameAutosuggestProps) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const suggestions = useMemo<ClientSuggestion[]>(() => {
    const q = value.trim().toLowerCase()
    if (!q) return []

    // Saved clients first — these are the ones the user has worked with.
    const savedMatches: ClientSuggestion[] = savedClients
      .filter((c) => c.clientName.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS)
      .map((c) => ({
        label: c.clientName,
        source: 'saved',
        savedClientId: c.id,
        fill: {
          clientName: c.clientName,
          industry: c.industry,
          sector: c.sector,
          clientUrl: c.clientUrl,
        },
      }))

    // Directory next — skip entries whose name matches one of the saved
    // clients we already listed, to avoid duplicates.
    const savedNames = new Set(
      savedMatches.map((s) => s.fill.clientName.toLowerCase()),
    )
    const dirMatches: ClientSuggestion[] = searchDirectory(
      value,
      MAX_SUGGESTIONS - savedMatches.length,
    )
      .filter((e: DirectoryEntry) => !savedNames.has(e.name.toLowerCase()))
      .map((e: DirectoryEntry) => ({
        label: e.name,
        source: 'directory',
        fill: {
          clientName: e.name,
          industry: e.industry,
          sector: e.sector,
          clientUrl: e.url,
        },
      }))

    return [...savedMatches, ...dirMatches].slice(0, MAX_SUGGESTIONS)
  }, [value, savedClients])

  // Clamp highlight when suggestions list shrinks.
  useEffect(() => {
    if (highlight >= suggestions.length) setHighlight(0)
  }, [suggestions.length, highlight])

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      // Open on arrow-down if we have suggestions for current input
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setOpen(true)
        e.preventDefault()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      setHighlight((h) => (h + 1) % suggestions.length)
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length)
      e.preventDefault()
    } else if (e.key === 'Enter') {
      const picked = suggestions[highlight]
      if (picked) {
        onPickSuggestion(picked)
        setOpen(false)
        e.preventDefault()
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      e.preventDefault()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        ref={inputRef}
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setHighlight(0)
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />

      {open && suggestions.length > 0 && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-popover font-app shadow-lg ring-1 ring-foreground/5"
        >
          <ul className="max-h-[280px] overflow-y-auto py-1">
            {suggestions.map((s, i) => {
              const isActive = i === highlight
              return (
                <li
                  key={`${s.source}:${s.label}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    // onMouseDown fires before blur so the click lands.
                    e.preventDefault()
                    onPickSuggestion(s)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-muted' : 'hover:bg-muted/60',
                  )}
                >
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(17,17,17,0.06)' }}
                  >
                    <Building2 className="size-3.5 text-muted-foreground" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-foreground">
                      {s.label}
                    </span>
                    {s.fill.industry && (
                      <span className="truncate text-[11px] text-muted-foreground">
                        {s.fill.industry}
                        {s.fill.sector ? ` · ${s.fill.sector}` : ''}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
