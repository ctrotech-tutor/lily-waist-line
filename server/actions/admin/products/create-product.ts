'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(200),
  shortDescription: z.string().trim().max(500).default(''),
  description: z.string().trim().max(10000).default(''),
  basePrice: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().min(0).nullable().optional(),
  sizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL'])).min(1, 'At least one size is required'),
  compressionLevels: z.array(z.enum(['LIGHT', 'MEDIUM', 'HIGH'])).min(1, 'At least one compression level is required'),
  stockQuantity: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  imageUrls: z.array(z.object({
    url: z.string(),
    storagePath: z.string(),
    imageType: z.enum(['main', 'gallery', 'variant']).default('gallery'),
    sortOrder: z.number().int().min(0).default(0)
  })).default([]),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base)
  if (!slug) slug = 'product'
  let counter = 0
  let candidate = slug
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    counter++
    candidate = `${slug}-${counter}`
  }
  return candidate
}

export async function createProduct(input: CreateProductInput) {
  try {
    const validated = createProductSchema.parse(input)

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

    const slug = await generateUniqueSlug(validated.name)

    const variantCombinations: { size: string; compressionLevel: string }[] = []
    for (const size of validated.sizes) {
      for (const compression of validated.compressionLevels) {
        variantCombinations.push({ size, compressionLevel: compression })
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: validated.name,
          slug,
          shortDescription: validated.shortDescription,
          description: validated.description,
          basePrice: validated.basePrice,
          compareAtPrice: validated.compareAtPrice ?? null,
          status: validated.status,
        }
      })

      for (let i = 0; i < variantCombinations.length; i++) {
        const v = variantCombinations[i]
        const sku = `${slug.toUpperCase()}-${v.size}-${v.compressionLevel}`
        await tx.productVariant.create({
          data: {
            productId: product.id,
            size: v.size,
            compressionLevel: v.compressionLevel,
            sku,
            stockQuantity: validated.stockQuantity,
          }
        })
      }

      for (const img of validated.imageUrls) {
        await tx.productImage.create({
          data: {
            productId: product.id,
            url: img.url,
            storagePath: img.storagePath,
            imageType: img.imageType,
            sortOrder: img.sortOrder,
          }
        })
      }

      return product
    })

    revalidatePath('/admin/products')

    return {
      success: true as const,
      data: { id: result.id, slug: result.slug }
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.issues[0]?.message || 'Invalid input' }
    }
    console.error('Create product error:', error)
    return { success: false as const, error: 'Failed to create product' }
  }
}