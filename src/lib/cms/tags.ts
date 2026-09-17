/**
 * Cache tags shared by the data layer and by Payload's afterChange hooks.
 * The tag name is the collection/global slug, so adding a collection cannot
 * silently forget to invalidate.
 */
export const CACHE_TAGS = {
  pages: 'pages',
  products: 'products',
  productCategories: 'product-categories',
  projects: 'projects',
  projectCategories: 'project-categories',
  articles: 'articles',
  articleCategories: 'article-categories',
  catalogs: 'catalogs',
  media: 'media',
  siteSettings: 'site-settings',
  homePage: 'home-page',
  careers: 'careers',
  sitemap: 'sitemap',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

/** How long a cached CMS read may be served before it is refreshed anyway. */
export const CMS_REVALIDATE_SECONDS = 300
