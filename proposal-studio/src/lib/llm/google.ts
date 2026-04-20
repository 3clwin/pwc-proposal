import { GoogleGenerativeAI } from '@google/generative-ai'
import type { LLMMessage, LLMOptions, LLMResponse } from './types'

export async function generateGoogleCompletion(
  model: string,
  apiKey: string,
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResponse> {
  const genAI = new GoogleGenerativeAI(apiKey)

  const systemMessages = messages.filter((m) => m.role === 'system')
  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  const systemInstruction = options?.systemPrompt
    ?? systemMessages.map((m) => m.content).join('\n')
    ?? undefined

  const generativeModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemInstruction || undefined,
    generationConfig: {
      maxOutputTokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
    },
  })

  const history = nonSystemMessages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const lastMessage = nonSystemMessages[nonSystemMessages.length - 1]

  const chat = generativeModel.startChat({ history })
  const result = await chat.sendMessage(lastMessage?.content ?? '')
  const response = result.response

  return {
    content: response.text(),
    usage: {
      inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
    },
  }
}
