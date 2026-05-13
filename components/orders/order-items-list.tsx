"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface OrderItemData {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  compression: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItemsListProps {
  items: OrderItemData[];
  className?: string;
}

export function OrderItemsList({ items, className }: OrderItemsListProps) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">
        Items Ordered
      </h2>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="relative w-full sm:w-24 h-32 sm:h-32 bg-muted shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 96px"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-lg text-foreground mb-2">
                    {item.productName}
                  </h3>

                  {/* Variants */}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="font-sans">
                      Size: <span className="text-foreground">{item.size}</span>
                    </span>
                    <span className="hidden sm:inline text-border">|</span>
                    <span className="font-sans">
                      Compression: <span className="text-foreground">{item.compression}</span>
                    </span>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-sm text-muted-foreground">
                      Qty: <span className="text-foreground font-medium">{item.quantity}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="font-heading text-lg text-foreground">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      ${item.unitPrice.toFixed(2)} each
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {index < items.length - 1 && (
              <Separator className="mt-6 bg-border/50" />
            )}
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm uppercase tracking-wider text-muted-foreground">
            Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
          </span>
          <span className="font-heading text-xl text-foreground">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
