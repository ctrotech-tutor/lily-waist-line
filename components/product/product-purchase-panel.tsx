"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingBag,
  Heart,
  Shield,
  Truck,
  RefreshCw,
  Lock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addToCart } from "@/server/actions/cart";
import { addToWishlist } from "@/server/actions/wishlist";
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
    className: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  },
  "low-stock": {
    label: "Low Stock",
    className: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
};

export function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [compressionLevel, setCompressionLevel] = useState<string>("MEDIUM");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  // Get unique sizes from variants
  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)));
  
  // Find selected variant based on size and compression level
  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.compressionLevel === compressionLevel
  );

  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => Math.min(selectedVariant?.stockQuantity || 10, prev + 1));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stockQuantity === 0) return;

    setIsAddingToCart(true);
    setCartMessage(null);

    try {
      const result = await addToCart({ variantId: selectedVariant.id, quantity });
      if (result.success) {
        setCartMessage("Added to cart!");
        setTimeout(() => setCartMessage(null), 2000);
      } else {
        setCartMessage(result.error || "Failed to add to cart");
        setTimeout(() => setCartMessage(null), 3000);
      }
    } catch (error) {
      setCartMessage("Failed to add to cart");
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);

    try {
      const result = await addToWishlist(product.id);
      if (result.success) {
        setIsWishlisted(true);
      } else {
        if (result.error?.includes("logged in")) {
          router.push("/login");
          return;
        }
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || selectedVariant.stockQuantity === 0) return;

    setIsAddingToCart(true);

    try {
      const result = await addToCart({ variantId: selectedVariant.id, quantity });
      if (result.success) {
        // Navigate to checkout page (to be implemented)
        router.push("/checkout");
      } else {
        setCartMessage(result.error || "Failed to add to cart");
        setTimeout(() => setCartMessage(null), 3000);
      }
    } catch (error) {
      setCartMessage("Failed to add to cart");
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setIsAddingToCart(false);
    }
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
      </div>

      <Separator className="my-8" />

      {/* Variant Selection */}
      <div className="space-y-6">
        {/* Size Selector */}
        <div className="space-y-3">
          <label className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
            Size
          </label>
          <Select
            value={selectedSize}
            onValueChange={setSelectedSize}
            disabled={isOutOfStock}
          >
            <SelectTrigger
              className={cn(
                "h-12 w-full border-border bg-transparent font-sans text-sm",
                "focus:ring-secondary focus:ring-1",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card">
              {availableSizes.map((size) => (
                <SelectItem
                  key={size}
                  value={size}
                  className="font-sans text-sm focus:bg-secondary/10 focus:text-foreground"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Compression Level */}
        <div className="space-y-3">
          <label className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
            Compression Level
          </label>
          <div className="flex border border-border overflow-hidden">
            {compressionLevels.map((level, index) => (
              <button
                key={level.value}
                onClick={() => !isOutOfStock && setCompressionLevel(level.value)}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 py-3 px-2 font-sans text-xs font-semibold uppercase tracking-wide",
                  "transition-colors duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  index !== compressionLevels.length - 1 && "border-r border-border",
                  compressionLevel === level.value
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-transparent text-foreground hover:bg-secondary/10"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-3">
          <label className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
            Quantity
          </label>
          <div className="flex items-center w-fit">
            <button
              onClick={handleQuantityDecrease}
              disabled={quantity <= 1 || isOutOfStock}
              className={cn(
                "flex h-12 w-12 items-center justify-center",
                "border border-r-0 border-border bg-transparent",
                "font-sans text-lg text-foreground",
                "transition-colors hover:text-secondary",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-foreground"
              )}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="flex h-12 w-16 items-center justify-center border border-border bg-transparent font-sans text-base text-foreground">
              {quantity}
            </div>
            <button
              onClick={handleQuantityIncrease}
              disabled={quantity >= (selectedVariant?.stockQuantity || 10) || isOutOfStock}
              className={cn(
                "flex h-12 w-12 items-center justify-center",
                "border border-l-0 border-border bg-transparent",
                "font-sans text-lg text-foreground",
                "transition-colors hover:text-secondary",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-foreground"
              )}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 flex flex-col gap-3">
        {/* Primary Action - Add to Cart */}
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={cn(
            "w-full gap-2 bg-secondary text-secondary-foreground",
            "font-sans text-sm font-semibold uppercase tracking-wide",
            "hover:bg-accent hover:text-accent-foreground",
            "h-14",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Secondary Action - Add to Wishlist */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className={cn(
            "w-full gap-2 border-border bg-transparent",
            "font-sans text-sm font-semibold uppercase tracking-wide text-foreground",
            "hover:border-secondary hover:text-secondary",
            "h-14"
          )}
        >
          {isAddingToWishlist ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current text-secondary")} />
          )}
          {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
        </Button>

        {/* Buy Now */}
        <Button
          size="lg"
          variant="ghost"
          onClick={handleBuyNow}
          disabled={isOutOfStock || isAddingToCart}
          className={cn(
            "w-full gap-2",
            "font-sans text-sm font-semibold uppercase tracking-wide",
            "h-14",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Buy Now
        </Button>
      </div>

      {/* Success/Error Message */}
      {cartMessage && (
        <div className="mt-4 text-center">
          <span className={cn(
            "inline-block px-4 py-2 text-xs font-semibold uppercase tracking-wider",
            cartMessage.includes("Added") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {cartMessage}
          </span>
        </div>
      )}

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

      {/* Additional Trust Badges */}
      <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-secondary" />
          <span className="font-sans text-xs text-muted-foreground">
            256-bit SSL Secure
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-secondary" />
          <span className="font-sans text-xs text-muted-foreground">
            Free Shipping $75+
          </span>
        </div>
      </div>
    </div>
  );
}
