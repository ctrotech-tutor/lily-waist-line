'use server'

import { getCurrentUser } from '@/lib/auth/guards'

export async function getCurrentUserAction() {
  return await getCurrentUser()
}