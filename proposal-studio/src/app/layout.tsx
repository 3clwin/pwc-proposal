import type { Metadata } from 'next'
import {
  JetBrains_Mono,
  Space_Grotesk,
  Bricolage_Grotesque,
  EB_Garamond,
} from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from '@/components/providers'
import { AppShell } from '@/components/app-shell'
import { Toaster } from 'sonner'
import './globals.css'
import { cn } from '@/lib/utils'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

// ─────────────────────────────────────────────────────────────────────────
// Template font fallbacks — consumed ONLY inside <ProposalCanvas>.
// Each substitutes for a category of paid client font so proposal previews
// stay faithful when the real brand font isn't web-hosted.
//
//  • fallback-sans    → regular sans (e.g. Ringside Sans, Gotham)
//  • fallback-wide    → wide/display sans (e.g. Ringside Extra Wide)
//  • fallback-serif   → classic/display serif (e.g. Garamond, Playfair)
//
// App chrome does NOT use any of these — it stays in Arial + Georgia.
// ─────────────────────────────────────────────────────────────────────────

const templateFallbackSans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-template-fallback-sans',
  weight: ['400', '500', '600', '700'],
})

const templateFallbackWide = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-template-fallback-wide',
  weight: ['400', '700', '800'],
})

const templateFallbackSerif = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-template-fallback-serif',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Proposal Studio',
  description:
    'Transform RFP responses into polished, brand-perfect proposal microsites.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        jetbrainsMono.variable,
        templateFallbackSans.variable,
        templateFallbackWide.variable,
        templateFallbackSerif.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Providers>
          <TooltipProvider delayDuration={300}>
            <AppShell>{children}</AppShell>
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
