'use server'

import { getCurrentUser } from '@/lib/auth/guards'
import prisma from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateAvatar(url: string, storagePath: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Clean up old avatar from storage if it exists
    if (user.avatarStoragePath) {
      try {
        await supabaseAdmin.storage
          .from('user-avatars')
          .remove([user.avatarStoragePath])
      } catch (cleanupError) {
        console.error('Failed to clean up old avatar:', cleanupError)
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: url,
        avatarStoragePath: storagePath,
      },
    })

    revalidatePath('/account')

    return { success: true, avatarUrl: url }
  } catch (error) {
    console.error('Error updating avatar:', error)
    return { success: false, error: 'Failed to update avatar' }
  }
}

export async function deleteAvatar() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    if (user.avatarStoragePath) {
      try {
        await supabaseAdmin.storage
          .from('user-avatars')
          .remove([user.avatarStoragePath])
      } catch (cleanupError) {
        console.error('Failed to delete avatar from storage:', cleanupError)
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: null,
        avatarStoragePath: null,
      },
    })

    revalidatePath('/account')

    return { success: true }
  } catch (error) {
    console.error('Error deleting avatar:', error)
    return { success: false, error: 'Failed to delete avatar' }
  }
}