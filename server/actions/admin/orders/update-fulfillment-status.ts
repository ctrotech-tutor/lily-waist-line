import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { FulfillmentStatus } from '@/lib/generated/prisma/enums'
import { sendShippingUpdateEmail } from '@/lib/services/email/email-triggers'

// Input validation schema
const updateFulfillmentStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  newStatus: z.enum(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

// Valid state transitions
const VALID_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [], // Terminal state
  CANCELLED: [], // Terminal state
}

export async function updateFulfillmentStatus(input: z.infer<typeof updateFulfillmentStatusSchema>) {
  try {
    // Validate input
    const { orderId, newStatus } = updateFulfillmentStatusSchema.parse(input)
    
    const supabase = await createClient()
    
    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'ADMIN') {
      throw new Error('Access denied. Admin access required.')
    }

    // Get current order status
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .select(`
        id,
        paymentStatus,
        fulfillmentStatus
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Validate payment status - order must be paid to process fulfillment
    if (order.paymentStatus !== 'PAID' && newStatus !== 'CANCELLED') {
      throw new Error('Cannot update fulfillment status for unpaid order')
    }

    const currentStatus = order.fulfillmentStatus

    // Validate state transition
    const allowedTransitions = VALID_TRANSITIONS[currentStatus as FulfillmentStatus]
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid fulfillment status transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ') || 'None (terminal state)'}`
      )
    }

    // Update order fulfillment status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('Order')
      .update({ 
        fulfillmentStatus: newStatus,
        updatedAt: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update fulfillment status: ${updateError.message}`)
    }

    // Create or update shipment record for shipped orders
    if (newStatus === 'SHIPPED') {
      const { error: shipmentError } = await supabase
        .from('Shipment')
        .upsert({
          orderId,
          carrier: 'PENDING', // Will be updated with add-tracking-number
          trackingNumber: null,
          shippedAt: new Date().toISOString(),
          deliveredAt: null,
        }, {
          onConflict: 'orderId'
        })

      if (shipmentError) {
        throw new Error(`Failed to create shipment record: ${shipmentError.message}`)
      }

      // Send shipping update email (non-blocking)
      try {
        // Get order and user details for email
        const { data: orderData } = await supabase
          .from('Order')
          .select(`
            userId,
            total,
            orderItems:OrderItem(
              quantity,
              product:Product(
                name
              )
            )
          `)
          .eq('id', orderId)
          .single()

        if (orderData) {
          const { data: userData } = await supabase
            .from('User')
            .select('fullName, email')
            .eq('id', orderData.userId)
            .single()

          if (userData) {
            const firstName = userData.fullName.split(' ')[0] || 'there'
            const orderNumber = `LWL-${new Date().getFullYear()}-${orderId.slice(-6).toUpperCase()}`
            const carrier = 'Shipping Carrier' // Will be updated when tracking is added
            const trackingNumber = 'Tracking will be updated soon'
            const estimatedDelivery = '3-5 business days'
            
            // Format items for email
            const emailItems = (orderData.orderItems as Array<{ product?: { name?: string }; quantity: number; variant?: { size?: string; compressionLevel?: string } }>).map(item => ({
              name: item.product?.name || 'Product',
              quantity: item.quantity,
            }))
            
            // Send shipping update email asynchronously
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
        }
      } catch (error) {
        console.error('Failed to send shipping update email:', error)
        // Don't break admin flow if email fails
      }
    }

    // Update delivered date for delivered orders
    if (newStatus === 'DELIVERED') {
      const { error: deliveryUpdateError } = await supabase
        .from('Shipment')
        .update({ 
          deliveredAt: new Date().toISOString()
        })
        .eq('orderId', orderId)

      if (deliveryUpdateError) {
        // Log warning but don't fail - shipment record might not exist yet
        console.warn('Warning: Could not update delivered date for shipment:', deliveryUpdateError.message)
      }
    }

    // Revalidate admin pages
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)

    return {
      success: true,
      message: `Fulfillment status updated from ${currentStatus} to ${newStatus}`,
      orderId,
      previousStatus: currentStatus,
      newStatus,
      order: updatedOrder,
    }

  } catch (error) {
    console.error('Error in updateFulfillmentStatus:', error)
    throw error
  }
}
