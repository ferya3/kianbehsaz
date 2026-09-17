import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { revalidateCollection, revalidateCollectionOnDelete } from '../hooks/revalidate'

/**
 * Products, projects and articles all need the same taxonomy shape. One
 * factory keeps them identical instead of three files drifting apart.
 */
function createCategoryCollection(slug: string, labelSingular: string): CollectionConfig {
  return {
    slug,
    labels: { singular: labelSingular, plural: `${labelSingular}s` },
    admin: {
      group: 'Taxonomy',
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', 'sortOrder'],
    },
    access: {
      read: anyone,
      create: authenticated,
      update: authenticated,
      delete: authenticated,
    },
    hooks: {
      afterChange: [revalidateCollection(slug)],
      afterDelete: [revalidateCollectionOnDelete(slug)],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true },
      { name: 'description', type: 'textarea', localized: true },
      { name: 'image', type: 'upload', relationTo: 'media' },
      {
        name: 'sortOrder',
        type: 'number',
        defaultValue: 0,
        admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
      },
      slugField('title'),
      seoField,
    ],
  }
}

export const ProductCategories = createCategoryCollection(
  'product-categories',
  'Product category',
)
export const ProjectCategories = createCategoryCollection(
  'project-categories',
  'Project category',
)
export const ArticleCategories = createCategoryCollection(
  'article-categories',
  'Article category',
)
