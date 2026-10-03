'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { PaymentProofStatus, PaymentStatus } from '@/lib/generated/prisma/enums'
import { verifyPaymentSchema, type VerifyPaymentInput } from '@/lib/validators/admin/verify-payment'
import { expireReservationForOrder, releaseOrderInventory } from '@/lib/services/inventory-reservations'
import { sendPaymentReceivedEmail, sendPaymentRejectedEmail } from '@/lib/services/email/email-triggers'

export async function verifyPayment(input: VerifyPaymentInput) {
  try {
    const { orderId, action, reason } = verifyPaymentSchema.parse(input)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    if (!dbUser || dbUser.role !== 'ADMIN') {
      throw new Error('Access denied. Admin access required.')
    }

    // Handle an elapsed proof window before loading the review state. The helper
    // is idempotent and cannot release an order whose proof already extended it.
    await expireReservationForOrder(orderId)

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
          paymentStatus: true,
          paymentMethod: true,
          total: true,
          userId: true,
          fulfillmentStatus: true,
          inventoryReservedAt: true,
          inventoryCommittedAt: true,
          inventoryReleasedAt: true,
          paymentProofs: {
            where: { status: 'PENDING' },
            select: { id: true },
          },
          orderItems: {
            select: {
              quantity: true,
              variantId: true,
              unitPrice: true,
              productNameSnapshot: true,
            },
          },
        },
      })

      if (!order) throw new Error('Order not found')
      if (order.paymentStatus !== 'PENDING') {
        throw new Error(`Cannot verify payment for order with status: ${order.paymentStatus}`)
      }
      if (order.fulfillmentStatus === 'CANCELLED' || order.inventoryReleasedAt) {
        throw new Error('This order is cancelled and its inventory has been released')
      }
      if (order.inventoryCommittedAt) {
        throw new Error('Inventory for this order has already been committed')
      }
      if (order.paymentProofs.length === 0) {
        throw new Error('No payment proof found for this order')
      }

      const now = new Date()
      const newPaymentStatus: PaymentStatus = action === 'APPROVE' ? 'PAID' : 'REJECTED'
      const newProofStatus: PaymentProofStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'

      if (action === 'APPROVE' && !order.inventoryReservedAt) {
        // Orders created before reservation support need a fresh stock check at
        // approval. Never mark an old order paid if its items can no longer be reserved.
        const items = [...order.orderItems].sort((a, b) => a.variantId.localeCompare(b.variantId))
        for (const item of items) {
          const reservation = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stockQuantity: { gte: item.quantity },
            },
            data: { stockQuantity: { decrement: item.quantity } },
          })
          if (reservation.count !== 1) {
            throw new Error(`Cannot approve this legacy order: insufficient stock for ${item.productNameSnapshot}`)
          }
        }
      }

      const update = await tx.order.updateMany({
        where: {
          id: orderId,
          paymentStatus: 'PENDING',
          fulfillmentStatus: 'PENDING',
          inventoryReleasedAt: null,
          inventoryCommittedAt: null,
        },
        data: action === 'APPROVE'
          ? {
              paymentStatus: 'PAID',
              inventoryReservedAt: order.inventoryReservedAt ?? now,
              inventoryCommittedAt: now,
              reservationExpiresAt: null,
            }
          : {
              paymentStatus: 'REJECTED',
              fulfillmentStatus: 'CANCELLED',
              reservationExpiresAt: null,
            },
      })

      if (update.count !== 1) {
        throw new Error('The order changed while it was being reviewed. Refresh and try again.')
      }

      if (action === 'REJECT' && order.inventoryReservedAt) {
        await releaseOrderInventory(tx, orderId, now)
      }

      const proofTransition = await tx.paymentProof.updateMany({
        where: { orderId, status: 'PENDING' },
        data: {
          status: newProofStatus,
          rejectionReason: action === 'REJECT' ? reason! : null,
        },
      })
      if (proofTransition.count === 0) {
        throw new Error('The pending payment proof was removed. Refresh and try again.')
      }

      return { order, newPaymentStatus, newProofStatus }
    })

    if (action === 'APPROVE') {
      try {
        const userData = await prisma.user.findUnique({
          where: { id: result.order.userId },
          select: { fullName: true, email: true },
        })

        if (userData) {
          const firstName = userData.fullName.split(' ')[0] || 'there'
          const paymentMethod = result.order.paymentMethod === 'CASH_APP' ? 'Cash App' : 'PayPal'
          const amount = `$${Number(result.order.total).toFixed(2)}`
          const emailItems = result.order.orderItems.map((item) => ({
            name: item.productNameSnapshot || 'Product',
            quantity: item.quantity,
          }))

          sendPaymentReceivedEmail(
            firstName,
            userData.email,
            result.order.orderNumber,
            paymentMethod,
            amount,
            emailItems,
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
          select: { fullName: true, email: true },
        })

        if (userData) {
          const firstName = userData.fullName.split(' ')[0] || 'there'
          const paymentMethod = result.order.paymentMethod === 'CASH_APP' ? 'Cash App' : 'PayPal'
          const amount = `$${Number(result.order.total).toFixed(2)}`
          const emailItems = result.order.orderItems.map((item) => ({
            name: item.productNameSnapshot || 'Product',
            quantity: item.quantity,
          }))

          sendPaymentRejectedEmail(
            firstName,
            userData.email,
            result.order.orderNumber,
            orderId,
            paymentMethod,
            amount,
            emailItems,
            reason,
          )
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
      message: action === 'APPROVE' ? 'Payment approved successfully' : 'Payment rejected successfully',
      orderId,
      newPaymentStatus: result.newPaymentStatus,
      newProofStatus: result.newProofStatus,
    }
  } catch (error) {
    console.error('Error in verifyPayment:', error)
    throw error
  }
}
