import type { MetadataRoute } from 'next'
import { getSitemapEntries } from '@/lib/cms/queries'
import { defaultLocale, localeHrefLang, locales } from '@/lib/i18n/config'
import { absoluteUrl } from '@/lib/utils/url'

export const revalidate = 3600

/** Routes that exist in code rather than in the CMS. */
const STATIC_PATHS = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/articles', priority: 0.8, changeFrequency: 'daily' as const },
  { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/catalogs', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/quality', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/sustainability', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/careers', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
]

function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[localeHrefLang[locale]] = absoluteUrl(`/${locale}${path}`)
  }
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicEntries = await getSitemapEntries()
  const now = new Date()

  const entries: MetadataRoute.Sitemap = []

  for (const route of STATIC_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(`/${locale}${route.path}`),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        // The default language is the one we want ranked when all else is equal.
        priority: locale === defaultLocale ? route.priority : route.priority * 0.9,
        alternates: { languages: languageAlternates(route.path) },
      })
    }
  }

  for (const entry of dynamicEntries) {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(`/${locale}${entry.path}`),
        lastModified: new Date(entry.updatedAt),
        changeFrequency: 'weekly',
        priority: locale === defaultLocale ? 0.7 : 0.6,
        alternates: { languages: languageAlternates(entry.path) },
      })
    }
  }

  return entries
}
