'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Key, User, Palette, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ProviderKeyRow } from '@/components/settings/provider-key-card'
import { Card, CardContent } from '@/components/ui/card'
import { useLLM } from '@/context/llm-context'
import type { LLMProvider } from '@/types'

const PROVIDERS: LLMProvider[] = ['anthropic', 'openai', 'google']

const NAV_ITEMS = [
  { id: 'account' as const, label: 'Account', icon: User },
  { id: 'api-keys' as const, label: 'API Keys', icon: Key },
  { id: 'branding' as const, label: 'Branding', icon: Palette },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
]

type NavSection = (typeof NAV_ITEMS)[number]['id']

export default function SettingsPage() {
  const { settings } = useLLM()
  const [activeNav, setActiveNav] = useState<NavSection>('api-keys')

  const configuredCount = Object.values(settings.providers).filter(
    (p) => p.apiKey.length > 0 && p.isVerified,
  ).length

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden md:flex-row">
      {/* Sidebar — full width horizontal strip on mobile, vertical rail on md+ */}
      <aside className="flex shrink-0 flex-col border-b border-border bg-card md:w-[20%] md:min-w-[240px] md:border-b-0 md:border-r lg:min-w-[280px]">
        <div className="flex h-12 items-center gap-2 px-4">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/editor" aria-label="Back to editor">
              <ArrowLeft className="size-4 text-muted-foreground" />
            </Link>
          </Button>
          <span className="text-sm font-medium text-foreground">Settings</span>
        </div>

        <Separator className="hidden md:block" />

        <nav
          className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-x-visible md:py-3"
          aria-label="Settings navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors md:gap-2.5',
                  activeNav === item.id
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
          {activeNav === 'account' && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                  Account
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Manage your profile, organization, and account preferences.
                </p>
              </div>
              <Separator />
              <Card className="rounded-2xl py-0">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Account settings coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeNav === 'api-keys' && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                    API Keys
                  </h1>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Add your API key for any LLM provider to power proposal generation,
                    brand extraction, and the AI chat assistant.
                  </p>
                </div>
                {configuredCount > 0 && (
                  <span className="mt-1 shrink-0 text-xs text-muted-foreground">
                    {configuredCount}/{PROVIDERS.length} configured
                  </span>
                )}
              </div>

              <Card className="rounded-2xl bg-muted/30 py-0">
                <CardContent className="flex flex-col gap-6 p-4">
                  {PROVIDERS.map((provider, i) => (
                    <div key={provider}>
                      <ProviderKeyRow
                        provider={provider}
                        config={settings.providers[provider]}
                      />
                      {i < PROVIDERS.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <p className="-mt-3 text-center text-[11px] leading-relaxed text-muted-foreground/60 md:-mt-5">
                Keys are stored in your browser&apos;s local storage and sent via request
                headers. They are never stored on our servers.
              </p>
            </div>
          )}

          {activeNav === 'branding' && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                  Branding
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Customize default proposal branding, logos, and color preferences.
                </p>
              </div>
              <Separator />
              <Card className="rounded-2xl py-0">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Branding settings coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeNav === 'notifications' && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                  Notifications
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Control email and in-app notification preferences.
                </p>
              </div>
              <Separator />
              <Card className="rounded-2xl py-0">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Notification settings coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
