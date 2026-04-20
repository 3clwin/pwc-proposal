import type { SiteSection } from '@/types'

interface SectionTextProps {
  section: SiteSection
}

export function SectionText({ section }: SectionTextProps) {
  const { content, style } = section

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding ?? '64px 24px',
      }}
      data-section-id={section.id}
    >
      <div className="mx-auto max-w-3xl">
        {content.headline && (
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {content.headline}
          </h2>
        )}
        {content.subheadline && (
          <p className="mt-2 text-lg opacity-70">{content.subheadline}</p>
        )}
        {content.body && (
          <p className="mt-4 text-base leading-relaxed">{content.body}</p>
        )}
        {content.items && content.items.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {content.items.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                {item.title && (
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-sm leading-relaxed opacity-70">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
