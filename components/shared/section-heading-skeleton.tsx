"use client";

import { cn } from "@/lib/utils";

export interface SectionHeadingSkeletonProps {
  className?: string;
  showSupportingText?: boolean;
  align?: "left" | "center" | "right";
}

export function SectionHeadingSkeleton({
  className,
  showSupportingText = true,
  align = "center",
}: SectionHeadingSkeletonProps) {
  const alignClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        alignClasses[align],
        className
      )}
    >
      {/* Eyebrow Label Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>

      {/* Divider Skeleton */}
      <div className="w-16 h-px bg-muted animate-pulse mb-8" />

      {/* Main Heading Skeleton */}
      <div
        className={cn(
          "flex flex-col gap-3 mb-6",
          align !== "left" && "items-center",
          align === "right" && "items-end"
        )}
      >
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
      </div>

      {/* Supporting Copy Skeleton */}
      {showSupportingText && (
        <div
          className={cn(
            "flex flex-col gap-2",
            align !== "left" && "items-center",
            align === "right" && "items-end"
          )}
        >
          <div className="h-4 w-full max-w-xs bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      )}
    </div>
  );
}