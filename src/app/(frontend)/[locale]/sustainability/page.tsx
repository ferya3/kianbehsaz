import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { PageHero } from '@/components/shared/PageHero'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Sustainability' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/sustainability',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function SustainabilityPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: 'Sustainability' }),
    getTranslations({ locale, namespace: 'Nav' }),
  ])

  const pillars = [
    { title: t('energyTitle'), body: t('energyBody') },
    { title: t('wasteTitle'), body: t('wasteBody') },
    { title: t('waterTitle'), body: t('waterBody') },
    { title: t('communityTitle'), body: t('communityBody') },
  ]

  return (
    <>
      <PageHero
        locale={typedLocale}
        index="07"
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('sustainability'), href: '/sustainability' }]}
      />

      <Section>
        <ul className="grid gap-x-12 gap-y-16 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={(index % 2) * 0.08}>
              <li className="rule-hairline pt-6">
                <span dir="ltr" className="label-mono text-ember-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-5 text-3xl font-semibold text-ink-50">{pillar.title}</h2>
                <p className="mt-4 max-w-md text-ink-400">{pillar.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  )
}
