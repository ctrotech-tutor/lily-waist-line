"use client";

import { useState } from "react";
import { Sparkles, Diamond } from "lucide-react";
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left content */}
            <div className="lg:col-span-8">
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

            {/* Right decorative element — desktop only */}
            <div className="hidden lg:flex lg:col-span-4 items-start justify-center pt-4">
              <div
                className={cn(
                  "w-full border border-border p-8",
                  "transition-all duration-1000 delay-300 ease-out",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <Diamond className="w-6 h-6 text-primary" />
                  <div className="w-8 h-px bg-primary/50" />
                  <p className="font-heading text-lg text-foreground leading-snug">
                    Curated for the woman who demands excellence
                  </p>
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-[0.15em]">
                    Lily Waist Liner
                  </p>
                  <div className="w-8 h-px bg-primary/50" />
                  <Diamond className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
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
