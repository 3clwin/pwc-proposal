import type { SiteSection } from '@/types'

interface SectionTeamProps {
  section: SiteSection
}

export function SectionTeam({ section }: SectionTeamProps) {
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.items.map((member, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg border p-4"
                style={{ borderColor: `${style.textColor}15`, backgroundColor: `${style.textColor}05` }}
              >
                <div
                  className="mb-2 flex size-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: style.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : `${style.textColor}20` }}
                >
                  {member.title?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                {member.title && (
                  <h3 className="text-sm font-semibold">{member.title}</h3>
                )}
                {member.description && (
                  <p className="text-xs leading-relaxed opacity-70">{member.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
