import { NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/llm'
import { resolveLLMConfig } from '@/lib/llm/server-config'
import { editSectionPrompt } from '@/prompts/edit-section'
import type { SiteContent, SiteSection } from '@/types'

interface EditSectionRequest {
  siteContent: SiteContent
  userRequest: string
}

export async function POST(request: Request) {
  try {
    const llm = resolveLLMConfig(request)

    const body = (await request.json()) as EditSectionRequest

    if (!body.siteContent || !body.userRequest) {
      return NextResponse.json({ error: 'Missing siteContent or userRequest' }, { status: 400 })
    }

    if (!llm) {
      return NextResponse.json({
        sections: body.siteContent.sections,
        summary: 'AI editing is not available — no model is configured on the server.',
      })
    }

    const prompt = editSectionPrompt(body.siteContent, body.userRequest)

    const response = await generateCompletion(llm.provider, llm.model, llm.apiKey, [
      { role: 'user', content: prompt },
    ], {
      maxTokens: 4096,
      temperature: 0.7,
      systemPrompt: 'You are a proposal editor. Return ONLY valid JSON with no markdown fences.',
    })

    const parsed = JSON.parse(response.content) as {
      sections: SiteSection[]
      summary: string
    }

    return NextResponse.json({
      sections: parsed.sections,
      summary: parsed.summary,
      usage: response.usage,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Edit failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
