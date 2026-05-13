"use client";

import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderDetails } from "./data";

interface AdminOrderItemsProps {
  order: OrderDetails;
}

export function AdminOrderItems({ order }: AdminOrderItemsProps) {
  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-[#d4af37]" />
          <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
            Order Items ({order.items.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.items.map((item, index) => (
          <div key={item.id}>
            <div className="flex gap-4">
              <div className="h-20 w-16 flex-shrink-0 overflow-hidden border border-border/50 bg-muted/30">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-[family-name:var(--font-bodoni-moda)] text-sm font-medium">
                    {item.productName}
                  </p>
                  <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                    {item.variant}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                  <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            {index < order.items.length - 1 && <Separator className="mt-4 bg-border/50" />}
          </div>
        ))}

        <Separator className="bg-border/50" />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-[family-name:var(--font-montserrat)] text-muted-foreground">Subtotal</span>
            <span className="font-[family-name:var(--font-montserrat)]">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-[family-name:var(--font-montserrat)] text-muted-foreground">Shipping</span>
            <span className="font-[family-name:var(--font-montserrat)]">
              {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-2">
            <span className="font-[family-name:var(--font-montserrat)] text-sm font-semibold">Total</span>
            <span className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold text-[#d4af37]">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
