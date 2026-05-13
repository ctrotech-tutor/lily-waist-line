"use client";

import { ShieldCheck, Truck, Undo2, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface CartSummaryProps {
  subtotal: number;
  deliveryFee?: number | null;
  discount?: number;
  className?: string;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  itemCount?: number;
}

export function CartSummary({
  subtotal,
  deliveryFee = null,
  discount = 0,
  className,
  onCheckout,
  onContinueShopping,
  itemCount = 0,
}: CartSummaryProps) {
  const deliveryDisplay = deliveryFee === null 
    ? "Calculated at checkout" 
    : deliveryFee === 0 
      ? "Free" 
      : `$${deliveryFee.toFixed(2)}`;

  const total = subtotal + (deliveryFee ?? 0) - discount;

  const trustItems = [
    { icon: ShieldCheck, label: "Secure Checkout" },
    { icon: Truck, label: "Fast Delivery" },
    { icon: Undo2, label: "Easy Returns" },
  ];

  return (
    <Card className={cn("border-border", className)}>
      <CardContent className="p-6">
        {/* Summary Header */}
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-6">
          Order Summary
        </h2>

        {/* Price Breakdown */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="font-sans text-sm text-muted-foreground">
              Subtotal {itemCount > 0 && `(${itemCount} item${itemCount !== 1 ? 's' : ''})`}
            </span>
            <span className="font-sans text-sm font-medium text-foreground">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center">
            <span className="font-sans text-sm text-muted-foreground">
              Delivery Fee
            </span>
            <span className={cn(
              "font-sans text-sm font-medium",
              deliveryFee === 0 ? "text-green-500" : "text-foreground"
            )}>
              {deliveryDisplay}
            </span>
          </div>

          {/* Discount (only shown if applied) */}
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-muted-foreground">
                Discount
              </span>
              <span className="font-sans text-sm font-medium text-green-500">
                -${discount.toFixed(2)}
              </span>
            </div>
          )}

          <Separator className="my-4" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg font-semibold text-foreground">
              Total
            </span>
            <span className="font-heading text-xl font-semibold text-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Trust Microcopy Section */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs"
              >
                <item.icon className="w-3.5 h-3.5 text-secondary" />
                <span className="font-sans">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <Button
          onClick={onCheckout}
          className={cn(
            "w-full mt-6",
            "h-12",
            "font-sans text-sm font-semibold uppercase tracking-wider",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/90",
            "transition-colors duration-200"
          )}
          size="lg"
          disabled={subtotal === 0}
        >
          Proceed to Checkout
        </Button>

        {/* Secondary Action */}
        <Button
          onClick={onContinueShopping}
          variant="ghost"
          className={cn(
            "w-full mt-3",
            "h-10",
            "font-sans text-sm font-medium",
            "text-muted-foreground",
            "hover:text-foreground hover:bg-transparent",
            "transition-colors duration-200"
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </CardContent>
    </Card>
  );
}
