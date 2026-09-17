import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getCatalogs } from '@/lib/cms/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section } from '@/components/ui/Section'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/Badge'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Catalogs' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/catalogs',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function CatalogsPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav, tCommon, format, catalogs] = await Promise.all([
    getTranslations({ locale, namespace: 'Catalogs' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getTranslations({ locale, namespace: 'Common' }),
    getFormatter({ locale }),
    getCatalogs(typedLocale),
  ])

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('catalogs'), href: '/catalogs' }]}
      />

      <Section>
        {catalogs.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {catalogs.map((catalog) => (
              <li key={catalog.id}>
                <a
                  href={catalog.url ?? '#'}
                  download
                  className="flex h-full flex-col justify-between gap-4 rounded-card border border-brand-100 bg-surface p-6 shadow-card transition-shadow hover:shadow-raised"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold text-brand-900">{catalog.title}</h2>
                      {catalog.category ? <Badge>{catalog.category}</Badge> : null}
                    </div>
                    {catalog.description ? (
                      <p className="mt-2 text-sm text-brand-600">{catalog.description}</p>
                    ) : null}
                  </div>

                  <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-brand-500">
                    {catalog.filesize ? (
                      <div className="flex gap-1">
                        <dt>{t('fileSize')}:</dt>
                        <dd dir="ltr">{Math.round(catalog.filesize / 1024)} KB</dd>
                      </div>
                    ) : null}
                    <div className="flex gap-1">
                      <dt>{t('updatedAt')}:</dt>
                      <dd>
                        {format.dateTime(new Date(catalog.updatedAt), { dateStyle: 'medium' })}
                      </dd>
                    </div>
                    <span className="ms-auto font-medium text-accent-700">
                      {tCommon('download')}
                    </span>
                  </dl>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message={t('empty')} />
        )}
      </Section>
    </>
  )
}
