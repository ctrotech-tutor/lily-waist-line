'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { tryAction } from '@/lib/security/error-handling'

export async function logout() {
  await tryAction(async () => {
    // Create Supabase client
    const supabase = await createClient()

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      // Continue with redirect even if signOut has issues
    }

    // Clear all cached data
    revalidatePath('/', 'layout')
  })()

  // Redirect to login page
  redirect('/login')
}
