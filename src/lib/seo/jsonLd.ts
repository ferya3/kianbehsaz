import type { Locale } from '@/lib/i18n/config'
import { absoluteUrl } from '@/lib/utils/url'

type JsonLd = Record<string, unknown>

export function organizationJsonLd({
  name,
  description,
  logo,
  sameAs,
  phone,
  email,
  address,
}: {
  name: string
  description?: string | null
  logo?: string | null
  sameAs?: string[]
  phone?: string | null
  email?: string | null
  address?: string | null
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: absoluteUrl('/'),
    description: description ?? undefined,
    logo: logo ?? undefined,
    sameAs: sameAs?.length ? sameAs : undefined,
    contactPoint:
      phone || email
        ? [
            {
              '@type': 'ContactPoint',
              contactType: 'sales',
              telephone: phone ?? undefined,
              email: email ?? undefined,
            },
          ]
        : undefined,
    address: address
      ? { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'IR' }
      : undefined,
  }
}

export function websiteJsonLd({ name, locale }: { name: string; locale: Locale }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function productJsonLd({
  name,
  description,
  image,
  brand,
  url,
  specifications,
}: {
  name: string
  description?: string | null
  image?: string | null
  brand: string
  url: string
  specifications?: { label: string; value: string }[]
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description ?? undefined,
    image: image ?? undefined,
    brand: { '@type': 'Brand', name: brand },
    url: absoluteUrl(url),
    additionalProperty: specifications?.length
      ? specifications.map((spec) => ({
          '@type': 'PropertyValue',
          name: spec.label,
          value: spec.value,
        }))
      : undefined,
  }
}

export function articleJsonLd({
  headline,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  authorName,
  publisherName,
  locale,
}: {
  headline: string
  description?: string | null
  image?: string | null
  url: string
  publishedTime?: string | null
  modifiedTime?: string | null
  authorName?: string | null
  publisherName: string
  locale: Locale
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: description ?? undefined,
    image: image ?? undefined,
    inLanguage: locale,
    mainEntityOfPage: absoluteUrl(url),
    datePublished: publishedTime ?? undefined,
    dateModified: modifiedTime ?? publishedTime ?? undefined,
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    publisher: { '@type': 'Organization', name: publisherName },
  }
}
