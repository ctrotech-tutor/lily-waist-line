'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Prisma, PrismaClient } from '@/lib/generated/prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/services/email/email-triggers'

// Transaction result type
interface OrderCreationResult {
  order: {
    id: string
    userId: string
    addressId: string
    subtotal: number
    shippingFee: number
    total: number
    paymentMethod: string
    paymentStatus: string
    fulfillmentStatus: string
    createdAt: Date
  }
  orderItems: Array<{
    id: string
    orderId: string
    productId: string
    variantId: string
    quantity: number
    unitPrice: number
    product: {
      name: string
    }
    variant: {
      size: string
      compressionLevel: string
      color: string | null
      sku: string
    }
  }>
  address: {
    id: string
    firstName: string
    lastName: string
    company: string | null
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    postalCode: string
    country: string
    phone: string | null
  }
}

const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Address ID is required'),
  paymentMethod: z.enum(['CASH_APP', 'PAYPAL'])
})

export async function createOrder(formData: { addressId: string; paymentMethod: string }) {
  try {
    // Validate input
    const validatedData = createOrderSchema.parse(formData)

    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to create an order'
      }
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>): Promise<OrderCreationResult> => {
      // Fetch user's cart with full product and variant data
      const cartItems = await tx.cartItem.findMany({
        where: { userId: user.id },
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      })

      if (cartItems.length === 0) {
        throw new Error('Your cart is empty')
      }

      // Validate stock for all cart items
      for (const cartItem of cartItems) {
        if (cartItem.variant.stockQuantity < cartItem.quantity) {
          throw new Error(`Insufficient stock for ${cartItem.variant.product.name}. Only ${cartItem.variant.stockQuantity} items available.`)
        }
      }

      // Fetch and validate address ownership
      const address = await tx.address.findFirst({
        where: {
          id: validatedData.addressId,
          userId: user.id
        }
      })

      if (!address) {
        throw new Error('Invalid address selected')
      }

      // Calculate totals using live database values
      let subtotal = 0
      for (const cartItem of cartItems) {
        const itemTotal = Number(cartItem.variant.product.basePrice) * cartItem.quantity
        subtotal += itemTotal
      }

      // For phase one, shipping fee is placeholder ($10)
      const shippingFee = 10
      const total = subtotal + shippingFee

      // Create order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          addressId: validatedData.addressId,
          subtotal,
          shippingFee,
          total,
          paymentMethod: validatedData.paymentMethod,
          paymentStatus: 'PENDING',
          fulfillmentStatus: 'PENDING'
        }
      })

      // Create order items with snapshot data
      const orderItems = await Promise.all(
        cartItems.map((cartItem) =>
          tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: cartItem.variant.productId,
              variantId: cartItem.variantId,
              quantity: cartItem.quantity,
              unitPrice: cartItem.variant.product.basePrice
            },
            include: {
              product: {
                select: {
                  name: true
                }
              },
              variant: {
                select: {
                  size: true,
                  compressionLevel: true,
                  color: true,
                  sku: true
                }
              }
            }
          })
        )
      )

      // Clear cart items after successful order creation
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      })

      return {
        order: {
          ...order,
          subtotal: Number(order.subtotal),
          shippingFee: Number(order.shippingFee),
          total: Number(order.total)
        },
        orderItems: orderItems.map(item => ({
          ...item,
          unitPrice: Number(item.unitPrice)
        })),
        address
      }
    })

    // Send order confirmation email (non-blocking)
    try {
      const orderNumber = `LWL-${new Date().getFullYear()}-${result.order.id.slice(-6).toUpperCase()}`
      const firstName = result.address.firstName
      const email = user.email || ''
      
      // Format items for email template
      const emailItems = result.orderItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: `$${Number(item.unitPrice).toFixed(2)}`,
        size: item.variant.size,
        compression: item.variant.compressionLevel,
      }))
      
      // Format shipping address for email template
      const shippingAddress = {
        name: `${result.address.firstName} ${result.address.lastName}`,
        address: `${result.address.addressLine1}${result.address.addressLine2 ? ', ' + result.address.addressLine2 : ''}`,
        city: result.address.city,
        state: result.address.state,
        country: result.address.country,
        postalCode: result.address.postalCode,
      }
      
      // Send order confirmation email asynchronously
      sendOrderConfirmationEmail(
        firstName,
        email,
        orderNumber,
        emailItems,
        `$${Number(result.order.subtotal).toFixed(2)}`,
        `$${Number(result.order.shippingFee).toFixed(2)}`,
        `$${Number(result.order.total).toFixed(2)}`,
        shippingAddress
      )
    } catch (error) {
      console.error('Failed to send order confirmation email:', error)
      // Don't break order flow if email fails
    }

    // Revalidate relevant paths
    revalidatePath('/cart')
    revalidatePath('/orders')
    revalidatePath('/checkout')

    return {
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: result.order.id,
        orderNumber: `LWL-${new Date().getFullYear()}-${result.order.id.slice(-6).toUpperCase()}`,
        total: Number(result.order.total),
        paymentMethod: result.order.paymentMethod,
        paymentStatus: result.order.paymentStatus,
        fulfillmentStatus: result.order.fulfillmentStatus,
        items: result.orderItems.map(item => ({
          id: item.id,
          productName: item.product.name,
          size: item.variant.size,
          compressionLevel: item.variant.compressionLevel,
          color: item.variant.color,
          sku: item.variant.sku,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.unitPrice) * item.quantity
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
          phone: result.address.phone
        },
        subtotal: Number(result.order.subtotal),
        shippingFee: Number(result.order.shippingFee),
        createdAt: result.order.createdAt
      }
    }

  } catch (error) {
    console.error('Create order error:', error)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to create order. Please try again.'
    }
  }
}
