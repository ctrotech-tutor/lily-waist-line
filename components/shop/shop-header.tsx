"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopHeaderProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  productCount?: number;
}

export function ShopHeader({
  eyebrow = "Lily Collection",
  title = "Shop Waist Trainers",
  subtitle = "Premium waist trainers crafted for the woman who demands excellence. Sculpt your silhouette with confidence, discipline, and uncompromising luxury.",
  productCount = 12,
}: ShopHeaderProps) {
  const [isLoaded] = useState(true);

  return (
    <header className="relative w-full">
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
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </span>
          </div>

          {/* Gold Divider */}
          <div
            className={cn(
              "w-16 h-px bg-primary mb-8",
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
            {title}
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
            {subtitle}
          </p>

          {/* Product Count */}
          <div
            className={cn(
              "flex items-center gap-3",
              "transition-all duration-1000 delay-400 ease-out",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="w-2 h-2 bg-primary" />
            <span className="font-sans text-sm text-muted-foreground">
              Showing {productCount} products
            </span>
          </div>
        </div>
      </div>

      {/* Bottom border accent */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          "bg-linear-to-r from-transparent via-border to-transparent",
          "transition-all duration-1000 delay-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </header>
  );
}

export default ShopHeader;
