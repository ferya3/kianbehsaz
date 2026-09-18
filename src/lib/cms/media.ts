import type { Media } from '@/payload-types'
import { absoluteMediaUrl, mediaUrl } from '@/lib/utils/url'

export type ResolvedMedia = {
  url: string
  alt: string
  width?: number
  height?: number
}

type MediaField = number | Media | null | undefined

/**
 * Payload returns an upload field as either the related document (when the
 * query used `depth > 0`) or just its id. Everything that renders an image goes
 * through here so a missing relation degrades to `null` instead of throwing.
 */
export function resolveMedia(
  value: MediaField,
  size?: 'thumbnail' | 'card' | 'wide' | 'og',
): ResolvedMedia | null {
  if (!value || typeof value !== 'object') return null

  const sized = size ? value.sizes?.[size] : undefined
  const url = mediaUrl(sized?.url ?? value.url)
  if (!url) return null

  return {
    url,
    alt: value.alt ?? '',
    width: sized?.width ?? value.width ?? undefined,
    height: sized?.height ?? value.height ?? undefined,
  }
}

/**
 * The same image as an absolute URL, for OpenGraph and JSON-LD — which are
 * read off-site, where the relative path `resolveMedia` returns is useless.
 */
export function ogImageUrl(value: MediaField): string | undefined {
  const resolved = resolveMedia(value, 'og') ?? resolveMedia(value)
  return absoluteMediaUrl(resolved?.url)
}
