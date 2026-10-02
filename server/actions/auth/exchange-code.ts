'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { syncUserRoleToAuth } from '@/lib/auth/sync-role'

export async function exchangeCode(code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data?.user) {
      console.error('Auth code exchange error:', error?.message)
      return { success: false as const, error: 'Failed to authenticate.' }
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

    await prisma.user.upsert({
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

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true }
    })
    const role = dbUser?.role ?? 'CUSTOMER'
    await syncUserRoleToAuth(authUser.id, role)

    return { success: true as const }
  } catch (error) {
    console.error('exchangeCode error:', error)
    return { success: false as const, error: 'An unexpected error occurred.' }
  }
}