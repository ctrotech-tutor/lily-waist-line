'use server'

import { getCurrentUser } from '@/lib/auth/guards'
import prisma from '@/lib/prisma'
import { releaseOrderInventory } from '@/lib/services/inventory-reservations'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
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

    const data = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | null,
    }

    const validatedData = updateProfileSchema.parse(data)

    // Check if email is being changed and if it's already taken
    if (validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })
      if (existingUser) {
        return { success: false, error: 'Email already in use' }
      }
    }

    // Update user in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
      }
    })

    // Note: Email change in Supabase Auth would require additional flow
    // For now, we only update the Prisma record
    // In a full implementation, you would:
    // 1. Send verification email to new email
    // 2. Update Supabase auth email
    // 3. Sync with Prisma

    revalidatePath('/account')

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
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
 * Delete user account
 * Requires password confirmation and ownership validation
 */
export async function deleteAccount(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = {
      password: formData.get('password') as string,
    }

    const validatedData = deleteAccountSchema.parse(data)

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: validatedData.password,
    })

    if (signInError) {
      return { success: false, error: 'Password is incorrect' }
    }

    const deletion = await prisma.$transaction(async (tx) => {
      // Checkout takes a shared lock on this row; the exclusive lock prevents a
      // new order from being created between this check and the cascade delete.
      const lockedUser = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR UPDATE
      `
      if (lockedUser.length === 0) return { deleted: false, reason: 'NOT_FOUND' as const }

      const activeOrders = await tx.order.count({
        where: {
          userId: user.id,
          fulfillmentStatus: { not: 'DELIVERED' },
          paymentStatus: 'PAID',
        },
      })
      if (activeOrders > 0) return { deleted: false, reason: 'ACTIVE_ORDERS' as const }

      const outstandingReservations = await tx.order.findMany({
        where: {
          userId: user.id,
          inventoryReservedAt: { not: null },
          inventoryCommittedAt: null,
          inventoryReleasedAt: null,
        },
        select: { id: true },
      })
      for (const order of outstandingReservations) {
        await releaseOrderInventory(tx, order.id)
      }

      await tx.user.delete({ where: { id: user.id } })
      return { deleted: true as const }
    })

    if (!deletion.deleted) {
      if (deletion.reason === 'ACTIVE_ORDERS') {
        return {
          success: false,
          error: 'Cannot delete account with active orders. Please complete or cancel your orders first.',
        }
      }
      return { success: false, error: 'Account not found' }
    }

    // Delete user from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id
    )

    if (deleteError) {
      console.error('Error deleting Supabase user:', deleteError)
      // Continue even if Supabase deletion fails - Prisma data is deleted
    }

    // Sign out user
    await supabase.auth.signOut()

    return { success: true }
  } catch (error) {
    console.error('Error deleting account:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to delete account' }
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
