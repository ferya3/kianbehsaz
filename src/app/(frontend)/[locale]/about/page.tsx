import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/cms/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Stats } from '@/components/home/Stats'
import { CtaBanner } from '@/components/home/CtaBanner'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'About' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/about',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'About' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getSiteSettings(typedLocale),
  ])

  const values = [
    { title: t('valueQuality'), body: t('valueQualityBody') },
    { title: t('valuePartnership'), body: t('valuePartnershipBody') },
    { title: t('valueResponsibility'), body: t('valueResponsibilityBody') },
  ]

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('about'), href: '/about' }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">{t('historyTitle')}</h2>
            <p className="mt-4 text-brand-600">{t('historyBody')}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{t('missionTitle')}</h2>
            <p className="mt-4 text-brand-600">{t('missionBody')}</p>
          </div>
        </div>
      </Section>

      <Stats locale={typedLocale} settings={settings} />

      <Section tone="muted">
        <SectionHeader title={t('valuesTitle')} />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-card border border-brand-100 bg-surface p-8"
            >
              <h3 className="text-xl font-semibold text-brand-900">{value.title}</h3>
              <p className="mt-3 text-brand-600">{value.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBanner locale={typedLocale} />
    </>
  )
}
