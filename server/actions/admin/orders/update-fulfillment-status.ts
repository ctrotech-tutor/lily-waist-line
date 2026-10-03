'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { FulfillmentStatus } from '@/lib/generated/prisma/enums'
import { releaseOrderInventory } from '@/lib/services/inventory-reservations'
import {
  sendOrderProcessingEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
} from '@/lib/services/email/email-triggers'

const updateFulfillmentStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  newStatus: z.enum(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

const VALID_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export async function updateFulfillmentStatus(input: z.infer<typeof updateFulfillmentStatusSchema>) {
  try {
    const { orderId, newStatus } = updateFulfillmentStatusSchema.parse(input)

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

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
          userId: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          inventoryReservedAt: true,
          inventoryCommittedAt: true,
          inventoryReleasedAt: true,
        }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      if (order.paymentStatus !== 'PAID' && newStatus !== 'CANCELLED') {
        throw new Error('Cannot update fulfillment status for unpaid order')
      }

      const currentStatus = order.fulfillmentStatus as FulfillmentStatus
      const allowedTransitions = VALID_TRANSITIONS[currentStatus]

      if (!allowedTransitions.includes(newStatus)) {
        throw new Error(
          `Invalid fulfillment status transition from ${currentStatus} to ${newStatus}. ` +
          `Allowed transitions: ${allowedTransitions.join(', ') || 'None (terminal state)'}`
        )
      }

      const statusChange = await tx.order.updateMany({
        where: {
          id: orderId,
          fulfillmentStatus: currentStatus,
        },
        data: { fulfillmentStatus: newStatus },
      })
      if (statusChange.count !== 1) {
        throw new Error('The order changed while it was being updated. Refresh and try again.')
      }

      if (
        newStatus === 'CANCELLED'
        && order.paymentStatus !== 'PAID'
        && order.inventoryReservedAt
        && !order.inventoryCommittedAt
        && !order.inventoryReleasedAt
      ) {
        await releaseOrderInventory(tx, orderId, new Date())
      }

      if (newStatus === 'CANCELLED') {
        await tx.paymentProof.updateMany({
          where: { orderId, status: 'PENDING' },
          data: {
            status: 'REJECTED',
            rejectionReason: 'The order was cancelled before payment-proof review.',
          },
        })
      }

      if (newStatus === 'SHIPPED') {
        const existingShipment = await tx.shipment.findFirst({ where: { orderId } })
        if (existingShipment) {
          await tx.shipment.update({
            where: { id: existingShipment.id },
            data: { shippedAt: new Date() }
          })
        } else {
          await tx.shipment.create({
            data: {
              orderId,
              carrier: 'PENDING',
              shippedAt: new Date(),
            }
          })
        }
      }

      if (newStatus === 'DELIVERED') {
        await tx.shipment.updateMany({
          where: { orderId },
          data: { deliveredAt: new Date() }
        })
      }

      return { order, currentStatus }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/orders')
    revalidatePath(`/order/confirmation/${orderId}`)

    // Send email asynchronously (non-blocking)
    try {
      const userData = await prisma.user.findUnique({
        where: { id: result.order.userId },
        select: { fullName: true, email: true }
      })

      if (userData) {
        const firstName = userData.fullName.split(' ')[0] || 'there'
        const orderNumber = result.order.orderNumber

        if (newStatus === 'PROCESSING') {
          const items = await prisma.orderItem.findMany({
            where: { orderId },
            select: {
              quantity: true,
              product: { select: { name: true } }
            }
          })
          sendOrderProcessingEmail(firstName, userData.email, orderNumber,
            items.map(i => ({ name: i.product?.name || 'Product', quantity: i.quantity }))
          )
        } else if (newStatus === 'SHIPPED') {
          const items = await prisma.orderItem.findMany({
            where: { orderId },
            select: {
              quantity: true,
              product: { select: { name: true } }
            }
          })
          sendOrderShippedEmail(firstName, userData.email, orderNumber,
            items.map(i => ({ name: i.product?.name || 'Product', quantity: i.quantity }))
          )
        } else if (newStatus === 'DELIVERED') {
          sendOrderDeliveredEmail(firstName, userData.email, orderNumber)
        } else if (newStatus === 'CANCELLED') {
          sendOrderCancelledEmail(firstName, userData.email, orderNumber)
        }
      }
    } catch (error) {
      console.error('Failed to send fulfillment status email:', error)
    }

    return {
      success: true,
      message: `Fulfillment status updated from ${result.currentStatus} to ${newStatus}`,
      orderId,
      previousStatus: result.currentStatus,
      newStatus,
    }

  } catch (error) {
    console.error('Error in updateFulfillmentStatus:', error)
    throw error
  }
}