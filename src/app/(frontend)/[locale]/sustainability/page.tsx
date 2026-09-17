import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section } from '@/components/ui/Section'

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
      <PageHeader
        locale={typedLocale}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('sustainability'), href: '/sustainability' }]}
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-card border border-brand-100 bg-surface p-8"
            >
              <h2 className="text-xl font-semibold text-brand-900">{pillar.title}</h2>
              <p className="mt-3 text-brand-600">{pillar.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
