'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function resetSystem() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false as const, error: 'Unauthorized' }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false as const, error: 'Access denied. Admin access required.' }
    }

    await prisma.paymentConfiguration.deleteMany()

    await prisma.paymentConfiguration.createMany({
      data: [
        { paymentMethod: 'CASH_APP', enabled: false },
        { paymentMethod: 'PAYPAL', enabled: false },
      ],
    })

    revalidatePath('/admin/settings')
    return { success: true as const }
  } catch (error) {
    console.error('Error resetting system:', error)
    return { success: false as const, error: 'Failed to reset system settings' }
  }
}