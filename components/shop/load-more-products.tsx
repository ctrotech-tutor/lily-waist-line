"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LoadMoreProductsProps {
  className?: string;
  onLoadMore?: () => void;
  remainingCount?: number;
  isLoading?: boolean;
}

export function LoadMoreProducts({
  className,
  onLoadMore,
  remainingCount,
  isLoading = false,
}: LoadMoreProductsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-8",
        className
      )}
    >
      {/* Load More Button */}
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        className={cn(
          "h-14 px-12",
          "bg-transparent text-foreground",
          "font-sans text-sm font-semibold uppercase tracking-widest",
          "border border-foreground/30",
          "rounded-full", // changed from rounded-none
          "transition-all duration-300 ease-out",
          "hover:border-[#d4af37] hover:text-[#d4af37]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </span>
        ) : (
          "Discover More"
        )}
      </Button>

      {/* Remaining Count Indicator */}
      {remainingCount !== undefined && remainingCount > 0 && !isLoading && (
        <p
          className={cn(
            "mt-4",
            "font-sans text-xs",
            "text-muted-foreground",
            "tracking-wide"
          )}
        >
          {remainingCount} more product{remainingCount !== 1 ? "s" : ""} available
        </p>
      )}
    </div>
  );
}