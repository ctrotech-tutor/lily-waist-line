import { supabaseAdmin } from '../supabase/admin'
import { isAllowedImageType } from '@/lib/utils/file-validation'
import type { UploadResult, StorageError } from '@/types/media'

export type { UploadResult, StorageError }

export class StorageService {
  private bucketName = 'product-images'

  /**
   * Upload a product image to Supabase Storage
   */
  async uploadProductImage({
    file,
    productId,
    variantId,
    type = 'gallery'
  }: {
    file: File
    productId: string
    variantId?: string
    type?: 'main' | 'variant' | 'gallery'
  }): Promise<UploadResult> {
    try {
      // Validate file type
      if (!this.isValidImageFile(file)) {
        return {
          success: false,
          url: '',
          path: '',
          error: 'Invalid file type. Only images are allowed.'
        }
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          url: '',
          path: '',
          error: 'File size must be less than 5MB.'
        }
      }

      // Generate file path
      const path = this.generateFilePath(productId, variantId, file.name, type)

      // Upload file
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true
        })

      if (error) {
        return {
          success: false,
          url: '',
          path: '',
          error: error.message
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(path)

      return {
        success: true,
        url: publicUrl,
        path: data.path
      }
    } catch (error) {
      return {
        success: false,
        url: '',
        path: '',
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * Upload a temp image before product creation
   * Uses userId + timestamp for path since productId isn't known yet
   */
  async uploadTempImage({
    file,
    userId,
  }: {
    file: File
    userId: string
  }): Promise<UploadResult> {
    try {
      if (!this.isValidImageFile(file)) {
        return { success: false, url: '', path: '', error: 'Invalid file type. Only images are allowed.' }
      }
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, url: '', path: '', error: 'File size must be less than 5MB.' }
      }

      const timestamp = Date.now()
      const fileParts = file.name.split('.')
      const extension = fileParts.length > 1 ? fileParts.pop()! : 'jpg'
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, -extension.length - 1)
      const uniqueFileName = `${sanitizedName}-${timestamp}.${extension}`
      const path = `temp/uploads/${userId}/${uniqueFileName}`

      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true
        })

      if (error) {
        return { success: false, url: '', path: '', error: error.message }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(path)

      return { success: true, url: publicUrl, path: data.path }
    } catch (error) {
      return { success: false, url: '', path: '', error: error instanceof Error ? error.message : 'Upload failed' }
    }
  }

  /**
   * Delete a product image from Supabase Storage
   */
  async deleteProductImage(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .remove([path])

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  }

  /**
   * Get public URL for a file path
   */
  getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(path)

    return publicUrl
  }

  /**
   * Generate file path following the folder structure convention
   */
  private generateFilePath(
    productId: string,
    variantId: string | undefined,
    fileName: string,
    type: 'main' | 'variant' | 'gallery'
  ): string {
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const fileParts = fileName.split('.')
    const extension = fileParts.length > 1 ? fileParts.pop()! : 'jpg'
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, -extension.length - 1)
    const uniqueFileName = `${sanitizedName}-${timestamp}.${extension}`

    switch (type) {
      case 'main':
        return `products/${productId}/main/${uniqueFileName}`
      case 'variant':
        if (!variantId) {
          throw new Error('Variant ID is required for variant images')
        }
        return `products/${productId}/variants/${variantId}/${uniqueFileName}`
      case 'gallery':
        return `products/${productId}/gallery/${uniqueFileName}`
      default:
        return `products/${productId}/gallery/${uniqueFileName}`
    }
  }

  /**
   * Validate if file is an image
   */
  private isValidImageFile(file: File): boolean {
    return isAllowedImageType(file.type, file.name)
  }

  /**
   * Create product-images bucket if it doesn't exist
   */
  async createBucketIfNotExists(): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

      if (listError) {
        return {
          success: false,
          error: listError.message
        }
      }

      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName)

      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabaseAdmin.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/x-png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        })

        if (createError) {
          return {
            success: false,
            error: createError.message
          }
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bucket creation failed'
      }
    }
  }
}

// Singleton instance
export const storageService = new StorageService()
