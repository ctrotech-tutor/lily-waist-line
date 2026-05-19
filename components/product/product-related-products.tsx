"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";
import { Separator } from "@/components/ui/separator";

const relatedProducts = [
  {
    id: "related-1",
    image: "/img-p-2.png",
    name: "Core Fit Waist Trainer",
    subtitle: "Advanced compression technology",
    price: 129.99,
    badge: "Popular",
    stockState: "in-stock" as const,
    variantId: "related-1",
    slug: "core-fit-waist-trainer",
  },
  {
    id: "related-2",
    image: "/img-p-3.png",
    name: "Elite Shape Waist Trainer",
    subtitle: "Premium latex construction",
    price: 159.99,
    originalPrice: 199.99,
    stockState: "in-stock" as const,
    variantId: "related-2",
    slug: "elite-shape-waist-trainer",
  },
  {
    id: "related-3",
    image: "/img-p-4.png",
    name: "Power Sculpt Corset",
    subtitle: "Maximum compression support",
    price: 179.99,
    badge: "Premium",
    stockState: "in-stock" as const,
    variantId: "related-3",
    slug: "power-sculpt-corset",
  },
  {
    id: "related-4",
    image: "/img-p-1.png",
    name: "Classic Sculpt Waist Trainer",
    subtitle: "Everyday transformation essential",
    price: 89.99,
    originalPrice: 119.99,
    stockState: "low-stock" as const,
    variantId: "related-4",
    slug: "classic-sculpt-waist-trainer",
  },
];

export function ProductRelatedProducts() {
  const [isLoaded] = useState(true);

  return (
    <section className="relative py-16 md:py-20">
      <div className="space-y-10 md:space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          {/* Eyebrow */}
          <div
            className={cn(
              "flex items-center gap-2",
              "transition-all duration-700",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
              You May Also Like
            </span>
          </div>

          {/* Title */}
          <h2
            className={cn(
              "font-heading text-2xl md:text-3xl lg:text-4xl",
              "text-foreground leading-tight",
              "transition-all duration-700 delay-100",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Curated for Your Transformation
          </h2>

          {/* Supporting Line */}
          <p
            className={cn(
              "font-sans text-base md:text-lg",
              "text-muted-foreground leading-relaxed max-w-xl",
              "transition-all duration-700 delay-200",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            A boutique selection of pieces that complement your journey.
          </p>
        </div>

        <Separator className="bg-border/50" />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {relatedProducts.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                "transition-all duration-700",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Optional CTA Row - Future-ready placeholder */}
        <div
          className={cn(
            "flex justify-center pt-8",
            "transition-all duration-700 delay-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <button
            disabled
            className={cn(
              "group flex items-center gap-3",
              "px-8 py-4",
              "border border-secondary/30",
              "font-sans text-sm font-semibold uppercase tracking-wider",
              "text-muted-foreground",
              "transition-all duration-300 ease-out",
              "hover:border-secondary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            View All Products
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductRelatedProducts;
