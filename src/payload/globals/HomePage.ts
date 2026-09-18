import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * The hero is fully editor-controlled — separate desktop and mobile assets,
 * both CTAs and the overlay strength — because it is the single element most
 * likely to be changed without a developer, and the one that decides LCP.
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('home-page')] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        {
          name: 'desktopMedia',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image or short MP4 used from the `md` breakpoint up.' },
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Always an image — never a video on mobile data.' },
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 40,
          admin: { description: 'Percentage of dark overlay, for text contrast.' },
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'href', type: 'text' },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'sections',
      type: 'group',
      label: 'Section visibility',
      admin: { description: 'Turn homepage sections on or off without a deploy.' },
      fields: [
        { name: 'showIntro', type: 'checkbox', defaultValue: true },
        { name: 'showStats', type: 'checkbox', defaultValue: true },
        { name: 'showProducts', type: 'checkbox', defaultValue: true },
        { name: 'showProjects', type: 'checkbox', defaultValue: true },
        { name: 'showProduction', type: 'checkbox', defaultValue: true },
        { name: 'showQuality', type: 'checkbox', defaultValue: true },
        { name: 'showSustainability', type: 'checkbox', defaultValue: true },
        { name: 'showArticles', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'intro',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
