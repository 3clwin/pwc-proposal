'use client'

import type { ReactNode } from 'react'
import { ProjectProvider } from '@/context/project-context'
import { LLMSettingsProvider } from '@/context/llm-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProjectProvider>
      <LLMSettingsProvider>{children}</LLMSettingsProvider>
    </ProjectProvider>
  )
}
