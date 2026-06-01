"use client";

import { useMemo, useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
  extends Omit<ImageProps, "onLoad" | "onError" | "src"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  wrapperClassName?: string;
  enableLazyLoad?: boolean;
  quality?: number;
}

/**
 * Valid sources:
 * - /images/photo.jpg
 * - https://...
 * - http://...
 * - data:image/...
 * - blob:...
 */
function isValidImageSrc(
  value?: string | null
): value is string {
  if (!value || typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("blob:")
  );
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/logo.svg",
  className,
  wrapperClassName,
  enableLazyLoad = true,
  priority = false,
  quality = 80,
  sizes = "(max-width: 768px) 100vw, 50vw",
  width,
  height,
  fill,
  ...props
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  const useFill = fill || (!width && !height);

  const safeSrc = useMemo(() => {
    if (hasError) {
      return fallbackSrc;
    }

    return isValidImageSrc(src)
      ? src
      : fallbackSrc;
  }, [src, hasError, fallbackSrc]);

  return (
    <div
      className={cn(
        "relative",
        useFill && "h-full w-full",
        wrapperClassName
      )}
    >
      <Image
        src={safeSrc}
        alt={alt}
        quality={quality}
        fill={useFill}
        width={!useFill ? width : undefined}
        height={!useFill ? height : undefined}
        priority={priority}
        sizes={sizes}
        loading={
          enableLazyLoad && !priority
            ? "lazy"
            : "eager"
        }
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        className={cn(
          "object-cover",
          "transform-gpu",
          "backface-hidden",
          "transform-[translateZ(0)]",
          className
        )}
        {...props}
      />

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center border border-border bg-card">
          <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center">
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                "border border-primary/20 bg-background",
                "size-10 sm:size-14"
              )}
            >
              <span
                className={cn(
                  "ml-0.5 font-semibold text-primary",
                  "text-[10px] sm:text-sm",
                  "tracking-[0.18em]"
                )}
              >
                LWL
              </span>
            </div>

            <p
              className={cn(
                "hidden max-w-full truncate",
                "text-[8px] sm:text-[10px]",
                "font-medium uppercase",
                "tracking-[0.18em]",
                "text-muted-foreground"
              )}
            >
              Image Unavailable
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* PRODUCT IMAGE */

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string | null;
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
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className={cn(
        "object-cover",
        className
      )}
    />
  );
}

/* THUMBNAIL IMAGE */

export function ThumbnailImage({
  src,
  alt,
  className,
  size = 80,
}: {
  src?: string | null;
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
      sizes={`${size}px`}
      className={cn(
        "rounded-md object-cover",
        className
      )}
    />
  );
}

/* HERO IMAGE */

export function HeroImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src?: string | null;
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
      sizes={sizes}
      className={cn(
        "object-cover",
        className
      )}
    />
  );
}

/* AVATAR IMAGE */

export function AvatarImage({
  src,
  alt,
  size = 40,
  className,
}: {
  src?: string | null;
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
      className={cn(
        "rounded-full object-cover",
        className
      )}
    />
  );
}