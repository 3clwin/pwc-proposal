'use client'

import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface TemplateOption {
  id: string
  eyebrow: string
  title: string
  description: string
  image: string
}

const OPTIONS: TemplateOption[] = [
  {
    id: 'ai-builder',
    eyebrow: 'AI Proposal Builder',
    title: 'Build a Proposal Site From Scratch',
    description: 'Let AI analyze your RFP and generate a custom, client-branded proposal site.',
    image: '/Template 7.png',
  },
  {
    id: 'template',
    eyebrow: 'Professional Templates',
    title: 'Choose a PwC Template',
    description: 'Start from a curated set of industry-specific proposal layouts.',
    image: '/Template 2.png',
  },
]

interface TemplatePickerProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {OPTIONS.map((opt) => {
        const isSelected = selectedId === opt.id

        return (
          <Card
            key={opt.id}
            className={`relative cursor-pointer overflow-hidden border p-0 shadow-none ring-0 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
              isSelected ? 'border-primary' : 'border-border'
            }`}
            onClick={() => onSelect(opt.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(opt.id)
              }
            }}
          >
            {isSelected && (
              <div className="absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-full bg-primary">
                <Check className="size-3.5 text-primary-foreground" />
              </div>
            )}

            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={opt.image}
                alt={opt.eyebrow}
                fill
                // Shift the crop window left — reveals more of the
                // right side of the template and hides a bit of
                // the left edge.
                className="object-cover"
                style={{ objectPosition: '25% center' }}
                unoptimized
              />
            </div>

            <div className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {opt.eyebrow}
              </p>
              <p className="text-sm text-muted-foreground">
                {opt.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {opt.title}
                </span>
                <ArrowRight className="size-4 text-foreground" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
