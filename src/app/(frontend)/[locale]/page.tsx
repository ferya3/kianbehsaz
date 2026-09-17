import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import {
  getArticles,
  getHomePage,
  getProducts,
  getProjects,
  getSiteSettings,
} from '@/lib/cms/queries'
import { resolveMedia } from '@/lib/cms/media'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Hero } from '@/components/home/Hero'
import { Stats } from '@/components/home/Stats'
import { FeatureSplit } from '@/components/home/FeatureSplit'
import { Capabilities } from '@/components/home/Capabilities'
import { CtaBanner } from '@/components/home/CtaBanner'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { EmptyState } from '@/components/shared/EmptyState'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/** Rebuilt on demand by the CMS hooks; this is only the safety net. */
export const revalidate = 600

export default async function HomePageRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale

  const [t, tCommon, home, settings, products, projects, articles] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Common' }),
    getHomePage(typedLocale),
    getSiteSettings(typedLocale),
    getProducts(typedLocale, { featured: true, limit: 6 }),
    getProjects(typedLocale, { featured: true, limit: 3 }),
    getArticles(typedLocale, { limit: 3 }),
  ])

  const sections = home?.sections
  const show = (key: keyof NonNullable<typeof sections>) => sections?.[key] !== false
  const introImage = resolveMedia(home?.intro?.image, 'wide')

  return (
    <>
      <Hero locale={typedLocale} home={home} />

      {show('showIntro') ? (
        <FeatureSplit
          eyebrow={t('introEyebrow')}
          title={home?.intro?.title || t('introTitle')}
          body={home?.intro?.body || t('introBody')}
          imageUrl={introImage?.url}
          imageAlt={introImage?.alt}
        >
          <Button href="/about" variant="ghost">
            {tCommon('readMore')}
          </Button>
        </FeatureSplit>
      ) : null}

      {show('showStats') ? <Stats locale={typedLocale} settings={settings} /> : null}

      {show('showProducts') ? (
        <Section>
          <SectionHeader
            eyebrow={t('productsEyebrow')}
            title={t('productsTitle')}
            body={t('productsBody')}
            action={
              <Button href="/products" variant="ghost">
                {tCommon('viewAll')}
              </Button>
            }
          />
          {products.docs.length ? (
            <ProductGrid products={products.docs} />
          ) : (
            <EmptyState message={tCommon('empty')} />
          )}
        </Section>
      ) : null}

      {show('showProjects') ? (
        <Section tone="muted">
          <SectionHeader
            eyebrow={t('projectsEyebrow')}
            title={t('projectsTitle')}
            body={t('projectsBody')}
            action={
              <Button href="/projects" variant="ghost">
                {tCommon('viewAll')}
              </Button>
            }
          />
          {projects.docs.length ? (
            <ProjectGrid projects={projects.docs} />
          ) : (
            <EmptyState message={tCommon('empty')} />
          )}
        </Section>
      ) : null}

      {show('showProduction') ? <Capabilities locale={typedLocale} /> : null}

      {show('showSustainability') ? (
        <Section>
          <SectionHeader
            eyebrow={t('sustainabilityEyebrow')}
            title={t('sustainabilityTitle')}
            body={t('sustainabilityBody')}
            action={
              <Button href="/sustainability" variant="ghost">
                {tCommon('readMore')}
              </Button>
            }
          />
        </Section>
      ) : null}

      {show('showArticles') ? (
        <Section tone="muted">
          <SectionHeader
            eyebrow={t('articlesEyebrow')}
            title={t('articlesTitle')}
            body={t('articlesBody')}
            action={
              <Button href="/articles" variant="ghost">
                {tCommon('viewAll')}
              </Button>
            }
          />
          {articles.docs.length ? (
            <ArticleGrid locale={typedLocale} articles={articles.docs} />
          ) : (
            <EmptyState message={tCommon('empty')} />
          )}
        </Section>
      ) : null}

      <CtaBanner locale={typedLocale} />
    </>
  )
}
