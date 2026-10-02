"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { ROUTES } from "@/lib/constants/routes";
import { Separator } from "@/components/ui/separator";
import { getRelatedProducts } from "@/server/actions/products";
import type { ProductWithDetails } from "@/lib/services";
import type { StockState } from "@/types/common";

interface ProductRelatedProductsProps {
  productId: string;
}

export function ProductRelatedProducts({ productId }: ProductRelatedProductsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setIsLoading(true);
        const result = await getRelatedProducts(productId, 4);
        if (!result.success) throw new Error(result.error)
        setProducts(result.data);
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
        setError("Failed to load related products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [productId]);

  // Transform backend product data to ProductCard props
  const transformProductToCard = (product: ProductWithDetails) => {
    const firstVariant = product.variants[0];
    const firstImage = product.images[0];

    return {
      id: product.id,
      variantId: firstVariant?.id || product.id,
      slug: product.slug,
      image: firstImage?.url || "/img-p-1.png",
      name: product.name,
      subtitle: product.shortDescription || "Premium waist trainer",
      price: product.basePrice,
      originalPrice: product.compareAtPrice || undefined,
      badge: product.compareAtPrice && product.compareAtPrice > product.basePrice ? "Sale" : undefined,
      stockState: (product.inStock ? "in-stock" : "out-of-stock") as StockState,
    };
  };

  const transformedProducts = products.map(transformProductToCard);

  if (isLoading) {
    return (
      <section className="relative py-16 md:py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      </section>
    );
  }

  if (error || transformedProducts.length === 0) {
    return null;
  }

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
          {transformedProducts.map((product, index) => (
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
          <Button asChild variant="outline" size="lg" className="group border-secondary/30 text-muted-foreground hover:border-secondary/50">
            <Link href={ROUTES.SHOP}>
              View All Products
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProductRelatedProducts;
