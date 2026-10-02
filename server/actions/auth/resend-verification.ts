'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendCustomVerificationEmail } from '@/lib/services/email/email-triggers'
import prisma from '@/lib/prisma'

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function resendVerification(formData: { email: string }) {
  try {
    const validatedData = resendVerificationSchema.parse(formData)

    // Get user's first name for personalization
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { fullName: true },
    })

    const firstName = user ? user.fullName.split(' ')[0] || 'there' : 'there'

    // Send custom verification email with our branded template
    sendCustomVerificationEmail(firstName, validatedData.email)

    revalidatePath('/verify-email')

    return {
      success: true,
      message: 'If an account with this email exists, a verification email has been sent.',
    }

  } catch (error) {
    console.error('Resend verification error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}