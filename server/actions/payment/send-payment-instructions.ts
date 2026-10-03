'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { expireReservationForOrder } from '@/lib/services/inventory-reservations'
import { z } from 'zod'

const sendPaymentInstructionsSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
})

export async function sendPaymentInstructions(input: z.infer<typeof sendPaymentInstructionsSchema>) {
  try {
    const { orderId } = sendPaymentInstructionsSchema.parse(input)

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Expire an unproved order before deciding whether payment instructions remain valid.
    await expireReservationForOrder(orderId)

    // Payment details are snapshotted on the order so later settings changes cannot
    // redirect an existing customer to a different recipient.
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        paymentMethod: true,
        paymentRecipient: true,
        paymentUrl: true,
        total: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        userId: true,
        user: {
          select: {
            fullName: true,
            email: true,
          }
        },
        orderItems: {
          select: {
            quantity: true,
            productNameSnapshot: true,
          }
        }
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // Verify user owns this order before exposing any payment destination.
    if (order.userId !== user.id) {
      throw new Error('Access denied')
    }
    if (order.paymentStatus !== 'PENDING' || order.fulfillmentStatus === 'CANCELLED') {
      throw new Error('Payment instructions are unavailable for this order state')
    }
    if (!order.paymentRecipient) {
      throw new Error('Payment details for this order need support confirmation. Do not send money using an unverified recipient.')
    }

    const isCashApp = order.paymentMethod === 'CASH_APP'
    const paymentMethodLabel = isCashApp ? 'Cash App' : 'PayPal'
    const amount = Number(order.total).toFixed(2)
    const amountFormatted = `$${amount}`
    const paymentLink = order.paymentUrl
    const paymentLabel = order.paymentRecipient

    // Read stored order number from DB
    const orderNumber = order.orderNumber

    // Prepare email data
    const emailData = {
      firstName: order.user.fullName.split(' ')[0] || 'there',
      email: order.user.email,
      orderNumber,
      paymentMethod: paymentMethodLabel,
      paymentLink,
      paymentLabel,
      amount: amountFormatted,
      items: order.orderItems.map(item => ({
        name: item.productNameSnapshot,
        quantity: item.quantity,
      }))
    }

    // Import email trigger function
    const { sendPaymentInstructionsEmail } = await import('@/lib/services/email/email-triggers')

    // Report the transport result instead of claiming success after a failed attempt.
    const delivery = await sendPaymentInstructionsEmail(
      emailData.firstName,
      emailData.email,
      emailData.orderNumber,
      orderId,
      emailData.paymentMethod,
      emailData.paymentLink,
      emailData.paymentLabel,
      emailData.amount,
      emailData.items
    )

    if (!delivery.success) {
      return {
        success: false,
        message: 'We could not email the instructions. Payment details remain visible on this page; use them or try again later.',
        orderId,
      }
    }

    return {
      success: true,
      message: 'Payment instructions were accepted for delivery to your email.',
      orderId,
    }

  } catch (error) {
    console.error('Error in sendPaymentInstructions:', error)
    throw error
  }
}