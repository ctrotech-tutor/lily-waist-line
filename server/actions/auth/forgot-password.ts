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

    // Send custom password reset email (non-blocking)
    sendCustomPasswordResetEmail(firstName, validatedData.email)

    revalidatePath('/forgot-password')

    return {
      success: true,
      message: 'If an account with this email exists, you will receive password reset instructions.',
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}
