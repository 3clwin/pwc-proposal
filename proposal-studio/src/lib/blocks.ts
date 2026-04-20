/**
 * Helpers for the schema-backed editor: stable id generation and a
 * tiny mutation toolkit used by the project reducer for sections and
 * their blocks. Keeping mutations centralized here means the reducer
 * stays declarative and the editor UI doesn't need to re-implement
 * ordering math in five places.
 */

let counter = 0

/**
 * Generates a short, locally-unique id. Prefixed so collisions with
 * bootstrap ids (which are human-readable) are visually obvious in
 * dev tools. Not cryptographically random — that would be overkill
 * and `crypto.randomUUID` is awkward in non-secure contexts.
 */
export function makeId(prefix = 'b'): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`
}

export function moveItem<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return arr
  const next = arr.slice()
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

export function insertAt<T>(arr: T[], index: number, item: T): T[] {
  const next = arr.slice()
  next.splice(Math.max(0, Math.min(index, next.length)), 0, item)
  return next
}

export function removeAt<T>(arr: T[], index: number): T[] {
  const next = arr.slice()
  next.splice(index, 1)
  return next
}

export function replaceAt<T>(arr: T[], index: number, item: T): T[] {
  const next = arr.slice()
  next[index] = item
  return next
}
