'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { PaymentStatus, PaymentProofStatus } from '@/lib/generated/prisma/enums'
import { sendPaymentReceivedEmail, sendPaymentRejectedEmail, sendOrderCancelledEmail } from '@/lib/services/email/email-triggers'
import { formatOrderNumber } from '@/lib/utils/order'

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
})

export async function verifyPayment(input: z.infer<typeof verifyPaymentSchema>) {
  try {
    const { orderId, action } = verifyPaymentSchema.parse(input)

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

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          paymentStatus: true,
          paymentMethod: true,
          total: true,
          userId: true,
          fulfillmentStatus: true,
          paymentProofs: {
            where: { status: 'PENDING' },
            select: { id: true, status: true }
          },
          orderItems: {
            select: {
              quantity: true,
              unitPrice: true,
              product: { select: { name: true } }
            }
          }
        }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      if (order.paymentStatus !== 'PENDING') {
        throw new Error(`Cannot verify payment for order with status: ${order.paymentStatus}`)
      }

      if (!order.paymentProofs || order.paymentProofs.length === 0) {
        throw new Error('No payment proof found for this order')
      }

      const newPaymentStatus: PaymentStatus = action === 'APPROVE' ? 'PAID' : 'REJECTED'
      const newProofStatus: PaymentProofStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: newPaymentStatus,
          ...(action === 'REJECT' ? { fulfillmentStatus: 'CANCELLED' } : {}),
        }
      })

      await tx.paymentProof.updateMany({
        where: { orderId, status: 'PENDING' },
        data: { status: newProofStatus }
      })

      return { order, newPaymentStatus, newProofStatus }
    })

    // Send email asynchronously (non-blocking, outside transaction)
    if (action === 'APPROVE') {
      try {
        const userData = await prisma.user.findUnique({
          where: { id: result.order.userId },
          select: { fullName: true, email: true }
        })

        if (userData) {
          const firstName = userData.fullName.split(' ')[0] || 'there'
          const orderNumber = formatOrderNumber(orderId)
          const paymentMethod = result.order.paymentMethod === 'CASH_APP' ? 'Cash App' : 'PayPal'
          const amount = `$${Number(result.order.total).toFixed(2)}`

          const emailItems = result.order.orderItems.map(item => ({
            name: item.product?.name || 'Product',
            quantity: item.quantity,
          }))

          sendPaymentReceivedEmail(
            firstName,
            userData.email,
            orderNumber,
            paymentMethod,
            amount,
            emailItems
          )
        }
      } catch (error) {
        console.error('Failed to send payment received email:', error)
      }
    }

    if (action === 'REJECT') {
      try {
        const userData = await prisma.user.findUnique({
          where: { id: result.order.userId },
          select: { fullName: true, email: true }
        })

        if (userData) {
          const firstName = userData.fullName.split(' ')[0] || 'there'
          const orderNumber = formatOrderNumber(orderId)
          const paymentMethod = result.order.paymentMethod === 'CASH_APP' ? 'Cash App' : 'PayPal'
          const amount = `$${Number(result.order.total).toFixed(2)}`

          const emailItems = result.order.orderItems.map(item => ({
            name: item.product?.name || 'Product',
            quantity: item.quantity,
          }))

          sendPaymentRejectedEmail(
            firstName,
            userData.email,
            orderNumber,
            paymentMethod,
            amount,
            emailItems,
          )
          sendOrderCancelledEmail(firstName, userData.email, orderNumber, 'Payment was not approved')
        }
      } catch (error) {
        console.error('Failed to send payment rejected email:', error)
      }
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/orders')
    revalidatePath(`/order/confirmation/${orderId}`)

    return {
      success: true,
      message: `Payment ${action.toLowerCase()}d successfully`,
      orderId,
      newPaymentStatus: result.newPaymentStatus,
      newProofStatus: result.newProofStatus,
    }

  } catch (error) {
    console.error('Error in verifyPayment:', error)
    throw error
  }
}