'use server'

import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators/auth'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { sendCustomPasswordResetEmail } from '@/lib/services/email/email-triggers'

export async function forgotPassword(formData: ForgotPasswordFormData) {
  try {
    const validatedData = forgotPasswordSchema.parse(formData)

    // Look up user to get their first name
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { fullName: true },
    })

    const firstName = user ? user.fullName.split(' ')[0] || 'there' : 'there'

    // Keep the response generic and non-blocking to avoid an account-existence timing signal.
    void sendCustomPasswordResetEmail(firstName, validatedData.email)

    revalidatePath('/forgot-password')

    return {
      success: true,
      message: 'If an account exists, reset instructions may take a few minutes. Check spam or contact support if they do not arrive.',
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}
