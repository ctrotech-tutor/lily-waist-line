'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10)
})

export async function getUserOrders(params?: {
  page?: number
  limit?: number
}) {
  try {
    // Validate pagination parameters
    const { page, limit } = paginationSchema.parse(params || {})

    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view your orders'
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch orders with summary data - single optimized query
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
          total: true,
          subtotal: true,
          shippingFee: true,
          paymentMethod: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              unitPrice: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { imageType: 'main' },
                    orderBy: { sortOrder: 'asc' },
                    take: 1
                  }
                }
              },
              variant: {
                select: {
                  id: true,
                  size: true,
                  compressionLevel: true,
                  color: true,
                  sku: true
                }
              }
            }
          },
          paymentProofs: {
            select: {
              id: true,
              status: true,
              uploadedAt: true
            },
            orderBy: { uploadedAt: 'desc' },
            take: 1
          },
          shipments: {
            select: {
              id: true,
              carrier: true,
              trackingNumber: true,
              shippedAt: true,
              deliveredAt: true
            },
            orderBy: { shippedAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({
        where: { userId: user.id }
      })
    ])

    // Transform orders into UI-ready format
    const transformedOrders = orders.map(order => {
      const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const paymentProof = order.paymentProofs[0]
      const shipment = order.shipments[0]
      
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt.toISOString().split('T')[0],
        total: order.total.toNumber(),
        subtotal: order.subtotal.toNumber(),
        shippingFee: order.shippingFee.toNumber(),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        itemCount,
        // Payment proof status for UI visibility
        paymentProofStatus: paymentProof?.status || null,
        hasPendingPaymentProof: paymentProof?.status === 'PENDING',
        // Shipping tracking info
        trackingInfo: shipment ? {
          carrier: shipment.carrier,
          trackingNumber: shipment.trackingNumber,
          shippedAt: shipment.shippedAt,
          deliveredAt: shipment.deliveredAt
        } : null,
        // First item for preview
        previewItem: order.orderItems[0] ? {
          id: order.orderItems[0].id,
          quantity: order.orderItems[0].quantity,
          unitPrice: order.orderItems[0].unitPrice.toNumber(),
          product: {
            id: order.orderItems[0].product.id,
            name: order.orderItems[0].product.name,
            slug: order.orderItems[0].product.slug,
            image: order.orderItems[0].product.images[0] || null
          },
          variant: {
            size: order.orderItems[0].variant.size,
            compressionLevel: order.orderItems[0].variant.compressionLevel,
            color: order.orderItems[0].variant.color
          }
        } : null
      }
    })

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return {
      success: true,
      data: {
        orders: transformedOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPreviousPage
        },
        meta: {
          isEmpty: transformedOrders.length === 0,
          hasPendingPayments: transformedOrders.some(order => 
            order.paymentStatus === 'PENDING' && !order.hasPendingPaymentProof
          ),
          hasPendingPaymentProofs: transformedOrders.some(order => 
            order.hasPendingPaymentProof
          )
        }
      }
    }

  } catch (error) {
    console.error('Get user orders error:', error)
    
    return {
      success: false,
      error: 'Failed to fetch orders. Please try again.'
    }
  }
}
