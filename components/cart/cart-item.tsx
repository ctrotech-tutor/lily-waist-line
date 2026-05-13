"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  compression?: string;
  quantity: number;
  className?: string;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

export function CartItem({
  id,
  name,
  image,
  price,
  size,
  compression,
  quantity: initialQuantity,
  className,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(id, newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(id, newQuantity);
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  const total = price * quantity;

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
        className
      )}
    >
      {/* Desktop: Horizontal Layout */}
      {/* Mobile: Stacked with image on top */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1 min-w-0">
        {/* Product Image */}
        <div className="relative w-full sm:w-24 md:w-32 aspect-3/4 sm:aspect-square shrink-0 overflow-hidden bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        </div>

        {/* Product Info Block */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h3 className="font-heading text-lg md:text-xl text-foreground leading-tight line-clamp-2">
            {name}
          </h3>
          <div className="mt-2 space-y-1">
            <p className="font-sans text-sm text-muted-foreground">
              Size: <span className="text-foreground">{size}</span>
            </p>
            {compression && (
              <p className="font-sans text-sm text-muted-foreground">
                Compression: <span className="text-foreground">{compression}</span>
              </p>
            )}
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

      {/* Right Section: Quantity Controls, Price, Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleDecrease}
            disabled={quantity <= 1}
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
            className="h-9 w-9 shrink-0"
            onClick={handleIncrease}
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

        {/* Remove Action */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0",
            "text-muted-foreground",
            "hover:text-destructive hover:bg-destructive/10",
            "transition-colors duration-200"
          )}
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
