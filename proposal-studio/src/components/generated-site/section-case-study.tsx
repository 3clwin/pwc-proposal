import type { SiteSection } from '@/types'

interface SectionCaseStudyProps {
  section: SiteSection
}

export function SectionCaseStudy({ section }: SectionCaseStudyProps) {
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
          <p className="mt-2 text-base opacity-70">{content.subheadline}</p>
        )}
        {content.items && (
          <div className="mt-8 flex flex-col gap-4">
            {content.items.map((study, i) => (
              <div
                key={i}
                className="rounded-lg border p-5"
                style={{ borderColor: `${style.textColor}15`, backgroundColor: `${style.textColor}05` }}
              >
                {study.title && <h3 className="text-base font-semibold">{study.title}</h3>}
                {study.description && (
                  <p className="mt-2 text-sm leading-relaxed opacity-70">{study.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
