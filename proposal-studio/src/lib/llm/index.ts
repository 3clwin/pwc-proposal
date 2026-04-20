import type { LLMProvider } from '@/types'
import type { LLMMessage, LLMOptions, LLMResponse } from './types'
import { generateAnthropicCompletion } from './anthropic'
import { generateGoogleCompletion } from './google'
import { generateOpenAICompletion } from './openai'

export type { LLMMessage, LLMOptions, LLMResponse } from './types'

const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      const isRateLimit =
        lastError.message.includes('rate_limit') ||
        lastError.message.includes('429') ||
        lastError.message.includes('quota')

      if (!isRateLimit && attempt === 0) {
        throw lastError
      }

      if (attempt < retries - 1) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt)
        await sleep(delay)
      }
    }
  }

  throw lastError ?? new Error('All retry attempts failed')
}

export async function generateCompletion(
  provider: LLMProvider,
  model: string,
  apiKey: string,
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResponse> {
  if (!apiKey) {
    throw new Error(`No API key provided for ${provider}`)
  }

  return withRetry(async () => {
    switch (provider) {
      case 'anthropic':
        return generateAnthropicCompletion(model, apiKey, messages, options)
      case 'google':
        return generateGoogleCompletion(model, apiKey, messages, options)
      case 'openai':
        return generateOpenAICompletion(model, apiKey, messages, options)
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`)
    }
  })
}
