'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { syncUserRoleToAuth } from '@/lib/auth/sync-role'

export async function syncAuthUser() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return { success: false as const, error: 'No authenticated user found.' }
    }

    const authUser = data.user

    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      [authUser.user_metadata?.first_name, authUser.user_metadata?.last_name]
        .filter(Boolean)
        .join(' ') ||
      authUser.email?.split('@')[0] ||
      'User'

    const dbUser = await prisma.user.upsert({
      where: { id: authUser.id },
      update: {
        email: authUser.email!,
        emailVerified: !!authUser.email_confirmed_at,
        updatedAt: new Date(),
      },
      create: {
        id: authUser.id,
        email: authUser.email!,
        fullName,
        role: 'CUSTOMER',
        emailVerified: !!authUser.email_confirmed_at,
      },
    })

    await syncUserRoleToAuth(dbUser.id, dbUser.role as 'CUSTOMER' | 'ADMIN')

    return { success: true as const }
  } catch (error) {
    console.error('syncAuthUser error:', error)
    return { success: false as const, error: 'An unexpected error occurred.' }
  }
}