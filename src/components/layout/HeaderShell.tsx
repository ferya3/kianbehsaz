'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils/cn'

/**
 * Fixed header that is invisible over the hero and materialises on scroll.
 *
 * The scroll listener is passive and only ever flips one boolean, so it does
 * no work per frame beyond a comparison — the visual change is a CSS
 * transition, not a JS animation.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled((current) => {
        const next = window.scrollY > 64
        return next === current ? current : next
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500',
        scrolled
          ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container
        className={cn(
          'flex items-center justify-between transition-[height] duration-500',
          scrolled ? 'h-16' : 'h-24',
        )}
      >
        {children}
      </Container>
    </header>
  )
}
