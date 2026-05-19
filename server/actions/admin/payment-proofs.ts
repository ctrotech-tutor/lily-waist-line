import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { paymentProofStatusUpdateSchema } from '@/lib/validators/payment-proof'
import type { PaymentProofStatus } from '@/lib/generated/prisma/enums'

// Admin action to get payment proof with signed URL
export async function getPaymentProofForAdmin(proofId: string) {
  try {
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

    // Get payment proof
    const { data: proof, error } = await supabase
      .from('PaymentProof')
      .select(`
        *,
        order:Order(
          id,
          total,
          paymentMethod,
          paymentStatus,
          user:User(
            id,
            email,
            fullName
          )
        )
      `)
      .eq('id', proofId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch payment proof: ${error.message}`)
    }

    if (!proof) {
      throw new Error('Payment proof not found')
    }

    // Generate signed URL for the proof image
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(proof.imageUrl, 60 * 60) // 1 hour expiry

    if (signedUrlError) {
      console.error('Failed to create signed URL:', signedUrlError)
    }

    return {
      ...proof,
      viewUrl: signedUrlData?.signedUrl || null
    }

  } catch (error) {
    console.error('Get payment proof error:', error)
    throw error
  }
}

// Admin action to update payment proof status
export async function updatePaymentProofStatus(
  proofId: string,
  data: z.infer<typeof paymentProofStatusUpdateSchema>
) {
  try {
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

    // Validate input
    const validatedData = paymentProofStatusUpdateSchema.parse(data)

    // Get current proof to check status transition
    const { data: currentProof, error: fetchError } = await supabase
      .from('PaymentProof')
      .select('status, orderId')
      .eq('id', proofId)
      .single()

    if (fetchError || !currentProof) {
      throw new Error('Payment proof not found')
    }

    // Validate status transition rules
    if (currentProof.status === 'VERIFIED' && validatedData.status !== 'REJECTED') {
      throw new Error('Cannot change status from VERIFIED to PENDING')
    }

    // Update payment proof status
    const { data: updatedProof, error: updateError } = await supabase
      .from('PaymentProof')
      .update({
        status: validatedData.status,
        // Note: We could add an adminNote field to the schema if needed
      })
      .eq('id', proofId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update payment proof: ${updateError.message}`)
    }

    // If proof is verified, update order payment status
    if (validatedData.status === 'VERIFIED') {
      const { error: orderUpdateError } = await supabase
        .from('Order')
        .update({ paymentStatus: 'PAID' })
        .eq('id', currentProof.orderId)

      if (orderUpdateError) {
        console.error('Failed to update order payment status:', orderUpdateError)
        // Don't throw error here since proof was updated successfully
      }
    }

    // If proof is rejected, allow customer to upload new proof
    // This is handled automatically by the upload endpoint logic

    // Revalidate admin pages
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${currentProof.orderId}`)

    return updatedProof

  } catch (error) {
    console.error('Update payment proof status error:', error)
    throw error
  }
}

// Admin action to get all payment proofs with filtering
export async function getAllPaymentProofs(filters?: {
  status?: PaymentProofStatus
  orderId?: string
  userId?: string
  page?: number
  limit?: number
}) {
  try {
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

    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const offset = (page - 1) * limit

    let query = supabase
      .from('PaymentProof')
      .select(`
        *,
        order:Order(
          id,
          total,
          paymentMethod,
          paymentStatus,
          user:User(
            id,
            email,
            fullName
          )
        )
      `)
      .order('uploadedAt', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.orderId) {
      query = query.eq('orderId', filters.orderId)
    }
    if (filters?.userId) {
      query = query.eq('order.user.id', filters.userId)
    }

    const { data: proofs, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch payment proofs: ${error.message}`)
    }

    return {
      proofs: proofs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }

  } catch (error) {
    console.error('Get all payment proofs error:', error)
    throw error
  }
}

// Admin action to delete payment proof
export async function deletePaymentProof(proofId: string) {
  try {
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

    // Get proof details before deletion
    const { data: proof, error: fetchError } = await supabase
      .from('PaymentProof')
      .select('imageUrl, orderId')
      .eq('id', proofId)
      .single()

    if (fetchError || !proof) {
      throw new Error('Payment proof not found')
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('payment-proofs')
      .remove([proof.imageUrl])

    if (storageError) {
      console.error('Failed to delete payment proof file:', storageError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('PaymentProof')
      .delete()
      .eq('id', proofId)

    if (deleteError) {
      throw new Error(`Failed to delete payment proof: ${deleteError.message}`)
    }

    // Revalidate admin pages
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${proof.orderId}`)

    return { success: true }

  } catch (error) {
    console.error('Delete payment proof error:', error)
    throw error
  }
}
