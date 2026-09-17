import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Next 16 asks for a cache-life profile alongside the tag. `max` is correct
 * here: content stays cached until an editor changes it, and this hook is the
 * thing that says it changed.
 */
const PROFILE = 'max'

/**
 * `revalidateTag` needs Next's request store, which only exists when Payload
 * is running inside the Next.js server. The same hooks also fire from the CLI
 * (`payload run`, migrations, seeding), where there is no cache to purge and
 * throwing here would abort the write itself.
 */
function purge(...tags: string[]) {
  try {
    for (const tag of tags) revalidateTag(tag, PROFILE)
  } catch {
    // Running outside a Next.js request — nothing is cached yet.
  }
}

/**
 * Because Payload runs inside the same Next.js process, an editor's save can
 * purge the front-end cache directly — no webhook, no shared secret, no delay
 * window where the site still shows the previous revision.
 */
export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc }) => {
    purge(tag, 'sitemap')
    return doc
  }

export const revalidateCollectionOnDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    purge(tag, 'sitemap')
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    purge(tag)
    return doc
  }
