'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

export type IndexRow = {
  id: number
  title: string
  href: string
  imageUrl?: string
  imageAlt?: string
  meta: string[]
}

/**
 * Projects as an index of rules, not a grid of cards.
 *
 * On a pointer device, hovering a row fades its image in behind the list —
 * the list stays the interface and the photography becomes atmosphere. On
 * touch, where there is no hover, each row shows its own thumbnail inline
 * instead, so nothing is hidden behind an interaction that cannot happen.
 */
export function ProjectIndex({ rows, label }: { rows: IndexRow[]; label: string }) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const reduce = useReducedMotion()

  const active = rows.find((row) => row.id === activeId) ?? null

  return (
    <div className="relative">
      {/* Backdrop preview: desktop only, and inert. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <AnimatePresence mode="wait">
          {active?.imageUrl ? (
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={active.imageUrl}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/85" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ul className="relative" onMouseLeave={() => setActiveId(null)}>
        {rows.map((row, index) => (
          <li key={row.id} className="rule-hairline last:border-b last:border-white/10">
            <Link
              href={row.href}
              onMouseEnter={() => setActiveId(row.id)}
              onFocus={() => setActiveId(row.id)}
              className="group grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 py-6 lg:grid-cols-[auto_1fr_auto] lg:py-9"
            >
              <span
                className={cn(
                  'label-mono transition-colors',
                  activeId === row.id ? 'text-ember-400' : '',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3
                className={cn(
                  'text-[clamp(1.5rem,3.4vw,3rem)] leading-tight font-semibold transition-colors duration-300',
                  activeId === row.id ? 'text-ink-50' : 'text-ink-300',
                )}
              >
                {row.title}
              </h3>

              {/* Inline thumbnail: the touch-device stand-in for hover. */}
              {row.imageUrl ? (
                <div className="relative col-span-2 aspect-16/9 overflow-hidden bg-ink-800 lg:hidden">
                  <Image
                    src={row.imageUrl}
                    alt={row.imageAlt ?? ''}
                    fill
                    sizes="92vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="col-span-2 flex items-center gap-6 lg:col-span-1 lg:justify-end">
                {row.meta.map((item) => (
                  <span key={item} className="label-mono whitespace-nowrap">
                    {item}
                  </span>
                ))}
                <span
                  aria-hidden="true"
                  className="text-ink-500 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-ink-50 rtl:rotate-180 rtl:group-hover:translate-x-1"
                >
                  ←
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <span className="sr-only">{label}</span>
    </div>
  )
}
