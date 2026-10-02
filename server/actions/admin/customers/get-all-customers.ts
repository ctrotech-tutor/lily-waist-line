'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { AdminService } from '@/lib/services/admin-service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { tryAction } from '@/lib/security/error-handling'

const getAllCustomersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
})

export type GetAllCustomersInput = z.infer<typeof getAllCustomersSchema>

export const getAllCustomers = tryAction(async (input: GetAllCustomersInput) => {
  const { page, limit, search } = getAllCustomersSchema.parse(input)

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

  const result = await AdminService.getCustomers(page, limit, search)

  revalidatePath('/admin/customers')

  return result
})