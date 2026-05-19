"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
  extends Omit<ImageProps, "onLoad" | "onError" | "src"> {
  src: string;
  fallbackSrc?: string;
  wrapperClassName?: string;
  enableLazyLoad?: boolean;
}

/**
 * Production-ready optimized image component
 *
 * Features:
 * - Skeleton loading state
 * - Broken image fallback
 * - Fade-in animation
 * - Lazy loading
 * - Supports both fill + fixed dimensions
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/logo.svg",
  className,
  wrapperClassName,
  enableLazyLoad = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  width,
  height,
  fill,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const useFill = fill || (!width && !height);

  const imageSrc = hasError ? fallbackSrc : src;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        useFill && "w-full h-full",
        wrapperClassName
      )}
    >
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {/* Actual Image */}
      <Image
        src={imageSrc}
        alt={alt}
        fill={useFill}
        width={!useFill ? width : undefined}
        height={!useFill ? height : undefined}
        priority={priority}
        sizes={sizes}
        loading={enableLazyLoad && !priority ? "lazy" : "eager"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-card border border-border">

          <div className="flex flex-col items-center gap-3">

            {/* LWL Brand Mark */}
            <div className="flex items-center justify-center size-20 border border-primary/20 rounded-full bg-background">
              <span className="font-heading text-2xl tracking-[0.25em] text-primary ml-1">
                LWL
              </span>
            </div>

            {/* Brand Label */}
            <div className="text-center">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Product Image
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

/**
 * Product images
 */
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  );
}

/**
 * Thumbnail images
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  size = 80,
}: {
  src: string;
  alt: string;
  className?: string;
  size?: number;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-md object-cover", className)}
      sizes={`${size}px`}
    />
  );
}

/**
 * Hero images
 */
export function HeroImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      className={cn("object-cover", className)}
      sizes={sizes}
    />
  );
}

/**
 * Avatar images
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  className,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted",
          className
        )}
        style={{
          width: size,
          height: size,
        }}
      >
        <span className="text-xs font-medium text-muted-foreground">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn("rounded-full object-cover", className)}
    />
  );
}