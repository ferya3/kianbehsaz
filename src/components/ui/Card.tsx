import type { ReactNode } from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

export function Card({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border border-brand-100 bg-surface shadow-card',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * The card used by products, projects and articles alike. One component means
 * the three listings stay visually identical as the site grows.
 */
export function MediaCard({
  href,
  title,
  description,
  imageUrl,
  imageAlt,
  meta,
  badge,
  priority = false,
}: {
  href: string
  title: string
  description?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  meta?: ReactNode
  badge?: string | null
  priority?: boolean
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-card border border-brand-100 bg-surface shadow-card transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-brand-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {badge ? (
          <span className="absolute top-3 inline-block rounded-pill bg-brand-950/80 px-3 py-1 text-xs text-white start-3">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-700">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 line-clamp-3 text-sm text-brand-600">{description}</p>
        ) : null}
        {meta ? <div className="mt-4 text-sm text-brand-500">{meta}</div> : null}
      </div>
    </Link>
  )
}
