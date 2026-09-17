type ClassValue = string | number | null | undefined | false | ClassValue[]

/**
 * Join class names. Deliberately dependency-free — the components in this
 * project compose fixed variant strings, so full Tailwind conflict resolution
 * (tailwind-merge) would be weight we never use.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = []

  for (const value of values) {
    if (!value) continue
    if (Array.isArray(value)) {
      const nested = cn(...value)
      if (nested) out.push(nested)
    } else {
      out.push(String(value))
    }
  }

  return out.join(' ')
}
