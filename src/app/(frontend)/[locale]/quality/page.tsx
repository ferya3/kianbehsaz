import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { CtaBanner } from '@/components/home/CtaBanner'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Quality' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/quality',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function QualityPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: 'Quality' }),
    getTranslations({ locale, namespace: 'Nav' }),
  ])

  const steps = [
    { title: t('step1'), body: t('step1Body') },
    { title: t('step2'), body: t('step2Body') },
    { title: t('step3'), body: t('step3Body') },
    { title: t('step4'), body: t('step4Body') },
  ]

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('quality'), href: '/quality' }]}
      />

      <Section>
        <SectionHeader title={t('labTitle')} body={t('labBody')} />
      </Section>

      <Section tone="muted">
        <SectionHeader title={t('processTitle')} />
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-card border border-brand-100 bg-surface p-6"
            >
              <span className="font-display text-3xl font-semibold text-accent-500" dir="ltr">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-brand-900">{step.title}</h3>
              <p className="mt-2 text-sm text-brand-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBanner locale={typedLocale} />
    </>
  )
}
