/**
 * The site's navigation index.
 *
 * Kept in code rather than in the CMS: these routes exist as React components,
 * so an editor being able to rename or delete one would only ever produce a
 * broken link. Editorial pages live in the `pages` collection instead.
 *
 * Because navigation is a full-screen index rather than a bar, it can hold the
 * whole site — there is no room pressure forcing pages into a "more" menu.
 */
export const PRIMARY_NAV = [
  { href: '/products', labelKey: 'products' },
  { href: '/projects', labelKey: 'projects' },
  { href: '/quality', labelKey: 'quality' },
  { href: '/about', labelKey: 'about' },
  { href: '/articles', labelKey: 'articles' },
  { href: '/catalogs', labelKey: 'catalogs' },
  { href: '/sustainability', labelKey: 'sustainability' },
  { href: '/careers', labelKey: 'careers' },
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
