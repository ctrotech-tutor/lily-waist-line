'use server'

import { createClient } from '@/lib/supabase/server'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators/auth'
import { revalidatePath } from 'next/cache'

export async function forgotPassword(formData: ForgotPasswordFormData) {
  try {
    // Validate input
    const validatedData = forgotPasswordSchema.parse(formData)

    // Create Supabase client
    const supabase = await createClient()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      }
    )

    if (error) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        error: 'Failed to send reset email. Please try again.'
      }
    }

    // Always return success to avoid email enumeration attacks
    revalidatePath('/forgot-password')
    
    return {
      success: true,
      message: 'If an account with this email exists, you will receive password reset instructions.'
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
