'use client'

import { useLLM } from '@/context/llm-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ProviderLogo } from '@/components/provider-logos'
import { AVAILABLE_MODELS, type LLMProvider } from '@/types'

const PROVIDER_ORDER: LLMProvider[] = ['anthropic', 'google', 'openai']

const PROVIDER_LABELS: Record<LLMProvider, string> = {
  anthropic: 'Anthropic',
  google: 'Google',
  openai: 'OpenAI',
}

/**
 * Curated two-model shortlist per provider: one strong default and one fast
 * alternative. Keeps the picker scannable while still giving a meaningful
 * choice. The full list lives in AVAILABLE_MODELS.
 */
const VISIBLE_MODEL_IDS: Record<LLMProvider, string[]> = {
  anthropic: ['claude-4.6-opus-high', 'claude-4.6-sonnet-medium'],
  google: ['gemini-3.1-pro-preview', 'gemini-3-flash-preview'],
  openai: ['gpt-5.4-high', 'gpt-5.4-medium-fast'],
}

export function LLMSelector() {
  const { activeProvider, activeModel, setDefaultModel } = useLLM()

  const currentValue = `${activeProvider}:${activeModel}`
  const allModels = PROVIDER_ORDER.flatMap((p) => AVAILABLE_MODELS[p])
  const currentModel = allModels.find((m) => `${m.provider}:${m.id}` === currentValue)

  return (
    <Select
      value={currentValue}
      onValueChange={(val) => {
        const [provider, model] = val.split(':') as [LLMProvider, string]
        setDefaultModel(provider, model)
      }}
    >
      <SelectTrigger className="h-6 min-w-0 max-w-full gap-1 border-none bg-transparent px-1.5 text-xs text-muted-foreground shadow-none hover:text-foreground">
        <SelectValue>
          {currentModel && (
            <span className="flex min-w-0 items-center gap-1.5">
              <ProviderLogo provider={currentModel.provider} className="size-3 shrink-0" />
              <span className="truncate">{currentModel.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        side="top"
        sideOffset={6}
        position="popper"
        className="min-w-[220px] p-1"
      >
        {PROVIDER_ORDER.map((provider, pi) => {
          const visibleIds = VISIBLE_MODEL_IDS[provider]
          const models = AVAILABLE_MODELS[provider].filter((m) =>
            visibleIds.includes(m.id)
          )
          if (models.length === 0) return null
          return (
            <div key={provider}>
              {pi > 0 && <Separator className="my-1" />}
              <div className="flex items-center gap-2 px-2 py-1">
                <ProviderLogo provider={provider} className="size-3.5 shrink-0" />
                <span className="text-xs font-medium text-muted-foreground">
                  {PROVIDER_LABELS[provider]}
                </span>
              </div>
              {models.map((m) => (
                <SelectItem
                  key={m.id}
                  value={`${m.provider}:${m.id}`}
                  className="py-1.5 pl-7 text-xs"
                >
                  {m.label}
                </SelectItem>
              ))}
            </div>
          )
        })}
      </SelectContent>
    </Select>
  )
}
