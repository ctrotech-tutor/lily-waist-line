'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function getWishlist() {
  try {
    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view your wishlist',
        data: []
      }
    }

    // Fetch wishlist with full product hydration in a single optimized query
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: user.id
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                imageType: 'main'
              },
              orderBy: {
                sortOrder: 'asc'
              },
              take: 1
            },
            variants: {
              select: {
                id: true,
                size: true,
                compressionLevel: true,
                color: true,
                sku: true,
                stockQuantity: true
              },
              orderBy: {
                stockQuantity: 'desc'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data for UI consumption
    const transformedWishlist = wishlistItems.map(item => ({
      id: item.id,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        shortDescription: item.product.shortDescription,
        basePrice: item.product.basePrice,
        compareAtPrice: item.product.compareAtPrice,
        status: item.product.status,
        images: item.product.images,
        variants: item.product.variants,
        // Computed fields for UI
        inStock: item.product.variants.some(variant => variant.stockQuantity > 0),
        priceRange: {
          min: item.product.variants.length > 0 
            ? Number(item.product.basePrice) 
            : Number(item.product.basePrice),
          max: item.product.variants.length > 0 
            ? Number(item.product.basePrice) 
            : Number(item.product.basePrice)
        }
      }
    }))

    return {
      success: true,
      data: transformedWishlist
    }

  } catch (error) {
    console.error('Get wishlist error:', error)
    return {
      success: false,
      error: 'Failed to fetch wishlist. Please try again.',
      data: []
    }
  }
}
