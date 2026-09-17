import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateCollection, revalidateCollectionOnDelete } from '../hooks/revalidate'
import { statusField } from '../fields/status'

/**
 * Downloadable documents (product catalogs, datasheets, test reports).
 *
 * Kept separate from `media` so the catalogs page can list documents without
 * filtering the whole image library by mime type.
 */
export const Catalogs: CollectionConfig = {
  slug: 'catalogs',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'public/media/catalogs',
    mimeTypes: ['application/pdf'],
  },
  hooks: {
    afterChange: [revalidateCollection('catalogs')],
    afterDelete: [revalidateCollectionOnDelete('catalogs')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'product',
      options: [
        { label: 'Product catalog', value: 'product' },
        { label: 'Technical datasheet', value: 'datasheet' },
        { label: 'Certificate', value: 'certificate' },
        { label: 'Company profile', value: 'profile' },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'language', type: 'select', hasMany: true, options: ['fa', 'en', 'ar'] },
    statusField,
  ],
}
