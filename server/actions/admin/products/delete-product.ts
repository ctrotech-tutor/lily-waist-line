'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const deleteProductSchema = z.object({
  productId: z.string().min(1),
})

export async function deleteProduct(input: z.infer<typeof deleteProductSchema>) {
  try {
    const { productId } = deleteProductSchema.parse(input)

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

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        images: { select: { storagePath: true } }
      }
    })

    if (!product) {
      return { success: false as const, error: 'Product not found' }
    }

    for (const image of product.images) {
      try {
        await supabaseAdmin.storage
          .from('product-images')
          .remove([image.storagePath])
      } catch {
        // Ignore storage errors - DB deletion takes priority
      }
    }

    await prisma.product.delete({ where: { id: productId } })

    revalidatePath('/admin/products')

    return { success: true as const }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.issues[0]?.message || 'Invalid input' }
    }
    console.error('Delete product error:', error)
    return { success: false as const, error: 'Failed to delete product' }
  }
}