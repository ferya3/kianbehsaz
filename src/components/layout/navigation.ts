/**
 * The site's primary navigation.
 *
 * Kept in code rather than in the CMS: these routes exist as React components,
 * so an editor being able to delete or rename one would only ever produce a
 * broken link. Editorial pages live in the `pages` collection instead.
 */
export const PRIMARY_NAV = [
  { href: '/about', labelKey: 'about' },
  { href: '/products', labelKey: 'products' },
  { href: '/projects', labelKey: 'projects' },
  { href: '/articles', labelKey: 'articles' },
  { href: '/quality', labelKey: 'quality' },
  { href: '/contact', labelKey: 'contact' },
] as const

export const FOOTER_NAV = {
  company: [
    { href: '/about', labelKey: 'about' },
    { href: '/quality', labelKey: 'quality' },
    { href: '/sustainability', labelKey: 'sustainability' },
    { href: '/careers', labelKey: 'careers' },
  ],
  resources: [
    { href: '/products', labelKey: 'products' },
    { href: '/projects', labelKey: 'projects' },
    { href: '/catalogs', labelKey: 'catalogs' },
    { href: '/gallery', labelKey: 'gallery' },
  ],
} as const

export type NavItem = { href: string; labelKey: string }
