import OpenAI from 'openai'
import type { LLMMessage, LLMOptions, LLMResponse } from './types'

export async function generateOpenAICompletion(
  model: string,
  apiKey: string,
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResponse> {
  const client = new OpenAI({ apiKey })

  const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

  if (options?.systemPrompt) {
    formattedMessages.push({ role: 'system', content: options.systemPrompt })
  }

  for (const msg of messages) {
    formattedMessages.push({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    })
  }

  const response = await client.chat.completions.create({
    model,
    messages: formattedMessages,
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.7,
  })

  const choice = response.choices[0]

  return {
    content: choice?.message?.content ?? '',
    usage: {
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
    },
  }
}
