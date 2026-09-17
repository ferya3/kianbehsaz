import type { Field } from 'payload'

/**
 * Publication status.
 *
 * Kept as an explicit field rather than relying only on Payload's draft system
 * so that the public data layer can filter on it in a single query, and so an
 * editor can unpublish a document without deleting it.
 */
export const statusField: Field = {
  name: 'status',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  index: true,
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  admin: { position: 'sidebar' },
}

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  index: true,
  admin: {
    position: 'sidebar',
    date: { pickerAppearance: 'dayAndTime' },
  },
  hooks: {
    beforeChange: [
      ({ value, data }) => {
        const status = (data as Record<string, unknown> | undefined)?.status
        if (status === 'published' && !value) return new Date()
        return value
      },
    ],
  },
}
