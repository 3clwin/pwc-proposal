import type { SiteSection } from '@/types'

interface SectionPricingProps {
  section: SiteSection
}

export function SectionPricing({ section }: SectionPricingProps) {
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
        {content.body && (
          <p className="mt-4 text-base leading-relaxed opacity-80">{content.body}</p>
        )}
        {content.items && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {content.items.map((tier, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border p-5"
                style={{ borderColor: `${style.textColor}15` }}
              >
                {tier.title && <h3 className="text-sm font-semibold">{tier.title}</h3>}
                {tier.description && (
                  <p className="text-xs leading-relaxed opacity-70">{tier.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
