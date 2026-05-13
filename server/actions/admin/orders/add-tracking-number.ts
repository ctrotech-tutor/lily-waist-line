import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Input validation schema
const addTrackingNumberSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  carrier: z.string().min(1, 'Carrier name is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required'),
})

export async function addTrackingNumber(input: z.infer<typeof addTrackingNumberSchema>) {
  try {
    // Validate input
    const { orderId, carrier, trackingNumber } = addTrackingNumberSchema.parse(input)
    
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

    // Validate order is ready for tracking
    if (order.paymentStatus !== 'PAID') {
      throw new Error('Cannot add tracking number for unpaid order')
    }

    if (order.fulfillmentStatus === 'PENDING') {
      throw new Error('Cannot add tracking number for order that has not been processed')
    }

    if (order.fulfillmentStatus === 'CANCELLED') {
      throw new Error('Cannot add tracking number for cancelled order')
    }

    // Check if tracking number already exists for this order
    const { data: existingShipment, error: existingError } = await supabase
      .from('Shipment')
      .select('id, trackingNumber, shippedAt, deliveredAt')
      .eq('orderId', orderId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') { // Not found error
      throw new Error(`Error checking existing shipment: ${existingError.message}`)
    }

    // Create or update shipment record
    const { data: shipment, error: shipmentError } = await supabase
      .from('Shipment')
      .upsert({
        orderId,
        carrier,
        trackingNumber,
        shippedAt: existingShipment?.shippedAt || new Date().toISOString(),
        deliveredAt: existingShipment?.deliveredAt || null,
      }, {
        onConflict: 'orderId'
      })
      .select()
      .single()

    if (shipmentError) {
      throw new Error(`Failed to save tracking information: ${shipmentError.message}`)
    }

    // If order is not yet marked as shipped, update it
    if (order.fulfillmentStatus === 'PROCESSING') {
      const { error: statusUpdateError } = await supabase
        .from('Order')
        .update({ 
          fulfillmentStatus: 'SHIPPED',
          updatedAt: new Date().toISOString()
        })
        .eq('id', orderId)

      if (statusUpdateError) {
        throw new Error(`Failed to update order status to shipped: ${statusUpdateError.message}`)
      }
    }

    // Revalidate admin pages
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)

    return {
      success: true,
      message: `Tracking number added successfully`,
      orderId,
      carrier,
      trackingNumber,
      shipment,
      orderStatusUpdated: order.fulfillmentStatus === 'PROCESSING',
    }

  } catch (error) {
    console.error('Error in addTrackingNumber:', error)
    throw error
  }
}
