"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { SectionHeadingSkeleton } from "@/components/shared/section-heading-skeleton";
import { getFeaturedProducts } from "@/server/actions/products";
import type { FeaturedProductData, ProductWithDetails } from "@/types/product";

export function FeaturedProductsSection() {
  const [isLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<FeaturedProductData[]>([]);

  // Fetch real data from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts(8);
        
        // Transform products to match ProductCard interface
        const transformedProducts = featuredProducts.map((product: ProductWithDetails): FeaturedProductData => ({
          id: product.id,
          image: product.images[0]?.url || "/img-p-1.png",
          name: product.name,
          subtitle: product.shortDescription,
          price: parseFloat(product.minPrice.toString()),
          originalPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : undefined,
          badge: product.totalStock > 10 ? undefined : "Limited",
          stockState: product.inStock ? "in-stock" as const : "out-of-stock" as const,
          slug: product.slug,
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <section id="featured" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/20 to-transparent opacity-50" />

      <div className="relative max-w-360 mx-auto px-5 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          {isLoading ? (
            <SectionHeadingSkeleton />
          ) : (
            <>
              {/* Eyebrow Label */}
              <div
                className={cn(
                  "flex items-center justify-center gap-2 mb-6",
                  "transition-all duration-700",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  Curated Collection
                </span>
              </div>

              {/* Gold Divider */}
              <div
                className={cn(
                  "w-12 h-px bg-[#d4af37] mx-auto mb-8",
                  "transition-all duration-700 delay-100",
                  isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                )}
              />

              {/* Main Heading */}
              <h2
                className={cn(
                  "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                  "leading-[1.15] tracking-tight text-foreground",
                  "mb-6",
                  "transition-all duration-700 delay-200",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                Featured Waist Trainers
              </h2>

              {/* Supporting Copy */}
              <p
                className={cn(
                  "font-sans text-base sm:text-lg",
                  "text-muted-foreground leading-relaxed",
                  "max-w-2xl mx-auto",
                  "transition-all duration-700 delay-300",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                Discover our most sought-after pieces, engineered for transformation.
                Each design combines luxury craftsmanship with results-driven compression.
              </p>
            </>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading
            ? // Skeleton loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className={cn(
                    "transition-all duration-700",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ProductCardSkeleton />
                </div>
              ))
            : // Product cards
              products.map((product: FeaturedProductData, index: number) => (
                <div
                  key={product.id}
                  className={cn(
                    "transition-all duration-700",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
        </div>

        {/* View All CTA */}
        {!isLoading && (
          <div
            className={cn(
              "flex justify-center mt-16 md:mt-20",
              "transition-all duration-700 delay-800",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <a
              href="/shop"
              className={cn(
                "group flex items-center gap-3",
                "px-8 py-4",
                "border border-[#d4af37]",
                "font-sans text-sm font-semibold uppercase tracking-wider",
                "text-foreground",
                "transition-all duration-300 ease-out",
                "hover:bg-[#d4af37]/10 hover:border-[#d4af37]",
                "focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              View All Products
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        )}
      </div>

      {/* Decorative lines */}
      <div
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2",
          "w-32 h-px",
          "bg-linear-to-r from-transparent via-[#d4af37]/20 to-transparent",
          "transition-all duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </section>
  );
}

export default FeaturedProductsSection;
