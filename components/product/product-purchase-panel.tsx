"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  Heart,
  Truck,
  RefreshCw,
  Lock,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { useAddToCart } from "@/hooks/use-cart-mutations";
import { useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist-mutations";
import { useProductWishlistStatus } from "@/hooks/use-product-interactions";
import { useProductCartStatus } from "@/hooks/use-product-interactions";
import type { ProductWithDetails } from "@/lib/services";

interface ProductPurchasePanelProps {
  product: ProductWithDetails;
}

const compressionLevels = [
  { value: "LIGHT", label: "Light Sculpt" },
  { value: "MEDIUM", label: "Medium Sculpt" },
  { value: "HIGH", label: "Maximum Sculpt" },
];

const stockConfig = {
  "in-stock": {
    label: "In Stock",
    className: "bg-success/10 text-success hover:bg-success/20",
  },
  "low-stock": {
    label: "Low Stock",
    className: "bg-warning/10 text-warning hover:bg-warning/20",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
};

export function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  
  // Smart default variant selection - select first in-stock variant
  const firstInStockVariant = product.variants.find(v => v.stockQuantity > 0);
  const defaultSize = firstInStockVariant?.size || product.variants[0]?.size || "M";
  const defaultCompression = firstInStockVariant?.compressionLevel || product.variants[0]?.compressionLevel || "MEDIUM";
  
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [compressionLevel, setCompressionLevel] = useState<string>(defaultCompression);
  const [quantity, setQuantity] = useState<number>(1);


  // Get unique sizes from variants
  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)));
  
  // Find selected variant based on size and compression level
  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.compressionLevel === compressionLevel
  );

  // Use shared hooks for wishlist and cart status
  const { isWishlisted } = useProductWishlistStatus(product.id);
  const { inCart } = useProductCartStatus(selectedVariant?.id || '');

  // Use shared mutation hooks
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => Math.min(selectedVariant?.stockQuantity || 10, prev + 1));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stockQuantity === 0) return;

    // If item is already in cart, navigate to cart
    if (inCart) {
      router.push(ROUTES.CART);
      return;
    }

    addToCartMutation.mutate(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          toast.success("Added to cart!")
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add to cart")
        }
      }
    );
  };

  const handleAddToWishlist = async () => {
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product.id, {
        onError: (error) => {
          if (error.message?.includes("logged in")) {
            router.push(ROUTES.LOGIN);
          }
        }
      });
    } else {
      addToWishlistMutation.mutate(product.id, {
        onError: (error) => {
          if (error.message?.includes("logged in")) {
            router.push(ROUTES.LOGIN);
          }
        }
      });
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || selectedVariant.stockQuantity === 0) return;

    addToCartMutation.mutate(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          toast.success("Added to cart! Redirecting to checkout...")
          setTimeout(() => {
            router.push(ROUTES.CHECKOUT);
          }, 1000);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add to cart")
        }
      }
    );
  };

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity === 0;
  const isLowStock = selectedVariant && selectedVariant.stockQuantity > 0 && selectedVariant.stockQuantity <= 5;
  const stockStatus = isOutOfStock ? "out-of-stock" : isLowStock ? "low-stock" : "in-stock";
  const price = product.basePrice;
  const originalPrice = product.compareAtPrice;

  return (
    <div className="flex flex-col">
      {/* Product Header */}
      <div className="space-y-4">
        {/* Stock Badge */}
        <Badge
          variant="secondary"
          className={cn("font-sans text-xs", stockConfig[stockStatus].className)}
        >
          {stockConfig[stockStatus].label}
        </Badge>

        {/* Product Name */}
        <h1 className="font-heading text-3xl leading-tight text-foreground lg:text-4xl">
          {product.name}
        </h1>

        {/* Tagline */}
        <p className="font-sans text-sm text-muted-foreground italic">
          {product.shortDescription || "Premium waist trainer for ultimate transformation"}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-3xl text-foreground">
            ${parseFloat(price.toString()).toFixed(2)}
          </span>
          {originalPrice && (
            <span className="font-heading text-xl text-muted-foreground line-through">
              ${parseFloat(originalPrice.toString()).toFixed(2)}
            </span>
          )}
          {originalPrice && (
            <span className="font-sans text-sm text-secondary">
              Save ${(parseFloat(originalPrice.toString()) - parseFloat(price.toString())).toFixed(2)}
            </span>
          )}
        </div>

        {/* Description preview */}
        {product.description && (
          <DescriptionPreview description={product.description} />
        )}
      </div>

      <Separator className="my-8" />

      {/* Variant Selection */}
      <div className="space-y-6">
        {/* Size Selector */}
        <div className="space-y-3">
          <label className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => !isOutOfStock && setSelectedSize(size)}
                disabled={isOutOfStock}
                className={cn(
                  "h-10 min-w-12 flex-1 sm:flex-none font-sans text-sm font-semibold",
                  selectedSize === size
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "border-border text-foreground hover:border-primary hover:text-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Compression Level */}
        <div className="space-y-3">
          <label className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
            Compression Level
          </label>
          <div className="flex gap-2">
            {compressionLevels.map((level) => (
              <Button
                key={level.value}
                variant={compressionLevel === level.value ? "default" : "outline"}
                size="sm"
                onClick={() => !isOutOfStock && setCompressionLevel(level.value)}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 h-10 font-sans text-xs font-semibold uppercase tracking-wide rounded-md",
                  compressionLevel === level.value
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "border-border text-foreground hover:border-primary hover:text-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-3">
          <label className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuantityDecrease}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Decrease quantity"
              className="h-10 w-10"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex h-10 w-12 items-center justify-center border border-border bg-transparent font-sans text-base text-foreground">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuantityIncrease}
              disabled={quantity >= (selectedVariant?.stockQuantity || 10) || isOutOfStock}
              aria-label="Increase quantity"
              className="h-10 w-10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 flex flex-col gap-3">
        {/* Primary Action - Add to Cart */}
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || addToCartMutation.isPending}
          className={cn(
            "w-full gap-2 bg-secondary text-secondary-foreground",
            "font-sans text-sm font-semibold uppercase tracking-wide",
            "hover:bg-accent hover:text-accent-foreground",
            "h-14",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {addToCartMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}
          {isOutOfStock ? "Out of Stock" : inCart ? "In Cart" : "Add to Cart"}
        </Button>

        {/* Secondary Action - Add to Wishlist */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToWishlist}
          disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
          className={cn(
            "w-full gap-2 border-border bg-transparent",
            "font-sans text-sm font-semibold uppercase tracking-wide text-foreground",
            "hover:border-secondary hover:text-secondary",
            "h-14"
          )}
        >
          {addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current text-secondary")} />
          )}
          {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
        </Button>

        {/* Buy Now */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleBuyNow}
          disabled={isOutOfStock || addToCartMutation.isPending}
          className={cn(
            "w-full gap-2",
            "font-sans text-sm font-semibold uppercase tracking-wide",
            "h-14",
            "border-secondary/50 text-secondary",
            "hover:bg-secondary/10",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {addToCartMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy Now"}
        </Button>
      </div>

      {/* Trust Micro Section */}
      <div className="mt-8 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-2 text-center">
          <Lock className="h-4 w-4 text-secondary" />
          <span className="font-sans text-[10px] uppercase tracking-wide text-muted-foreground">
            Secure Checkout
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Truck className="h-4 w-4 text-secondary" />
          <span className="font-sans text-[10px] uppercase tracking-wide text-muted-foreground">
            Fast Delivery
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <RefreshCw className="h-4 w-4 text-secondary" />
          <span className="font-sans text-[10px] uppercase tracking-wide text-muted-foreground">
            Easy Returns
          </span>
        </div>
      </div>

    </div>
  );
}

function DescriptionPreview({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setNeedsTruncation(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, []);

  return (
    <div className="mt-6">
      <div
        ref={textRef}
        className={cn(
          "font-sans text-sm text-muted-foreground leading-relaxed",
          !expanded && "line-clamp-3"
        )}
      >
        {description}
      </div>
      {needsTruncation && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 font-sans text-xs font-semibold uppercase tracking-wider text-secondary hover:text-accent p-0 h-auto"
        >
          {expanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  );
}
