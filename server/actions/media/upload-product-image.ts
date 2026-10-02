'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { storageService } from '@/lib/services/storage-service'
import type { UploadProductImageResult } from '@/types/media'

export async function uploadProductImage(formData: FormData): Promise<UploadProductImageResult> {
  try {
    // Verify user is authenticated and is admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required'
      }
    }

    // Check if user has admin role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Admin access required'
      }
    }

    // Extract form data
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const variantId = formData.get('variantId') as string | null
    const type = formData.get('type') as 'main' | 'variant' | 'gallery' || 'gallery'

    // Validate required fields
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      }
    }

    if (!productId) {
      return {
        success: false,
        error: 'Product ID is required'
      }
    }

    // Validate file type and size
    const { isAllowedImageType } = await import('@/lib/utils/file-validation')
    if (!isAllowedImageType(file.type, file.name)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
      }
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB.'
      }
    }

    // Upload image using storage service
    const result = await storageService.uploadProductImage({
      file,
      productId,
      variantId: variantId || undefined,
      type
    })

    if (result.error) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      url: result.url,
      path: result.path
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Upload failed. Please try again.'
    }
  }
}

export async function deleteProductImage(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user is authenticated and is admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required'
      }
    }

    // Check if user has admin role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Admin access required'
      }
    }

    // Delete image using storage service
    const result = await storageService.deleteProductImage(path)

    return result

  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: 'Delete failed. Please try again.'
    }
  }
}

export async function createStorageBucket(): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user is authenticated and is admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required'
      }
    }

    // Check if user has admin role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Admin access required'
      }
    }

    // Create bucket using storage service
    const result = await storageService.createBucketIfNotExists()

    return result

  } catch (error) {
    console.error('Bucket creation error:', error)
    return {
      success: false,
      error: 'Bucket creation failed. Please try again.'
    }
  }
}
