import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getCareers, getSiteSettings } from '@/lib/cms/queries'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionHead } from '@/components/ui/Section'
import { EmptyState } from '@/components/shared/EmptyState'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'

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
      <PageHero
        locale={typedLocale}
        index="08"
        title={t('title')}
        subtitle={careers?.intro || t('subtitle')}
        breadcrumbs={[{ name: tNav('careers'), href: '/careers' }]}
      >
        {applyEmail ? (
          <Button href={`mailto:${applyEmail}`} external>
            {t('apply')}
          </Button>
        ) : null}
      </PageHero>

      <Section>
        <SectionHead index="09" label={t('openPositions')} title={t('openPositions')} />

        {openPositions.length ? (
          <ul>
            {openPositions.map((position, index) => (
              <li
                key={position.id ?? position.title}
                className="rule-hairline last:border-b last:border-white/10"
              >
                <Reveal delay={Math.min(index, 5) * 0.05}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 py-8 lg:grid-cols-[auto_1fr_auto]">
                    <span className="label-mono">{String(index + 1).padStart(2, '0')}</span>

                    <div>
                      <h3 className="text-2xl font-semibold text-ink-50">{position.title}</h3>
                      <p className="label-mono mt-3 flex flex-wrap gap-x-6 gap-y-1">
                        {position.department ? <span>{position.department}</span> : null}
                        {position.location ? <span>{position.location}</span> : null}
                      </p>
                      {position.description ? (
                        <p className="mt-4 max-w-2xl text-ink-400">{position.description}</p>
                      ) : null}
                    </div>

                    {position.employmentType ? (
                      <div className="col-start-2 lg:col-start-auto">
                        <Tag tone="ember">{position.employmentType}</Tag>
                      </div>
                    ) : null}
                  </div>
                </Reveal>
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
