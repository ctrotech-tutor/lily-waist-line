export function AddressHeaderSkeleton() {
  return (
    <div className="border-b border-border">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="py-12 md:py-16 lg:py-20">
          {/* Eyebrow Label Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          </div>

          {/* Gold Divider Skeleton */}
          <div className="w-16 h-px bg-muted animate-pulse mb-8" />

          {/* Main Heading Skeleton */}
          <div className="h-16 w-80 bg-muted animate-pulse rounded mb-6" />

          {/* Supporting Copy Skeleton */}
          <div className="h-6 w-full max-w-xl bg-muted animate-pulse rounded mb-8" />

          {/* Address Count & Add Button Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-muted animate-pulse rounded" />
              <div className="h-5 w-48 bg-muted animate-pulse rounded" />
            </div>

            <div className="h-11 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
