"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { SectionHeadingSkeleton } from "@/components/shared/section-heading-skeleton";
import { getFeaturedProducts } from "@/server/actions/products";
import type { FeaturedProductData, ProductWithDetails } from "@/types/product";
import Link from "next/link";

export function FeaturedProductsSection() {
  const [isLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<FeaturedProductData[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts(8);

        const transformedProducts = featuredProducts.map(
          (product: ProductWithDetails): FeaturedProductData => {
            // Calculate stock state consistently with wishlist page
            let stockState: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
            if (!product.inStock) {
              stockState = "out-of-stock";
            } else if (product.variants.some(v => v.stockQuantity > 0 && v.stockQuantity <= 5)) {
              stockState = "low-stock";
            }

            return {
              id: product.id,
              variantId: product.variants[0]?.id || product.id,
              slug: product.slug,
              image: product.images[0]?.url || "/img-p-1.png",
              name: product.name,
              subtitle: product.shortDescription,
              price: parseFloat(product.minPrice.toString()),
              originalPrice: product.compareAtPrice
                ? parseFloat(product.compareAtPrice.toString())
                : undefined,
              badge: product.totalStock > 10 ? undefined : "Limited",
              stockState,
            };
          }
        );

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
            : products.map((product, index) => (
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
            <Link
              href="/shop"
              className={cn(
                "group inline-flex items-center gap-3",
                "px-8 py-4",
                "rounded-full", // rounded upgrade
                "border border-primary",
                "font-sans text-sm font-semibold uppercase tracking-wider",
                "text-foreground",
                "transition-all duration-300 ease-out",
                "hover:bg-primary/10 hover:border-primary/70",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              View All Products
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProductsSection;