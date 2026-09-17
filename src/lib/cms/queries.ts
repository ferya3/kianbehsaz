import 'server-only'

import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import type {
  Article,
  ArticleCategory,
  Career,
  Catalog,
  HomePage,
  Media,
  Page,
  Product,
  ProductCategory,
  Project,
  ProjectCategory,
  SiteSetting,
} from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { getCms, safeQuery } from './client'
import { CACHE_TAGS, CMS_REVALIDATE_SECONDS } from './tags'

const published: Where = { status: { equals: 'published' } }

type Paginated<T> = { docs: T[]; totalPages: number; totalDocs: number; page: number }

const emptyPage = <T>(): Paginated<T> => ({ docs: [], totalPages: 0, totalDocs: 0, page: 1 })

/**
 * Every exported reader is wrapped in this helper, so each one gets a stable
 * cache key, a revalidation window and the tags that Payload's change hooks
 * purge. Reads never use the request context, which is what makes them
 * cacheable across visitors in the first place.
 */
function cached<Args extends unknown[], Result>(
  keyPrefix: string,
  tags: string[],
  fn: (...args: Args) => Promise<Result>,
) {
  return unstable_cache(fn, [keyPrefix], {
    tags,
    revalidate: CMS_REVALIDATE_SECONDS,
  })
}

/* -------------------------------------------------------------------------- */
/* Globals                                                                     */
/* -------------------------------------------------------------------------- */

export const getSiteSettings = cached(
  'site-settings',
  [CACHE_TAGS.siteSettings],
  async (locale: Locale): Promise<SiteSetting | null> =>
    safeQuery('getSiteSettings', async () => {
      const cms = await getCms()
      return cms.findGlobal({ slug: 'site-settings', locale, depth: 1 })
    }, null),
)

export const getHomePage = cached(
  'home-page',
  [CACHE_TAGS.homePage],
  async (locale: Locale): Promise<HomePage | null> =>
    safeQuery('getHomePage', async () => {
      const cms = await getCms()
      return cms.findGlobal({ slug: 'home-page', locale, depth: 2 })
    }, null),
)

export const getCareers = cached(
  'careers',
  [CACHE_TAGS.careers],
  async (locale: Locale): Promise<Career | null> =>
    safeQuery('getCareers', async () => {
      const cms = await getCms()
      return cms.findGlobal({ slug: 'careers', locale, depth: 0 })
    }, null),
)

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export const getProductCategories = cached(
  'product-categories',
  [CACHE_TAGS.productCategories],
  async (locale: Locale): Promise<ProductCategory[]> =>
    safeQuery('getProductCategories', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'product-categories',
        locale,
        depth: 1,
        limit: 100,
        sort: 'sortOrder',
      })
      return result.docs
    }, []),
)

export const getProducts = cached(
  'products',
  [CACHE_TAGS.products, CACHE_TAGS.productCategories],
  async (
    locale: Locale,
    options: { categorySlug?: string; featured?: boolean; limit?: number; page?: number } = {},
  ): Promise<Paginated<Product>> =>
    safeQuery('getProducts', async () => {
      const cms = await getCms()
      const where: Where = { and: [published] }

      if (options.featured) {
        ;(where.and as Where[]).push({ featured: { equals: true } })
      }

      if (options.categorySlug) {
        const category = await cms.find({
          collection: 'product-categories',
          where: { slug: { equals: options.categorySlug } },
          limit: 1,
          depth: 0,
        })
        const categoryId = category.docs[0]?.id
        // An unknown category must return nothing rather than everything.
        if (!categoryId) return emptyPage<Product>()
        ;(where.and as Where[]).push({ category: { equals: categoryId } })
      }

      const result = await cms.find({
        collection: 'products',
        locale,
        where,
        depth: 1,
        limit: options.limit ?? 12,
        page: options.page ?? 1,
        sort: ['sortOrder', '-publishedAt'],
      })

      return {
        docs: result.docs,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        page: result.page ?? 1,
      }
    }, emptyPage<Product>()),
)

