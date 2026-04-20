import { Button } from '@/components/ui/button'
import type { SiteSection } from '@/types'

interface SectionHeroProps {
  section: SiteSection
}

export function SectionHero({ section }: SectionHeroProps) {
  const { content, style } = section

  return (
    <section
      className="flex flex-col items-center justify-center text-center"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding ?? '80px 24px',
        minHeight: '400px',
      }}
      data-section-id={section.id}
    >
      <div className="mx-auto max-w-3xl">
        {content.headline && (
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {content.headline}
          </h1>
        )}
        {content.subheadline && (
          <p className="mt-4 text-lg opacity-80">{content.subheadline}</p>
        )}
        {content.body && (
          <p className="mt-4 text-base leading-relaxed opacity-70">{content.body}</p>
        )}
        {content.cta && (
          <Button
            variant="secondary"
            size="lg"
            className="mt-8"
            style={{
              backgroundColor: style.textColor,
              color: style.backgroundColor,
            }}
          >
            {content.cta.text}
          </Button>
        )}
      </div>
    </section>
  )
}
