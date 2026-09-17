import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/utils/cn'

/**
 * Renders Payload's Lexical output on the server.
 *
 * Using the official converter rather than an HTML string from the CMS keeps
 * the content out of `dangerouslySetInnerHTML` — editor input is turned into
 * React elements, so it cannot inject markup or script.
 */
export function RichText({
  data,
  className,
}: {
  data: SerializedEditorState | null | undefined
  className?: string
}) {
  if (!data) return null

  return <LexicalRichText data={data} className={cn('prose-content', className)} />
}
