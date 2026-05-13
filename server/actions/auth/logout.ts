'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logout() {
  try {
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
    
    // Redirect to login page
    redirect('/login')

  } catch (error) {
    console.error('Logout error:', error)
    // Still redirect to login page even on error
    redirect('/login')
  }
}
