import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { serverEnv } from '../env'

const isProduction = process.env.NODE_ENV === 'production'

const defaultCookieOptions = isProduction
  ? { domain: '.lilywaistline.com', path: '/', sameSite: 'lax' as const }
  : { path: '/' }

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...defaultCookieOptions, ...options })
          )
        },
      },
    }
  )
}
