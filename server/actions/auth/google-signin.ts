'use server'

import { createClient } from '@/lib/supabase/server'
import { getAppUrl } from '@/lib/utils/app-url'
import { redirect } from 'next/navigation'

export async function googleSignIn(redirectTo?: string) {
  const supabase = await createClient()
  const appUrl = getAppUrl()

  const callbackUrl = redirectTo
    ? `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${appUrl}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (error) {
    console.error('Google sign-in error:', error)
    return { success: false, error: 'Failed to sign in with Google.' }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { success: true }
}