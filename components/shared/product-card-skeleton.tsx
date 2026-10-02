"use client";

import { cn } from "@/lib/utils";

export interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({
  className,
}: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col cursor-pointer",
        className
      )}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative aspect-3/4 overflow-hidden",
          "rounded-3xl",
          "bg-muted/70"
        )}
      >
        {/* Premium shimmer */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-linear-to-r from-transparent via-background/40 to-transparent",
            "-translate-x-full animate-shimmer"
          )}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 pt-5">
        {/* Title */}
        <div className="h-5 w-3/4 rounded-full bg-muted animate-pulse" />

        {/* Subtitle */}
        <div className="h-4 w-1/2 rounded-full bg-muted animate-pulse" />

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
        </div>

        {/* Stock */}
        <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}