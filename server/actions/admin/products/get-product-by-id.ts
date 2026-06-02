'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { tryAction } from '@/lib/security/error-handling'

const getProductByIdSchema = z.object({
  productId: z.string().min(1),
})

export const getProductById = tryAction(async (input: z.infer<typeof getProductByIdSchema>) => {
  const { productId } = getProductByIdSchema.parse(input)

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

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        select: {
          id: true,
          size: true,
          compressionLevel: true,
          sku: true,
          stockQuantity: true,
        }
      },
      images: {
        select: {
          id: true,
          url: true,
          storagePath: true,
          imageType: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  return {
    ...product,
    basePrice: product.basePrice.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() || null,
  }
})