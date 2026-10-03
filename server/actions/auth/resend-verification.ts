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

    // Keep the response generic and non-blocking to avoid an account-existence timing signal.
    void sendCustomVerificationEmail(firstName, validatedData.email)

    revalidatePath('/verify-email')

    return {
      success: true,
      message: 'If an account exists, verification instructions will be sent when email service is available. Check spam or contact support if nothing arrives.',
    }

  } catch (error) {
    console.error('Resend verification error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}