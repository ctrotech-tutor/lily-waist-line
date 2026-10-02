"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { ROUTES } from "@/lib/constants/routes";
import { SectionHeadingSkeleton } from "@/components/shared/section-heading-skeleton";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import { transformProductsToCardProps } from "@/lib/utils/product-transformers";
import Link from "next/link";

export function FeaturedProductsSection() {
  const [isLoaded] = useState(true);
  
  // Use TanStack Query for featured products
  const { data: products = [], isLoading } = useFeaturedProducts(8);

  // Transform products using shared utility
  const transformedProducts = transformProductsToCardProps(products);

  return (
    <section
      id="featured"
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/20 to-transparent opacity-50" />

      <div className="relative max-w-360 mx-auto px-5 sm:px-6 lg:px-8 xl:px-12">

        {/* HEADER */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24">

          {isLoading ? (
            <SectionHeadingSkeleton />
          ) : (
            <>
              {/* Eyebrow */}
              <div
                className={cn(
                  "flex items-center justify-center gap-2 mb-6",
                  "transition-all duration-700",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Curated Collection
                </span>
              </div>

              {/* Divider */}
              <div
                className={cn(
                  "w-12 h-px bg-primary mx-auto mb-8",
                  "transition-all duration-700 delay-100",
                  isLoaded
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0"
                )}
              />

              {/* Title */}
              <h2
                className={cn(
                  "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                  "leading-[1.15] tracking-tight text-foreground",
                  "mb-6",
                  "transition-all duration-700 delay-200",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                Featured Waist Trainers
              </h2>

              {/* Description */}
              <p
                className={cn(
                  "font-sans text-base sm:text-lg",
                  "text-muted-foreground leading-relaxed",
                  "max-w-2xl mx-auto",
                  "transition-all duration-700 delay-300",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                Discover our most sought-after pieces, engineered for transformation.
                Each design combines luxury craftsmanship with results-driven compression.
              </p>
            </>
          )}
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className={cn(
                  "transition-all duration-700",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProductCardSkeleton />
              </div>
            ))
            : transformedProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "transition-all duration-700",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
        </div>

        {/* CTA */}
        {!isLoading && (
          <div
            className={cn(
              "flex justify-center mt-16 md:mt-20",
              "transition-all duration-700 delay-800",
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <Button asChild variant="outline" size="lg" className="px-8 border-primary font-sans text-sm font-semibold uppercase tracking-wider hover:bg-primary/10 hover:border-primary/70">
              <Link href={ROUTES.SHOP}>
                View All Products
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProductsSection;