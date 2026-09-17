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
    <div className="overflow-x-auto rounded-card border border-brand-100">
      <table className="w-full text-start text-sm">
        <thead className="bg-surface-muted text-brand-600">
          <tr>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              {labels.property}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              {labels.value}
            </th>
            {hasUnits ? (
              <th scope="col" className="px-4 py-3 text-start font-medium">
                {labels.unit}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-100">
          {rows.map((row, index) => (
            <tr key={`${row.label}-${index}`}>
              <th scope="row" className="px-4 py-3 text-start font-medium text-brand-800">
                {row.label}
              </th>
              <td className="px-4 py-3 text-brand-700">{row.value}</td>
              {hasUnits ? (
                <td className="px-4 py-3 text-brand-500" dir="ltr">
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
