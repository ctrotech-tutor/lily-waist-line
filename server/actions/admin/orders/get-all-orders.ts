'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { AdminService, AdminOrderFilters } from '@/lib/services/admin-service'
import { releaseExpiredInventoryReservations } from '@/lib/services/inventory-reservations'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { tryAction } from '@/lib/security/error-handling'

// Input validation schema
const getAllOrdersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'REJECTED']).optional(),
  fulfillmentStatus: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
})

export const getAllOrders = tryAction(async (input: z.infer<typeof getAllOrdersSchema>) => {
  // Validate input
  const { page, limit, search, paymentStatus, fulfillmentStatus } = getAllOrdersSchema.parse(input)
  
  const supabase = await createClient()
  
  // Check admin authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Get user role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    throw new Error('Access denied. Admin access required.')
  }

  await releaseExpiredInventoryReservations()

  // Use optimized admin service
  const filters: AdminOrderFilters = {
    page,
    limit,
    search,
    paymentStatus,
    fulfillmentStatus
  }

  const result = await AdminService.getAllOrders(filters)

  // Revalidate admin pages
  revalidatePath('/admin/orders')

  return result
})
