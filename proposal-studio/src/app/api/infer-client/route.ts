import { NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/llm'
import { resolveLLMConfig } from '@/lib/llm/server-config'
import { INDUSTRY_SECTORS } from '@/types'

interface InferClientRequest {
  /** Either field can trigger the infer — whichever the user has entered. */
  clientName?: string
  clientUrl?: string
}

interface InferClientResponse {
  industry?: string
  sector?: string
  /** Suggested generic contact email derived from the domain, e.g. partnerships@lilly.com. */
  clientContact?: string
  source: 'llm' | 'heuristic' | 'none'
}

/**
 * Deterministic heuristic — used when no LLM is configured OR as a starting
 * point even when one is. For well-known domains we can just hard-code the
 * answer.
 */
function heuristicInfer(
  clientName?: string,
  clientUrl?: string,
): Partial<InferClientResponse> {
  const name = (clientName || '').toLowerCase()
  const url = (clientUrl || '').toLowerCase()
  const haystack = `${name} ${url}`

  // Tiny seed list — expand as more reference clients come through.
  const KNOWN: Array<{
    match: RegExp
    industry: string
    sector: string
  }> = [
    {
      match: /lilly|eli\s*lilly/,
      industry: 'Health Industries',
      sector: 'Pharma and Life Sciences',
    },
    {
      match: /pfizer|merck|novartis|astrazeneca|sanofi|roche|bristol|amgen|gilead|genentech|moderna|biontech/,
      industry: 'Health Industries',
      sector: 'Pharma and Life Sciences',
    },
    {
      match: /stripe|square|paypal|adyen|jpmorgan|citi|wells\s*fargo|goldman\s*sachs/,
      industry: 'Financial Services',
      sector: 'Banking and Capital Markets',
    },
    {
      match: /blackrock|vanguard|fidelity|pimco|state\s*street/,
      industry: 'Financial Services',
      sector: 'Asset and Wealth Management',
    },
    {
      match: /aetna|unitedhealth|humana|anthem|cigna|kaiser/,
      industry: 'Health Industries',
      sector: 'Payers and Providers',
    },
    {
      match: /google|meta|microsoft|apple|amazon|nvidia|salesforce|oracle/,
      industry: 'Technology, Media & Telecommunications',
      sector: 'Technology',
    },
  ]

  for (const rule of KNOWN) {
    if (rule.match.test(haystack)) {
      return { industry: rule.industry, sector: rule.sector }
    }
  }
  return {}
}

/**
 * Derive a sensible default contact email from the client's domain.
 * Never returns a specific person — always a generic inbox the user can
 * edit. Keeps us out of hallucination territory.
 */
function contactFromUrl(clientUrl?: string): string | undefined {
  if (!clientUrl) return undefined
  // Strip protocol and www.
  const domain = clientUrl
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    ?.trim()
  if (!domain || !domain.includes('.')) return undefined
  return `partnerships@${domain}`
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InferClientRequest
    if (!body.clientName && !body.clientUrl) {
      return NextResponse.json(
        { error: 'Provide clientName or clientUrl' },
        { status: 400 },
      )
    }

    const heuristic = heuristicInfer(body.clientName, body.clientUrl)
    const suggestedContact = contactFromUrl(body.clientUrl)

    const llm = resolveLLMConfig(request)

    // No LLM configured — return whatever the heuristic caught (possibly empty).
    if (!llm) {
      const response: InferClientResponse = {
        ...heuristic,
        clientContact: suggestedContact,
        source: Object.keys(heuristic).length > 0 ? 'heuristic' : 'none',
      }
      return NextResponse.json(response)
    }

    // Ask the LLM to classify against the EXACT taxonomy we accept.
    const industries = Object.keys(INDUSTRY_SECTORS)
    const taxonomyLines = industries
      .map(
        (ind) =>
          `${ind}: ${INDUSTRY_SECTORS[ind as keyof typeof INDUSTRY_SECTORS].join(', ')}`,
      )
      .join('\n')

    const prompt = `You are classifying a business against a fixed industry/sector taxonomy. Return ONLY valid JSON, no markdown fences, no extra text.

Business:
  name: ${body.clientName || '(unknown)'}
  url:  ${body.clientUrl || '(unknown)'}

Taxonomy (industry: sectors):
${taxonomyLines}

Return this exact JSON shape:
{
  "industry": "<one of: ${industries.join(' | ')}>",
  "sector": "<a sector that belongs to the industry above, exact match>",
  "confidence": <0-1 number>
}

If you're genuinely uncertain, use industry "Other" and sector "Other". Do not invent sectors that are not in the taxonomy above.`

    try {
      const res = await generateCompletion(
        llm.provider,
        llm.model,
        llm.apiKey,
        [{ role: 'user', content: prompt }],
        {
          maxTokens: 200,
          temperature: 0.2,
          systemPrompt:
            'You are a business classifier. Return ONLY valid JSON, no markdown fences, no prose.',
        },
      )

      const parsed = JSON.parse(res.content) as {
        industry?: string
        sector?: string
        confidence?: number
      }

      // Validate the returned values against the real taxonomy — if the LLM
      // hallucinated a bad pair, fall back to the heuristic.
      const validIndustry =
        parsed.industry &&
        industries.includes(parsed.industry as keyof typeof INDUSTRY_SECTORS)
      const validSector =
        validIndustry &&
        parsed.sector &&
        (
          INDUSTRY_SECTORS[
            parsed.industry as keyof typeof INDUSTRY_SECTORS
          ] as readonly string[]
        ).includes(parsed.sector)

      if (validIndustry && validSector) {
        return NextResponse.json({
          industry: parsed.industry!,
          sector: parsed.sector!,
          clientContact: suggestedContact,
          source: 'llm',
        } satisfies InferClientResponse)
      }

      // LLM returned something invalid → heuristic fallback.
      return NextResponse.json({
        ...heuristic,
        clientContact: suggestedContact,
        source: Object.keys(heuristic).length > 0 ? 'heuristic' : 'none',
      } satisfies InferClientResponse)
    } catch {
      return NextResponse.json({
        ...heuristic,
        clientContact: suggestedContact,
        source: Object.keys(heuristic).length > 0 ? 'heuristic' : 'none',
      } satisfies InferClientResponse)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Infer failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
