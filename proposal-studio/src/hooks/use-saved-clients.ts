'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SavedClient } from '@/types'

const STORAGE_KEY = 'ps-saved-clients'

/**
 * Canonical saved-client records. Seeded (or migrated over) on first load
 * so the demo always has a correctly-named Lilly client available. Extend
 * this list when we add more reference clients.
 */
const CANONICAL_CLIENTS: Omit<SavedClient, 'id'>[] = [
  {
    clientName: 'Eli Lilly And Company',
    clientSlug: 'lilly',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
    clientUrl: 'lilly.com',
    clientContact: '',
  },
]

/**
 * Apply canonical client data to whatever's currently persisted.
 *   • If a slug exists but fields drift (e.g. name was "Lilly"), overwrite
 *     the known fields so the demo stays tidy.
 *   • If a canonical slug is missing, seed it.
 * Returns the merged list (and whether anything actually changed, so the
 * caller can decide whether to persist back).
 */
function applyCanonical(
  existing: SavedClient[],
): { clients: SavedClient[]; changed: boolean } {
  let changed = false
  const byId = new Map(existing.map((c) => [c.id, c]))

  // Returns true if a record clearly refers to this canonical client:
  // matching slug, slug containing the canonical key, or name containing
  // it (handles legacy "Lilly" entries with slug "lilly", long-form slugs
  // like "eli-lilly-and-company", or free-typed duplicates).
  const isCanonicalMatch = (c: SavedClient, canonicalSlug: string) =>
    c.clientSlug === canonicalSlug ||
    c.clientSlug.includes(canonicalSlug) ||
    c.clientName.toLowerCase().includes(canonicalSlug)

  for (const canonical of CANONICAL_CLIENTS) {
    const matches = existing.filter((c) => isCanonicalMatch(c, canonical.clientSlug))

    if (matches.length > 0) {
      // Keep the first match as the survivor; collapse the rest into it so
      // we end up with exactly one record for this canonical client.
      const [survivor, ...duplicates] = matches
      if (survivor) {
        const merged: SavedClient = {
          ...survivor,
          ...canonical,
          id: survivor.id,
        }
        if (
          survivor.clientName !== canonical.clientName ||
          survivor.clientSlug !== canonical.clientSlug ||
          survivor.industry !== canonical.industry ||
          survivor.sector !== canonical.sector ||
          survivor.clientUrl !== canonical.clientUrl
        ) {
          changed = true
        }
        byId.set(survivor.id, merged)
      }

      for (const dup of duplicates) {
        byId.delete(dup.id)
        changed = true
      }
    } else {
      const seeded: SavedClient = {
        ...canonical,
        id: crypto.randomUUID(),
      }
      byId.set(seeded.id, seeded)
      changed = true
    }
  }

  // General dedup pass: collapse any remaining records that share a slug.
  // Protects against pre-existing duplicates that aren't canonical (e.g.
  // two records both saved with slug "acme"). First occurrence wins.
  const bySlug = new Map<string, SavedClient>()
  for (const client of byId.values()) {
    const existingForSlug = bySlug.get(client.clientSlug)
    if (existingForSlug) {
      changed = true
      continue
    }
    bySlug.set(client.clientSlug, client)
  }

  return { clients: [...bySlug.values()], changed }
}

function load(): SavedClient[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as SavedClient[]) : []
    const { clients, changed } = applyCanonical(parsed)
    if (changed) persist(clients)
    return clients
  } catch {
    const { clients } = applyCanonical([])
    persist(clients)
    return clients
  }
}

function persist(clients: SavedClient[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export function useSavedClients() {
  const [clients, setClients] = useState<SavedClient[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setClients(load())
    setHydrated(true)
  }, [])

  const saveClient = useCallback(
    (client: Omit<SavedClient, 'id'>) => {
      setClients((prev) => {
        const existing = prev.find(
          (c) => c.clientSlug === client.clientSlug
        )
        let next: SavedClient[]
        if (existing) {
          next = prev.map((c) =>
            c.clientSlug === client.clientSlug ? { ...c, ...client } : c
          )
        } else {
          next = [...prev, { ...client, id: crypto.randomUUID() }]
        }
        persist(next)
        return next
      })
    },
    []
  )

  return { clients: hydrated ? clients : [], saveClient }
}
