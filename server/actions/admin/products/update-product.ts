'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateProductSchema = z.object({
  productId: z.string().min(1),
  name: z.string().trim().min(1).max(200).optional(),
  shortDescription: z.string().trim().max(500).optional(),
  description: z.string().trim().max(10000).optional(),
  basePrice: z.number().min(0).optional(),
  compareAtPrice: z.number().min(0).nullable().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

export async function updateProduct(input: UpdateProductInput) {
  try {
    const validated = updateProductSchema.parse(input)

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

    const existing = await prisma.product.findUnique({
      where: { id: validated.productId }
    })

    if (!existing) {
      return { success: false as const, error: 'Product not found' }
    }

    const data: Record<string, unknown> = {}
    if (validated.name !== undefined) data.name = validated.name
    if (validated.shortDescription !== undefined) data.shortDescription = validated.shortDescription
    if (validated.description !== undefined) data.description = validated.description
    if (validated.basePrice !== undefined) data.basePrice = validated.basePrice
    if (validated.compareAtPrice !== undefined) data.compareAtPrice = validated.compareAtPrice
    if (validated.status !== undefined) data.status = validated.status

    const updated = await prisma.product.update({
      where: { id: validated.productId },
      data
    })

    revalidatePath('/admin/products')

    return {
      success: true as const,
      data: { id: updated.id }
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.issues[0]?.message || 'Invalid input' }
    }
    console.error('Update product error:', error)
    return { success: false as const, error: 'Failed to update product' }
  }
}
