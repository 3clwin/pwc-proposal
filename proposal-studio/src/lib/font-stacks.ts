import type { FontCategory, TypographyRole } from '@/types'

/**
 * Build a proper CSS font-family stack for a client's typography role.
 *
 * Paid client fonts (Ringside, Garamond Narrow Condensed, Gotham, etc.)
 * are rarely hosted on the web, so we wrap the declared family in quotes
 * and chain the ProposalCanvas's loaded web-safe substitutes by category,
 * terminating in a system generic.
 *
 * Without this, a single bare value like `font-family: Ringside Sans`
 * parses as multiple one-word candidates and the browser falls through to
 * its default serif (Georgia on macOS).
 */
export function buildFontStack(
  family: string,
  category: FontCategory = 'sans'
): string {
  const primary = `"${family}"`

  switch (category) {
    case 'serif':
      return `${primary}, var(--font-template-fallback-serif), "Georgia", "Times New Roman", serif`
    case 'wide-sans':
      return `${primary}, var(--font-template-fallback-wide), "Helvetica Neue", Arial, sans-serif`
    case 'mono':
      return `${primary}, var(--font-mono), "SFMono-Regular", Menlo, monospace`
    case 'sans':
    default:
      return `${primary}, var(--font-template-fallback-sans), -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`
  }
}

/** Convenience — builds a stack directly from a TypographyRole. */
export function stackForRole(role: TypographyRole): string {
  return buildFontStack(role.family, role.category)
}
