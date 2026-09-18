import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getCatalogs } from '@/lib/cms/queries'
import { PageHero } from '@/components/shared/PageHero'
import { Section } from '@/components/ui/Section'
import { EmptyState } from '@/components/shared/EmptyState'
import { Tag } from '@/components/ui/Tag'
import { Reveal } from '@/components/motion/Reveal'

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
      <PageHero
        locale={typedLocale}
        index="06"
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('catalogs'), href: '/catalogs' }]}
      />

      <Section>
        {catalogs.length ? (
          <ul>
            {catalogs.map((catalog, index) => (
              <li key={catalog.id} className="rule-hairline last:border-b last:border-white/10">
                <Reveal delay={Math.min(index, 5) * 0.05}>
                  <a
                    href={catalog.url ?? '#'}
                    download
                    className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 py-7 lg:grid-cols-[auto_1fr_auto_auto]"
                  >
                    <span className="label-mono">{String(index + 1).padStart(2, '0')}</span>

                    <div>
                      <h2 className="text-2xl font-semibold text-ink-200 transition-colors group-hover:text-ink-50">
                        {catalog.title}
                      </h2>
                      {catalog.description ? (
                        <p className="mt-2 max-w-xl text-sm text-ink-500">{catalog.description}</p>
                      ) : null}
                    </div>

                    <div className="col-start-2 flex flex-wrap items-center gap-4 lg:col-start-auto">
                      {catalog.category ? <Tag>{catalog.category}</Tag> : null}
                      {catalog.filesize ? (
                        <span dir="ltr" className="label-mono">
                          {Math.round(catalog.filesize / 1024)} KB
                        </span>
                      ) : null}
                      <span className="label-mono">
                        {format.dateTime(new Date(catalog.updatedAt), { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <span className="label-mono col-start-2 text-ember-400 lg:col-start-auto">
                      {tCommon('download')} ↓
                    </span>
                  </a>
                </Reveal>
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
