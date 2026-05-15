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

const PROVIDER_ENV: Record<
  LLMProvider,
  { keyNames: string[]; modelName: string; label: string }
> = {
  anthropic: {
    keyNames: ['ANTHROPIC_API_KEY'],
    modelName: 'ANTHROPIC_MODEL',
    label: 'Claude',
  },
  openai: {
    keyNames: ['OPENAI_API_KEY'],
    modelName: 'OPENAI_MODEL',
    label: 'OpenAI',
  },
  google: {
    keyNames: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    modelName: 'GOOGLE_MODEL',
    label: 'Gemini',
  },
}

function readEnvProvider(provider: LLMProvider): ResolvedLLMConfig | null {
  const env = PROVIDER_ENV[provider]
  const apiKey = env.keyNames.map((name) => process.env[name]).find(Boolean)
  if (!apiKey) return null
  return {
    provider,
    apiKey,
    model: process.env[env.modelName] || DEFAULT_MODELS[provider],
    source: 'env',
  }
}

export function getLLMEnvironmentStatus() {
  const providers = (Object.keys(PROVIDER_ENV) as LLMProvider[]).map((provider) => {
    const env = PROVIDER_ENV[provider]
    const configuredKeyName = env.keyNames.find((name) => Boolean(process.env[name]))
    return {
      provider,
      label: env.label,
      configured: Boolean(configuredKeyName),
      keyNames: env.keyNames,
      configuredKeyName,
      model: process.env[env.modelName] || DEFAULT_MODELS[provider],
      modelEnvName: env.modelName,
    }
  })

  const active = (['anthropic', 'openai', 'google'] as LLMProvider[]).find((provider) =>
    providers.find((p) => p.provider === provider && p.configured)
  )

  return {
    providers,
    defaultProvider: active ?? null,
    defaultModel: active ? providers.find((p) => p.provider === active)?.model ?? null : null,
  }
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

  if (headerProvider) {
    const requested = readEnvProvider(headerProvider)
    if (requested) {
      return {
        ...requested,
        model: headerModel || requested.model,
      }
    }
  }

  for (const provider of ['anthropic', 'openai', 'google'] as LLMProvider[]) {
    const config = readEnvProvider(provider)
    if (config) {
      return config
    }
  }

  return null
}
