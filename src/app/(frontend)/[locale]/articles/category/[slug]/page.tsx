import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getArticleCategories, getCategorySlugs } from '@/lib/cms/queries'
import { ArticlesListing } from '@/components/articles/ArticlesListing'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getCategorySlugs('article-categories')

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const categories = await getArticleCategories(locale as Locale)
  const category = categories.find((item) => item.slug === slug)
  if (!category) return {}

  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: `/articles/category/${slug}`,
    title: category.title,
    description: category.description,
    overrides: category.seo,
    siteName: tSite('name'),
  })
}

export default async function ArticleCategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const categories = await getArticleCategories(typedLocale)
  if (!categories.some((category) => category.slug === slug)) notFound()

  const { page } = await searchParams
  const parsedPage = Number.parseInt(page ?? '1', 10)

  return (
    <ArticlesListing
      locale={typedLocale}
      categorySlug={slug}
      page={Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1}
    />
  )
}
