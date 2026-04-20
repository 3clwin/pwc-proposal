import { NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/llm'
import { resolveLLMConfig } from '@/lib/llm/server-config'
import { scanRiskPrompt } from '@/prompts/scan-risk'
import { scanContentWithRegex } from '@/lib/risk-scanner'
import type { SiteContent, RiskFlag } from '@/types'

interface ScanRiskRequest {
  siteContent: SiteContent
}

export async function POST(request: Request) {
  try {
    const llm = resolveLLMConfig(request)

    const body = (await request.json()) as ScanRiskRequest

    if (!body.siteContent) {
      return NextResponse.json({ error: 'Missing siteContent' }, { status: 400 })
    }

    const regexFlags = scanContentWithRegex(body.siteContent)

    let llmFlags: RiskFlag[] = []
    if (llm) {
      try {
        const allText = body.siteContent.sections
          .map((s) => [s.content.headline, s.content.subheadline, s.content.body].filter(Boolean).join(' '))
          .join('\n\n')

        const response = await generateCompletion(llm.provider, llm.model, llm.apiKey, [
          { role: 'user', content: scanRiskPrompt(allText) },
        ], {
          maxTokens: 1024,
          temperature: 0.3,
          systemPrompt: 'You are a compliance reviewer. Return ONLY valid JSON.',
        })

        const parsed = JSON.parse(response.content) as {
          flags: Array<{
            text: string
            rule: string
            severity: 'high' | 'medium' | 'low'
            suggestedReplacement: string
            sectionId: string
          }>
        }

        llmFlags = parsed.flags.map((f) => ({
          id: crypto.randomUUID(),
          sectionId: f.sectionId,
          text: f.text,
          rule: f.rule,
          severity: f.severity,
          status: 'open' as const,
          suggestedReplacement: f.suggestedReplacement,
          position: { start: 0, end: 0 },
        }))
      } catch {
        // LLM scan failed — fall back to regex only
      }
    }

    // Merge and deduplicate by flagged text
    const seenTexts = new Set<string>()
    const allFlags: RiskFlag[] = []
    for (const flag of [...regexFlags, ...llmFlags]) {
      const key = flag.text.toLowerCase()
      if (!seenTexts.has(key)) {
        seenTexts.add(key)
        allFlags.push(flag)
      }
    }

    return NextResponse.json({ flags: allFlags })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Risk scan failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
