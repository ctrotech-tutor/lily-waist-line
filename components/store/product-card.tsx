"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  stockState?: StockState;
  isWishlisted?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  image,
  name,
  subtitle,
  price,
  originalPrice,
  badge,
  stockState = "in-stock",
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : null;

  const stockConfig = {
    "in-stock": { label: "In Stock", color: "text-emerald-500" },
    "low-stock": { label: "Low Stock", color: "text-amber-500" },
    "out-of-stock": { label: "Out of Stock", color: "text-red-500" },
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col shadow-sm",
        "transition-all duration-500 ease-out",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative aspect-3/4 overflow-hidden",
          "bg-card",
          "transition-all duration-500 ease-out",
          isHovered && "shadow-[0_0_30px_rgba(212,175,55,0.15)]"
        )}
      >
        {/* Product Image */}
        <Image
          src={image}
          alt={name}
          fill
          className={cn(
            "object-cover",
            "transition-transform duration-700 ease-out",
            isHovered && "scale-105"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"

        />

        {/* Hover Border Glow */}
        <div
          className={cn(
            "absolute inset-0 border border-transparent",
            "transition-all duration-500 ease-out",
            isHovered && "border-[#d4af37]/40"
          )}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={cn(
                "inline-block px-3 py-1.5",
                "bg-[#d4af37] text-black",
                "font-sans text-[10px] font-semibold uppercase tracking-widest",
                "leading-none"
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={cn(
                "inline-block px-3 py-1.5",
                "bg-black text-[#d4af37]",
                "font-sans text-[10px] font-semibold uppercase tracking-widest",
                "leading-none"
              )}
            >
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Action Buttons - Desktop Hover / Mobile Always Visible */}
        <div
          className={cn(
            "absolute bottom-3 left-3 right-3 flex gap-2",
            "transition-all duration-500 ease-out",
            "sm:opacity-0 sm:translate-y-4",
            "group-hover:sm:opacity-100 group-hover:sm:translate-y-0"
          )}
        >
          {/* Wishlist Button */}
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={cn(
              "flex items-center justify-center",
              "w-10 h-10",
              "bg-black/80 backdrop-blur-sm",
              "transition-all duration-300 ease-out",
              "hover:bg-[#d4af37] hover:text-black",
              wishlisted ? "text-[#d4af37]" : "text-white"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                wishlisted && "fill-current"
              )}
            />
          </button>

          {/* Quick View Button */}
          <button
            className={cn(
              "flex items-center justify-center",
              "w-10 h-10",
              "bg-black/80 backdrop-blur-sm text-white",
              "transition-all duration-300 ease-out",
              "hover:bg-[#d4af37] hover:text-black"
            )}
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add to Cart Button */}
          <button
            disabled={stockState === "out-of-stock"}
            className={cn(
              "flex-1 flex items-center justify-center gap-2",
              "h-10 px-4",
              "bg-black/80 backdrop-blur-sm text-white",
              "font-sans text-xs font-semibold uppercase tracking-wider",
              "transition-all duration-300 ease-out",
              "hover:bg-[#d4af37] hover:text-black",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">
              {stockState === "out-of-stock" ? "Sold Out" : "Add to Cart"}
            </span>
          </button>
        </div>

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
      <div className="flex flex-col gap-1.5 pt-4">
        {/* Product Name */}
        <h3 className="font-heading text-lg leading-tight text-foreground line-clamp-1">
          {name}
        </h3>

        {/* Product Subtitle */}
        <p className="font-sans text-sm text-muted-foreground line-clamp-1">
          {subtitle}
        </p>

        {/* Pricing Row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-heading text-lg text-foreground">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-heading text-sm text-muted-foreground line-through">
              ${originalPrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <span className={cn("font-sans text-xs", stockConfig[stockState].color)}>
          {stockConfig[stockState].label}
        </span>
      </div>
    </div>
  );
}
