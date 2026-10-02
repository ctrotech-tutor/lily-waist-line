"use client";

import { Package, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OrdersHeaderProps {
  orderCount: number;
  className?: string;
  isLoaded?: boolean;
  onBack?: () => void;
}

export function OrdersHeader({
  orderCount,
  className,
  isLoaded = true,
  onBack,
}: OrdersHeaderProps) {
  return (
    <div className={cn("border-b border-border", className)}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="py-12 md:py-16 lg:py-20">
          <div
            className={cn(
              "flex items-center gap-2 mb-6",
              "transition-all duration-700 ease-out",
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}
          >
            <Package className="w-4 h-4 text-primary" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Order History
            </span>
          </div>

          <div
            className={cn(
              "w-16 h-px bg-primary mb-8",
              "transition-all duration-700 delay-100 ease-out",
              isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )}
            style={{ transformOrigin: "left" }}
          />

          <h1
            className={cn(
              "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
              "leading-[1.1] tracking-tight text-foreground",
              "mb-6 max-w-2xl",
              "transition-all duration-1000 delay-200 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            My Orders
          </h1>

          <p
            className={cn(
              "font-sans text-base sm:text-lg",
              "text-muted-foreground leading-relaxed",
              "max-w-xl mb-8",
              "transition-all duration-1000 delay-300 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Track your purchases, payments, and deliveries.
          </p>

          <div
            className={cn(
              "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
              "transition-all duration-1000 delay-400 ease-out",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary" />
              <span className="font-sans text-sm text-muted-foreground">
                {orderCount === 0
                  ? "No orders yet"
                  : `${orderCount} ${orderCount === 1 ? "order" : "orders"} placed`}
              </span>
            </div>

            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full sm:w-auto px-6 py-3 text-sm font-button tracking-wide uppercase border-primary/30 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}