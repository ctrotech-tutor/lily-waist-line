'use server'

import { createClient } from '@/lib/supabase/server'
import prisma, { Decimal } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendOrderConfirmationEmail } from '@/lib/services/email/email-triggers'
import { releaseExpiredInventoryReservations } from '@/lib/services/inventory-reservations'
import { createReservationExpiry } from '@/lib/services/reservation-policy'
import { getPaymentDestination, isPaymentMethodAllowedForCountry } from '@/lib/services/payment-policy'
import { formatOrderNumber } from '@/lib/utils/order'

const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Address ID is required'),
  expectedTotal: z.number().finite().min(0),
  idempotencyKey: z.string().uuid('Invalid order request key'),
  paymentMethod: z.enum(['CASH_APP', 'PAYPAL']),
})

export async function createOrder(formData: {
  addressId: string
  expectedTotal: number
  idempotencyKey: string
  paymentMethod: string
}) {
  try {
    const validatedData = createOrderSchema.parse(formData)

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to create an order',
      }
    }

    // Release any stale holds before checking availability. The order transaction
    // still performs its own conditional stock updates, so this is not the safety gate.
    await releaseExpiredInventoryReservations()

    const result = await prisma.$transaction(async (tx) => {
      const lockedUser = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR SHARE
      `
      if (lockedUser.length !== 1) throw new Error('Your account is no longer available')

      // Serialize retries that carry the same key. The unique index remains the
      // durable idempotency guard if two requests race across instances.
      await tx.$queryRaw`
        WITH request_lock AS MATERIALIZED (
          SELECT pg_advisory_xact_lock(hashtextextended(${validatedData.idempotencyKey}, 0))
        )
        SELECT 1 FROM request_lock
      `

      const previousOrder = await tx.order.findUnique({
        where: { idempotencyKey: validatedData.idempotencyKey },
        select: {
          id: true,
          userId: true,
          orderNumber: true,
          total: true,
          paymentMethod: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          reservationExpiresAt: true,
        },
      })

      if (previousOrder) {
        if (previousOrder.userId !== user.id) {
          throw new Error('This order request key is not available')
        }
        return {
          kind: 'existing' as const,
          order: {
            ...previousOrder,
            total: Number(previousOrder.total),
          },
        }
      }

      const cartItems = await tx.cartItem.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          variantId: true,
          quantity: true,
          variant: {
            select: {
              id: true,
              stockQuantity: true,
              productId: true,
              price: true,
              product: {
                select: {
                  name: true,
                  basePrice: true,
                  status: true,
                },
              },
            },
          },
        },
      })

      if (cartItems.length === 0) {
        throw new Error('Your cart is empty')
      }

      for (const item of cartItems) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error('Your cart contains an invalid quantity')
        }
        if (item.variant.product.status !== 'ACTIVE') {
          throw new Error(`${item.variant.product.name} is no longer available`)
        }
        if (item.variant.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.variant.product.name}. Only ${item.variant.stockQuantity} items available.`,
          )
        }
      }

      const address = await tx.address.findFirst({
        where: {
          id: validatedData.addressId,
          userId: user.id,
        },
      })

      if (!address) {
        throw new Error('Invalid address selected')
      }

      if (!isPaymentMethodAllowedForCountry(address.country, validatedData.paymentMethod)) {
        throw new Error(validatedData.paymentMethod === 'CASH_APP'
          ? 'Cash App is only available for U.S. shipping addresses'
          : 'PayPal is only available for non-U.S. shipping addresses')
      }

      const paymentConfiguration = await tx.paymentConfiguration.findUnique({
        where: { paymentMethod: validatedData.paymentMethod },
      })
      if (!paymentConfiguration?.enabled) {
        throw new Error('This payment method is currently unavailable. Choose another method or contact support.')
      }

      // Lock each product row in a stable order. This prevents a product being
      // archived or its base price changing between checkout validation and commit.
      const productIds = [...new Set(cartItems.map((item) => item.variant.productId))].sort()
      const currentBasePrices = new Map<string, Decimal>()
      for (const productId of productIds) {
        const productRows = await tx.$queryRaw<Array<{ id: string; basePrice: number | string }>>`
          SELECT "id", "basePrice"
          FROM "Product"
          WHERE "id" = ${productId} AND "status" = 'ACTIVE'
          FOR SHARE
        `

        if (productRows.length !== 1) {
          const name = cartItems.find((item) => item.variant.productId === productId)?.variant.product.name
          throw new Error(`${name || 'A product'} is no longer available`)
        }
        currentBasePrices.set(productId, new Decimal(productRows[0].basePrice))
      }

      // Reserve stock with a conditional UPDATE. Concurrent checkouts for the last
      // unit cannot both succeed; a failed item rolls back all earlier decrements.
      const orderedCartItems = [...cartItems].sort((a, b) => a.variantId.localeCompare(b.variantId))
      for (const item of orderedCartItems) {
        const reservation = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            productId: item.variant.productId,
            stockQuantity: { gte: item.quantity },
            price: item.variant.price,
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        })

        if (reservation.count !== 1) {
          throw new Error(
            `Stock or price changed for ${item.variant.product.name}. Refresh your cart and try again.`,
          )
        }
      }

      let subtotal = new Decimal(0)
      for (const item of cartItems) {
        const unitPrice = item.variant.price ?? currentBasePrices.get(item.variant.productId)!
        subtotal = subtotal.add(unitPrice.mul(item.quantity))
      }

      const shippingFee = new Decimal(10)
      const total = subtotal.add(shippingFee)
      const expectedTotalCents = Math.round(validatedData.expectedTotal * 100)
      const actualTotalCents = Math.round(total.toNumber() * 100)
      if (!Number.isSafeInteger(expectedTotalCents)
        || !Number.isSafeInteger(actualTotalCents)
        || expectedTotalCents !== actualTotalCents) {
        throw new Error('Your order total changed. Refresh your cart and review the updated amount before placing the order.')
      }

      const paymentDestination = getPaymentDestination(
        validatedData.paymentMethod,
        paymentConfiguration,
        total.toNumber(),
      )
      if (!paymentDestination) {
        throw new Error('The selected payment method has no valid recipient configured. Choose another method or contact support.')
      }

      const createdAt = new Date()
      const reservationExpiresAt = createReservationExpiry(createdAt)
      const orderId = crypto.randomUUID()
      const orderNumber = formatOrderNumber(orderId)

      const order = await tx.order.create({
        data: {
          id: orderId,
          idempotencyKey: validatedData.idempotencyKey,
          userId: user.id,
          addressId: validatedData.addressId,
          subtotal,
          shippingFee,
          total,
          paymentMethod: validatedData.paymentMethod,
          paymentRecipient: paymentDestination.recipient,
          paymentUrl: paymentDestination.url,
          paymentStatus: 'PENDING',
          fulfillmentStatus: 'PENDING',
          inventoryReservedAt: createdAt,
          reservationExpiresAt,
          orderNumber,
        },
      })

      const orderItems = await Promise.all(
        cartItems.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.variant.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.variant.price === null
                ? currentBasePrices.get(item.variant.productId)!
                : item.variant.price,
            },
            include: {
              product: { select: { name: true } },
              variant: {
                select: {
                  size: true,
                  compressionLevel: true,
                  color: true,
                  sku: true,
                },
              },
            },
          }),
        ),
      )

      await tx.cartItem.deleteMany({ where: { userId: user.id } })

      return {
        kind: 'created' as const,
        order: {
          ...order,
          subtotal: Number(order.subtotal),
          shippingFee: Number(order.shippingFee),
          total: Number(order.total),
        },
        orderItems: orderItems.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
        })),
        address,
      }
    })

    revalidatePath('/cart')
    revalidatePath('/orders')
    revalidatePath('/checkout')

    if (result.kind === 'existing') {
      return {
        success: true,
        message: 'This order was already created',
        data: {
          orderId: result.order.id,
          orderNumber: result.order.orderNumber,
          total: result.order.total,
          paymentMethod: result.order.paymentMethod,
          paymentStatus: result.order.paymentStatus,
          fulfillmentStatus: result.order.fulfillmentStatus,
          reservationExpiresAt: result.order.reservationExpiresAt,
        },
      }
    }

    try {
      const emailItems = result.orderItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: `$${Number(item.unitPrice).toFixed(2)}`,
        size: item.variant.size,
        compression: item.variant.compressionLevel,
      }))

      const shippingAddress = {
        name: `${result.address.firstName} ${result.address.lastName}`,
        address: `${result.address.addressLine1}${result.address.addressLine2 ? ', ' + result.address.addressLine2 : ''}`,
        city: result.address.city,
        state: result.address.state,
        country: result.address.country,
        postalCode: result.address.postalCode,
      }

      await sendOrderConfirmationEmail(
        result.address.firstName,
        user.email || '',
        result.order.orderNumber,
        emailItems,
        `$${Number(result.order.subtotal).toFixed(2)}`,
        `$${Number(result.order.shippingFee).toFixed(2)}`,
        `$${Number(result.order.total).toFixed(2)}`,
        shippingAddress,
      )
    } catch (error) {
      console.error('Failed to send order confirmation email:', error)
    }

    return {
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        total: Number(result.order.total),
        paymentMethod: result.order.paymentMethod,
        paymentStatus: result.order.paymentStatus,
        fulfillmentStatus: result.order.fulfillmentStatus,
        reservationExpiresAt: result.order.reservationExpiresAt,
        items: result.orderItems.map((item) => ({
          id: item.id,
          productName: item.product.name,
          size: item.variant.size,
          compressionLevel: item.variant.compressionLevel,
          color: item.variant.color,
          sku: item.variant.sku,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.unitPrice) * item.quantity,
        })),
        shippingAddress: {
          fullName: `${result.address.firstName} ${result.address.lastName}`,
          company: result.address.company,
          addressLine1: result.address.addressLine1,
          addressLine2: result.address.addressLine2,
          city: result.address.city,
          state: result.address.state,
          postalCode: result.address.postalCode,
          country: result.address.country,
          phone: result.address.phone,
        },
        subtotal: Number(result.order.subtotal),
        shippingFee: Number(result.order.shippingFee),
        createdAt: result.order.createdAt,
      },
    }
  } catch (error) {
    console.error('Create order error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create order. Please try again.' }
  }
}