export const getProductBySlug = cached(
  'product-by-slug',
  [CACHE_TAGS.products],
  async (locale: Locale, slug: string): Promise<Product | null> =>
    safeQuery('getProductBySlug', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'products',
        locale,
        where: { and: [published, { slug: { equals: slug } }] },
        depth: 2,
        limit: 1,
      })
      return result.docs[0] ?? null
    }, null),
)

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export const getProjectCategories = cached(
  'project-categories',
  [CACHE_TAGS.projectCategories],
  async (locale: Locale): Promise<ProjectCategory[]> =>
    safeQuery('getProjectCategories', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'project-categories',
        locale,
        depth: 1,
        limit: 100,
        sort: 'sortOrder',
      })
      return result.docs
    }, []),
)

export const getProjects = cached(
  'projects',
  [CACHE_TAGS.projects, CACHE_TAGS.projectCategories],
  async (
    locale: Locale,
    options: { categorySlug?: string; featured?: boolean; limit?: number; page?: number } = {},
  ): Promise<Paginated<Project>> =>
    safeQuery('getProjects', async () => {
      const cms = await getCms()
      const where: Where = { and: [published] }

      if (options.featured) {
        ;(where.and as Where[]).push({ featured: { equals: true } })
      }

      if (options.categorySlug) {
        const category = await cms.find({
          collection: 'project-categories',
          where: { slug: { equals: options.categorySlug } },
          limit: 1,
          depth: 0,
        })
        const categoryId = category.docs[0]?.id
        if (!categoryId) return emptyPage<Project>()
        ;(where.and as Where[]).push({ category: { equals: categoryId } })
      }

      const result = await cms.find({
        collection: 'projects',
        locale,
        where,
        depth: 1,
        limit: options.limit ?? 12,
        page: options.page ?? 1,
        sort: ['-year', '-publishedAt'],
      })

      return {
        docs: result.docs,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        page: result.page ?? 1,
      }
    }, emptyPage<Project>()),
)

export const getProjectBySlug = cached(
  'project-by-slug',
  [CACHE_TAGS.projects],
  async (locale: Locale, slug: string): Promise<Project | null> =>
    safeQuery('getProjectBySlug', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'projects',
        locale,
        where: { and: [published, { slug: { equals: slug } }] },
        depth: 2,
        limit: 1,
      })
      return result.docs[0] ?? null
    }, null),
)

/* -------------------------------------------------------------------------- */
/* Articles                                                                    */
/* -------------------------------------------------------------------------- */

export const getArticleCategories = cached(
  'article-categories',
  [CACHE_TAGS.articleCategories],
  async (locale: Locale): Promise<ArticleCategory[]> =>
    safeQuery('getArticleCategories', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'article-categories',
        locale,
        depth: 0,
        limit: 100,
        sort: 'sortOrder',
      })
      return result.docs
    }, []),
)

export const getArticles = cached(
  'articles',
  [CACHE_TAGS.articles, CACHE_TAGS.articleCategories],
  async (
    locale: Locale,
    options: { categorySlug?: string; limit?: number; page?: number; excludeId?: number } = {},
  ): Promise<Paginated<Article>> =>
    safeQuery('getArticles', async () => {
      const cms = await getCms()
      const where: Where = { and: [published] }

      if (options.excludeId !== undefined) {
        ;(where.and as Where[]).push({ id: { not_equals: options.excludeId } })
      }

      if (options.categorySlug) {
        const category = await cms.find({
          collection: 'article-categories',
          where: { slug: { equals: options.categorySlug } },
          limit: 1,
          depth: 0,
        })
        const categoryId = category.docs[0]?.id
        if (!categoryId) return emptyPage<Article>()
        ;(where.and as Where[]).push({ category: { equals: categoryId } })
      }

      const result = await cms.find({
        collection: 'articles',
        locale,
        where,
        depth: 1,
        limit: options.limit ?? 9,
        page: options.page ?? 1,
        sort: '-publishedAt',
      })

      return {
        docs: result.docs,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        page: result.page ?? 1,
      }
    }, emptyPage<Article>()),
)

export const getArticleBySlug = cached(
  'article-by-slug',
  [CACHE_TAGS.articles],
  async (locale: Locale, slug: string): Promise<Article | null> =>
    safeQuery('getArticleBySlug', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'articles',
        locale,
        where: { and: [published, { slug: { equals: slug } }] },
        depth: 2,
        limit: 1,
      })
      return result.docs[0] ?? null
    }, null),
)

/* -------------------------------------------------------------------------- */
/* Pages, catalogs, gallery                                                    */
/* -------------------------------------------------------------------------- */

