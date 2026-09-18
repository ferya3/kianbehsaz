import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import {
  getArticles,
  getHomePage,
  getProducts,
  getProjects,
  getSiteSettings,
} from '@/lib/cms/queries'
import { Hero } from '@/components/home/Hero'
import { Marquee } from '@/components/home/Marquee'
import { Manifesto } from '@/components/home/Manifesto'
import { Figures } from '@/components/home/Figures'
import { ProductRail } from '@/components/products/ProductRail'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { Process } from '@/components/home/Process'
import { Journal } from '@/components/home/Journal'
import { CtaBanner } from '@/components/home/CtaBanner'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/** Rebuilt on demand by the CMS hooks; this is only the safety net. */
export const revalidate = 600

/**
 * The homepage is a sequence, not a stack of blocks: an opening frame, a held
 * statement, the figures behind it, the products, the work, the process, the
 * writing, and one closing surface. Each numbered chapter appears once.
 */
export default async function HomePageRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale

  const [home, settings, products, projects, articles] = await Promise.all([
    getHomePage(typedLocale),
    getSiteSettings(typedLocale),
    getProducts(typedLocale, { featured: true, limit: 8 }),
    getProjects(typedLocale, { featured: true, limit: 5 }),
    getArticles(typedLocale, { limit: 3 }),
  ])

  const sections = home?.sections
  const show = (key: keyof NonNullable<typeof sections>) => sections?.[key] !== false

  return (
    <>
      <Hero locale={typedLocale} home={home} products={products.docs} />
      <Marquee locale={typedLocale} />

      {show('showIntro') ? <Manifesto locale={typedLocale} home={home} /> : null}
      {show('showStats') ? <Figures locale={typedLocale} settings={settings} /> : null}
      {show('showProducts') ? (
        <ProductRail locale={typedLocale} products={products.docs} />
      ) : null}
      {show('showProjects') ? (
        <ProjectsSection locale={typedLocale} projects={projects.docs} />
      ) : null}
      {show('showQuality') ? <Process locale={typedLocale} /> : null}
      {show('showArticles') ? <Journal locale={typedLocale} articles={articles.docs} /> : null}

      <CtaBanner locale={typedLocale} />
    </>
  )
}
