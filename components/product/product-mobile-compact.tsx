"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { ROUTES } from "@/lib/constants/routes";
import { useAddToCart } from "@/hooks/use-cart-mutations";
import { useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist-mutations";
import { useProductWishlistStatus, useProductCartStatus } from "@/hooks/use-product-interactions";
import type { ProductWithDetails } from "@/lib/services";

interface ProductMobileCompactProps {
  product: ProductWithDetails;
  images: { url: string }[];
}

const compressionLabels: Record<string, string> = {
  LIGHT: "Light",
  MEDIUM: "Medium",
  HIGH: "Maximum",
};

export function ProductMobileCompact({ product, images }: ProductMobileCompactProps) {
  const router = useRouter();

  const firstInStockVariant = product.variants.find(v => v.stockQuantity > 0);
  const defaultSize = firstInStockVariant?.size || product.variants[0]?.size || "M";
  const defaultCompression = firstInStockVariant?.compressionLevel || product.variants[0]?.compressionLevel || "MEDIUM";

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [compressionLevel, setCompressionLevel] = useState(defaultCompression);

  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const availableCompressions = Array.from(new Set(product.variants.map(v => v.compressionLevel)));

  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.compressionLevel === compressionLevel
  );

  const { isWishlisted } = useProductWishlistStatus(product.id);
  const { inCart } = useProductCartStatus(selectedVariant?.id || "");

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity === 0;
  const price = selectedVariant?.price ?? product.basePrice;
  const variantImageUrl = selectedVariant?.images?.[0]?.url;

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stockQuantity === 0) return;
    if (inCart) {
      router.push(ROUTES.CART);
      return;
    }
    addToCartMutation.mutate(
      { variantId: selectedVariant.id, quantity: 1 },
      {
        onError: (error) => toast.error(error.message || "Failed to add to cart"),
      }
    );
  };

  const handleToggleWishlist = async () => {
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product.id, {
        onError: (error) => {
          if (error.message?.includes("logged in")) router.push(ROUTES.LOGIN);
        }
      });
    } else {
      addToWishlistMutation.mutate(product.id, {
        onError: (error) => {
          if (error.message?.includes("logged in")) router.push(ROUTES.LOGIN);
        }
      });
    }
  };

  return (
    <div className="flex gap-3 p-0">
      {/* Image */}
      <div className="w-2/5 shrink-0">
        <div className="relative aspect-4/5 border border-border bg-card overflow-hidden">
          <OptimizedImage
            src={variantImageUrl || images[0]?.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="40vw"
            priority
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Name */}
        <h1 className="font-heading text-base leading-tight text-foreground line-clamp-2">
          {product.name}
        </h1>

        {/* Price */}
        <p className="font-heading text-lg text-foreground">
          ${parseFloat(price.toString()).toFixed(2)}
        </p>

        {/* Size */}
        <div>
          <label className="font-sans text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
            Size
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => !isOutOfStock && setSelectedSize(size)}
                disabled={isOutOfStock}
                className={cn(
                  "h-7 min-w-[2rem] px-2 font-sans text-xs font-semibold border transition-colors",
                  selectedSize === size
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "border-border text-foreground hover:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Compression */}
        <div>
          <label className="font-sans text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
            Compression
          </label>
          <div className="flex gap-1.5">
            {availableCompressions.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => !isOutOfStock && setCompressionLevel(level)}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 h-7 px-2 font-sans text-[11px] font-semibold uppercase tracking-wide border transition-colors",
                  compressionLevel === level
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "border-border text-foreground hover:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {compressionLabels[level] || level}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || addToCartMutation.isPending}
            className={cn(
              "flex-1 h-9 gap-1.5",
              "bg-secondary text-secondary-foreground",
              "hover:bg-accent hover:text-accent-foreground",
              "font-sans text-xs font-semibold uppercase tracking-wide",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5" />
            )}
            {isOutOfStock ? "Sold Out" : inCart ? "In Cart" : "Add"}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWishlist}
            disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
            className="h-9 w-9 shrink-0 border-border"
          >
            {addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current text-secondary")} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
