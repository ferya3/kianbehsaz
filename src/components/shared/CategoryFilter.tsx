import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

export type FilterOption = { label: string; href: string; active: boolean }

/**
 * Category filters are links, not client-side state: each filtered listing has
 * its own URL, so it can be indexed, linked and cached like any other page.
 */
export function CategoryFilter({
  label,
  options,
}: {
  label: string
  options: FilterOption[]
}) {
  if (options.length <= 1) return null

  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              aria-current={option.active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center border px-4 py-2 text-sm font-medium transition-colors',
                option.active
                  ? 'border-ink-50 bg-ink-50 text-ink-950'
                  : 'border-white/15 text-ink-300 hover:border-white/50 hover:text-ink-50',
              )}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
