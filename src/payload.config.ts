import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Catalogs } from './payload/collections/Catalogs'
import { Pages } from './payload/collections/Pages'
import { Products } from './payload/collections/Products'
import { Projects } from './payload/collections/Projects'
import { Articles } from './payload/collections/Articles'
import {
  ArticleCategories,
  ProductCategories,
  ProjectCategories,
} from './payload/collections/categories'
import { SiteSettings } from './payload/globals/SiteSettings'
import { HomePage } from './payload/globals/HomePage'
import { Careers } from './payload/globals/Careers'
import { defaultLocale, locales } from './lib/i18n/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default buildConfig({
  serverURL: siteUrl,
  secret: process.env.PAYLOAD_SECRET ?? '',

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Kian Behsaz CMS',
    },
  },

  /**
   * The CMS REST/GraphQL API is namespaced under /api/cms so that `/api/*`
   * stays free for this application's own endpoints (contact, newsletter,
   * revalidation) with no ambiguity between a static and a catch-all route.
   */
  routes: {
    admin: '/admin',
    api: '/api/cms',
    graphQL: '/graphql',
    graphQLPlayground: '/graphql-playground',
  },

  /**
   * Payload owns the `cms` schema. Prisma owns `app` (see prisma/schema.prisma)
   * in the same database, so one `pg_dump` backs up content and operational
   * data together and neither tool's migrations touch the other's tables.
   */
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
    schemaName: 'cms',
    migrationDir: path.resolve(dirname, '../migrations'),
  }),

  editor: lexicalEditor(),

  collections: [
    Pages,
    Products,
    ProductCategories,
    Projects,
    ProjectCategories,
    Articles,
    ArticleCategories,
    Catalogs,
    Media,
    Users,
  ],

  globals: [SiteSettings, HomePage, Careers],

  /**
   * Content is localised field-by-field inside a single document, which is why
   * a product keeps one slug and one id across languages — that is what makes
   * `hreflang` and the language switcher trivial.
   */
  localization: {
    locales: locales.map((code) => ({ code, label: code })),
    defaultLocale,
    fallback: true,
  },

  cors: [siteUrl],
  csrf: [siteUrl],

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    // The front end uses the local API; GraphQL stays available for future
    // integrations but is not part of the page render path.
    disablePlaygroundInProduction: true,
  },
})
