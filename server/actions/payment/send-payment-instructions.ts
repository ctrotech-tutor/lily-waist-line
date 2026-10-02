'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
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

    // Fetch order details with user info, items, and payment config
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        paymentMethod: true,
        total: true,
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
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // Verify user owns this order
    if (order.userId !== user.id) {
      throw new Error('Access denied')
    }

    // Fetch payment configuration
    const paymentConfig = await prisma.paymentConfiguration.findFirst({
      where: {
        paymentMethod: order.paymentMethod,
        enabled: true
      }
    })

    if (!paymentConfig) {
      throw new Error('Payment configuration not found')
    }

    // Determine payment details based on method
    const isCashApp = order.paymentMethod === 'CASH_APP'
    const paymentMethodLabel = isCashApp ? 'Cash App' : 'PayPal'
    const amount = Number(order.total).toFixed(2)
    const amountFormatted = `$${amount}`

    let paymentLink: string
    let paymentLabel: string

    if (isCashApp) {
      const handle = paymentConfig.cashAppHandle || '$LilyWaistLine'
      paymentLink = `https://cash.app/${handle.replace('$', '')}`
      paymentLabel = handle
    } else {
      const handle = paymentConfig.paypalHandle || 'lilywaistline'
      paymentLink = `https://www.paypal.me/${handle}/${amount}`
      paymentLabel = handle
    }

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
        name: item.product.name,
        quantity: item.quantity,
      }))
    }

    // Import email trigger function
    const { sendPaymentInstructionsEmail } = await import('@/lib/services/email/email-triggers')

    // Send email
    await sendPaymentInstructionsEmail(
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

    return {
      success: true,
      message: 'Payment instructions sent successfully',
      orderId,
    }

  } catch (error) {
    console.error('Error in sendPaymentInstructions:', error)
    throw error
  }
}