import { createClient } from '@/lib/supabase/server'
import { AdminService, AdminOrderFilters } from '@/lib/services/admin-service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Input validation schema
const getAllOrdersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'REJECTED']).optional(),
  fulfillmentStatus: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
})

export async function getAllOrders(input: z.infer<typeof getAllOrdersSchema>) {
  try {
    // Validate input
    const { page, limit, search, paymentStatus, fulfillmentStatus } = getAllOrdersSchema.parse(input)
    
    const supabase = await createClient()
    
    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'ADMIN') {
      throw new Error('Access denied. Admin access required.')
    }

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

  } catch (error) {
    console.error('Error in getAllOrders:', error)
    throw error
  }
}
