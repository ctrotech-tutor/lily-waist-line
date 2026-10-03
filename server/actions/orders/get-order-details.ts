'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { expireReservationForOrder } from '@/lib/services/inventory-reservations'
import { z } from 'zod'

const orderDetailsSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required')
})

export async function getOrderDetails(orderId: string) {
  try {
    // Validate input
    const { orderId: validatedOrderId } = orderDetailsSchema.parse({ orderId })

    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view order details'
      }
    }

    const ownedOrder = await prisma.order.findFirst({
      where: { id: validatedOrderId, userId: user.id },
      select: { id: true },
    })

    if (!ownedOrder) {
      return { success: false, error: 'Order not found' }
    }

    await expireReservationForOrder(validatedOrderId)

    // Fetch order with strict ownership validation - single optimized query
    const order = await prisma.order.findFirst({
      where: {
        id: validatedOrderId,
        userId: user.id // Critical: ensures user can only access own orders
      },
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        updatedAt: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        paymentMethod: true,
        paymentRecipient: true,
        paymentUrl: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        reservationExpiresAt: true,
        inventoryReservedAt: true,
        inventoryReleasedAt: true,
        address: {
          select: {
            id: true, firstName: true, lastName: true, company: true,
            addressLine1: true, addressLine2: true, city: true, state: true,
            postalCode: true, country: true, phone: true,
          },
        },
        orderItems: {
          select: {
            id: true, quantity: true, unitPrice: true,
            product: {
              select: {
                id: true, name: true, slug: true,
                images: {
                  where: { imageType: 'main' },
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                  select: { id: true, url: true, altText: true },
                },
              },
            },
            variant: {
              select: {
                id: true, size: true, compressionLevel: true, color: true, sku: true,
              },
            },
          },
        },
        paymentProofs: {
          orderBy: { uploadedAt: 'desc' },
          select: { id: true, status: true, uploadedAt: true, imageUrl: true, transactionRef: true, rejectionReason: true },
        },
        shipments: {
          orderBy: { shippedAt: 'desc' },
          select: { id: true, carrier: true, trackingNumber: true, shippedAt: true, deliveredAt: true },
        },
      },
    })

    // Strict ownership validation - no order ID guessing allowed
    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // Transform order into UI-ready format
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Pricing snapshot (immutable)
      subtotal: order.subtotal.toNumber(),
      shippingFee: order.shippingFee.toNumber(),
      total: order.total.toNumber(),
      // Payment information
      paymentMethod: order.paymentMethod,
      paymentRecipient: order.paymentRecipient,
      paymentUrl: order.paymentUrl,
      paymentStatus: order.paymentStatus,
      // Fulfillment information
      fulfillmentStatus: order.fulfillmentStatus,
      reservationExpiresAt: order.reservationExpiresAt,
      hasInventoryReservation: Boolean(order.inventoryReservedAt && !order.inventoryReleasedAt),
      // Address snapshot (immutable)
      shippingAddress: {
        id: order.address.id,
        firstName: order.address.firstName,
        lastName: order.address.lastName,
        company: order.address.company,
        addressLine1: order.address.addressLine1,
        addressLine2: order.address.addressLine2,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
        phone: order.address.phone
      },
      // Order items with product snapshots
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber(),
        totalPrice: item.unitPrice.mul(item.quantity).toNumber(),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0] || null
        },
        variant: {
          id: item.variant.id,
          size: item.variant.size,
          compressionLevel: item.variant.compressionLevel,
          color: item.variant.color,
          sku: item.variant.sku
        }
      })),
      // Payment proof information
      paymentProofs: order.paymentProofs.map(proof => ({
        id: proof.id,
        status: proof.status,
        uploadedAt: proof.uploadedAt,
        imageUrl: proof.imageUrl, // Note: This would need signed URL generation for actual display
        transactionRef: proof.transactionRef,
        rejectionReason: proof.rejectionReason,
      })),
      // Shipping and tracking information
      shipments: order.shipments.map(shipment => ({
        id: shipment.id,
        carrier: shipment.carrier,
        trackingNumber: shipment.trackingNumber,
        shippedAt: shipment.shippedAt,
        deliveredAt: shipment.deliveredAt
      })),
      // Computed values for UI
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      hasPendingPaymentProof: order.paymentProofs.some(proof => proof.status === 'PENDING'),
      hasVerifiedPaymentProof: order.paymentProofs.some(proof => proof.status === 'VERIFIED'),
      hasShipped: order.fulfillmentStatus === 'SHIPPED' || order.fulfillmentStatus === 'DELIVERED',
      isDelivered: order.fulfillmentStatus === 'DELIVERED',
      // Latest tracking info
      latestShipment: order.shipments[0] || null,
      // Latest payment proof
      latestPaymentProof: order.paymentProofs[0] || null
    }

    return {
      success: true,
      data: transformedOrder
    }

  } catch (error) {
    console.error('Get order details error:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid order ID provided'
      }
    }
    
    return {
      success: false,
      error: 'Failed to fetch order details. Please try again.'
    }
  }
}
