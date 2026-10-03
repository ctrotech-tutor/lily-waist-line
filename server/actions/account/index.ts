'use server'

import { getCurrentUser } from '@/lib/auth/guards'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { isLoginEmailUnchanged, updateProfileSchema } from '@/lib/validators/account/update-profile'
import { getAccountDeletionResult } from '@/lib/services/account/deletion-policy'

// Validation schemas

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

/**
 * Update user profile
 */
export async function updateProfile(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const validatedData = updateProfileSchema.parse({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone') ?? '',
    })

    if (!isLoginEmailUnchanged(user.email, validatedData.email)) {
      return {
        success: false,
        error: 'Login email changes require a verified auth flow. Contact support; your login email was not changed.',
      }
    }

    // Email stays unchanged until the auth provider has confirmed a dedicated email-change flow.
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: validatedData.fullName,
        phone: validatedData.phone || null,
      }
    })

    revalidatePath('/account')

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to update profile' }
  }
}

/**
 * Change user password
 */
export async function changePassword(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
    }

    const validatedData = changePasswordSchema.parse(data)

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: validatedData.currentPassword,
    })

    if (signInError) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.newPassword,
    })

    if (updateError) {
      return { success: false, error: 'Failed to update password' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error changing password:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to change password' }
  }
}

/**
 * Resend email verification
 */
export async function resendVerificationEmail() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Get live auth user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Already verified?
    if (user.email_confirmed_at) {
      return {
        success: false,
        error: 'Email already verified',
      }
    }

    const { error } =
      await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo:
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lily-waist-line.vercel.app'}/auth/callback`,
        },
      })

    if (error) {
      console.error(error)

      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error(
      'Resend verification error:',
      error
    )

    return {
      success: false,
      error: 'Failed to resend verification email',
    }
  }
}

/**
 * Self-service deletion stays fail-closed until Auth deletion and financial-record
 * retention are coordinated. Never cascade order history and then report success
 * when the Supabase Auth deletion may have failed.
 */
export async function deleteAccount() {
  try {
    const user = await getCurrentUser()
    return getAccountDeletionResult(Boolean(user))
  } catch (error) {
    console.error('Error preparing account deletion request:', error)
    return { success: false, error: 'Unable to process the deletion request. Please contact support.' }
  }
}

/**
 * Logout user
 */
export async function logout() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    await supabase.auth.signOut()
    return { success: true }
  } catch (error) {
    console.error('Error logging out:', error)
    return { success: false, error: 'Failed to logout' }
  }
}

/**
 * Get account statistics
 */
export async function getAccountStats() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return null
    }

    // Get counts in parallel for performance
    const [ordersCount, addressesCount, wishlistCount] = await Promise.all([
      prisma.order.count({
        where: { userId: user.id }
      }),
      prisma.address.count({
        where: { userId: user.id }
      }),
      prisma.wishlistItem.count({
        where: { userId: user.id }
      })
    ])

    return {
      ordersCount,
      addressesCount,
      wishlistCount,
    }
  } catch (error) {
    console.error('Error getting account stats:', error)
    return null
  }
}
