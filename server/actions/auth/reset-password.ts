'use server'

import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function resetPassword(formData: ResetPasswordFormData) {
  try {
    // Validate input
    const validatedData = resetPasswordSchema.parse(formData)

    // Create Supabase client
    const supabase = await createClient()

    // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Invalid or expired reset session. Please request a new password reset.'
      }
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.password
    })

    if (updateError) {
      console.error('Reset password error:', updateError)
      return {
        success: false,
        error: 'Failed to update password. Please try again.'
      }
    }

    revalidatePath('/reset-password')
    
    return {
      success: true,
      message: 'Password updated successfully. You can now sign in with your new password.'
    }

  } catch (error) {
    console.error('Reset password error:', error)
    
    if (error instanceof Error && error.message.includes('Passwords do not match')) {
      return {
        success: false,
        error: 'Passwords do not match'
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
