import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    // Generated once on upload so the front end never resizes at request time.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'wide', width: 1440, height: 810, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Describe the image for screen readers and for search engines. Required.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
    },
    {
      name: 'showInGallery',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Include this image on the public gallery page.',
      },
    },
    {
      name: 'galleryCategory',
      type: 'select',
      defaultValue: 'factory',
      options: [
        { label: 'Factory', value: 'factory' },
        { label: 'Products', value: 'products' },
        { label: 'Projects', value: 'projects' },
        { label: 'Team', value: 'team' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => Boolean(siblingData?.showInGallery),
      },
    },
  ],
}
