'use server'

import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators/auth'
import { revalidatePath } from 'next/cache'
import { sendPasswordResetConfirmationEmail } from '@/lib/services/email/email-triggers'
import prisma from '@/lib/prisma'

export async function resetPassword(formData: ResetPasswordFormData) {
  try {
    const validatedData = resetPasswordSchema.parse(formData)

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Invalid or expired reset session. Please request a new password reset.',
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.password,
    })

    if (updateError) {
      console.error('Reset password error:', updateError)
      return {
        success: false,
        error: 'Failed to update password. Please try again.',
      }
    }

    // Send password reset confirmation email (non-blocking)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { fullName: true },
    })
    const firstName = dbUser ? dbUser.fullName.split(' ')[0] || 'there' : 'there'
    sendPasswordResetConfirmationEmail(firstName, user.email!)

    revalidatePath('/reset-password')

    return {
      success: true,
      message: 'Password updated successfully. You can now sign in with your new password.',
    }

  } catch (error) {
    console.error('Reset password error:', error)

    if (error instanceof Error && error.message.includes('Passwords do not match')) {
      return {
        success: false,
        error: 'Passwords do not match',
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}
