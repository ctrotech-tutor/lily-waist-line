'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function getAdminProfile() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false as const, error: 'Unauthorized' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false as const, error: 'Access denied' }
    }

    return {
      success: true as const,
      data: {
        fullName: dbUser.fullName,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl,
      },
    }
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return { success: false as const, error: 'Failed to fetch admin profile' }
  }
}