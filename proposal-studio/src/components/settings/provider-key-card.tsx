'use client'

import { useState, useCallback } from 'react'
import { Eye, EyeOff, CheckCircle2, Loader2, X, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ProviderLogo } from '@/components/provider-logos'
import { useLLM } from '@/context/llm-context'
import type { LLMProvider, LLMProviderConfig } from '@/types'

const PROVIDER_META: Record<LLMProvider, { name: string; placeholder: string; hint: string }> = {
  anthropic: {
    name: 'Claude',
    placeholder: 'sk-ant-api03-…',
    hint: 'console.anthropic.com',
  },
  openai: {
    name: 'OpenAI',
    placeholder: 'sk-proj-…',
    hint: 'platform.openai.com',
  },
  google: {
    name: 'Gemini',
    placeholder: 'AIza…',
    hint: 'aistudio.google.com',
  },
}

interface ProviderKeyRowProps {
  provider: LLMProvider
  config: LLMProviderConfig
}

export function ProviderKeyRow({ provider, config }: ProviderKeyRowProps) {
  const { updateApiKey, setVerified } = useLLM()
  const [showKey, setShowKey] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [localKey, setLocalKey] = useState(config.apiKey)
  const [copied, setCopied] = useState(false)
  const meta = PROVIDER_META[provider]

  const hasKey = localKey.length > 0
  const isDirty = localKey !== config.apiKey

  const handleSave = useCallback(async () => {
    updateApiKey(provider, localKey)

    if (!localKey) {
      setVerified(provider, false)
      toast.success(`${meta.name} key removed`)
      return
    }

    setVerifying(true)
    try {
      const res = await fetch('/api/llm-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-llm-provider': provider,
          'x-llm-api-key': localKey,
          'x-llm-model': config.selectedModel,
        },
        body: JSON.stringify({ provider }),
      })
      if (res.ok) {
        setVerified(provider, true)
        toast.success(`${meta.name} key saved & verified`)
      } else {
        setVerified(provider, false)
        toast.error('Key saved but verification failed — check the key')
      }
    } catch {
      setVerified(provider, false)
      toast.error('Key saved but could not verify')
    } finally {
      setVerifying(false)
    }
  }, [localKey, config.selectedModel, meta.name, provider, setVerified, updateApiKey])

  const handleClear = useCallback(() => {
    setLocalKey('')
    updateApiKey(provider, '')
    setVerified(provider, false)
    setShowKey(false)
  }, [provider, updateApiKey, setVerified])

  const handleCopy = useCallback(async () => {
    if (!localKey) return
    await navigator.clipboard.writeText(localKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [localKey])

  return (
    <div className="flex flex-col gap-4">
      {/* Provider header */}
      <div className="flex items-center gap-3">
        <ProviderLogo provider={provider} className="size-6" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{meta.name}</p>
          <p className="text-xs text-muted-foreground">{meta.hint}</p>
        </div>
        {config.isVerified ? (
          <Badge variant="secondary" className="gap-1 text-emerald-600">
            <CheckCircle2 className="size-3" />
            Active
          </Badge>
        ) : hasKey && !isDirty ? (
          <Badge variant="outline">Unverified</Badge>
        ) : null}
      </div>

      {/* Key input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`key-${provider}`} className="text-xs text-muted-foreground">
          API Key
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              id={`key-${provider}`}
              type={showKey ? 'text' : 'password'}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={meta.placeholder}
              className="pr-20 font-mono text-xs"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
              {hasKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  aria-label="Copy key"
                >
                  {copied ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3 text-muted-foreground" />
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <EyeOff className="size-3 text-muted-foreground" />
                ) : (
                  <Eye className="size-3 text-muted-foreground" />
                )}
              </Button>
              {hasKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleClear}
                  aria-label="Clear key"
                >
                  <X className="size-3 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleSave}
            disabled={(!isDirty && !(!config.isVerified && hasKey)) || verifying}
          >
            {verifying ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : isDirty ? (
              'Save'
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
