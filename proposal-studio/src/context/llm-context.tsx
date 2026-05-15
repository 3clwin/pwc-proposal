'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { LLMProvider, LLMSettings } from '@/types'
import { AVAILABLE_MODELS } from '@/types'

const STORAGE_KEY = 'ps-llm-settings'

function createDefaultSettings(): LLMSettings {
  return {
    providers: {
      anthropic: {
        provider: 'anthropic',
        label: 'Claude',
        apiKey: '',
        isVerified: false,
        selectedModel: 'claude-4.6-opus-high',
        availableModels: AVAILABLE_MODELS.anthropic,
      },
      google: {
        provider: 'google',
        label: 'Gemini',
        apiKey: '',
        isVerified: false,
        selectedModel: 'gemini-3.1-pro-preview',
        availableModels: AVAILABLE_MODELS.google,
      },
      openai: {
        provider: 'openai',
        label: 'OpenAI',
        apiKey: '',
        isVerified: false,
        selectedModel: 'gpt-5.4-high',
        availableModels: AVAILABLE_MODELS.openai,
      },
    },
    defaultProvider: 'anthropic',
    defaultModel: 'claude-4.6-opus-high',
  }
}

function loadSettings(): LLMSettings {
  if (typeof window === 'undefined') return createDefaultSettings()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultSettings()
    return JSON.parse(raw) as LLMSettings
  } catch {
    return createDefaultSettings()
  }
}

function persistSettings(settings: LLMSettings) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

// --- Context ---

interface LLMContextValue {
  settings: LLMSettings
  activeProvider: LLMProvider
  activeModel: string
  activeApiKey: string
  isConfigured: boolean
  setProvider: (provider: LLMProvider) => void
  setModel: (provider: LLMProvider, modelId: string) => void
  updateApiKey: (provider: LLMProvider, apiKey: string) => void
  setVerified: (provider: LLMProvider, verified: boolean) => void
  setDefaultModel: (provider: LLMProvider, modelId: string) => void
}

const LLMContext = createContext<LLMContextValue | null>(null)

export function LLMSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LLMSettings>(createDefaultSettings)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSettings(loadSettings())
      setHydrated(true)
    }, 0)
    return () => window.clearTimeout(handle)
  }, [])

  useEffect(() => {
    if (hydrated) {
      persistSettings(settings)
    }
  }, [settings, hydrated])

  const activeProvider = settings.defaultProvider
  const activeProviderConfig = settings.providers[activeProvider]
  const activeModel = settings.defaultModel
  const activeApiKey = activeProviderConfig.apiKey

  const isConfigured = Object.values(settings.providers).some(
    (p) => p.apiKey.length > 0 && p.isVerified
  )

  const setProvider = useCallback((provider: LLMProvider) => {
    setSettings((prev) => ({
      ...prev,
      defaultProvider: provider,
      defaultModel: prev.providers[provider].selectedModel,
    }))
  }, [])

  const setModel = useCallback((provider: LLMProvider, modelId: string) => {
    setSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          selectedModel: modelId,
        },
      },
    }))
  }, [])

  const updateApiKey = useCallback((provider: LLMProvider, apiKey: string) => {
    setSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          apiKey,
          isVerified: false,
        },
      },
    }))
  }, [])

  const setVerified = useCallback((provider: LLMProvider, verified: boolean) => {
    setSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          isVerified: verified,
        },
      },
    }))
  }, [])

  const setDefaultModel = useCallback((provider: LLMProvider, modelId: string) => {
    setSettings((prev) => ({
      ...prev,
      defaultProvider: provider,
      defaultModel: modelId,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          selectedModel: modelId,
        },
      },
    }))
  }, [])

  return (
    <LLMContext.Provider
      value={{
        settings,
        activeProvider,
        activeModel,
        activeApiKey,
        isConfigured,
        setProvider,
        setModel,
        updateApiKey,
        setVerified,
        setDefaultModel,
      }}
    >
      {children}
    </LLMContext.Provider>
  )
}

export function useLLM(): LLMContextValue {
  const ctx = useContext(LLMContext)
  if (!ctx) {
    throw new Error('useLLM must be used within an LLMSettingsProvider')
  }
  return ctx
}
