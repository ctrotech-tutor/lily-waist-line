'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { selectPaymentMethodSchema, type SelectPaymentMethodInput } from '@/lib/validators/payment'

/**
 * Validates payment method based on shipping address country
 * US customers can only use CASH_APP
 * International customers can only use PAYPAL
 */
function validatePaymentMethodForRegion(country: string, paymentMethod: string): boolean {
  const normalizedCountry = country.toLowerCase().trim()
  
  // United States variants - use exact matching or word boundaries to avoid false positives
  const usCountries = ['united states', 'usa', 'us', 'america']
  const isUS = usCountries.some(us => {
    // Check for exact match or if country starts with/contains the US variant as a whole word
    return normalizedCountry === us || 
           normalizedCountry.startsWith(us + ' ') || 
           normalizedCountry.endsWith(' ' + us) ||
           normalizedCountry.includes(' ' + us + ' ')
  })
  
  if (isUS) {
    return paymentMethod === 'CASH_APP'
  } else {
    return paymentMethod === 'PAYPAL'
  }
}

export async function selectPaymentMethod(input: SelectPaymentMethodInput) {
  try {
    // Validate input
    const validatedData = selectPaymentMethodSchema.parse(input)

    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to select a payment method'
      }
    }

    // Fetch the order with shipping address to validate ownership and region
    const order = await prisma.order.findUnique({
      where: {
        id: validatedData.orderId
      },
      include: {
        address: true // Include the address relation (shippingAddress)
      }
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // Validate order ownership
    if (order.userId !== user.id) {
      return {
        success: false,
        error: 'You can only modify your own orders'
      }
    }

    // Validate that payment method can be changed (future-proof for payment proof upload)
    if (order.paymentStatus !== 'PENDING') {
      return {
        success: false,
        error: 'Payment method cannot be changed after payment is initiated'
      }
    }

    // Validate shipping address exists
    if (!order.address) {
      return {
        success: false,
        error: 'Shipping address is required before selecting payment method'
      }
    }

    // Validate payment method based on region
    const isPaymentMethodValid = validatePaymentMethodForRegion(
      order.address.country,
      validatedData.paymentMethod
    )

    if (!isPaymentMethodValid) {
      const isUS = ['united states', 'usa', 'us', 'america'].some(
        us => order.address!.country.toLowerCase().includes(us)
      )
      
      return {
        success: false,
        error: isUS 
          ? 'Cash App is the only available payment method for US customers'
          : 'PayPal is the only available payment method for international customers'
      }
    }

    // Update the order with the selected payment method
    const updatedOrder = await prisma.order.update({
      where: {
        id: validatedData.orderId
      },
      data: {
        paymentMethod: validatedData.paymentMethod,
        // Keep payment status as PENDING as specified
        updatedAt: new Date()
      }
    })

    // Revalidate relevant paths
    revalidatePath('/checkout')
    revalidatePath('/order/confirmation')
    revalidatePath(`/orders/${validatedData.orderId}`)

    return {
      success: true,
      data: {
        orderId: updatedOrder.id,
        paymentMethod: updatedOrder.paymentMethod,
        paymentStatus: updatedOrder.paymentStatus
      }
    }

  } catch (error) {
    console.error('Error selecting payment method:', error)
    
    // Handle Zod validation errors
    if (error instanceof Error && error.message.includes('Invalid payment method')) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to select payment method. Please try again.'
    }
  }
}
