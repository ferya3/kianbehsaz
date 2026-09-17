import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: adminOnly },
  hooks: { afterChange: [revalidateGlobal('site-settings')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'siteName', type: 'text', localized: true, required: true },
            { name: 'tagline', type: 'text', localized: true },
            {
              name: 'defaultSeoDescription',
              type: 'textarea',
              localized: true,
              maxLength: 180,
              admin: { description: 'Used when a page has no description of its own.' },
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Fallback OpenGraph image, ideally 1200×630.' },
            },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'address', type: 'textarea', localized: true },
            {
              name: 'phones',
              type: 'array',
              labels: { singular: 'Phone', plural: 'Phones' },
              fields: [
                { name: 'label', type: 'text', localized: true },
                { name: 'number', type: 'text', required: true },
              ],
            },
            {
              name: 'emails',
              type: 'array',
              labels: { singular: 'Email', plural: 'Emails' },
              fields: [
                { name: 'label', type: 'text', localized: true },
                { name: 'address', type: 'email', required: true },
              ],
            },
            { name: 'openingHours', type: 'text', localized: true },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              admin: { description: 'Optional map iframe URL shown on the contact page.' },
            },
            {
              name: 'notificationEmail',
              type: 'email',
              admin: { description: 'Where contact form notifications are sent.' },
            },
          ],
        },
        {
          label: 'Social & stats',
          fields: [
            {
              name: 'social',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Profiles' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: ['linkedin', 'instagram', 'telegram', 'youtube', 'x', 'aparat'],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Statistic', plural: 'Statistics' },
              admin: { description: 'The four numbers shown on the homepage.' },
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
