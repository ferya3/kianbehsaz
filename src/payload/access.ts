import type { Access, FieldAccess } from 'payload'

export type UserRole = 'admin' | 'editor'

function roleOf(user: unknown): UserRole | undefined {
  if (user && typeof user === 'object' && 'role' in user) {
    const role = (user as { role?: unknown }).role
    if (role === 'admin' || role === 'editor') return role
  }
  return undefined
}

/** Anyone may read; used together with a published-status filter. */
export const anyone: Access = () => true

/** Any signed-in CMS user (admin or editor). */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Same rule, but typed as a plain predicate — `admin.access` only accepts a
 * boolean, never a query constraint.
 */
export const canUseAdminPanel = ({ req }: { req: { user?: unknown } }): boolean =>
  Boolean(req.user)

/** Admins only. */
export const adminOnly: Access = ({ req }) => roleOf(req.user) === 'admin'

export const adminOnlyField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'

/**
 * Public reads are limited to published documents; signed-in users see drafts
 * too, which is what makes the admin panel's preview work.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return {
    status: { equals: 'published' },
  }
}
