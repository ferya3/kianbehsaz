import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getCareers, getSiteSettings } from '@/lib/cms/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Careers' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/careers',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav, careers, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'Careers' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getCareers(typedLocale),
    getSiteSettings(typedLocale),
  ])

  const openPositions = (careers?.positions ?? []).filter((position) => position.open !== false)
  const applyEmail = careers?.applyEmail || settings?.emails?.[0]?.address

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={t('title')}
        subtitle={careers?.intro || t('subtitle')}
        breadcrumbs={[{ name: tNav('careers'), href: '/careers' }]}
      >
        {applyEmail ? (
          <Button href={`mailto:${applyEmail}`} external>
            {t('apply')}
          </Button>
        ) : null}
      </PageHeader>

      <Section>
        <SectionHeader title={t('openPositions')} />

        {openPositions.length ? (
          <ul className="space-y-4">
            {openPositions.map((position) => (
              <li
                key={position.id ?? position.title}
                className="rounded-card border border-brand-100 bg-surface p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-900">{position.title}</h3>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-500">
                      {position.department ? (
                        <span>
                          {t('department')}: {position.department}
                        </span>
                      ) : null}
                      {position.location ? (
                        <span>
                          {t('location')}: {position.location}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  {position.employmentType ? (
                    <Badge tone="accent">{position.employmentType}</Badge>
                  ) : null}
                </div>

                {position.description ? (
                  <p className="mt-4 text-brand-600">{position.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message={t('noPositions')} />
        )}
      </Section>
    </>
  )
}
