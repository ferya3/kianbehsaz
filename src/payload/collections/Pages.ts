import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { publishedAtField, statusField } from '../fields/status'
import { revalidateCollection, revalidateCollectionOnDelete } from '../hooks/revalidate'

/**
 * Editorial pages that do not need bespoke code — privacy policy, terms, a
 * landing page for a campaign. The fixed routes (about, quality, …) have their
 * own React components and read their copy from `messages/` plus globals.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateCollection('pages')],
    afterDelete: [revalidateCollectionOnDelete('pages')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true, required: true },
    statusField,
    publishedAtField,
    slugField('title'),
    seoField,
  ],
}
