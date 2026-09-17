import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { publishedAtField, statusField } from '../fields/status'
import { revalidateCollection, revalidateCollectionOnDelete } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'featured', 'updatedAt'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateCollection('products')],
    afterDelete: [revalidateCollectionOnDelete('products')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              maxLength: 300,
              admin: { description: 'Shown on product cards and in search results.' },
            },
            { name: 'description', type: 'richText', localized: true },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Used on cards, in OpenGraph and as the gallery poster.' },
            },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Image', plural: 'Images' },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
          ],
        },
        {
          label: 'Technical',
          fields: [
            {
              name: 'specifications',
              type: 'array',
              labels: { singular: 'Specification', plural: 'Specifications' },
              admin: { description: 'Rendered as the technical specifications table.' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'value', type: 'text', required: true, localized: true },
                { name: 'unit', type: 'text' },
              ],
            },
            {
              name: 'applications',
              type: 'array',
              labels: { singular: 'Application', plural: 'Applications' },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'downloads',
              type: 'relationship',
              relationTo: 'catalogs',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxDepth: 1,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    statusField,
    publishedAtField,
    slugField('title'),
    seoField,
  ],
}
