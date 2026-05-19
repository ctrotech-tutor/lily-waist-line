export function CartHeaderSkeleton() {
  return (
    <>
      {/* Eyebrow Label Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>

      {/* Divider Skeleton */}
      <div className="w-16 h-px bg-muted animate-pulse mb-8" />

      {/* Main Heading Skeleton */}
      <div className="h-12 w-64 bg-muted animate-pulse rounded mb-6" />

      {/* Supporting Copy Skeleton */}
      <div className="h-5 w-full max-w-xl bg-muted animate-pulse rounded mb-8" />

      {/* Item Count Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    </>
  );
}
