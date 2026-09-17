import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { ProductsListing } from '@/components/products/ProductsListing'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Products' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/products',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const { page } = await searchParams
  const parsedPage = Number.parseInt(page ?? '1', 10)

  return (
    <ProductsListing
      locale={locale as Locale}
      page={Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1}
    />
  )
}
