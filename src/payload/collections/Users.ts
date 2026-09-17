import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, authenticated, canUseAdminPanel } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'System',
  },
  access: {
    // Only admins manage accounts; editors can still read the list so that
    // "author" relationships render a name instead of an id.
    create: adminOnly,
    read: authenticated,
    update: adminOnly,
    delete: adminOnly,
    admin: canUseAdminPanel,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // An editor must not be able to promote themselves.
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
