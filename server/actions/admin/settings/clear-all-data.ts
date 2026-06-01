'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function clearAllStoreData() {
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

    await prisma.$transaction([
      prisma.paymentProof.deleteMany(),
      prisma.shipment.deleteMany(),
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.cartItem.deleteMany(),
      prisma.wishlistItem.deleteMany(),
      prisma.address.deleteMany(),
      prisma.productImage.deleteMany(),
      prisma.productVariant.deleteMany(),
      prisma.product.deleteMany(),
      prisma.user.deleteMany({ where: { role: 'CUSTOMER' } }),
    ])

    revalidatePath('/admin')
    return { success: true as const }
  } catch (error) {
    console.error('Error clearing store data:', error)
    return { success: false as const, error: 'Failed to clear store data' }
  }
}