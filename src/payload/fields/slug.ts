import type { Field } from 'payload'

/** Turn an arbitrary title into a URL-safe slug, preserving Persian/Arabic letters. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    // Keep latin letters, digits, hyphens and the Arabic/Persian block.
    .replace(/[^a-z0-9؀-ۿ-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * A slug field that auto-fills from another field when left empty.
 *
 * The slug is intentionally NOT localised: one document keeps one URL segment
 * across all three languages, so `/fa/products/brick-x`, `/en/products/brick-x`
 * and `/ar/products/brick-x` are the same document and can be linked with
 * `hreflang` without a translation table.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL segment. Shared across all languages.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = (data as Record<string, unknown> | undefined)?.[sourceField]
        if (typeof source === 'string' && source.length > 0) return slugify(source)
        return value
      },
    ],
  },
})
