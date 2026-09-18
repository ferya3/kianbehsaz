export type SpecRow = { label: string; value: string; unit?: string | null }

/**
 * A two- or three-column specification table. Rendered as a real `<table>`
 * rather than a definition list so it stays readable when copied into an email
 * or a tender document, which is what these numbers are usually for.
 */
export function SpecTable({
  rows,
  labels,
}: {
  rows: SpecRow[]
  labels: { property: string; value: string; unit: string }
}) {
  if (!rows.length) return null

  const hasUnits = rows.some((row) => row.unit)

  return (
    <div className="overflow-x-auto border-t border-white/10">
      <table className="tabular w-full text-start text-sm">
        <thead className="text-ink-500">
          <tr>
            <th scope="col" className="label-mono py-3 pe-6 text-start">
              {labels.property}
            </th>
            <th scope="col" className="label-mono py-3 pe-6 text-start">
              {labels.value}
            </th>
            {hasUnits ? (
              <th scope="col" className="label-mono py-3 pe-6 text-start">
                {labels.unit}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, index) => (
            <tr key={`${row.label}-${index}`}>
              <th scope="row" className="py-4 pe-6 text-start font-medium text-ink-200">
                {row.label}
              </th>
              <td className="py-4 pe-6 font-mono text-ink-50">{row.value}</td>
              {hasUnits ? (
                <td className="py-4 font-mono text-ink-500" dir="ltr">
                  {row.unit ?? '—'}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
