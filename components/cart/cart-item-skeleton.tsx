export function CartItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 p-4 sm:p-6 bg-card border border-border">
      {/* Image Skeleton */}
      <div className="relative w-full sm:w-24 md:w-32 aspect-3/4 sm:aspect-square shrink-0 overflow-hidden bg-muted animate-pulse" />

      {/* Product Info Skeleton */}
      <div className="flex flex-col justify-center min-w-0 flex-1 gap-2">
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
      </div>

      {/* Right Section Skeleton */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
        {/* Quantity Controls Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-muted animate-pulse rounded" />
          <div className="w-10 h-6 bg-muted animate-pulse rounded" />
          <div className="h-9 w-9 bg-muted animate-pulse rounded" />
        </div>

        {/* Price Skeleton */}
        <div className="hidden sm:block text-right min-w-24">
          <div className="h-6 w-16 bg-muted animate-pulse rounded mb-1" />
          <div className="h-4 w-12 bg-muted animate-pulse rounded" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-muted animate-pulse rounded" />
          <div className="h-9 w-9 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
