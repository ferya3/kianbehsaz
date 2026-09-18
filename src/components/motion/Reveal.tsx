'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * The site's one entrance animation.
 *
 * Content is never hidden by it on the server — Framer sets the initial style
 * after hydration, so crawlers and no-JS visitors get the finished page. It is
 * skipped entirely under `prefers-reduced-motion`, and nothing above the fold
 * uses it, so it cannot touch LCP.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Display headings arrive one line at a time, each sliding up from behind a
 * hard edge — the difference between "animated" and "directed".
 *
 * The `whileInView` trigger has to sit on the *outer* element, not on the line
 * itself. An IntersectionObserver clips against ancestor overflow, and a line
 * parked at `y: 110%` is entirely outside its own `overflow-hidden` mask — so
 * a trigger on the line would wait for an intersection that its own initial
 * state prevents, and the heading would never appear. The unclipped wrapper
 * fires, and the lines follow it as variants.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((line, index) => (
          <span key={line + index} className={`block ${lineClassName ?? ''}`}>
            {line}
          </span>
        ))}
      </span>
    )
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {lines.map((line, index) => (
        <span key={line + index} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            variants={{ hidden: { y: '110%' }, visible: { y: '0%' } }}
            transition={{
              duration: 0.9,
              delay: delay + index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
