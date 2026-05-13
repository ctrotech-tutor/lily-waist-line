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
    left: "items-start",
    center: "items-center",
    right: "items-end",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        alignClasses[align],
        className
      )}
    >
      {/* Eyebrow Label */}
      <div className="h-3 w-32 bg-muted animate-pulse" />

      {/* Main Heading */}
      <div className="flex flex-col gap-2 items-center">
        <div className="h-10 w-64 bg-muted animate-pulse" />
        <div className="h-10 w-48 bg-muted animate-pulse" />
      </div>

      {/* Supporting Text */}
      {showSupportingText && (
        <div className="flex flex-col gap-1.5 items-center mt-2">
          <div className="h-4 w-80 bg-muted animate-pulse" />
          <div className="h-4 w-64 bg-muted animate-pulse" />
        </div>
      )}
    </div>
  );
}
