"use client";

import { cn } from "@/lib/utils";

export interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("group relative flex flex-col", className)}>
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {/* Shimmer Effect */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-linear-to-r from-transparent via-background/20 to-transparent",
            "animate-shimmer",
            "-translate-x-full"
          )}
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1.5 pt-4">
        {/* Product Name */}
        <div className="h-6 w-3/4 bg-muted animate-pulse" />

        {/* Product Subtitle */}
        <div className="h-4 w-1/2 bg-muted animate-pulse" />

        {/* Pricing Row */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-5 w-16 bg-muted animate-pulse" />
        </div>

        {/* Stock Status */}
        <div className="h-3 w-20 bg-muted animate-pulse" />
      </div>
    </div>
  );
}
