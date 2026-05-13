'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  wrapperClassName?: string
  enableLazyLoad?: boolean
  priority?: boolean
  sizes?: string
}

/**
 * Optimized Image Component with lazy loading and responsive sizing
 * Implements performance best practices for image loading
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className,
  wrapperClassName,
  enableLazyLoad = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width,
  height,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Use fallback image if there's an error
  const imageSrc = hasError ? fallbackSrc : src

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}
      
      {/* Optimized Next.js Image */}
      <Image
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={enableLazyLoad && !priority ? 'lazy' : 'eager'}
        priority={priority}
        sizes={sizes}
        width={width}
        height={height}
        {...props}
      />
      
      {/* Error state overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-500 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  )
}

/**
 * Product Image Component with specific optimizations for product images
 */
export function ProductImage({
  src,
  alt,
  className,
  width = 300,
  height = 400,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      enableLazyLoad={!priority}
    />
  )
}

/**
 * Thumbnail Image Component for gallery thumbnails
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  width = 80,
  height = 80,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('object-cover rounded-md', className)}
      width={width}
      height={height}
      priority={false}
      sizes="80px"
      enableLazyLoad={true}
    />
  )
}

/**
 * Hero Image Component for large hero sections
 */
export function HeroImage({
  src,
  alt,
  className,
  priority = true,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      width={1920}
      height={1080}
      priority={priority}
      sizes="100vw"
      enableLazyLoad={!priority}
    />
  )
}

/**
 * Avatar Image Component for user avatars
 */
export function AvatarImage({
  src,
  alt,
  className,
  size = 40,
}: {
  src?: string
  alt: string
  className?: string
  size?: number
}) {
  if (!src) {
    // Default avatar placeholder
    return (
      <div 
        className={cn(
          'bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-500 text-xs">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('object-cover rounded-full', className)}
      width={size}
      height={size}
      priority={false}
      sizes={`${size}px`}
      enableLazyLoad={true}
    />
  )
}
