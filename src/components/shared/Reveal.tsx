'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * A single, small entrance animation used across the site.
 *
 * Motion is a garnish here, not the point: the element is only nudged 16px and
 * the animation is skipped entirely for visitors who asked for reduced motion.
 * Nothing animates above the fold, so it cannot affect LCP.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
