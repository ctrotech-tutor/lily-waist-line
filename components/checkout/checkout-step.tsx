"use client";

import { cn } from "@/lib/utils";

export interface CheckoutStepProps {
  title: string;
  subtitle?: string;
  stepNumber: number;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutStep({
  title,
  subtitle,
  stepNumber,
  isActive = false,
  children,
  className,
}: CheckoutStepProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl",
        "border border-border",
        "bg-card",
        "transition-all duration-300",
        isActive && "ring-1 ring-secondary/30",
        className
      )}
    >
      {/* Step Header */}
      <div className="px-6 py-5 border-b border-border/50">
        <div className="flex items-center gap-4">
          {/* Step Number Indicator */}
          <div
            className={cn(
              "w-8 h-8 flex items-center justify-center",
              "font-sans text-sm font-semibold",
              "transition-colors duration-200",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {stepNumber}
          </div>

          {/* Title Block */}
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="font-sans text-sm text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
}
