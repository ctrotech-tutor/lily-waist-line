import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CheckoutStepSkeletonProps {
  className?: string;
}

export function CheckoutStepSkeleton({ className }: CheckoutStepSkeletonProps) {
  return (
    <div className={cn("border border-border bg-card", className)}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-md shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Address card skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-border p-5 md:p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}