import { supabaseAdmin } from '@/lib/supabase/admin'

export async function syncUserRoleToAuth(userId: string, role: 'CUSTOMER' | 'ADMIN') {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  })
  if (error) {
    console.error(`Failed to sync role to app_metadata for user ${userId}:`, error.message)
  }
}
