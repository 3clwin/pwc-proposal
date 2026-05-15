import { ArrowRight, Check, AlertCircle, Info } from 'lucide-react'
import type { BrandTokens } from '@/types'

interface ComponentPreviewsProps {
  tokens: BrandTokens
}

function sem(tokens: BrandTokens, token: string, fb: string): string {
  if (!tokens.colors.semantic) return fb
  for (const g of tokens.colors.semantic)
    for (const t of g.tokens)
      if (t.token === token) return t.hex
  return fb
}

function pal(tokens: BrandTokens, family: string, idx: number, fb: string): string {
  return tokens.colors.palettes?.[family]?.[idx] ?? fb
}

export function ComponentPreviews({ tokens }: ComponentPreviewsProps) {
  const { colors } = tokens

  const brand1     = sem(tokens, '--lds-g-color-brand-1', colors.primary)
  const onBrand1   = sem(tokens, '--lds-g-color-on-brand-1', '#ffffff')
  const surface1   = sem(tokens, '--lds-g-color-surface-1', '#191919')
  const onSurface1 = sem(tokens, '--lds-g-color-on-surface-1', '#191919')
  const onSurface2 = sem(tokens, '--lds-g-color-on-surface-2', '#3a3a3a')
  const onSurfInv1 = sem(tokens, '--lds-g-color-on-surface-inverse-1', '#ffffff')
  const border3    = sem(tokens, '--lds-g-color-border-3', '#c5c5c5')
  const disabledBg = sem(tokens, '--lds-g-color-disabled-container-1', '#c5c5c5')
  const disabledFg = sem(tokens, '--lds-g-color-on-disabled-1', '#6a6a6a')
  const successBg  = sem(tokens, '--lds-g-color-success-container-1', '#e7f4ea')
  const successFg  = sem(tokens, '--lds-g-color-success-1', '#007a55')
  const warningBg  = sem(tokens, '--lds-g-color-warning-container-1', '#fceee7')
  const warningFg  = sem(tokens, '--lds-g-color-warning-1', '#a55500')
  const errorBg    = sem(tokens, '--lds-g-color-error-container-1', '#ffdad4')
  const errorFg    = sem(tokens, '--lds-g-color-error-1', '#9f180f')
  const infoBg     = sem(tokens, '--lds-g-color-info-container-1', '#edf1fd')
  const infoFg     = sem(tokens, '--lds-g-color-info-1', '#1b6cba')

  const redTint    = pal(tokens, 'red', 0, '#fbf5f4')   // lds-content-section-primary-red
  const redMid     = pal(tokens, 'red', 1, '#f9eeed')   // lds-content-section-secondary-red

  const sans  = 'var(--font-sans, sans-serif)'
  const serif = 'var(--font-heading, serif)'
  const label = 'var(--font-label, sans-serif)'

  return (
    <div className="flex flex-col gap-10">

      {/* ── Buttons ──
          .cta-button-filled: h48, r32, p12/24, gap12, 20px/24px, w400, Ringside Sans */}
      <div>
        <SectionLabel font={label}>Buttons</SectionLabel>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-12 items-center gap-3 px-6" style={{ backgroundColor: brand1, color: onBrand1, borderRadius: '32px', fontSize: '20px', fontWeight: 400, lineHeight: '24px', fontFamily: sans }}>
            Primary <ArrowRight className="size-5" />
          </span>
          <span className="inline-flex h-12 items-center gap-3 px-6" style={{ backgroundColor: surface1, color: onSurfInv1, borderRadius: '32px', fontSize: '20px', fontWeight: 400, lineHeight: '24px', fontFamily: sans }}>
            Secondary
          </span>
          <span className="inline-flex h-12 items-center gap-3 px-6" style={{ backgroundColor: 'transparent', color: brand1, borderRadius: '32px', border: `2px solid ${brand1}`, fontSize: '20px', fontWeight: 400, lineHeight: '24px', fontFamily: sans }}>
            Outlined
          </span>
          <span className="inline-flex h-12 items-center gap-3 px-6" style={{ backgroundColor: disabledBg, color: disabledFg, borderRadius: '32px', fontSize: '20px', fontWeight: 400, lineHeight: '24px', fontFamily: sans }}>
            Disabled
          </span>
        </div>
      </div>

      {/* ── Text Links ──
          .cta-text.cta-text-red: 20px/30px, w900, underline, color brand1 */}
      <div>
        <SectionLabel font={label}>Text Links</SectionLabel>
        <div className="flex flex-col gap-3">
          {['Examine our process', 'How to spot counterfeits', 'What is genetic medicine'].map((t) => (
            <a key={t} className="inline-flex items-center gap-1 self-start" style={{ color: brand1, fontSize: '20px', fontWeight: 900, lineHeight: '30px', textDecoration: 'underline', textUnderlineOffset: '4px', fontFamily: sans }}>
              {t}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── Typography ──
          .lds-ringside-garamond-extra: Garamond Narrow, 100px/100px, w400, ls-1.5px
          <em> = italic
          .lds-ringside-heading-3: Ringside Sans, 36px/43.92px, w400, ls-0.72px
          .lds-ringside-body-large: Ringside Sans, 20px/30px, w400 */}
      <div>
        <SectionLabel font={label}>Typography</SectionLabel>
        <div className="flex flex-col gap-5 py-6" style={{ backgroundColor: redTint, borderRadius: '20px', padding: '24px' }}>
          <p style={{ fontFamily: serif, fontSize: '36px', lineHeight: '1', fontWeight: 400, letterSpacing: '-1.5px', color: onSurface1 }}>
            A medicine company should do more <em>than just make medicine.</em>
          </p>
          <h3 style={{ fontFamily: sans, fontSize: '24px', lineHeight: '29.28px', fontWeight: 400, letterSpacing: '-0.72px', color: onSurface1 }}>
            Find care
          </h3>
          <p style={{ fontFamily: sans, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: onSurface2 }}>
            Get in touch with an independent doctor who understands your condition.
          </p>
        </div>
      </div>

      {/* ── Three-Column Feature Cards ──
          Layout: 3 cols, each has heading-3 (36px/w400), body-large (20px/w400), cta-button-filled
          Section bg: redTint (#fbf5f4) */}
      <div>
        <SectionLabel font={label}>Cards</SectionLabel>
        <div style={{ backgroundColor: redTint, borderRadius: '20px', padding: '24px' }}>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Find care', body: 'Get in touch with an independent doctor who understands your condition.', cta: 'Get started' },
              { title: 'Access pharmacy', body: 'LillyDirect® Pharmacy provides access to authentic Lilly medicines, free home delivery, exclusive savings, and support.', cta: 'Get medicine' },
              { title: 'Join a clinical trial', body: 'Clinical trials need patients to help medicine get better.', cta: 'View trials' },
            ].map((c) => (
              <div key={c.title} className="flex flex-col gap-4">
                <h3 style={{ fontFamily: sans, fontSize: '24px', lineHeight: '29.28px', fontWeight: 400, letterSpacing: '-0.72px', color: onSurface1 }}>
                  {c.title}
                </h3>
                <p className="flex-1" style={{ fontFamily: sans, fontSize: '14px', lineHeight: '21px', fontWeight: 400, color: onSurface1 }}>
                  {c.body}
                </p>
                <span className="inline-flex h-10 items-center gap-2 self-start px-5" style={{ backgroundColor: brand1, color: onBrand1, borderRadius: '32px', fontSize: '16px', fontWeight: 400, lineHeight: '24px', fontFamily: sans }}>
                  {c.cta} <ArrowRight className="size-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ──
          .horizontal-numeric-tile — number: lds-ringside-heading-1 (60px/66px, w900, ls-1.5px)
          label: lds-ringside-heading-6 (24px/31.92px, w400, ls-0.48px)
          divider: 2px, #c5c5c5
          section bg: #f9eeed (secondary-red) */}
      <div>
        <SectionLabel font={label}>Stats</SectionLabel>
        <div style={{ backgroundColor: redMid, borderRadius: '20px', padding: '24px' }}>
          <div className="grid grid-cols-3 gap-6">
            {[
              { num: '150', label: 'Years making medicine' },
              { num: '100+', label: 'Patented medications' },
              { num: '10', label: 'Prix Galien Awards earned' },
            ].map(({ num, label: lbl }) => (
              <div key={lbl} className="flex flex-col gap-2">
                <div style={{ backgroundColor: border3, height: '2px', width: '100%' }} />
                <span style={{ fontFamily: sans, fontSize: '40px', lineHeight: '44px', fontWeight: 900, letterSpacing: '-1.5px', color: onSurface1 }}>
                  {num}
                </span>
                <span style={{ fontFamily: sans, fontSize: '14px', lineHeight: '18.62px', fontWeight: 400, letterSpacing: '-0.48px', color: onSurface1 }}>
                  {lbl}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Cards (bottom 3-up: "Medicine starts with safety") ──
          bg: redTint, heading: lds-ringside-heading-5 (28px), body, cta-text-red underline */}
      <div>
        <SectionLabel font={label}>Content Cards</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Medicine starts with safety', body: 'Thousands of employees work every day to make sure Lilly medicine is made consistently and with the highest quality.', cta: 'Examine our process' },
            { title: 'Protect yourself from counterfeits', body: 'We give you the information you need to better protect yourself against counterfeit, fake and unsafe products.', cta: 'How to spot counterfeits' },
            { title: 'The hope of medicine for every body', body: 'We may one day make medicine tailored to biology using new treatments from their own genetic code.', cta: 'What is genetic medicine' },
          ].map((c) => (
            <div key={c.title} className="flex flex-col gap-3" style={{ backgroundColor: redTint, borderRadius: '20px', padding: '24px' }}>
              <h4 style={{ fontFamily: sans, fontSize: '20px', lineHeight: '26px', fontWeight: 400, letterSpacing: '-0.48px', color: onSurface1 }}>
                {c.title}
              </h4>
              <p className="flex-1" style={{ fontFamily: sans, fontSize: '14px', lineHeight: '21px', fontWeight: 400, color: onSurface2 }}>
                {c.body}
              </p>
              <a className="mt-1 inline-flex items-center gap-1 self-start" style={{ color: brand1, fontSize: '14px', fontWeight: 900, lineHeight: '21px', textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: sans }}>
                {c.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feedback (LDS semantic: success/warning/error/info containers) ── */}
      <div>
        <SectionLabel font={label}>Feedback</SectionLabel>
        <div className="flex flex-col gap-2">
          {[
            { icon: <Check className="size-4 shrink-0" />, bg: successBg, fg: successFg, text: 'Submission received — your proposal has been uploaded successfully.' },
            { icon: <AlertCircle className="size-4 shrink-0" />, bg: warningBg, fg: warningFg, text: 'Review required — some sections need additional detail.' },
            { icon: <AlertCircle className="size-4 shrink-0" />, bg: errorBg, fg: errorFg, text: 'Validation error — please correct the highlighted fields.' },
            { icon: <Info className="size-4 shrink-0" />, bg: infoBg, fg: infoFg, text: 'Your proposal is being reviewed by the compliance team.' },
          ].map(({ icon, bg, fg, text }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-3" style={{ borderRadius: '16px', backgroundColor: bg, color: fg, fontSize: '14px', lineHeight: '21px', fontWeight: 400, fontFamily: sans }}>
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ font, children }: { font: string; children: React.ReactNode }) {
  return (
    <h4
      className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em]"
      style={{ color: '#6a6a6a', fontFamily: font }}
    >
      {children}
    </h4>
  )
}
