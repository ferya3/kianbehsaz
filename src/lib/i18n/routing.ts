import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every language gets an explicit prefix (/fa, /en, /ar) so no URL is
  // ambiguous and each language version is independently indexable.
  localePrefix: 'always',
  localeDetection: true,
})
