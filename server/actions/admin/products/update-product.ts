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
  sizes: z.array(z.enum(['S', 'M', 'L', 'XL'])).optional(),
  compressionLevels: z.array(z.enum(['LIGHT', 'MEDIUM', 'HIGH'])).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  variantPrices: z.record(z.string(), z.number().min(0)).optional(),
  mainImage: z.object({
    url: z.string(),
    storagePath: z.string(),
    imageType: z.enum(['main', 'gallery', 'variant']).default('main'),
    sortOrder: z.number().int().min(0).default(0),
  }).optional(),
  imageUrls: z.array(z.object({
    url: z.string(),
    storagePath: z.string(),
    imageType: z.enum(['main', 'gallery', 'variant']).default('gallery'),
    sortOrder: z.number().int().min(0).default(0),
  })).optional(),
  imageIdsToRemove: z.array(z.string()).optional(),
  variantImages: z.record(z.string(), z.object({
    url: z.string(),
    storagePath: z.string(),
    existing: z.boolean(),
    id: z.string().optional(),
  }).nullable()).optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

async function generateUniqueSku(slug: string, size: string, compression: string, existingIds: string[]): Promise<string> {
  const baseSku = `${slugify(slug).toUpperCase()}-${size}-${compression}`
  let candidate = baseSku
  let counter = 0
  while (true) {
    const found = await prisma.productVariant.findUnique({ where: { sku: candidate }, select: { id: true } })
    if (!found || existingIds.includes(found.id)) break
    counter++
    candidate = `${baseSku}-${counter}`
  }
  return candidate
}

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
      where: { id: validated.productId },
      include: {
        variants: {
          select: { id: true, size: true, compressionLevel: true, stockQuantity: true, sku: true }
        }
      }
    })

    if (!existing) {
      return { success: false as const, error: 'Product not found' }
    }

    const result = await prisma.$transaction(async (tx) => {
      // ── 1. Delete removed product images ──
      if (validated.imageIdsToRemove && validated.imageIdsToRemove.length > 0) {
        await tx.productImage.deleteMany({
          where: { id: { in: validated.imageIdsToRemove } }
        })
      }

      // ── 2. Variant restructuring (when sizes or compression levels change) ──
      const currentSlug = validated.name ? slugify(validated.name) : existing.slug
      const restructuring = validated.sizes && validated.compressionLevels

      if (restructuring) {
        const desiredCombos = new Set<string>()
        for (const size of validated.sizes!) {
          for (const compression of validated.compressionLevels!) {
            desiredCombos.add(`${size}:${compression}`)
          }
        }

        const existingVariants = existing.variants
        const existingCombos = new Set(existingVariants.map(v => `${v.size}:${v.compressionLevel}`))

        // Delete variants whose combo is no longer desired
        // Skip deletion if variant has associated order items
        for (const variant of existingVariants) {
          const combo = `${variant.size}:${variant.compressionLevel}`
          if (!desiredCombos.has(combo)) {
            const orderItemCount = await tx.orderItem.count({ where: { variantId: variant.id } })
            if (orderItemCount > 0) {
              // Orphan — nullify stock instead of deleting to preserve order history
              await tx.productVariant.update({
                where: { id: variant.id },
                data: { stockQuantity: 0 }
              })
            } else {
              // Safe to delete — images cascade via onDelete
              await tx.productVariant.delete({ where: { id: variant.id } })
            }
          }
        }

        // Create variants for new combos
        const keptVariantIds = new Set(existingVariants.map(v => v.id))
        for (const combo of desiredCombos) {
          if (!existingCombos.has(combo)) {
            const [size, compression] = combo.split(':')
            const sku = await generateUniqueSku(currentSlug, size, compression, Array.from(keptVariantIds))
            const created = await tx.productVariant.create({
              data: {
                productId: validated.productId,
                size,
                compressionLevel: compression,
                sku,
                stockQuantity: 0,
              }
            })
            keptVariantIds.add(created.id)
          }
        }
      }

      // ── 3. Handle variant images (must run after restructuring so variant IDs exist) ──
      if (validated.variantImages) {
        const currentVariants = await tx.productVariant.findMany({
          where: { productId: validated.productId },
          select: { id: true, size: true }
        })

        for (const [size, img] of Object.entries(validated.variantImages)) {
          const sizeVariants = currentVariants.filter(v => v.size === size)
          if (sizeVariants.length === 0) continue
          const variantIds = sizeVariants.map(v => v.id)

          if (img === null) {
            await tx.productImage.deleteMany({
              where: { variantId: { in: variantIds }, imageType: 'variant' }
            })
          } else if (!img.existing) {
            await tx.productImage.deleteMany({
              where: { variantId: { in: variantIds }, imageType: 'variant' }
            })
            for (const variantId of variantIds) {
              await tx.productImage.create({
                data: {
                  productId: validated.productId,
                  variantId,
                  url: img.url,
                  storagePath: img.storagePath,
                  imageType: 'variant',
                  sortOrder: 0,
                }
              })
            }
          }
        }
      }

      // ── 4. Create main image if provided ──
      if (validated.mainImage) {
        await tx.productImage.create({
          data: {
            productId: validated.productId,
            url: validated.mainImage.url,
            storagePath: validated.mainImage.storagePath,
            imageType: 'main',
            sortOrder: 0,
          }
        })
      }

      // ── 5. Create new gallery images ──
      if (validated.imageUrls && validated.imageUrls.length > 0) {
        for (const img of validated.imageUrls) {
          await tx.productImage.create({
            data: {
              productId: validated.productId,
              url: img.url,
              storagePath: img.storagePath,
              imageType: 'gallery',
              sortOrder: img.sortOrder,
            }
          })
        }
      }

      // ── 6. Update per-variant prices ──
      if (validated.variantPrices) {
        const allVariants = await tx.productVariant.findMany({
          where: { productId: validated.productId },
          select: { id: true, size: true }
        })
        for (const variant of allVariants) {
          const price = validated.variantPrices[variant.size]
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { price: price ?? null }
          })
        }
      }

      // ── 7. Distribute stock quantity evenly across all variants ──
      if (validated.stockQuantity !== undefined) {
        const allVariants = await tx.productVariant.findMany({
          where: { productId: validated.productId },
          select: { id: true }
        })
        if (allVariants.length > 0) {
          const perVariant = Math.floor(validated.stockQuantity / allVariants.length)
          let remainder = validated.stockQuantity - perVariant * allVariants.length

          for (const variant of allVariants) {
            const stock = perVariant + (remainder > 0 ? 1 : 0)
            if (remainder > 0) remainder--
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stockQuantity: stock }
            })
          }
        }
      }

      // ── 8. Update product scalar fields ──
      const data: Record<string, unknown> = {}
      if (validated.name !== undefined) data.name = validated.name
      if (validated.shortDescription !== undefined) data.shortDescription = validated.shortDescription
      if (validated.description !== undefined) data.description = validated.description
      if (validated.basePrice !== undefined) data.basePrice = validated.basePrice
      if (validated.compareAtPrice !== undefined) data.compareAtPrice = validated.compareAtPrice
      if (validated.status !== undefined) data.status = validated.status

      return tx.product.update({
        where: { id: validated.productId },
        data
      })
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${validated.productId}`)

    return {
      success: true as const,
      data: { id: result.id }
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.issues[0]?.message || 'Invalid input' }
    }
    console.error('Update product error:', error)
    return { success: false as const, error: 'Failed to update product' }
  }
}
