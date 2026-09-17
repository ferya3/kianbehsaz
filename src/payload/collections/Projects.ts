import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { publishedAtField, statusField } from '../fields/status'
import { revalidateCollection, revalidateCollectionOnDelete } from '../hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'status', 'updatedAt'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateCollection('projects')],
    afterDelete: [revalidateCollectionOnDelete('projects')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'summary', type: 'textarea', localized: true, maxLength: 300 },
            { name: 'description', type: 'richText', localized: true },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Image', plural: 'Images' },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
            {
              name: 'videos',
              type: 'array',
              labels: { singular: 'Video', plural: 'Videos' },
              fields: [
                { name: 'url', type: 'text', required: true },
                { name: 'title', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Project data',
          fields: [
            { name: 'client', type: 'text', localized: true },
            { name: 'location', type: 'text', localized: true },
            {
              name: 'year',
              type: 'number',
              min: 1900,
              max: 2200,
              admin: { description: 'Gregorian year of completion.' },
            },
            {
              name: 'productsUsed',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxDepth: 1,
            },
            {
              name: 'technicalInfo',
              type: 'array',
              labels: { singular: 'Detail', plural: 'Details' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'value', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'project-categories',
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
    statusField,
    publishedAtField,
    slugField('title'),
    seoField,
  ],
}
