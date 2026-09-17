import type { Metadata } from 'next'
import {
  defaultLocale,
  localeHrefLang,
  locales,
  type Locale,
} from '@/lib/i18n/config'
import { absoluteUrl, getSiteUrl } from '@/lib/utils/url'

/**
 * The subset of a document's `seo` group that this module consumes. The CMS
 * group also has an `image` upload relation; pages resolve that to a URL
 * themselves (via `ogImageUrl`) and pass it as `image`, because resolving a
 * Payload relation is not this module's job.
 */
export type SeoOverrides = {
  title?: string | null
  description?: string | null
  keywords?: string | null
  canonical?: string | null
  noIndex?: boolean | null
}

type BuildMetadataArgs = {
  locale: Locale
  /** Path WITHOUT the locale prefix, e.g. `/products/brick-x`. */
  path: string
  title: string
  description?: string | null
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  overrides?: SeoOverrides | null
  siteName?: string
}

function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '')
  return `/${locale}${clean}`
}

/**
 * Build the `alternates` block.
 *
 * Because a document keeps one slug across languages, every page can declare
 * all three language versions plus `x-default` without a translation lookup.
 */
export function buildAlternates(locale: Locale, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {}

  for (const code of locales) {
    languages[localeHrefLang[code]] = absoluteUrl(localePath(code, path))
  }
  languages['x-default'] = absoluteUrl(localePath(defaultLocale, path))

  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages,
  }
}

/**
 * Single entry point for page metadata. Per-document CMS overrides win, then
 * the values the page passes in, then the site defaults.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  overrides,
  siteName,
}: BuildMetadataArgs): Metadata {
  const resolvedTitle = overrides?.title?.trim() || title
  const resolvedDescription = overrides?.description?.trim() || description || undefined
  const resolvedImage = image || undefined
  const noIndex = Boolean(overrides?.noIndex)

  const baseAlternates = buildAlternates(locale, path)
  // A manual canonical only replaces the canonical link; the language
  // alternates still describe the same document in the other two languages.
  const alternates: Metadata['alternates'] = overrides?.canonical
    ? { ...baseAlternates, canonical: overrides.canonical }
    : baseAlternates

  const openGraph: Metadata['openGraph'] = {
    type,
    title: resolvedTitle,
    description: resolvedDescription,
    url: absoluteUrl(localePath(locale, path)),
    siteName,
    locale: localeHrefLang[locale],
    images: resolvedImage ? [{ url: resolvedImage, width: 1200, height: 630 }] : undefined,
    ...(type === 'article'
      ? {
          publishedTime: publishedTime ?? undefined,
          modifiedTime: modifiedTime ?? undefined,
        }
      : {}),
  }

  return {
    metadataBase: new URL(getSiteUrl()),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: overrides?.keywords
      ? overrides.keywords.split(',').map((keyword) => keyword.trim())
      : undefined,
    alternates,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph,
    twitter: {
      card: resolvedImage ? 'summary_large_image' : 'summary',
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedImage ? [resolvedImage] : undefined,
    },
  }
}
