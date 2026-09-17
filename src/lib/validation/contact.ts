import { z } from 'zod'

/**
 * Error messages are *keys* into the `Validation` namespace of `messages/`,
 * not sentences. The same schema then validates on the server (where there is
 * no request locale yet) and in the browser (where the key is translated).
 */
const phonePattern = /^[+\d][\d\s()-]{6,19}$/

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'nameMin').max(120, 'nameMax'),
  email: z.email('emailInvalid').max(180),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, 'phoneInvalid')
    .max(24)
    .optional()
    .or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'subjectMin').max(160),
  message: z.string().trim().min(10, 'messageMin').max(4000, 'messageMax'),
  locale: z.enum(['fa', 'en', 'ar']),
  /**
   * Honeypot. Accepted by the schema whatever it contains — the route checks
   * it separately and answers 200 without storing anything, so a bot learns
   * nothing from the response about why its submission vanished.
   */
  website: z.string().max(200).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export const newsletterSchema = z.object({
  email: z.email('emailInvalid').max(180),
  locale: z.enum(['fa', 'en', 'ar']),
  /** Honeypot; see the note on `contactSchema`. */
  website: z.string().max(200).optional(),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

/** Flatten Zod issues into `{ field: messageKey }` for the form to render. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && !errors[field]) {
      errors[field] = issue.message
    }
  }

  return errors
}
