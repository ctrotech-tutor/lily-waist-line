"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Heart, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/optimized-image";
import type { CartItemWithDetails } from "@/lib/services/cart-service";

export interface CartItemProps {
  cartItem: CartItemWithDetails;
  className?: string;
  onQuantityChange?: (cartItemId: string, quantity: number) => void;
  onRemove?: (cartItemId: string) => void;
  onSaveForLater?: (productId: string) => void;
}

export function CartItem({
  cartItem,
  className,
  onQuantityChange,
  onRemove,
  onSaveForLater,
}: CartItemProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDecrease = useCallback(async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setIsUpdating(true);
      await onQuantityChange?.(cartItem.id, newQuantity);
      setIsUpdating(false);
    }
  }, [quantity, cartItem.id, onQuantityChange]);

  const handleIncrease = useCallback(async () => {
    if (quantity < cartItem.maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setIsUpdating(true);
      await onQuantityChange?.(cartItem.id, newQuantity);
      setIsUpdating(false);
    }
  }, [quantity, cartItem.maxQuantity, cartItem.id, onQuantityChange]);

  const handleRemove = useCallback(async () => {
    setIsUpdating(true);
    await onRemove?.(cartItem.id);
    setIsUpdating(false);
  }, [cartItem.id, onRemove]);

  const handleSaveForLater = useCallback(async () => {
    setIsUpdating(true);
    await onSaveForLater?.(cartItem.product.id);
    setIsUpdating(false);
  }, [cartItem.product.id, onSaveForLater]);

  const handleProductClick = useCallback(() => {
    router.push(`/product/${cartItem.product.id}/${cartItem.product.slug}`);
  }, [router, cartItem.product.id, cartItem.product.slug]);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewOpen(true);
  }, []);

  const total = cartItem.totalPrice;
  const price = cartItem.unitPrice;
  const imageUrl = cartItem.product.image?.url || "/placeholder-product.jpg";

  const stockLabel = !cartItem.variant.inStock
    ? "Out of Stock"
    : cartItem.variant.lowStock
      ? `Only ${cartItem.variant.stockQuantity} left`
      : "In Stock";

  const stockDotColor = !cartItem.variant.inStock
    ? "bg-destructive"
    : cartItem.variant.lowStock
      ? "bg-warning"
      : "bg-success";

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col sm:flex-row gap-4 sm:gap-6",
          "p-4 sm:p-6",
          "bg-card border border-border rounded-2xl",
          "transition-all duration-300 ease-out",
          "hover:border-primary/20 hover:shadow-sm hover:shadow-primary/5",
          isUpdating && "pointer-events-none",
          className
        )}
      >
        {/* Hover gold accent */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/40 rounded-full" />

        {/* Image */}
        <div className="relative w-full sm:w-28 md:w-32 aspect-3/4 sm:aspect-square shrink-0 overflow-hidden rounded-xl bg-muted cursor-pointer group/image"
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleImageClick(e as unknown as React.MouseEvent)}
        >
          <OptimizedImage
            src={imageUrl}
            alt={cartItem.product.name}
            className="object-cover transition-transform duration-500 group-hover/image:scale-105"
            sizes="(max-width: 640px) 100vw, 128px"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/0 flex items-center justify-center transition-all duration-300 group-hover/image:bg-background/20">
            <Eye className="w-5 h-5 text-foreground/0 group-hover/image:text-foreground/70 transition-all duration-300" />
          </div>

          {/* Updating skeleton */}
          {isUpdating && (
            <div className="absolute inset-0 bg-background/50 animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 gap-1.5 justify-center">
          <Button
            variant="link"
            onClick={handleProductClick}
            className="text-left p-0 h-auto"
          >
            <h3 className="font-heading text-lg md:text-xl text-foreground leading-tight line-clamp-2 hover:underline transition-colors duration-200">
              {cartItem.product.name}
            </h3>
          </Button>

          <div className="space-y-0.5 mt-1">
            <p className="font-sans text-sm text-muted-foreground">
              Size:{" "}
              <span className="text-foreground font-medium">{cartItem.variant.size}</span>
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              Compression:{" "}
              <span className="text-foreground font-medium">{cartItem.variant.compressionLevel}</span>
            </p>
          </div>

          {/* Stock indicator */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className={cn("w-1.5 h-1.5 rounded-full", stockDotColor)} />
            <span className="font-sans text-xs text-muted-foreground">{stockLabel}</span>
          </div>
        </div>

        {/* Quantity + Price + Actions */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-4 mt-2 sm:mt-0">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
              className="h-8 w-8"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="w-8 text-center font-sans text-sm font-medium text-foreground tabular-nums">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              disabled={quantity >= cartItem.maxQuantity || isUpdating}
              aria-label="Increase quantity"
              className="h-8 w-8"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-heading text-lg text-foreground tabular-nums">
              ${total.toFixed(2)}
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              ${price.toFixed(2)} each
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveForLater}
              disabled={isUpdating}
              aria-label="Save for later"
              title="Save for later"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8"
            >
              <Heart className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isUpdating}
              aria-label="Remove item"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              {isUpdating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl bg-background p-0 border-border max-h-[90vh] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{cartItem.product.name}</DialogTitle>
          </DialogHeader>
          <OptimizedImage
            src={imageUrl}
            alt={cartItem.product.name}
            className="w-full h-auto object-contain max-h-[80vh]"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}