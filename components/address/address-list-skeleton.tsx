import { cn } from "@/lib/utils";
import { AddressCardSkeleton } from "./address-card-skeleton";

export interface AddressListSkeletonProps {
  className?: string;
  count?: number;
}

export function AddressListSkeleton({ className, count = 4 }: AddressListSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <AddressCardSkeleton key={index} />
      ))}
    </div>
  );
}
