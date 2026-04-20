import type { RiskFlag, SiteContent } from '@/types'

interface RestrictedPattern {
  pattern: RegExp
  rule: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
}

const RESTRICTED_PATTERNS: RestrictedPattern[] = [
  { pattern: /\bguarantee\b/gi, rule: 'Overcommitment language', severity: 'high', suggestion: 'Replace with "we are committed to" or "we aim to"' },
  { pattern: /\bensure\b/gi, rule: 'Overcommitment language', severity: 'medium', suggestion: 'Replace with "work to achieve" or "strive to"' },
  { pattern: /\bcertify\b/gi, rule: 'Overcommitment language', severity: 'high', suggestion: 'Remove or replace with "we believe" or "based on our experience"' },
  { pattern: /\bwarrant\b/gi, rule: 'Overcommitment language', severity: 'high', suggestion: 'Remove warranty language' },
  { pattern: /\bpromise results\b/gi, rule: 'Overcommitment language', severity: 'high', suggestion: 'Replace with "target outcomes" or "expected results"' },
  { pattern: /\bunlimited liability\b/gi, rule: 'Liability risk', severity: 'high', suggestion: 'Add liability caps or qualifiers' },
  { pattern: /\bindemnify without limit\b/gi, rule: 'Liability risk', severity: 'high', suggestion: 'Add indemnification limits' },
  { pattern: /\$[\d,]+(?:\.\d{2})?/g, rule: 'Specific pricing', severity: 'medium', suggestion: 'Remove specific dollar amounts or add "estimated" qualifier' },
  { pattern: /\bfixed fee\b/gi, rule: 'Pricing commitment', severity: 'medium', suggestion: 'Add qualifier: "fixed fee, subject to scope confirmation"' },
  { pattern: /\bcompliant with all regulations\b/gi, rule: 'Overly broad regulatory claim', severity: 'high', suggestion: 'Specify which regulations and add qualifiers' },
]

export function scanContentWithRegex(siteContent: SiteContent): RiskFlag[] {
  const flags: RiskFlag[] = []

  for (const section of siteContent.sections) {
    const texts = [
      section.content.headline,
      section.content.subheadline,
      section.content.body,
      section.content.cta?.text,
      ...(section.content.items?.map((i) => `${i.title ?? ''} ${i.description ?? ''}`) ?? []),
    ].filter(Boolean).join(' ')

    for (const restricted of RESTRICTED_PATTERNS) {
      const matches = texts.matchAll(restricted.pattern)
      for (const match of matches) {
        flags.push({
          id: crypto.randomUUID(),
          sectionId: section.id,
          text: match[0],
          rule: restricted.rule,
          severity: restricted.severity,
          status: 'open',
          suggestedReplacement: restricted.suggestion,
          position: { start: match.index ?? 0, end: (match.index ?? 0) + match[0].length },
        })
      }
    }
  }

  return flags
}
