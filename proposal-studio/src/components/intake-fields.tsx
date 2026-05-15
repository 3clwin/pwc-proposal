'use client'

import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Building2, Plus, Info, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { INDUSTRIES, INDUSTRY_SECTORS, type SavedClient } from '@/types'
import { cn } from '@/lib/utils'
import {
  ClientNameAutosuggest,
  type ClientSuggestion,
} from '@/components/client-name-autosuggest'

export interface ClientFields {
  clientName: string
  projectTitle: string
  industry: string
  sector: string
  clientUrl: string
  clientContact: string
  dueDate: Date | undefined
  description: string
}

export type ClientMode = 'new' | 'existing'

interface IntakeFieldsProps {
  fields: ClientFields
  onChange: (fields: ClientFields) => void
  mode: ClientMode
  onModeChange: (mode: ClientMode) => void
  savedClients: SavedClient[]
  selectedClientId: string | null
  onSelectClient: (id: string) => void
}

export function IntakeFields({
  fields,
  onChange,
  mode,
  onModeChange,
  savedClients = [],
  selectedClientId,
  onSelectClient,
}: IntakeFieldsProps) {
  const isExisting = mode === 'existing'
  const readOnly = isExisting && !!selectedClientId

  // Show the rest of the form only once the user has picked a lane:
  //   • New client → show all fields immediately.
  //   • Existing client → hide fields until a client is selected.
  // On the initial landing, only Client type (and Select client, when in
  // existing mode) are visible.
  const showFields = !isExisting || !!selectedClientId

  const [inferring, setInferring] = useState(false)
  const lastInferKeyRef = useRef<string>('')

  function update(partial: Partial<ClientFields>) {
    if (readOnly && !('projectTitle' in partial) && !('dueDate' in partial) && !('description' in partial) && !('clientContact' in partial)) return
    onChange({ ...fields, ...partial })
  }

  /**
   * Debounced AI infer on clientName + clientUrl changes.
   *
   * Strategy:
   *   • Only runs in new-client mode (existing clients already have these).
   *   • Waits 900ms after the last keystroke before firing (feels responsive
   *     without hammering the API).
   *   • Skips if industry is already set by the user — we never overwrite.
   *   • Skips repeat calls for the same (name, url) key.
   *   • Fills blanks only: industry, sector, and clientContact if empty.
   */
  useEffect(() => {
    if (readOnly) return
    const name = fields.clientName.trim()
    const url = fields.clientUrl.trim()

    // Need something to work with.
    if (!name && !url) return

    // Bail if the user already picked an industry — respect their input.
    if (fields.industry) return

    const key = `${name}|${url}`
    if (key === lastInferKeyRef.current) return

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      lastInferKeyRef.current = key
      try {
        setInferring(true)
        const res = await fetch('/api/infer-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientName: name, clientUrl: url }),
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as {
          industry?: string
          sector?: string
          clientContact?: string
        }
        // Merge non-empty predictions without overwriting user-entered data.
        const patch: Partial<ClientFields> = {}
        if (data.industry && !fields.industry) patch.industry = data.industry
        if (data.sector && !fields.sector) patch.sector = data.sector
        if (data.clientContact && !fields.clientContact) {
          patch.clientContact = data.clientContact
        }
        if (Object.keys(patch).length > 0) update(patch)
      } catch {
        // Silent — the heuristic/LLM already covers the null case, and
        // failing to infer is non-blocking.
      } finally {
        setInferring(false)
      }
    }, 900)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.clientName, fields.clientUrl, readOnly])

  return (
    <div className="flex flex-col gap-6">
      {/* Mode toggle */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Client type</Label>
        <div className="inline-flex h-10 items-center rounded-lg bg-muted p-1 gap-1 self-start">
          <button
            type="button"
            onClick={() => onModeChange('new')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              mode === 'new'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Plus className="size-3.5" />
            New client
          </button>
          <button
            type="button"
            onClick={() => onModeChange('existing')}
            disabled={savedClients.length === 0}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              mode === 'existing'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
              savedClients.length === 0 && 'cursor-not-allowed opacity-40'
            )}
          >
            <Building2 className="size-3.5" />
            Existing client
          </button>
        </div>
        {savedClients.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No saved clients yet. Complete a project to save a client.
          </p>
        )}
      </div>

      {/* Client selector (existing mode only) */}
      {isExisting && savedClients.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="selectClient">
            <span>Select client<span className="text-destructive"> *</span></span>
          </Label>
          <Select
            value={selectedClientId ?? ''}
            onValueChange={onSelectClient}
          >
            <SelectTrigger id="selectClient" className="w-full">
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent>
              {savedClients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.clientName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Remaining form fields — hidden on landing until the user picks a
          lane (new client or an existing client from the dropdown). */}
      {showFields && (
        <>
          {/* RFP title — always editable */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectTitle">
              <span>RFP title<span className="text-destructive"> *</span></span>
            </Label>
            <Input
              id="projectTitle"
              placeholder="Cloud Migration Advisory"
              value={fields.projectTitle}
              onChange={(e) => update({ projectTitle: e.target.value })}
            />
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-1.5">
            <Label>
              <span>Due date<span className="text-destructive"> *</span></span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-9 w-full justify-start text-left font-normal',
                    !fields.dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="size-4" data-icon="inline-start" />
                  {fields.dueDate ? format(fields.dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fields.dueDate}
                  onSelect={(d) => update({ dueDate: d })}
                  initialFocus
                  // Disable any day strictly before today. Normalizing to
                  // midnight prevents off-by-one issues across timezones.
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Client identity — editable in new-client mode, read-only in
              existing-client mode (confirms what the dropdown picked). */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clientName">
              <span>Client name<span className="text-destructive"> *</span></span>
            </Label>
            {readOnly ? (
              <Input
                id="clientName"
                placeholder="Stripe, Shopify, etc."
                value={fields.clientName}
                readOnly
                className="bg-muted text-muted-foreground cursor-default"
              />
            ) : (
              <ClientNameAutosuggest
                value={fields.clientName}
                onChange={(name) => update({ clientName: name })}
                savedClients={savedClients}
                onPickSuggestion={(s: ClientSuggestion) => {
                  // Both saved-client and directory picks behave the same
                  // way in new-client mode: we treat the suggestion as a
                  // shortcut that pre-fills whatever we know. Fields stay
                  // editable — the user can override anything. We never
                  // flip to existing-client mode from here; that's only
                  // entered via the explicit Client type toggle.
                  const patch: Partial<ClientFields> = {
                    clientName: s.fill.clientName,
                  }
                  if (s.fill.industry && !fields.industry) {
                    patch.industry = s.fill.industry
                  }
                  if (s.fill.sector && !fields.sector) {
                    patch.sector = s.fill.sector
                  }
                  if (s.fill.clientUrl && !fields.clientUrl) {
                    patch.clientUrl = s.fill.clientUrl
                  }
                  update(patch)
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="industry">
                <span>Industry<span className="text-destructive"> *</span></span>
              </Label>
              {inferring && !readOnly && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <Sparkles className="size-3 animate-pulse" />
                  AI suggesting
                </span>
              )}
            </div>
            <Select
              value={fields.industry}
              onValueChange={(v) => {
                // When industry changes, auto-select sector if the chosen
                // industry has exactly one sector (e.g. "Other" → "Other");
                // otherwise reset sector so an invalid value doesn't linger.
                const sectors =
                  INDUSTRY_SECTORS[v as keyof typeof INDUSTRY_SECTORS] ?? []
                const nextSector = sectors.length === 1 ? sectors[0] ?? '' : ''
                update({ industry: v, sector: nextSector })
              }}
              disabled={readOnly}
            >
              <SelectTrigger
                id="industry"
                className={cn(
                  'w-full',
                  readOnly && 'bg-muted text-muted-foreground disabled:opacity-100',
                )}
              >
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector — options are derived from the selected industry. When
              no industry is picked yet, we surface sectors across every
              industry so the user can still open the menu and pick; picking
              a sector back-fills the correct industry automatically. */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sector">
              <span>Sector<span className="text-destructive"> *</span></span>
            </Label>
            <Select
              value={fields.sector}
              onValueChange={(v) => {
                // If no industry is chosen yet, find which industry owns
                // this sector and set it too. Keeps the two selects in sync
                // without forcing a specific order of operations.
                if (!fields.industry) {
                  const owner = (
                    Object.entries(INDUSTRY_SECTORS) as [
                      string,
                      readonly string[],
                    ][]
                  ).find(([, secs]) => secs.includes(v))
                  if (owner) {
                    update({ industry: owner[0], sector: v })
                    return
                  }
                }
                update({ sector: v })
              }}
              disabled={readOnly}
            >
              <SelectTrigger
                id="sector"
                className={cn(
                  'w-full',
                  readOnly && 'bg-muted text-muted-foreground disabled:opacity-100',
                )}
              >
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {fields.industry
                  ? (INDUSTRY_SECTORS[
                      fields.industry as keyof typeof INDUSTRY_SECTORS
                    ] ?? []).map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        {sec}
                      </SelectItem>
                    ))
                  : // No industry picked yet → show every sector grouped by
                    // industry so the user can still pick. Picking will
                    // auto-fill the industry via onValueChange above.
                    (
                      Object.entries(INDUSTRY_SECTORS) as [
                        string,
                        readonly string[],
                      ][]
                    ).flatMap(([industry, secs]) =>
                      secs.map((sec) => (
                        <SelectItem key={`${industry}:${sec}`} value={sec}>
                          {sec}
                        </SelectItem>
                      )),
                    )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex w-fit items-center gap-1.5">
              <Label htmlFor="clientUrl">
                <span>Client website<span className="text-destructive"> *</span></span>
              </Label>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Why we need the client website"
                      className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                      <Info className="size-3.5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={6} className="max-w-[260px] text-left">
                    We analyze the client&apos;s website to pull brand context — colors, typography, tone, and positioning — so your proposal feels tailored to them out of the box.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {readOnly ? (
              <Input
                id="clientUrl"
                value={fields.clientUrl ? `https://www.${fields.clientUrl}` : ''}
                readOnly
                className="bg-muted text-muted-foreground cursor-default"
              />
            ) : (
              <div className="flex h-9 items-center rounded-3xl border border-border bg-background transition-[color,box-shadow,background-color] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
                <span className={`shrink-0 pl-3 text-sm select-none ${fields.clientUrl ? 'text-foreground' : 'text-muted-foreground'}`}>https://www.</span>
                <input
                  id="clientUrl"
                  type="text"
                  placeholder="stripe.com"
                  value={fields.clientUrl}
                  onChange={(e) => update({ clientUrl: e.target.value })}
                  className="h-full flex-1 bg-transparent pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clientContact" className="text-muted-foreground">
              Client contact email
            </Label>
            <Input
              id="clientContact"
              type="email"
              placeholder="jane@lilly.com"
              value={fields.clientContact}
              onChange={(e) => update({ clientContact: e.target.value })}
              readOnly={readOnly}
              className={cn(readOnly && 'bg-muted text-muted-foreground cursor-default')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-muted-foreground">
              Brief description
            </Label>
            <Textarea
              id="description"
              placeholder="Two or three sentences about the engagement"
              rows={3}
              value={fields.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  )
}
