import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Inputs are a rule with text on it, not a box.
 *
 * On a dark page a bordered box reads as a hole; an underline keeps the form
 * feeling like part of the page and puts all the emphasis on what was typed.
 */
const control =
  'w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-ink-50 ' +
  'placeholder:text-ink-500 transition-colors focus:border-ember-400 focus:outline-none ' +
  'disabled:opacity-50 aria-invalid:border-ember-500'

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
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label-mono">
        {label}
        {required ? <span className="text-ember-400"> *</span> : null}
        {hint ? <span className="ms-2 normal-case text-ink-500">({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-ember-300">
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
  return <textarea className={cn(control, 'min-h-32 resize-y', className)} {...props} />
}

/**
 * A hidden field that real users never fill in. Requests that arrive with it
 * populated are answered 200 and dropped server-side — cheap spam filtering
 * that costs no third-party script and no accessibility trade-off.
 */
export function Honeypot({ name = 'website' }: { name?: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={name}>Leave this field empty</label>
      <input id={name} name={name} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
