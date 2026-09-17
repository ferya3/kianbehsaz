/**
 * Renders a JSON-LD block.
 *
 * The payload is serialised with `JSON.stringify` and the `<` character is
 * escaped, which is what prevents CMS text containing `</script>` from
 * breaking out of the tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  )
}
