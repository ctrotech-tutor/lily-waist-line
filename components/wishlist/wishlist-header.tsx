"use client";

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistHeaderProps {
  itemCount: number;
  className?: string;
  isLoaded?: boolean;
  onContinueShopping?: () => void;
}

export function WishlistHeader({
  itemCount,
  className,
  isLoaded = true,
  onContinueShopping,
}: WishlistHeaderProps) {
  return (
    <div className={cn("border-b border-border", className)}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="py-12 md:py-16 lg:py-20">
          {/* Eyebrow Label */}
          <div
            className={cn(
              "flex items-center gap-2 mb-6",
              "transition-all duration-700 ease-out",
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Saved Favorites
            </span>
          </div>

          {/* Gold Divider */}
          <div
            className={cn(
              "w-16 h-px bg-[#d4af37] mb-8",
              "transition-all duration-700 delay-100 ease-out",
              isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )}
            style={{ transformOrigin: "left" }}
          />

          {/* Main Heading */}
          <h1
            className={cn(
              "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
              "leading-[1.1] tracking-tight text-foreground",
              "mb-6 max-w-2xl",
              "transition-all duration-1000 delay-200 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Your Wishlist
          </h1>

          {/* Supporting Copy */}
          <p
            className={cn(
              "font-sans text-base sm:text-lg",
              "text-muted-foreground leading-relaxed",
              "max-w-xl mb-8",
              "transition-all duration-1000 delay-300 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Save the pieces you love and return anytime.
          </p>

          {/* Item Count & Continue Shopping Button */}
          <div
            className={cn(
              "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
              "transition-all duration-1000 delay-400 ease-out",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d4af37]" />
              <span className="font-sans text-sm text-muted-foreground">
                {itemCount === 0
                  ? "No saved items"
                  : `${itemCount} ${itemCount === 1 ? "item" : "items"} saved`}
              </span>
            </div>

            {itemCount > 0 && (
              <Button
                onClick={onContinueShopping}
                className="w-full sm:w-auto px-6 py-3 text-sm font-button tracking-wide uppercase bg-[#d4af37] text-black hover:bg-[#d4af37]/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
