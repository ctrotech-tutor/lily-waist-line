'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { AdminService } from '@/lib/services/admin-service'
import { z } from 'zod'
import { tryAction } from '@/lib/security/error-handling'

const getAllProductsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  stockFilter: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).optional(),
})

export type GetAllProductsInput = z.input<typeof getAllProductsSchema>

export const getAllProducts = tryAction(async (input: GetAllProductsInput = {}) => {
  const { page, limit, search, stockFilter } = getAllProductsSchema.parse(input)

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

  const result = await AdminService.getProducts(page, limit, search, stockFilter)

  return result
})