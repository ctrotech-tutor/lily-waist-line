import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { PaymentStatus, PaymentProofStatus } from '@/lib/generated/prisma/enums'
import { sendPaymentReceivedEmail } from '@/lib/services/email/email-triggers'

// Input validation schema
const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
})

export async function verifyPayment(input: z.infer<typeof verifyPaymentSchema>) {
  try {
    // Validate input
    const { orderId, action, reason } = verifyPaymentSchema.parse(input)
    
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

    // Start transaction to ensure data consistency
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .select(`
        id,
        paymentStatus,
        paymentMethod,
        total,
        userId,
        paymentProofs:PaymentProof(
          id,
          status
        ),
        orderItems:OrderItem(
          quantity,
          unitPrice,
          product:Product(
            name
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Validate current payment status
    if (order.paymentStatus !== 'PENDING') {
      throw new Error(`Cannot verify payment for order with status: ${order.paymentStatus}`)
    }

    // Check if payment proof exists
    if (!order.paymentProofs || order.paymentProofs.length === 0) {
      throw new Error('No payment proof found for this order')
    }

    // Determine new statuses
    const newPaymentStatus: PaymentStatus = action === 'APPROVE' ? 'PAID' : 'REJECTED'
    const newProofStatus: PaymentProofStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'

    // Update order payment status
    const { error: updateOrderError } = await supabase
      .from('Order')
      .update({ 
        paymentStatus: newPaymentStatus,
        updatedAt: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateOrderError) {
      throw new Error(`Failed to update order payment status: ${updateOrderError.message}`)
    }

    // Send payment received email if payment was approved (non-blocking)
    if (action === 'APPROVE') {
      try {
        // Get user details for email
        const { data: userData } = await supabase
          .from('User')
          .select('fullName, email')
          .eq('id', order.userId)
          .single()

        if (userData) {
          const firstName = userData.fullName.split(' ')[0] || 'there'
          const orderNumber = `LWL-${new Date().getFullYear()}-${order.id.slice(-6).toUpperCase()}`
          const paymentMethod = order.paymentMethod === 'CASH_APP' ? 'Cash App' : 'PayPal'
          const amount = `$${Number(order.total).toFixed(2)}`
          
          // Format items for email
          const emailItems = (order.orderItems as Array<{ product?: { name?: string }; quantity: number; variant?: { size?: string; compressionLevel?: string } }>).map(item => ({
            name: item.product?.name || 'Product',
            quantity: item.quantity,
          }))
          
          // Send payment received email asynchronously
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
        // Don't break admin flow if email fails
      }
    }

    // Update payment proof status
    const { error: updateProofError } = await supabase
      .from('PaymentProof')
      .update({ 
        status: newProofStatus
      })
      .eq('orderId', orderId)
      .eq('status', 'PENDING') // Only update pending proofs

    if (updateProofError) {
      throw new Error(`Failed to update payment proof status: ${updateProofError.message}`)
    }

    // If payment was rejected, also cancel fulfillment
    if (action === 'REJECT') {
      const { error: cancelFulfillmentError } = await supabase
        .from('Order')
        .update({ 
          fulfillmentStatus: 'CANCELLED',
          updatedAt: new Date().toISOString()
        })
        .eq('id', orderId)

      if (cancelFulfillmentError) {
        throw new Error(`Failed to cancel order fulfillment: ${cancelFulfillmentError.message}`)
      }
    }

    // Revalidate admin pages
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)

    return {
      success: true,
      message: `Payment ${action.toLowerCase()}d successfully`,
      orderId,
      newPaymentStatus,
      newProofStatus,
    }

  } catch (error) {
    console.error('Error in verifyPayment:', error)
    throw error
  }
}
