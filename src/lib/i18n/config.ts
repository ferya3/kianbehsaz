/**
 * Single source of truth for the site's locales.
 *
 * Everything else — routing, `hreflang`, the locale switcher, the CMS
 * localisation config and the sitemap — derives from this list, so adding a
 * fourth language is a one-line change here plus a messages file.
 */
export const locales = ['fa', 'en', 'ar'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fa'

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr',
  ar: 'rtl',
}

/** Label shown in the language switcher, written in the language itself. */
export const localeLabels: Record<Locale, string> = {
  fa: 'فارسی',
  en: 'English',
  ar: 'العربية',
}

/** BCP 47 tags used for `hreflang` and `<html lang>`. */
export const localeHrefLang: Record<Locale, string> = {
  fa: 'fa-IR',
  en: 'en',
  ar: 'ar',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return localeDirections[locale]
}
