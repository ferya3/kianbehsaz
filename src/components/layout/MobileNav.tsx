'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { LocaleSwitcher } from './LocaleSwitcher'

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)

  // Navigating must close the panel; otherwise the overlay stays over the new
  // page, because this component never unmounts. Adjusting the state during
  // render (rather than in an effect) avoids painting the stale open panel
  // once before closing it.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t('close') : t('menu')}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-brand-200 text-brand-800"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={`absolute inset-x-0 top-0 h-0.5 bg-current transition-transform ${
              open ? 'translate-y-1.5 rotate-45' : ''
            }`}
          />
          <span
            className={`absolute inset-x-0 top-1.5 h-0.5 bg-current transition-opacity ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`absolute inset-x-0 top-3 h-0.5 bg-current transition-transform ${
              open ? '-translate-y-1.5 -rotate-45' : ''
            }`}
          />
        </span>
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto border-t border-brand-100 bg-surface px-4 py-6"
        >
          <nav aria-label={t('menu')}>
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-card px-4 py-3 text-base font-medium text-brand-800 hover:bg-brand-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 border-t border-brand-100 pt-6">
            <LocaleSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  )
}
