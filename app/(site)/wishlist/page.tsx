"use client";
export const dynamic = "force-dynamic"
import Link from "next/link";
import { WishlistHeader } from "@/components/wishlist/wishlist-header";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";
import { WishlistItemCardSkeleton } from "@/components/wishlist/wishlist-item-card-skeleton";
import { EmptyWishlistState } from "@/components/wishlist/empty-wishlist-state";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useRemoveFromWishlist } from "@/hooks/use-wishlist-mutations";
import { useAddToCart } from "@/hooks/use-cart-mutations";
import { useCart } from "@/hooks/use-cart";
import type { StockState } from "@/types/common";
import { ROUTES } from "@/lib/constants/routes";

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

// Calculate stock state for wishlist product
function calculateWishlistStockState(product: WishlistItemData['product']): StockState {
  if (!product.inStock) {
    return 'out-of-stock';
  }
  if (product.variants.some(v => v.stockQuantity > 0 && v.stockQuantity <= 5)) {
    return 'low-stock';
  }
  return 'in-stock';
}

export default function WishlistPage() {
  const { data: wishlistItems, isLoading, error } = useWishlist();
  const { data: cartData } = useCart();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  // Handle remove item - calls backend action
  const handleRemoveItem = async (productId: string) => {
    removeFromWishlist.mutate(productId);
  };

  // Handle add to cart - calls existing cart backend
  const handleAddToCart = async (variantId: string) => {
    addToCart.mutate({ variantId, quantity: 1 });
  };

  const itemCount = wishlistItems?.length || 0;

  return (
    <>
      <div className="min-h-full bg-background">
        {/* Page Header Section */}
        <WishlistHeader
          itemCount={itemCount}
          isLoaded={!isLoading}
        />

        {/* Wishlist Content Container */}
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
          {isLoading ? (
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
                <p className="text-destructive mb-4">{error.message}</p>
                <Link
                  href={ROUTES.SHOP}
                  className="text-primary hover:underline"
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
                !isLoading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {wishlistItems?.map((item) => {
                const product = item.product;
                const image = product.images[0]?.url || "/placeholder.png";
                const price = Number(product.basePrice);
                const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : undefined;
                
                // Determine stock state using shared utility
                const stockState: StockState = calculateWishlistStockState(product);

                // Get first available variant for add to cart
                const firstAvailableVariant = product.variants.find(v => v.stockQuantity > 0);

                // Check if this variant is in cart
                const cartItems = cartData?.items || [];
                const inCart = firstAvailableVariant 
                  ? cartItems.some(cartItem => cartItem.variant.id === firstAvailableVariant.id)
                  : false;

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
                    inCart={inCart}
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
