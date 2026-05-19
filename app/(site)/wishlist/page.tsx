"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WishlistHeader } from "@/components/wishlist/wishlist-header";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";
import { WishlistItemCardSkeleton } from "@/components/wishlist/wishlist-item-card-skeleton";
import { EmptyWishlistState } from "@/components/wishlist/empty-wishlist-state";
import { cn } from "@/lib/utils";
import { getWishlist } from "@/server/actions/wishlist";

// Wishlist item data structure from backend
interface WishlistItemData {
  id: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    basePrice: number;
    compareAtPrice: number | null;
    status: string;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
    }>;
    variants: Array<{
      id: string;
      size: string;
      compressionLevel: string;
      color: string | null;
      sku: string;
      stockQuantity: number;
    }>;
    inStock: boolean;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist data on mount
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const result = await getWishlist();
        if (result.success) {
          setWishlistItems(result.data);
        } else {
          setError(result.error || "Failed to load wishlist");
        }
      } catch (err) {
        setError("Failed to load wishlist");
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchWishlist();
  }, []);

  // Handle remove item - calls backend action
  const handleRemoveItem = async (productId: string) => {
    try {
      const { removeFromWishlist } = await import("@/server/actions/wishlist");
      const result = await removeFromWishlist(productId);
      
      if (result.success) {
        // Refresh wishlist data
        const wishlistResult = await getWishlist();
        if (wishlistResult.success) {
          setWishlistItems(wishlistResult.data);
        }
      } else {
        console.error("Failed to remove item:", result.error);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Handle add to cart - calls existing cart backend
  const handleAddToCart = async (variantId: string) => {
    try {
      const { addToCart } = await import("@/server/actions/cart");
      const result = await addToCart({ variantId, quantity: 1 });
      
      if (!result.success) {
        console.error("Failed to add to cart:", result.error);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const itemCount = wishlistItems.length;

  return (
    <>
      <div className="min-h-full bg-background">
        {/* Page Header Section */}
        <WishlistHeader
          itemCount={itemCount}
          isLoaded={isLoaded}
        />

        {/* Wishlist Content Container */}
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
          {!isLoaded ? (
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              )}
            >
              {[...Array(8)].map((_, i) => (
                <WishlistItemCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link
                  href="/shop"
                  className="text-[#d4af37] hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : itemCount === 0 ? (
            <EmptyWishlistState />
          ) : (
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                "transition-all duration-1000 delay-200 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {wishlistItems.map((item) => {
                const product = item.product;
                const image = product.images[0]?.url || "/placeholder.png";
                const price = Number(product.basePrice);
                const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : undefined;
                
                // Determine stock state based on variants
                let stockState: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
                if (!product.inStock) {
                  stockState = "out-of-stock";
                } else if (product.variants.some(v => v.stockQuantity > 0 && v.stockQuantity <= 5)) {
                  stockState = "low-stock";
                }

                // Get first available variant for add to cart
                const firstAvailableVariant = product.variants.find(v => v.stockQuantity > 0);

                return (
                  <WishlistItemCard
                    key={item.id}
                    id={product.id}
                    slug={product.slug}
                    image={image}
                    name={product.name}
                    tagline={product.shortDescription}
                    price={price}
                    originalPrice={originalPrice}
                    stockState={stockState}
                    variantId={firstAvailableVariant?.id}
                    onAddToCart={handleAddToCart}
                    onRemove={handleRemoveItem}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
