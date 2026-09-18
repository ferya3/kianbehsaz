import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionHead } from '@/components/ui/Section'
import { CtaBanner } from '@/components/home/CtaBanner'
import { Reveal } from '@/components/motion/Reveal'
import { getGalleryImages } from '@/lib/cms/queries'
import { resolveMedia } from '@/lib/cms/media'

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
  const [t, tNav, media] = await Promise.all([
    getTranslations({ locale, namespace: 'Quality' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getGalleryImages(typedLocale),
  ])

  // The laboratory frame backs the hero when it has been uploaded.
  const hero = resolveMedia(
    media.find((item) => item.filename?.startsWith('lab')) ?? media[0],
    'wide',
  )

  const steps = [
    { title: t('step1'), body: t('step1Body') },
    { title: t('step2'), body: t('step2Body') },
    { title: t('step3'), body: t('step3Body') },
    { title: t('step4'), body: t('step4Body') },
  ]

  return (
    <>
      <PageHero
        locale={typedLocale}
        index="03"
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('quality'), href: '/quality' }]}
        imageUrl={hero?.url}
        imageAlt={hero?.alt}
      />

      <Section>
        <div className="max-w-3xl">
          <h2 className="label-mono mb-6 text-ember-400">{t('labTitle')}</h2>
          <p className="text-2xl leading-relaxed text-ink-200">{t('labBody')}</p>
        </div>
      </Section>

      <Section tone="raised" className="border-y border-white/10">
        <SectionHead index="04" label={t('processTitle')} title={t('processTitle')} />
        <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.07}>
              <li className="rule-hairline pt-6">
                <span dir="ltr" className="font-display text-5xl leading-none font-semibold text-ink-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-ink-50">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <CtaBanner locale={typedLocale} />
    </>
  )
}
