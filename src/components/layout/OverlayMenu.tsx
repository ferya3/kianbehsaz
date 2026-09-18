'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { Container } from '@/components/ui/Container'
import { LocaleSwitcher } from './LocaleSwitcher'

type Item = { href: string; label: string; index: string }

/**
 * Full-screen navigation index.
 *
 * Portalled into <body> rather than rendered inside the header: the header
 * carries `backdrop-blur`, and an element with a backdrop-filter becomes the
 * containing block for its `fixed` descendants, which would size this panel
 * against the header bar instead of the viewport.
 */
export function OverlayMenu({
  items,
  siteName,
  tagline,
}: {
  items: Item[]
  siteName: string
  tagline: string
}) {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const reduce = useReducedMotion()

  const [open, setOpen] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)

  // Resolved once: null while server rendering, <body> from the first client
  // render onward. AnimatePresence has to stay mounted for the exit animation,
  // so the portal cannot be created lazily on open.
  const [portalTarget] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : document.body,
  )

  // Navigating closes the index. Adjusting during render rather than in an
  // effect avoids painting the stale open panel once before closing it.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const panel = (
    <motion.div
      id="site-index"
      className="fixed inset-0 z-[60] flex flex-col bg-ink-950"
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <Container className="flex h-24 shrink-0 items-center justify-between">
        <span className="font-display text-lg font-semibold text-ink-50">{siteName}</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="label-mono text-ink-300 transition-colors hover:text-ink-50"
        >
          {t('close')} ✕
        </button>
      </Container>

      <Container className="flex flex-1 flex-col justify-center overflow-y-auto py-10">
        <nav aria-label={t('menu')}>
          <ul>
            {items.map((item, i) => (
              <li key={item.href} className="rule-hairline">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.16 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-baseline gap-6 py-3 transition-colors md:py-4"
                  >
                    <span className="label-mono w-8 shrink-0 transition-colors group-hover:text-ember-400">
                      {item.index}
                    </span>
                    <span className="font-display text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[1.15] font-semibold text-ink-200 transition-colors group-hover:text-ink-50">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="rule-hairline flex shrink-0 flex-wrap items-center justify-between gap-4 py-6">
        <p className="text-sm text-ink-400">{tagline}</p>
        <LocaleSwitcher />
      </Container>
    </motion.div>
  )

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-index"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 text-ink-50"
      >
        <span className="label-mono text-ink-200 transition-colors group-hover:text-ink-50">
          {t('menu')}
        </span>
        <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
          <span className="block h-px w-full bg-current" />
          <span className="block h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </button>

      {portalTarget
        ? createPortal(<AnimatePresence>{open ? panel : null}</AnimatePresence>, portalTarget)
        : null}
    </>
  )
}
