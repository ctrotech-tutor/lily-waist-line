'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const toggleStatusSchema = z.object({
  productId: z.string().min(1),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
})

export async function toggleProductStatus(input: z.infer<typeof toggleStatusSchema>) {
  try {
    const { productId, status } = toggleStatusSchema.parse(input)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false as const, error: 'Unauthorized' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false as const, error: 'Access denied. Admin access required.' }
    }

    const existing = await prisma.product.findUnique({ where: { id: productId } })
    if (!existing) {
      return { success: false as const, error: 'Product not found' }
    }

    await prisma.product.update({
      where: { id: productId },
      data: { status }
    })

    revalidatePath('/admin/products')

    return { success: true as const, data: { id: productId, status } }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.issues[0]?.message || 'Invalid input' }
    }
    console.error('Toggle product status error:', error)
    return { success: false as const, error: 'Failed to update product status' }
  }
}