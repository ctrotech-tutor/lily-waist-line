'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { AdminService } from '@/lib/services/admin-service'
import { expireReservationForOrder } from '@/lib/services/inventory-reservations'
import { z } from 'zod'
import { tryAction } from '@/lib/security/error-handling'

const getOrderByIdSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
})

export const getOrderById = tryAction(async (input: z.infer<typeof getOrderByIdSchema>) => {
  const { orderId } = getOrderByIdSchema.parse(input)

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    throw new Error('Access denied. Admin access required.')
  }

  await expireReservationForOrder(orderId)
  const order = await AdminService.getOrderById(orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.paymentProofs && order.paymentProofs.length > 0) {
    const supabase = await createClient()
    order.paymentProofs = await Promise.all(
      order.paymentProofs.map(async (proof) => {
        const { data: signedUrl } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(proof.imageUrl, 60 * 60 * 24 * 7)
        return {
          ...proof,
          imageUrl: signedUrl?.signedUrl || proof.imageUrl,
        }
      })
    )
  }

  return order
})