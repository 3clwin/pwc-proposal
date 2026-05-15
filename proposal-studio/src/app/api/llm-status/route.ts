import { NextResponse } from 'next/server'
import { getLLMEnvironmentStatus } from '@/lib/llm/server-config'
import { generateCompletion } from '@/lib/llm'
import type { LLMProvider } from '@/types'

export const runtime = 'nodejs'

export function GET() {
  return NextResponse.json(getLLMEnvironmentStatus())
}

export async function POST(request: Request) {
  const provider = request.headers.get('x-llm-provider') as LLMProvider | null
  const apiKey = request.headers.get('x-llm-api-key')
  const model = request.headers.get('x-llm-model')

  if (!provider || !apiKey) {
    return NextResponse.json({ valid: false, error: 'Missing provider or key' }, { status: 400 })
  }

  try {
    await generateCompletion(
      provider,
      model || 'claude-4.6-sonnet-medium',
      apiKey,
      [{ role: 'user', content: 'Say "ok" and nothing else.' }],
      { maxTokens: 4, temperature: 0 },
    )
    return NextResponse.json({ valid: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ valid: false, error: message }, { status: 401 })
  }
}
