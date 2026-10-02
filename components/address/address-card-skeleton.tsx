import { cn } from "@/lib/utils";

export interface AddressCardSkeletonProps {
  className?: string;
}

export function AddressCardSkeleton({ className }: AddressCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative p-6 md:p-8 border border-border bg-card",
        className
      )}
    >
      {/* Default Badge Skeleton */}
      <div className="absolute top-4 right-4">
        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
      </div>

      {/* Address Content */}
      <div className="flex items-start gap-4">
        {/* Icon Skeleton */}
        <div className="shrink-0">
          <div className="w-12 h-12 border border-border bg-muted animate-pulse" />
        </div>

        {/* Address Details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name Skeleton */}
          <div className="h-7 w-48 bg-muted animate-pulse rounded" />

          {/* Company Skeleton */}
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />

          {/* Address Lines Skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-muted animate-pulse rounded" />
            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
          </div>

          {/* Phone Skeleton */}
          <div className="h-5 w-40 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
        <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
        <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
        <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
