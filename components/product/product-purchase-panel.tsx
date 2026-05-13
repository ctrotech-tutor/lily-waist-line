"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock product data interface
interface ProductPurchasePanelProps {
  product?: {
    name: string;
    tagline: string;
    price: number;
    originalPrice?: number;
    stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  };
}

// Default mock data
const defaultProduct = {
  name: "Elite Sculpt Waist Trainer",
  tagline: "Maximum Compression for Ultimate Transformation",
  price: 89.99,
  originalPrice: 119.99,
  stockStatus: "in-stock" as const,
};

const sizeOptions = ["XS", "S", "M", "L", "XL"];

const compressionLevels = [
  { value: "light", label: "Light Sculpt" },
  { value: "medium", label: "Medium Sculpt" },
  { value: "maximum", label: "Maximum Sculpt" },
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
  product = defaultProduct,
}: ProductPurchasePanelProps) {
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => Math.min(10, prev + 1));
  };

  const isOutOfStock = product.stockStatus === "out-of-stock";

  return (
    <div className="flex flex-col">
      {/* Product Header */}
      <div className="space-y-4">
        {/* Stock Badge */}
        <Badge
          variant="secondary"
          className={cn("font-sans text-xs", stockConfig[product.stockStatus].className)}
        >
          {stockConfig[product.stockStatus].label}
        </Badge>

        {/* Product Name */}
        <h1 className="font-heading text-3xl leading-tight text-foreground lg:text-4xl">
          {product.name}
        </h1>

        {/* Tagline */}
        <p className="font-sans text-sm text-muted-foreground italic">
          {product.tagline}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-3xl text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="font-heading text-xl text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.originalPrice && (
            <span className="font-sans text-sm text-secondary">
              Save ${(product.originalPrice - product.price).toFixed(2)}
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
              {sizeOptions.map((size) => (
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
              disabled={quantity >= 10 || isOutOfStock}
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
          disabled={isOutOfStock}
          className={cn(
            "w-full gap-2 bg-secondary text-secondary-foreground",
            "font-sans text-sm font-semibold uppercase tracking-wide",
            "hover:bg-accent hover:text-accent-foreground",
            "h-14",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Secondary Action - Add to Wishlist */}
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "w-full gap-2 border-border bg-transparent",
            "font-sans text-sm font-semibold uppercase tracking-wide text-foreground",
            "hover:border-secondary hover:text-secondary",
            "h-14"
          )}
        >
          <Heart className="h-4 w-4" />
          Add to Wishlist
        </Button>

        {/* Optional - Buy Now (placeholder, disabled) */}
        <Button
          size="lg"
          variant="ghost"
          disabled
          className={cn(
            "w-full gap-2",
            "font-sans text-sm font-semibold uppercase tracking-wide",
            "h-14 opacity-50 cursor-not-allowed"
          )}
        >
          Buy Now
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