export const getPageBySlug = cached(
  'page-by-slug',
  [CACHE_TAGS.pages],
  async (locale: Locale, slug: string): Promise<Page | null> =>
    safeQuery('getPageBySlug', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'pages',
        locale,
        where: { and: [published, { slug: { equals: slug } }] },
        depth: 1,
        limit: 1,
      })
      return result.docs[0] ?? null
    }, null),
)

export const getCatalogs = cached(
  'catalogs',
  [CACHE_TAGS.catalogs],
  async (locale: Locale): Promise<Catalog[]> =>
    safeQuery('getCatalogs', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'catalogs',
        locale,
        where: published,
        depth: 1,
        limit: 100,
        sort: 'title',
      })
      return result.docs
    }, []),
)

export const getGalleryImages = cached(
  'gallery',
  [CACHE_TAGS.media],
  async (locale: Locale): Promise<Media[]> =>
    safeQuery('getGalleryImages', async () => {
      const cms = await getCms()
      const result = await cms.find({
        collection: 'media',
        locale,
        where: { showInGallery: { equals: true } },
        depth: 0,
        limit: 120,
        sort: '-createdAt',
      })
      return result.docs
    }, []),
)

/* -------------------------------------------------------------------------- */
/* Build-time slug lists                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately NOT cached.
 *
 * `generateStaticParams` runs once per build, so there is nothing to gain from
 * a cache — and plenty to lose: `unstable_cache` persists to `.next/cache`
 * between builds, so a cached empty list would keep a freshly published
 * document out of the prerendered set until the entry expired.
 */
export async function getPublishedSlugs(
  collection: 'products' | 'projects' | 'articles',
): Promise<string[]> {
  return safeQuery(`getPublishedSlugs(${collection})`, async () => {
    const cms = await getCms()
    const result = await cms.find({
      collection,
      where: published,
      depth: 0,
      limit: 1000,
      pagination: false,
    })
    return result.docs.map((doc) => doc.slug)
  }, [])
}

/** Same, for taxonomy terms. Also uncached, for the same reason. */
export async function getCategorySlugs(
  collection: 'product-categories' | 'project-categories' | 'article-categories',
): Promise<string[]> {
  return safeQuery(`getCategorySlugs(${collection})`, async () => {
    const cms = await getCms()
    const result = await cms.find({ collection, depth: 0, limit: 500, pagination: false })
    return result.docs.map((doc) => doc.slug)
  }, [])
}

/* -------------------------------------------------------------------------- */
/* Sitemap                                                                     */
/* -------------------------------------------------------------------------- */

export type SitemapEntry = { path: string; updatedAt: string }

/**
 * One query per collection returning only what the sitemap needs, rather than
 * reusing the listing readers and throwing most of each document away.
 */
export const getSitemapEntries = cached(
  'sitemap-entries',
  [CACHE_TAGS.sitemap],
  async (): Promise<SitemapEntry[]> =>
    safeQuery('getSitemapEntries', async () => {
      const cms = await getCms()
      const notHidden: Where = {
        and: [published, { 'seo.noIndex': { not_equals: true } }],
      }

      const [products, projects, articles, pages, productCats, projectCats, articleCats] =
        await Promise.all([
          cms.find({ collection: 'products', where: notHidden, depth: 0, limit: 1000 }),
          cms.find({ collection: 'projects', where: notHidden, depth: 0, limit: 1000 }),
          cms.find({ collection: 'articles', where: notHidden, depth: 0, limit: 1000 }),
          cms.find({ collection: 'pages', where: notHidden, depth: 0, limit: 200 }),
          cms.find({ collection: 'product-categories', depth: 0, limit: 200 }),
          cms.find({ collection: 'project-categories', depth: 0, limit: 200 }),
          cms.find({ collection: 'article-categories', depth: 0, limit: 200 }),
        ])

      const entries: SitemapEntry[] = []
      const push = (prefix: string, docs: { slug: string; updatedAt: string }[]) => {
        for (const doc of docs) {
          entries.push({ path: `${prefix}/${doc.slug}`, updatedAt: doc.updatedAt })
        }
      }

      push('/products', products.docs)
      push('/products/category', productCats.docs)
      push('/projects', projects.docs)
      push('/projects/category', projectCats.docs)
      push('/articles', articles.docs)
      push('/articles/category', articleCats.docs)
      push('', pages.docs)

      return entries
    }, []),
)
