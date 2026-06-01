"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/shared/optimized-image";
import type { WishlistItemCardProps } from "@/types/wishlist";
import { ROUTES } from "@/lib/constants/routes";

export type { WishlistItemCardProps };

export function WishlistItemCard({
  id,
  slug,
  image,
  name,
  tagline,
  price,
  originalPrice,
  stockState = "in-stock",
  variantId,
  inCart = false,
  className,
  onAddToCart,
  onRemove,
}: WishlistItemCardProps) {
  const router = useRouter();

  const hasDiscount = originalPrice && originalPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : null;

  const stockConfig = {
    "in-stock": {
      label: "In Stock",
      color:
        "bg-success/10 text-success border-success/20",
    },
    "low-stock": {
      label: "Low Stock",
      color:
        "bg-warning/10 text-warning border-warning/20",
    },
    "out-of-stock": {
      label: "Out of Stock",
      color: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      router.push(ROUTES.CART);
      return;
    }
    if (variantId) onAddToCart?.(variantId);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(id);
  };

  const handleCardClick = () => {
    router.push(`/product/${id}/${slug}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        "group relative flex flex-col cursor-pointer",
        "bg-card border border-border",
        "rounded-2xl overflow-hidden",
        "transition-all duration-500 ease-out",
        "hover:border-primary/30 hover:shadow-primary/10",
        className
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        <ProductImage
          src={image}
          alt={name}
          className={cn(
            "transition-transform duration-700 ease-out",
            "group-hover:scale-105"
          )}
        />

        {/* REMOVE */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="absolute top-3 right-3 z-10 bg-foreground/10 backdrop-blur-md text-foreground hover:bg-destructive/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* DISCOUNT */}
        {discountPercentage && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-widest px-2 py-1">
              -{discountPercentage}%
            </Badge>
          </div>
        )}

        {/* OUT OF STOCK */}
        {stockState === "out-of-stock" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-white/80">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-2 p-4">
        {/* STOCK BADGE */}
        <Badge
          variant="outline"
          className={cn(
            "w-fit",
            "text-[10px] font-semibold uppercase tracking-wider px-2 py-1",
            stockConfig[stockState].color
          )}
        >
          {stockConfig[stockState].label}
        </Badge>

        {/* NAME */}
        <h3 className="text-lg font-heading leading-tight line-clamp-1">
          {name}
        </h3>

        {/* TAGLINE */}
        {tagline && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {tagline}
          </p>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xl font-heading">
            ${price.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          onClick={handleAddToCart}
          disabled={stockState === "out-of-stock" || !variantId}
          className={cn(
            "w-full mt-2 h-11",
            inCart
              ? "bg-primary text-primary-foreground hover:bg-black/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            "font-semibold uppercase tracking-wide",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {stockState === "out-of-stock" || !variantId
            ? "Sold Out"
            : inCart
              ? "In Cart"
              : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}