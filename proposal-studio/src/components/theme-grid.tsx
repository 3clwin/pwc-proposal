'use client'

import { ThemeCard } from './theme-card'
import type { ThemeVariant } from '@/types'

interface ThemeGridProps {
  themes: ThemeVariant[]
  selectedThemeId: string | null
  onSelectTheme: (theme: ThemeVariant) => void
}

export function ThemeGrid({ themes, selectedThemeId, onSelectTheme }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={selectedThemeId === theme.id}
          onSelect={onSelectTheme}
        />
      ))}
    </div>
  )
}
