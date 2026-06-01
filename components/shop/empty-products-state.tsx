"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyProductsStateProps {
  className?: string;
  onReset?: () => void;
}

export function EmptyProductsState({
  className,
  onReset,
}: EmptyProductsStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-16 px-4",
        "text-center",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center",
          "w-16 h-16 mb-6",
          "border border-primary/20"
        )}
      >
        <SlidersHorizontal className="w-6 h-6 text-primary" />
      </div>

      {/* Heading */}
      <h3
        className={cn(
          "font-heading text-2xl md:text-3xl",
          "text-foreground",
          "mb-3"
        )}
      >
        No Products Found
      </h3>

      {/* Supporting Copy */}
      <p
        className={cn(
          "font-sans text-base",
          "text-muted-foreground",
          "max-w-md mb-8",
          "leading-relaxed"
        )}
      >
        Try adjusting your filters to discover more sculpting essentials.
      </p>

      {/* Reset Action */}
      <Button
        onClick={onReset}
        className={cn(
          "h-12 px-8",
          "bg-primary text-primary-foreground",
          "font-sans text-sm font-semibold uppercase tracking-wider",
          "border border-primary",
          "rounded-none",
          "transition-all duration-300 ease-out",
          "hover:bg-primary hover:text-primary-foreground",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
      >
        Reset Filters
      </Button>
    </div>
  );
}
