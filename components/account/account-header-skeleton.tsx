"use client";

export function AccountHeaderSkeleton() {
  return (
    <>
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-muted animate-pulse mb-8" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          {/* Heading */}
          <div className="h-12 w-72 bg-muted animate-pulse rounded mb-4" />

          {/* Supporting Copy */}
          <div className="h-5 w-full max-w-xl bg-muted animate-pulse rounded mb-6" />

          {/* Meta */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-4 w-52 bg-muted animate-pulse rounded" />
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Button */}
        <div className="h-12 w-40 bg-muted animate-pulse rounded" />
      </div>
    </>
  );
}