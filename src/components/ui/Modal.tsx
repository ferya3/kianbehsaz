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
        'w-[min(64rem,94vw)] bg-ink-950 p-0 text-ink-100 backdrop:bg-ink-950/90 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </dialog>
  )
}
