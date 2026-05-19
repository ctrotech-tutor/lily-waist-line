"use client";

import { cn } from "@/lib/utils";

export interface WishlistItemCardSkeletonProps {
  className?: string;
}

export function WishlistItemCardSkeleton({
  className,
}: WishlistItemCardSkeletonProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col",
        "rounded-2xl overflow-hidden",
        "bg-card border border-border",
        className
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {/* Shimmer */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-linear-to-r from-transparent via-white/10 to-transparent",
            "animate-pulse"
          )}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3 p-4">
        {/* Stock Badge */}
        <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />

        {/* Title */}
        <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />

        {/* Tagline */}
        <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-5 w-16 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-12 rounded-md bg-muted/60 animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-11 w-full rounded-full bg-muted animate-pulse mt-2" />
      </div>
    </div>
  );
}