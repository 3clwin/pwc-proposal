import type { SiteSection } from '@/types'

interface SectionTimelineProps {
  section: SiteSection
}

export function SectionTimeline({ section }: SectionTimelineProps) {
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
          <div className="relative mt-8 flex flex-col gap-0">
            {content.items.map((phase, i) => (
              <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: style.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : style.textColor }}
                  >
                    {i + 1}
                  </div>
                  {i < content.items!.length - 1 && (
                    <div className="mt-1 w-px flex-1" style={{ backgroundColor: `${style.textColor}20` }} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  {phase.title && (
                    <h3 className="text-sm font-semibold">{phase.title}</h3>
                  )}
                  {phase.description && (
                    <p className="mt-1 text-sm leading-relaxed opacity-70">{phase.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
