"use client";

import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export interface WishlistItemCardProps {
  id: string;
  image: string;
  name: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  stockState?: StockState;
  className?: string;
  onAddToCart?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function WishlistItemCard({
  id,
  image,
  name,
  tagline,
  price,
  originalPrice,
  stockState = "in-stock",
  className,
  onAddToCart,
  onRemove,
}: WishlistItemCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : null;

  const stockConfig = {
    "in-stock": { label: "In Stock", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    "low-stock": { label: "Low Stock", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    "out-of-stock": { label: "Out of Stock", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  };

  const handleAddToCart = () => {
    onAddToCart?.(id);
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col",
        "bg-card border border-border",
        "transition-all duration-500 ease-out",
        "hover:border-[#d4af37]/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {/* Product Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Remove Button - Top Right */}
        <button
          onClick={handleRemove}
          className={cn(
            "absolute top-3 right-3 z-10",
            "w-9 h-9 flex items-center justify-center",
            "bg-black/60 backdrop-blur-sm text-white",
            "transition-all duration-300 ease-out",
            "hover:bg-red-500/80 hover:text-white"
          )}
          aria-label="Remove from wishlist"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              className="bg-[#d4af37] text-black border-0 font-sans text-[10px] font-semibold uppercase tracking-widest px-2 py-1"
            >
              -{discountPercentage}%
            </Badge>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {stockState === "out-of-stock" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/80">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 p-4">
        {/* Stock Status Badge */}
        <Badge
          variant="outline"
          className={cn(
            "w-fit font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-none",
            stockConfig[stockState].color
          )}
        >
          {stockConfig[stockState].label}
        </Badge>

        {/* Product Name */}
        <h3 className="font-heading text-lg leading-tight text-foreground line-clamp-1">
          {name}
        </h3>

        {/* Product Tagline */}
        {tagline && (
          <p className="font-sans text-sm text-muted-foreground line-clamp-1">
            {tagline}
          </p>
        )}

        {/* Pricing Row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-heading text-xl text-foreground">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-heading text-sm text-muted-foreground line-through">
              ${originalPrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={stockState === "out-of-stock"}
          className={cn(
            "w-full mt-2 py-3",
            "font-button text-sm font-semibold uppercase tracking-wide",
            "bg-[#d4af37] text-black hover:bg-[#d4af37]/90",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {stockState === "out-of-stock" ? "Sold Out" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
