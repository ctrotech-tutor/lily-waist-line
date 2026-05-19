"use client";

import { cn } from "@/lib/utils";

export interface ShopHeaderSkeletonProps {
  className?: string;
}

export function ShopHeaderSkeleton({
  className,
}: ShopHeaderSkeletonProps) {
  return (
    <header className={cn("relative w-full", className)}>
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="py-12 md:py-16 lg:py-20">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />

            <div className="h-3 w-28 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Accent Line */}
          <div className="mb-8 h-px w-16 bg-muted/60" />

          {/* Heading */}
          <div className="mb-4 h-12 w-full max-w-xl rounded-full bg-muted animate-pulse sm:h-14" />

          {/* Subtitle */}
          <div className="space-y-3 mb-8 max-w-2xl">
            <div className="h-4 w-full rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-[90%] rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-[65%] rounded-full bg-muted animate-pulse" />
          </div>

          {/* Product Count */}
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />

            <div className="h-4 w-36 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border/40" />
    </header>
  );
}

export default ShopHeaderSkeleton;