import type { Field } from 'payload'

/**
 * Per-document SEO overrides.
 *
 * Every field is optional: `src/lib/seo` falls back to the document's own
 * title/excerpt and to the global site defaults when a field is left empty, so
 * editors only fill these in when they want to override something.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Leave empty to derive from the content itself.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      maxLength: 70,
      admin: { description: 'Overrides <title>. Aim for 50–60 characters.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      maxLength: 180,
      admin: { description: 'Overrides the meta description. Aim for 150–160 characters.' },
    },
    {
      name: 'keywords',
      type: 'text',
      localized: true,
      admin: { description: 'Comma separated. Low weight for ranking; used sparingly.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'OpenGraph image. Falls back to the cover image.' },
    },
    {
      name: 'canonical',
      type: 'text',
      admin: { description: 'Absolute URL. Only set when this page duplicates another.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Exclude from search engines and from the sitemap.' },
    },
  ],
}
