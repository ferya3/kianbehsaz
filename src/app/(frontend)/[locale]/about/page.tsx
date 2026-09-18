import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getHomePage, getSiteSettings } from '@/lib/cms/queries'
import { resolveMedia } from '@/lib/cms/media'
import { PageHero } from '@/components/shared/PageHero'
import { Container } from '@/components/ui/Container'
import { Section, SectionHead } from '@/components/ui/Section'
import { Figures } from '@/components/home/Figures'
import { CtaBanner } from '@/components/home/CtaBanner'
import { Reveal } from '@/components/motion/Reveal'
import { ParallaxMedia } from '@/components/motion/ParallaxMedia'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

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
  const [t, tNav, settings, home] = await Promise.all([
    getTranslations({ locale, namespace: 'About' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getSiteSettings(typedLocale),
    getHomePage(typedLocale),
  ])

  const image = resolveMedia(home?.intro?.image, 'wide')

  const values = [
    { title: t('valueQuality'), body: t('valueQualityBody') },
    { title: t('valuePartnership'), body: t('valuePartnershipBody') },
    { title: t('valueResponsibility'), body: t('valueResponsibilityBody') },
  ]

  return (
    <>
      <PageHero
        locale={typedLocale}
        index="04"
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('about'), href: '/about' }]}
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="space-y-16 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="label-mono mb-5 text-ember-400">{t('historyTitle')}</h2>
              <p className="text-xl leading-relaxed text-ink-200">{t('historyBody')}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="label-mono mb-5 text-ember-400">{t('missionTitle')}</h2>
              <p className="text-xl leading-relaxed text-ink-200">{t('missionBody')}</p>
            </Reveal>
          </div>

          {image ? (
            <ParallaxMedia
              src={image.url}
              alt={image.alt}
              className="aspect-3/4 w-full lg:aspect-2/3"
              sizes="(min-width: 1024px) 45vw, 92vw"
            />
          ) : null}
        </div>
      </Section>

      <Figures locale={typedLocale} settings={settings} />

      <Section>
        <SectionHead index="05" label={t('valuesTitle')} title={t('valuesTitle')} />
        <Container className="!px-0">
          <ul className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.08}>
                <li className="rule-hairline pt-6">
                  <span dir="ltr" className="font-display text-4xl font-semibold text-ink-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-ink-50">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-400">{value.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBanner locale={typedLocale} />
    </>
  )
}
