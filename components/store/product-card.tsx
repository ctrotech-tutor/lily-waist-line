"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Eye, ShoppingBag, Loader2 } from "lucide-react";
import { ROUTES, ROUTE_BUILDERS } from "@/lib/constants/routes";
import { toast } from "sonner"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useAddToCart } from "@/hooks/use-cart-mutations";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/use-wishlist-mutations";

import {
  useProductWishlistStatus,
  useProductCartStatus,
} from "@/hooks/use-product-interactions";

import { ProductImage } from "../shared/optimized-image";
import { ProductQuickViewDialog } from "./product-quick-view";

import type { StockState } from "@/types/common";

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
  className,
}: ProductCardProps) {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<{
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    basePrice: number;
    compareAtPrice: number | null;
    images: { url: string; altText: string | null }[];
    variants: {
      id: string;
      size: string;
      compressionLevel: string;
      price: number | null;
      stockQuantity: number;
      images: { url: string }[];
    }[];
  } | null>(null);


  const { isWishlisted: wishlisted } =
    useProductWishlistStatus(id);

  const { inCart } =
    useProductCartStatus(variantId);

  const addToCartMutation = useAddToCart();

  const addToWishlistMutation =
    useAddToWishlist();

  const removeFromWishlistMutation =
    useRemoveFromWishlist();

  const hasDiscount =
    originalPrice && originalPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice - price) / originalPrice) * 100
      )
    : null;

  const stockConfig = {
    "in-stock": {
      label: "In Stock",
      color: "text-success",
    },

    "low-stock": {
      label: "Low Stock",
      color: "text-warning",
    },

    "out-of-stock": {
      label: "Out of Stock",
      color: "text-destructive",
    },
  };

  const handleCardClick = () => {
    router.push(`/product/${id}/${slug}`);
  };

  const handleQuickView = async (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const { getQuickViewProduct } = await import("@/server/actions/products/get-quick-view-product");
      const result = await getQuickViewProduct(id);
      if (result.success) {
        setQuickViewProduct(result.data);
        setQuickViewOpen(true);
      }
    } catch {
      toast.error("Failed to load product details");
    }
  };

  const handleAddToWishlist = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (wishlisted) {
      removeFromWishlistMutation.mutate(id, {
        onError: (error) => {
          if (
            error.message?.includes("logged in")
          ) {
            router.push(ROUTES.LOGIN);
          }
        },
      });

      return;
    }

    addToWishlistMutation.mutate(id, {
      onError: (error) => {
        if (
          error.message?.includes("logged in")
        ) {
          router.push("/login");
        }
      },
    });
  };

  const handleAddToCart = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (stockState === "out-of-stock") {
      return;
    }

    addToCartMutation.mutate(
      {
        variantId,
        quantity: 1,
      },
      {
        onError: (error) => {
          toast.error(error.message || "Failed to add to cart")
          router.push(ROUTES.LOGIN)
        },
      }
    );
  };

  return (
    <div
      role="link"
      tabIndex={0}
      className={cn(
        "group relative flex flex-col cursor-pointer",
        className
      )}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE */}
      <div
        className={cn(
          "relative isolate aspect-3/4",
          "overflow-hidden rounded-3xl",
          "bg-card",
          "transition-shadow duration-300 ease-out",
          isHovered &&
            "shadow-primary/10"
        )}
      >
        <ProductImage
          src={image}
          alt={name}
          className={cn(
            "h-full w-full object-cover",
            "transition-transform duration-500 ease-out",
            "transform-gpu backface-hidden",
            isHovered && "md:scale-[1.03]"
          )}
        />

        {/* Hover Border */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl border",
            "border-transparent",
            "transition-colors duration-300",
              isHovered &&
                "border-primary/30"
          )}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={cn(
                "inline-flex px-3 py-1.5 rounded-md",
                "bg-primary text-primary-foreground",
                "text-[10px] font-semibold uppercase tracking-widest"
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Discount */}
        {discountPercentage && (
          <div className="absolute right-3 top-3 z-10">
            <span
              className={cn(
                "inline-flex px-3 py-1.5 rounded-md",
                "bg-primary text-primary-foreground",
                "text-[10px] font-semibold uppercase tracking-widest"
              )}
            >
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Actions */}
        <div
          className={cn(
            "absolute bottom-3 left-3 right-3 z-10 flex gap-2",
            "transition-opacity duration-300",
            "sm:translate-y-3 sm:opacity-0",
            "group-hover:sm:translate-y-0",
            "group-hover:sm:opacity-100"
          )}
        >
          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddToWishlist}
            disabled={
              addToWishlistMutation.isPending ||
              removeFromWishlistMutation.isPending
            }
            className={cn(
              "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground",
              wishlisted && "text-primary",
              "shrink-0"
            )}
          >
            {addToWishlistMutation.isPending ||
            removeFromWishlistMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "h-4 w-4",
                  wishlisted && "fill-current"
                )}
              />
            )}
          </Button>

          {/* Quick View */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleQuickView}
            className="bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground shrink-0"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Add To Cart */}
          <Button
            variant="ghost"
            onClick={handleAddToCart}
            disabled={
              stockState === "out-of-stock" ||
              addToCartMutation.isPending
            }
            className={cn(
              "min-w-0 flex-1 px-4",
              "text-xs font-semibold uppercase tracking-wider",
              inCart
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4 shrink-0" />
            )}

            <span className="truncate">
              {stockState === "out-of-stock"
                ? "Sold Out"
                : inCart
                  ? "In Cart"
                  : "Add to Cart"}
            </span>
          </Button>
        </div>

        {/* Quick View Dialog */}
        {quickViewProduct && (
          <ProductQuickViewDialog
            product={quickViewProduct}
            open={quickViewOpen}
            onOpenChange={(open) => {
              setQuickViewOpen(open);
              if (!open) setQuickViewProduct(null);
            }}
          />
        )}

        {/* Out Of Stock */}
        {stockState ===
          "out-of-stock" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
              Out of Stock
            </span>
          </div>
        )}


      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-1.5 pt-4">
        <h3 className="line-clamp-1 text-lg text-foreground">
          {name}
        </h3>

        <p className="line-clamp-1 text-sm text-muted-foreground">
          {subtitle}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg text-foreground">
            ${price.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <span
          className={cn(
            "text-xs",
            stockConfig[stockState].color
          )}
        >
          {stockConfig[stockState].label}
        </span>
      </div>
    </div>
  );
}