'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { AdminService } from '@/lib/services/admin-service'
import { z } from 'zod'
import { tryAction } from '@/lib/security/error-handling'

const getCustomerByIdSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
})

export type GetCustomerByIdInput = z.infer<typeof getCustomerByIdSchema>

export const getCustomerById = tryAction(async (input: GetCustomerByIdInput) => {
  const { customerId } = getCustomerByIdSchema.parse(input)

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

  const customer = await AdminService.getCustomerById(customerId)

  if (!customer) {
    throw new Error('Customer not found')
  }

  return customer
})