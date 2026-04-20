import type { LLMProvider } from '@/types'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMOptions {
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface LLMRequest {
  provider: LLMProvider
  model: string
  apiKey: string
  messages: LLMMessage[]
  options?: LLMOptions
}

export interface LLMResponse {
  content: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
}
