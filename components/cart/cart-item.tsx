"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handleDecrease = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setIsUpdating(true);
      await onQuantityChange?.(cartItem.id, newQuantity);
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (quantity < cartItem.maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setIsUpdating(true);
      await onQuantityChange?.(cartItem.id, newQuantity);
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove?.(cartItem.id);
    setIsUpdating(false);
  };

  const handleSaveForLater = async () => {
    setIsUpdating(true);
    await onSaveForLater?.(cartItem.product.id);
    setIsUpdating(false);
  };

  const handleProductClick = () => {
    router.push(`/product/${cartItem.product.id}/${cartItem.product.slug}`);
  };

  const total = cartItem.totalPrice;
  const price = cartItem.unitPrice;
  const imageUrl = cartItem.product.image?.url || "/placeholder-product.jpg";

  return (
    <div
      className={cn(
        "group relative",
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        "gap-4 sm:gap-6",
        "p-4 sm:p-6",
        "bg-card",
        "border border-border",
        "transition-all duration-300 ease-out",
        isUpdating && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Desktop: Horizontal Layout */}
      {/* Mobile: Stacked with image on top */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1 min-w-0">
        {/* Product Image */}
        <div className="relative w-full sm:w-24 md:w-32 aspect-3/4 sm:aspect-square shrink-0 overflow-hidden bg-muted">
          <OptimizedImage
            src={imageUrl}
            alt={cartItem.product.name}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        </div>

        {/* Product Info Block */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <button
            onClick={handleProductClick}
            className="text-left hover:underline"
          >
            <h3 className="font-heading text-lg md:text-xl text-foreground leading-tight line-clamp-2">
              {cartItem.product.name}
            </h3>
          </button>
          <div className="mt-2 space-y-1">
            <p className="font-sans text-sm text-muted-foreground">
              Size: <span className="text-foreground">{cartItem.variant.size}</span>
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              Compression: <span className="text-foreground">{cartItem.variant.compressionLevel}</span>
            </p>
          </div>
          
          {/* Mobile-only price display */}
          <div className="sm:hidden mt-3 flex items-center gap-2">
            <span className="font-heading text-lg text-foreground">
              ${total.toFixed(2)}
            </span>
            <span className="font-sans text-sm text-muted-foreground">
              (${price.toFixed(2)} each)
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Quantity Controls, Price, Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={handleDecrease}
            disabled={quantity <= 1 || isUpdating}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <span className="w-10 text-center font-sans text-sm font-medium text-foreground">
            {quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={handleIncrease}
            disabled={quantity >= cartItem.maxQuantity || isUpdating}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Desktop-only Price */}
        <div className="hidden sm:block text-right min-w-24">
          <p className="font-heading text-lg md:text-xl text-foreground">
            ${total.toFixed(2)}
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            ${price.toFixed(2)} each
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Save for Later */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full shrink-0",
              "text-muted-foreground",
              "hover:text-primary hover:bg-primary/10",
              "transition-colors duration-200"
            )}
            onClick={handleSaveForLater}
            disabled={isUpdating}
            aria-label="Save for later"
            title="Save for later"
          >
            <Heart className="w-4 h-4" />
          </Button>

          {/* Remove Action */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full shrink-0",
              "text-muted-foreground",
              "hover:text-destructive hover:bg-destructive/10",
              "transition-colors duration-200"
            )}
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
