'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Built on the native <dialog> element: focus trapping, Escape handling and
 * inertness of the background come from the platform rather than from a
 * dependency.
 */
export function Modal({
  open,
  onClose,
  label,
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClick={(event) => {
        // Clicking the backdrop resolves to the dialog element itself.
        if (event.target === ref.current) onClose()
      }}
      className={cn(
        'w-[min(48rem,92vw)] rounded-card p-0 shadow-raised backdrop:bg-brand-950/70',
        className,
      )}
    >
      {children}
    </dialog>
  )
}
