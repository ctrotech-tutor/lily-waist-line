'use server'

import { createClient } from '@/lib/supabase/server'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators/auth'
import { revalidatePath } from 'next/cache'

export async function resendVerification(formData: ForgotPasswordFormData) {
  try {
    // Validate input
    const validatedData = forgotPasswordSchema.parse(formData)

    // Create Supabase client
    const supabase = await createClient()

    // Try to reset password for the email - this will send verification if needed
    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      }
    )

    if (error) {
      console.error('Resend verification error:', error)
      // Don't reveal specific errors for security
      return {
        success: true,
        message: 'If an account with this email exists, you will receive a verification email.'
      }
    }

    revalidatePath('/verify-email')
    
    return {
      success: true,
      message: 'If an account with this email exists, you will receive a verification email.'
    }

  } catch (error) {
    console.error('Resend verification error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
