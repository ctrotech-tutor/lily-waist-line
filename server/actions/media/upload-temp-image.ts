'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { storageService } from '@/lib/services/storage-service'
import type { UploadProductImageResult } from '@/types/media'

export async function uploadTempImage(formData: FormData): Promise<UploadProductImageResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Authentication required' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false, error: 'Admin access required' }
    }

    const file = formData.get('file') as File

    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' }
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB.' }
    }

    const result = await storageService.uploadTempImage({ file, userId: user.id })

    if (result.error) {
      return { success: false, error: result.error }
    }

    return { success: true, url: result.url, path: result.path }
  } catch (error) {
    console.error('Temp upload error:', error)
    return { success: false, error: 'Upload failed. Please try again.' }
  }
}
