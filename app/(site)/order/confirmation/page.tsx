"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  OrderConfirmationShell,
  OrderSuccessHeader,
  OrderDetailsCard,
  PaymentNextStep,
} from "@/components/order";
import {
  Shield,
  Zap,
  RotateCcw,
  ShoppingBag,
  CheckCircle,
  Clock,
} from "lucide-react";

// Mock data for demo purposes
const MOCK_ORDER = {
  orderNumber: "LWL-2026-001",
  orderDate: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  paymentStatus: "pending" as const,
  paymentMethod: "cashapp" as const, // or "paypal"
};

export default function OrderConfirmationPage() {
  const [paymentMethod] = useState<"cashapp" | "paypal">(
    MOCK_ORDER.paymentMethod
  );

  return (
    <OrderConfirmationShell>
      {/* Success Header */}
      <OrderSuccessHeader className="mb-8 md:mb-12" />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Order Details Card */}
        <OrderDetailsCard
          orderNumber={MOCK_ORDER.orderNumber}
          orderDate={MOCK_ORDER.orderDate}
          paymentStatus={MOCK_ORDER.paymentStatus}
        />

        {/* Payment Instructions */}
        <PaymentNextStep
          method={paymentMethod}
          cashAppHandle="LilyWaistLine"
          paypalEmail="payments@lilywaistline.com"
        />

        {/* Trust Messaging Card */}
        <Card className="p-6 md:p-8 border border-border bg-card">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
              <Shield className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground">
              Trust & Assurance
            </h2>
          </div>

          <Separator className="mb-6" />

          {/* Trust Items */}
          <div className="space-y-4">
            {/* Secure Order Handling */}
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  Secure Order Handling
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Your order information is encrypted and protected
                </p>
              </div>
            </div>

            {/* Manual Payment Verification */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  Manual Payment Verification
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Our team verifies each payment before processing
                </p>
              </div>
            </div>

            {/* Fast Processing After Payment */}
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  Fast Processing
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Shipping begins within 24 hours of payment confirmation
                </p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  Easy Returns
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  30-day hassle-free return policy
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Continue Shopping */}
          <Link href="/shop" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 border-[#d4af37]/50 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37] font-sans text-sm font-semibold uppercase tracking-wider rounded-none transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </OrderConfirmationShell>
  );
}
