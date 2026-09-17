import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

const control =
  'w-full rounded-card border border-brand-200 bg-surface px-4 py-3 text-brand-900 ' +
  'placeholder:text-brand-400 focus:border-accent-500 focus:outline-none ' +
  'focus:ring-2 focus:ring-accent-500/25 disabled:bg-brand-50 aria-invalid:border-accent-600'

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-brand-800">
        {label}
        {required ? <span className="text-accent-600"> *</span> : null}
        {hint ? <span className="ms-1 text-xs font-normal text-brand-400">({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-accent-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-36 resize-y', className)} {...props} />
}

/**
 * A hidden field that real users never fill in. Requests that arrive with it
 * populated are dropped server-side — cheap spam filtering that costs no
 * third-party script and no accessibility trade-off.
 */
export function Honeypot({ name = 'website' }: { name?: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={name}>Leave this field empty</label>
      <input id={name} name={name} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
