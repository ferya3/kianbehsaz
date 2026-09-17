import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { publishedAtField, statusField } from '../fields/status'
import { revalidateCollection, revalidateCollectionOnDelete } from '../hooks/revalidate'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'status'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateCollection('articles')],
    afterDelete: [revalidateCollectionOnDelete('articles')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: 300,
      admin: { description: 'Shown on cards and used as the meta description fallback.' },
    },
    { name: 'content', type: 'richText', localized: true, required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'readingMinutes',
      type: 'number',
      min: 1,
      admin: { description: 'Estimated reading time. Leave empty to hide.' },
    },
    {
      name: 'tags',
      type: 'array',
      labels: { singular: 'Tag', plural: 'Tags' },
      fields: [{ name: 'label', type: 'text', required: true, localized: true }],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'article-categories',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
    statusField,
    publishedAtField,
    slugField('title'),
    seoField,
  ],
}
