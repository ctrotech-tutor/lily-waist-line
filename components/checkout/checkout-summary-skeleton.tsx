import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CheckoutSummarySkeletonProps {
  className?: string;
}

export function CheckoutSummarySkeleton({ className }: CheckoutSummarySkeletonProps) {
  return (
    <Card className={cn("border-border bg-background", className)}>
      <CardContent className="p-4 lg:p-6">
        {/* Heading */}
        <Skeleton className="h-6 w-36 mb-6" />

        {/* Item rows */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 mb-4">
            <Skeleton className="w-16 h-20 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
        ))}

        {/* Divider */}
        <Skeleton className="h-px w-full my-6" />

        {/* Promo row */}
        <Skeleton className="h-10 w-full mb-6 rounded-md" />

        {/* Price breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-px w-full my-4" />
          <div className="flex justify-between p-4 -mx-4 lg:-mx-6 bg-secondary/10">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}