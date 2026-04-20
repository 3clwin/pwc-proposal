import Anthropic from '@anthropic-ai/sdk'
import type { LLMMessage, LLMOptions, LLMResponse } from './types'

export async function generateAnthropicCompletion(
  model: string,
  apiKey: string,
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResponse> {
  const client = new Anthropic({ apiKey })

  const systemMessages = messages.filter((m) => m.role === 'system')
  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  const systemPrompt = options?.systemPrompt
    ?? systemMessages.map((m) => m.content).join('\n')
    ?? undefined

  const response = await client.messages.create({
    model,
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.7,
    system: systemPrompt || undefined,
    messages: nonSystemMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const textBlock = response.content.find((block) => block.type === 'text')

  return {
    content: textBlock?.text ?? '',
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  }
}
