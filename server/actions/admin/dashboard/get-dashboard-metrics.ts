'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { AdminService } from '@/lib/services/admin-service'
import { tryAction } from '@/lib/security/error-handling'
import { formatOrderNumber } from '@/lib/utils/order'

export const getDashboardMetrics = tryAction(async () => {
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

  const metrics = await AdminService.getDashboardMetrics()

  return {
    ...metrics,
    recentOrders: metrics.recentOrders.map(order => ({
      id: order.id,
      orderNumber: formatOrderNumber(order.id, order.createdAt),
      customerName: order.user.fullName,
      customerEmail: order.user.email,
      amount: order.total,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      date: order.createdAt.toISOString().split('T')[0],
    }))
  }
})