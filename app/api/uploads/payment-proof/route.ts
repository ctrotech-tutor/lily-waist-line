import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getAppUrl } from '@/lib/utils/app-url'

// Allowed MIME types for payment proof images
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp']

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  getAppUrl(),
]

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const source = origin || referer
  if (!source) return false
  return ALLOWED_ORIGINS.some((o) => source.startsWith(o))
}

export async function POST(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Create Supabase server client
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPEG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Validate file is not empty
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty.' },
        { status: 400 }
      )
    }

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { 
        id: true, 
        userId: true,
        paymentProofs: {
          select: { status: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied. You can only upload payment proofs for your own orders.' },
        { status: 403 }
      )
    }

    // Check for duplicate pending proof
    const existingPendingProof = order.paymentProofs.some(proof => proof.status === 'PENDING')
    if (existingPendingProof) {
      return NextResponse.json(
        { error: 'A payment proof is already pending review. Please wait for admin verification before uploading another proof.' },
        { status: 409 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileName = `payment-proof-${timestamp}-${randomString}.${fileExt}`

    // Storage path: orders/{orderId}/payment-proof/{fileName}
    const storagePath = `orders/${orderId}/payment-proof/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file. Please try again.' },
        { status: 500 }
      )
    }

    // Create PaymentProof record in database
    const paymentProof = await prisma.paymentProof.create({
      data: {
        orderId: orderId,
        imageUrl: storagePath, // Store the storage path, not public URL
        status: 'PENDING'
      }
    })

    // Get signed URL for admin viewing (private bucket)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7) // 7 days expiry

    if (signedUrlError) {
      console.error('Failed to create signed URL:', signedUrlError)
      // Still return success, but without signed URL
    }

    return NextResponse.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: {
        id: paymentProof.id,
        status: paymentProof.status,
        uploadedAt: paymentProof.uploadedAt,
        // Only include signed URL for admin viewing (will be null for customers)
        adminViewUrl: signedUrlData?.signedUrl || null
      }
    })

  } catch (error) {
    console.error('Payment proof upload error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase server client
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Check if user is admin or order owner
    const userInfo = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const isAdmin = userInfo?.role === 'ADMIN'
    const isOwner = order.userId === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get payment proofs for the order
    const paymentProofs = await prisma.paymentProof.findMany({
      where: { orderId },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        status: true,
        uploadedAt: true
      }
    })

    // For admins, generate signed URLs for each proof
    if (isAdmin) {
      const proofsWithUrls = await Promise.all(
        paymentProofs.map(async (proof: { imageUrl: string; status: string; id: string; uploadedAt: Date }) => {
          const { data: signedUrlData } = await supabase.storage
            .from('payment-proofs')
            .createSignedUrl(proof.imageUrl, 60 * 60) // 1 hour expiry
          
          return {
            ...proof,
            viewUrl: signedUrlData?.signedUrl || null
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: proofsWithUrls
      })
    }

    // For customers, return basic info only
    return NextResponse.json({
      success: true,
      data: paymentProofs
    })

  } catch (error) {
    console.error('Get payment proofs error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
