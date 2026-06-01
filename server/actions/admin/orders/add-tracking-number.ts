'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendShippingUpdateEmail } from '@/lib/services/email/email-triggers'
import { formatOrderNumber } from '@/lib/utils/order'

const addTrackingNumberSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  carrier: z.string().min(1, 'Carrier name is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required'),
})

export async function addTrackingNumber(input: z.infer<typeof addTrackingNumberSchema>) {
  try {
    const { orderId, carrier, trackingNumber } = addTrackingNumberSchema.parse(input)

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
          paymentStatus: true,
          fulfillmentStatus: true,
          userId: true,
          orderItems: {
            select: {
              quantity: true,
              product: { select: { name: true } }
            }
          }
        }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      if (order.paymentStatus !== 'PAID') {
        throw new Error('Cannot add tracking number for unpaid order')
      }

      if (order.fulfillmentStatus === 'PENDING') {
        throw new Error('Cannot add tracking number for order that has not been processed')
      }

      if (order.fulfillmentStatus === 'CANCELLED') {
        throw new Error('Cannot add tracking number for cancelled order')
      }

      const orderStatusUpdated = order.fulfillmentStatus === 'PROCESSING'

      const existingShipment = await tx.shipment.findFirst({
        where: { orderId }
      })

      const shipment = existingShipment
        ? await tx.shipment.update({
            where: { id: existingShipment.id },
            data: { carrier, trackingNumber }
          })
        : await tx.shipment.create({
            data: {
              orderId,
              carrier,
              trackingNumber,
              shippedAt: new Date(),
            }
          })

      if (orderStatusUpdated) {
        await tx.order.update({
          where: { id: orderId },
          data: { fulfillmentStatus: 'SHIPPED' }
        })
      }

      return { shipment, orderStatusUpdated, order }
    })

    // Send email with real tracking info asynchronously
    try {
      const userData = await prisma.user.findUnique({
        where: { id: result.order.userId },
        select: { fullName: true, email: true }
      })

      if (userData) {
        const firstName = userData.fullName.split(' ')[0] || 'there'
        const orderNumber = formatOrderNumber(orderId)
        const estimatedDelivery = '3-5 business days'

        const emailItems = result.order.orderItems.map(item => ({
          name: item.product?.name || 'Product',
          quantity: item.quantity,
        }))

        sendShippingUpdateEmail(
          firstName,
          userData.email,
          orderNumber,
          carrier,
          trackingNumber,
          estimatedDelivery,
          emailItems
        )
      }
    } catch (error) {
      console.error('Failed to send shipping update email:', error)
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/orders')
    revalidatePath(`/order/confirmation/${orderId}`)

    return {
      success: true,
      message: 'Tracking number added successfully',
      orderId,
      carrier,
      trackingNumber,
      shipment: result.shipment,
      orderStatusUpdated: result.orderStatusUpdated,
    }

  } catch (error) {
    console.error('Error in addTrackingNumber:', error)
    throw error
  }
}