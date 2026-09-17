import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'

/**
 * Production, technology and quality as three parallel claims. Presented as a
 * card row rather than three more image/text splits, which would turn the
 * homepage into a very long accordion of the same layout.
 */
export async function Capabilities({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  const items = [
    { eyebrow: t('productionEyebrow'), title: t('productionTitle'), body: t('productionBody') },
    { eyebrow: t('technologyEyebrow'), title: t('technologyTitle'), body: t('technologyBody') },
    { eyebrow: t('qualityEyebrow'), title: t('qualityTitle'), body: t('qualityBody') },
  ]

  return (
    <Section tone="muted">
      <SectionHeader eyebrow={t('technologyEyebrow')} title={t('technologyTitle')} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.05}>
            <article className="h-full rounded-card border border-brand-100 bg-surface p-8">
              <p className="text-sm font-medium tracking-wide text-accent-600 uppercase">
                {item.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-brand-900">{item.title}</h3>
              <p className="mt-3 text-brand-600">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
