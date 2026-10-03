'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { expireReservationForOrder } from '@/lib/services/inventory-reservations'
import { getPaymentDestination, isPaymentMethodAllowedForCountry } from '@/lib/services/payment-policy'
import { revalidatePath } from 'next/cache'
import { selectPaymentMethodSchema, type SelectPaymentMethodInput } from '@/lib/validators/payment'

export async function selectPaymentMethod(input: SelectPaymentMethodInput) {
  try {
    const validatedData = selectPaymentMethodSchema.parse(input)
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'You must be logged in to select a payment method' }
    }

    await expireReservationForOrder(validatedData.orderId)

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const lockedOrder = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "Order"
        WHERE "id" = ${validatedData.orderId} AND "userId" = ${user.id}
        FOR UPDATE
      `
      if (lockedOrder.length !== 1) throw new Error('Order not found')

      const order = await tx.order.findFirst({
        where: { id: validatedData.orderId, userId: user.id },
        select: {
          id: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          total: true,
          inventoryCommittedAt: true,
          inventoryReleasedAt: true,
          paymentProofs: { select: { id: true }, take: 1 },
          shippingCountry: true,
        },
      })

      if (!order) throw new Error('Order not found')
      if (order.paymentStatus !== 'PENDING'
        || order.fulfillmentStatus !== 'PENDING'
        || order.inventoryCommittedAt
        || order.inventoryReleasedAt
        || order.paymentProofs.length > 0) {
        throw new Error('Payment method cannot be changed after payment proof submission or order closure')
      }

      if (!isPaymentMethodAllowedForCountry(order.shippingCountry, validatedData.paymentMethod)) {
        throw new Error(validatedData.paymentMethod === 'CASH_APP'
          ? 'Cash App is only available for U.S. shipping addresses'
          : 'PayPal is only available for non-U.S. shipping addresses')
      }

      const configuration = await tx.paymentConfiguration.findUnique({
        where: { paymentMethod: validatedData.paymentMethod },
      })
      const destination = getPaymentDestination(
        validatedData.paymentMethod,
        configuration,
        order.total.toNumber(),
      )
      if (!destination) {
        throw new Error('This payment method is disabled or has no valid recipient configured')
      }

      const update = await tx.order.updateMany({
        where: {
          id: order.id,
          userId: user.id,
          paymentStatus: 'PENDING',
          fulfillmentStatus: 'PENDING',
          inventoryCommittedAt: null,
          inventoryReleasedAt: null,
          OR: [
            { reservationExpiresAt: null },
            { reservationExpiresAt: { gt: new Date() } },
          ],
        },
        data: {
          paymentMethod: validatedData.paymentMethod,
          paymentRecipient: destination.recipient,
          paymentUrl: destination.url,
          updatedAt: new Date(),
        },
      })
      if (update.count !== 1) {
        throw new Error('The order changed while its payment method was being updated')
      }
      return { id: order.id, paymentMethod: validatedData.paymentMethod }
    })

    revalidatePath('/checkout')
    revalidatePath('/order/confirmation')
    revalidatePath(`/orders/${validatedData.orderId}`)

    return {
      success: true,
      data: {
        orderId: updatedOrder.id,
        paymentMethod: updatedOrder.paymentMethod,
        paymentStatus: 'PENDING',
      },
    }
  } catch (error) {
    console.error('Error selecting payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to select payment method. Please try again.',
    }
  }
}
