"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  MapPin,
  CreditCard,
  Package,
  Shield,
  Clock,
  Zap,
  Loader2,
  ArrowRight,
  DollarSign,
  Globe,
} from "lucide-react";
import { AddressCardData } from "./address-selector";
import { PaymentMethod } from "./payment-method-selector";

// Mock item for order summary
interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface OrderReviewProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  selectedAddress: AddressCardData | null;
  selectedPayment: PaymentMethod | null;
  onEditAddress: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
  isLoading?: boolean;
  className?: string;
}

export function OrderReview({
  items,
  subtotal,
  shipping,
  total,
  selectedAddress,
  selectedPayment,
  onEditAddress,
  onEditPayment,
  onPlaceOrder,
  isLoading = false,
  className,
}: OrderReviewProps) {
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    onPlaceOrder();
  };

  const fullName = selectedAddress
    ? `${selectedAddress.firstName} ${selectedAddress.lastName}`
    : "";

  const locationLine = selectedAddress
    ? [selectedAddress.city, selectedAddress.state, selectedAddress.country]
        .filter(Boolean)
        .join(" / ")
    : "";

  const paymentInfo = selectedPayment === "cashapp"
    ? { label: "Cash App", badge: "US Orders", icon: DollarSign, description: "You will complete payment via Cash App after order confirmation." }
    : { label: "PayPal", badge: "Global", icon: Globe, description: "You will be redirected to PayPal to complete payment securely." };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 1. Order Summary Recap */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Order Summary
          </h3>
          <p className="font-sans text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="p-5">
          {/* Item List */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {/* Item Image */}
                <div className="w-14 h-18 bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <Package className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0 pt-0.5">
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
                <span className="font-sans text-sm font-medium text-foreground pt-0.5">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator className="mb-6" />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-muted-foreground">Subtotal</span>
              <span className="font-sans text-sm font-medium text-foreground">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-muted-foreground">Shipping</span>
              <span className="font-sans text-sm font-medium text-foreground">
                ${shipping.toFixed(2)}
              </span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="font-heading text-base font-semibold text-foreground">
                Total
              </span>
              <span className="font-heading text-xl font-semibold text-secondary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Shipping Address Recap */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              Shipping Address
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditAddress}
            className="h-8 px-3 text-sm text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            Change
          </Button>
        </div>

        <div className="p-5">
          {selectedAddress ? (
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 flex items-center justify-center border border-secondary/30 bg-secondary/10">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-sm font-semibold text-foreground mb-1">
                  {fullName}
                </h4>
                <p className="text-foreground text-sm leading-relaxed">
                  {selectedAddress.addressLine1}
                </p>
                {selectedAddress.addressLine2 && (
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedAddress.addressLine2}
                  </p>
                )}
                <p className="text-muted-foreground text-sm mt-1">{locationLine}</p>
                {selectedAddress.phone && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {selectedAddress.phone}
                  </p>
                )}
                {selectedAddress.isDefault && (
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-secondary/20 text-secondary font-sans text-[10px] font-semibold uppercase tracking-wider"
                  >
                    Default Address
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              No address selected
            </p>
          )}
        </div>
      </Card>

      {/* 3. Payment Method Recap */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              Payment Method
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditPayment}
            className="h-8 px-3 text-sm text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            Change
          </Button>
        </div>

        <div className="p-5">
          {selectedPayment ? (
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 flex items-center justify-center border border-secondary/30 bg-secondary/10">
                  <CreditCard className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading text-sm font-semibold text-foreground">
                    {paymentInfo.label}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="bg-secondary/20 text-secondary font-sans text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {paymentInfo.badge}
                  </Badge>
                </div>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {paymentInfo.description}
                </p>
              </div>
            </div>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              No payment method selected
            </p>
          )}
        </div>
      </Card>

      {/* 4. Trust & Assurance Section */}
      <Alert className="border-secondary/30 bg-secondary/5">
        <Shield className="w-5 h-5 text-secondary shrink-0" />
        <AlertDescription className="font-sans text-sm text-foreground ml-2">
          Your order is protected and will be processed securely after confirmation.
        </AlertDescription>
      </Alert>

      {/* Trust Indicators Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2 p-4 border border-border bg-muted/30">
          <div className="w-10 h-10 flex items-center justify-center border border-secondary/20 bg-secondary/10">
            <Shield className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide text-center">
            Secure Checkout
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border border-border bg-muted/30">
          <div className="w-10 h-10 flex items-center justify-center border border-secondary/20 bg-secondary/10">
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide text-center">
            Manual Verification
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border border-border bg-muted/30">
          <div className="w-10 h-10 flex items-center justify-center border border-secondary/20 bg-secondary/10">
            <Zap className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide text-center">
            Fast Processing
          </span>
        </div>
      </div>

      {/* 5. Place Order CTA */}
      <div className="pt-4">
        <Button
          onClick={handlePlaceOrder}
          disabled={isLoading || isPlacing || !selectedAddress || !selectedPayment}
          className={cn(
            "w-full h-14",
            "font-sans text-sm font-semibold uppercase tracking-wider",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-300"
          )}
        >
          {isPlacing || isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Preparing your order
            </>
          ) : (
            <>
              Place Order
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Helper Text */}
        <p className="font-sans text-xs text-muted-foreground text-center mt-4">
          By placing this order, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}
