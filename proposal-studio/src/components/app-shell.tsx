'use client'

import { usePathname } from 'next/navigation'
import { GlobalNav } from '@/components/global-nav'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const isEditor = pathname === '/editor'
  const isIntake = pathname === '/intake'

  if (isEditor) {
    return (
      <>
        <div className="fixed inset-x-0 top-0 z-30">
          <GlobalNav />
        </div>
        {children}
      </>
    )
  }

  if (isIntake || isLanding) {
    return <>{children}</>
  }

  return (
    <>
      <GlobalNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  )
}
