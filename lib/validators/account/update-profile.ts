import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().max(32, 'Phone number is too long').optional(),
})

/** Email changes must be confirmed by the auth provider before Prisma is updated. */
export function isLoginEmailUnchanged(currentEmail: string, requestedEmail: string): boolean {
  return currentEmail.trim().toLowerCase() === requestedEmail.trim().toLowerCase()
}
