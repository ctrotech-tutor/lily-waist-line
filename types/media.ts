/**
 * Media/upload-related types
 */

// Upload result from storage service
export interface UploadResult {
  success: boolean
  url: string
  path: string
  error?: string
}

// Storage error
export interface StorageError {
  message: string
  code?: string
}

// Upload product image result
export interface UploadProductImageResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}