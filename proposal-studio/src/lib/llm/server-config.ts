import type { LLMProvider } from '@/types'

export interface ResolvedLLMConfig {
  provider: LLMProvider
  apiKey: string
  model: string
  source: 'header' | 'env'
}

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-4.6-opus-high',
  openai: 'gpt-5.4-high',
  google: 'gemini-3.1-pro-preview',
}

/**
 * Resolve the LLM provider to use for a request.
 *
 * Priority:
 *  1. BYOK headers (`x-llm-provider`, `x-llm-api-key`, `x-llm-model`) —
 *     preserved for power users who want to swap keys at runtime.
 *  2. Server-configured env vars — Anthropic → OpenAI → Google.
 *     `*_MODEL` env vars override the provider's default model.
 *
 * Returns `null` when neither source is available, which lets callers fall
 * back to simulated/sample output.
 */
export function resolveLLMConfig(request: Request): ResolvedLLMConfig | null {
  const headerProvider = request.headers.get('x-llm-provider') as LLMProvider | null
  const headerKey = request.headers.get('x-llm-api-key')
  const headerModel = request.headers.get('x-llm-model')

  if (headerProvider && headerKey) {
    return {
      provider: headerProvider,
      apiKey: headerKey,
      model: headerModel || DEFAULT_MODELS[headerProvider],
      source: 'header',
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic,
      source: 'env',
    }
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
      source: 'env',
    }
  }
  const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  if (googleKey) {
    return {
      provider: 'google',
      apiKey: googleKey,
      model: process.env.GOOGLE_MODEL || DEFAULT_MODELS.google,
      source: 'env',
    }
  }

  return null
}
