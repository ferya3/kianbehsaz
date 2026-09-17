import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Careers: GlobalConfig = {
  slug: 'careers',
  label: 'Careers',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('careers')] },
  fields: [
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'applyEmail', type: 'email' },
    {
      name: 'positions',
      type: 'array',
      labels: { singular: 'Position', plural: 'Positions' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'department', type: 'text', localized: true },
        { name: 'location', type: 'text', localized: true },
        {
          name: 'employmentType',
          type: 'select',
          defaultValue: 'full-time',
          options: [
            { label: 'Full time', value: 'full-time' },
            { label: 'Part time', value: 'part-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Internship', value: 'internship' },
          ],
        },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'open', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
