"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Eye, ShoppingBag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addToCart, getCart } from "@/server/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "@/server/actions/wishlist";
import { ProductImage } from "../shared/optimized-image";

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductCardProps {
  id: string;
  variantId: string;
  slug: string;
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
  variantId,
  slug,
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
  const router = useRouter();

  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    async function checkWishlistStatus() {
      try {
        const result = await getWishlist();

        if (result.success) {
          const isInWishlist = result.data.some(
            (item) => item.product.id === id
          );

          setWishlisted(isInWishlist);
        }
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    }

    checkWishlistStatus();
  }, [id]);

  useEffect(() => {
    async function checkCartStatus() {
      try {
        const result = await getCart();

        if (result.success && result.data) {
          const isInCart = result.data.items.some(
            (item) => item.variant.id === variantId
          );

          setInCart(isInCart);
        }
      } catch (error) {
        console.error("Failed to check cart status:", error);
      }
    }

    checkCartStatus();
  }, [variantId]);

  const hasDiscount = originalPrice && originalPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const stockConfig = {
    "in-stock": {
      label: "In Stock",
      color: "text-emerald-500",
    },
    "low-stock": {
      label: "Low Stock",
      color: "text-amber-500",
    },
    "out-of-stock": {
      label: "Out of Stock",
      color: "text-red-500",
    },
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (stockState === "out-of-stock") return;

    setIsAddingToCart(true);
    setCartMessage(null);

    try {
      const result = await addToCart({
        variantId,
        quantity: 1,
      });

      if (result.success) {
        setInCart(true);
        setCartMessage("Added to cart!");

        setTimeout(() => {
          setCartMessage(null);
        }, 2000);
      } else {
        setCartMessage(result.error || "Failed to add to cart");

        setTimeout(() => {
          setCartMessage(null);
        }, 3000);
      }
    } catch {
      setCartMessage("Failed to add to cart");

      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsAddingToWishlist(true);

    try {
      if (wishlisted) {
        const result = await removeFromWishlist(id);

        if (result.success) {
          setWishlisted(false);
        }
      } else {
        const result = await addToWishlist(id);

        if (result.success) {
          setWishlisted(true);
        } else {
          if (result.error?.includes("logged in")) {
            router.push("/login");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log("Quick view:", id);
  };

  const handleCardClick = () => {
    router.push(`/product/${id}/${slug}`);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col cursor-pointer",
        "transition-all duration-500 ease-out",
        className
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE */}
      <div
        className={cn(
          "relative aspect-3/4 overflow-hidden rounded-3xl",
          "bg-card",
          "transition-all duration-500 ease-out",
          isHovered &&
          "shadow-[0_8px_30px_rgba(212,175,55,0.10)] dark:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
        )}
      >
        <ProductImage
          src={image}
          alt={name}
          className={cn(
            "transition-transform duration-700 ease-out",
            isHovered && "scale-105"
          )}
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl border border-transparent",
            "transition-all duration-500 ease-out",
            isHovered && "border-accent/40"
          )}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1.5",
                "bg-[#d4af37] text-black",
                "font-sans text-[10px] font-semibold uppercase tracking-widest"
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Discount */}
        {discountPercentage && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1.5",
                "bg-black text-[#d4af37]",
                "font-sans text-[10px] font-semibold uppercase tracking-widest"
              )}
            >
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Actions */}
        <div
          className={cn(
            "absolute bottom-3 left-3 right-3 flex gap-2",
            "transition-all duration-500 ease-out",
            "sm:opacity-0 sm:translate-y-4",
            "group-hover:sm:opacity-100 group-hover:sm:translate-y-0"
          )}
        >
          {/* Wishlist */}
          <button
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
              "bg-black/80 backdrop-blur-sm",
              "transition-all duration-300",
              "hover:bg-[#d4af37] hover:text-black",
              wishlisted ? "text-[#d4af37]" : "text-white",
              "disabled:opacity-50"
            )}
          >
            {isAddingToWishlist ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "h-4 w-4",
                  wishlisted && "fill-current"
                )}
              />
            )}
          </button>

          {/* Quick View */}
          <button
            onClick={handleQuickView}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
              "bg-black/80 text-white backdrop-blur-sm",
              "transition-all duration-300",
              "hover:bg-[#d4af37] hover:text-black"
            )}
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            disabled={stockState === "out-of-stock" || isAddingToCart}
            className={cn(
              "flex h-10 flex-1 min-w-0 items-center justify-center gap-2 rounded-full px-4",
              inCart
                ? "bg-[#d4af37] text-black"
                : "bg-black/80 text-white backdrop-blur-sm",
              "font-sans text-xs font-semibold uppercase tracking-wider",
              "transition-all duration-300",
              !inCart && "hover:bg-[#d4af37] hover:text-black",
              "disabled:opacity-50"
            )}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4 shrink-0" />
            )}

            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {stockState === "out-of-stock"
                ? "Sold Out"
                : inCart
                  ? "In Cart"
                  : "Add to Cart"}
            </span>
          </button>
        </div>

        {/* Stock Overlay */}
        {stockState === "out-of-stock" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/80">
              Out of Stock
            </span>
          </div>
        )}

        {/* Toast */}
        {cartMessage && (
          <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
            <span className="inline-flex rounded-full bg-black/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
              {cartMessage}
            </span>
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-1.5 pt-4">
        <h3 className="line-clamp-1 font-heading text-lg text-foreground">
          {name}
        </h3>

        <p className="line-clamp-1 font-sans text-sm text-muted-foreground">
          {subtitle}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="font-heading text-lg text-foreground">
            ${price.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="font-heading text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <span
          className={cn(
            "font-sans text-xs",
            stockConfig[stockState].color
          )}
        >
          {stockConfig[stockState].label}
        </span>
      </div>
    </div>
  );
}