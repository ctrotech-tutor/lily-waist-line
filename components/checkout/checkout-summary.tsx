"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package, ChevronDown, ChevronUp, Tag, Shield, Truck, RotateCcw } from "lucide-react";

// Mock item for preview
interface MockItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface CheckoutSummaryProps {
  subtotal?: number;
  shipping?: number | null;
  discount?: number;
  total?: number;
  items?: MockItem[];
  className?: string;
  promoCode?: string;
  onPromoApply?: (code: string) => void;
}

// Default mock cart data
const defaultMockItems: MockItem[] = [
  {
    id: "1",
    name: "Elite Sculpt Waist Trainer",
    image: "/img-1.png",
    price: 120,
    quantity: 1,
    variant: "Size M / High Compression",
  },
];

export function CheckoutSummary({
  subtotal: propSubtotal,
  shipping = 10,
  discount = 0,
  total: propTotal,
  items = defaultMockItems,
  className,
  onPromoApply,
}: CheckoutSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Calculate totals from mock data if not provided
  const calculatedSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = propSubtotal ?? calculatedSubtotal;
  const shippingValue = shipping ?? 0;
  const total = propTotal ?? (subtotal + shippingValue - discount);

  const shippingDisplay = shippingValue === 0
    ? "Free"
    : `$${shippingValue.toFixed(2)}`;

  // Show max 2-3 items, overflow to "+ more items"
  const visibleItems = items.slice(0, 3);
  const hiddenCount = items.length - visibleItems.length;

  const handlePromoApply = () => {
    if (promoInput.trim()) {
      setIsPromoApplied(true);
      onPromoApply?.(promoInput);
    }
  };

  return (
    <Card className={cn("border-border bg-background", className)}>
      <CardContent className="p-0">
        {/* Mobile Accordion Header */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-semibold text-foreground">
                Order Summary
              </span>
              <Badge variant="secondary" className="text-xs">
                {items.length} {items.length === 1 ? "item" : "items"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-heading text-lg font-semibold text-secondary">
                ${total.toFixed(2)}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </div>

        {/* Desktop Header - Always Visible */}
        <div className="hidden lg:block p-6 pb-0">
          <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground">
            Order Summary
          </h2>
        </div>

        {/* Collapsible Content - Desktop always visible, Mobile togglable */}
        <div className={cn(
          "lg:block",
          isExpanded ? "block" : "hidden"
        )}>
          <div className="p-4 lg:p-6 pt-4">
            {/* Item Preview */}
            {items.length > 0 && (
              <>
                <div className="space-y-4 mb-6">
                  {visibleItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      {/* Item Image */}
                      <div className="w-16 h-20 bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="font-heading text-sm font-medium text-foreground leading-tight">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="font-sans text-xs text-muted-foreground mt-0.5">
                            {item.variant}
                          </p>
                        )}
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Item Price */}
                      <span className="font-sans text-sm font-medium text-foreground pt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Overflow Indicator */}
                  {hiddenCount > 0 && (
                    <p className="font-sans text-xs text-muted-foreground text-center py-2">
                      + {hiddenCount} more {hiddenCount === 1 ? "item" : "items"}
                    </p>
                  )}
                </div>
                <Separator className="mb-6" />
              </>
            )}

            {/* Promo Code UI */}
            <div className="mb-6">
              {!isPromoApplied ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handlePromoApply}
                    disabled={!promoInput.trim()}
                    className="h-10 px-4 text-sm font-medium"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-secondary/10 border border-secondary/20">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-secondary" />
                    <span className="font-sans text-sm text-foreground">
                      Code <span className="font-medium">{promoInput}</span> applied
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsPromoApplied(false);
                      setPromoInput("");
                    }}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-sans text-sm font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm text-muted-foreground">
                  Shipping
                </span>
                <span
                  className={cn(
                    "font-sans text-sm font-medium",
                    shipping === 0 ? "text-green-500" : "text-foreground"
                  )}
                >
                  {shippingDisplay}
                </span>
              </div>

              {/* Discount (if applied) */}
              {(isPromoApplied || discount > 0) && (
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

              {/* Total - Emphasized Block */}
              <div className="p-4 bg-secondary/10 border border-secondary/20 -mx-4 lg:-mx-6">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-lg font-semibold text-foreground">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="font-heading text-2xl font-semibold text-secondary block">
                      ${total.toFixed(2)}
                    </span>
                    <span className="font-sans text-xs text-muted-foreground">
                      Including taxes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                    Secure
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                    Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
