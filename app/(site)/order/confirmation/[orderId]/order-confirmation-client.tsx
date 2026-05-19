"use client";

import { useState, useEffect } from "react";
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
  Upload,
} from "lucide-react";

import { getOrderDetails } from "@/server/actions/orders";
import { toast } from "sonner";

import { PaymentStatus } from "@/lib/generated/prisma/enums";

type OrderData = {
  orderNumber: string;
  createdAt: Date | string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
};

interface OrderConfirmationClientProps {
  orderId: string;
}

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        toast.error("Order ID not found");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getOrderDetails(orderId);

        if (result.success && result.data) {
          setOrderData(result.data);
        } else {
          toast.error(
            result.error ||
              "Failed to load order details"
          );
        }
      } catch (error) {
        console.error(
          "Error fetching order:",
          error
        );

        toast.error(
          "Failed to load order details"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const paymentMethod =
    orderData?.paymentMethod?.toLowerCase() ===
    "cash_app"
      ? "cashapp"
      : "paypal";

  const orderNumber =
    orderData?.orderNumber ??
    "LWL-XXXX-XXXX";

  const orderDate = orderData?.createdAt
    ? new Date(
        orderData.createdAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

  const paymentStatus =
    orderData?.paymentStatus ??
    PaymentStatus.PENDING;

  const canUploadProof = paymentStatus === PaymentStatus.PENDING;

  if (isLoading) {
    return (
      <OrderConfirmationShell>
        <div className="flex items-center justify-center py-12">
          <p className="font-sans text-muted-foreground">
            Loading order details...
          </p>
        </div>
      </OrderConfirmationShell>
    );
  }

  if (!orderData) {
    return (
      <OrderConfirmationShell>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="font-sans text-muted-foreground">
              Order not found
            </p>

            <Link
              href="/shop"
              className="mt-4 inline-block"
            >
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </OrderConfirmationShell>
    );
  }

  return (
    <OrderConfirmationShell>
      <OrderSuccessHeader className="mb-8 md:mb-12" />

      <div className="space-y-6">
        <OrderDetailsCard
          orderNumber={orderNumber}
          orderDate={orderDate}
          paymentStatus={paymentStatus}
        />

        <PaymentNextStep
          method={paymentMethod}
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
          {/* Upload Payment Proof - shown when payment is pending */}
          {canUploadProof && (
            <Link href={`/order/payment-proof/${orderId}`} className="flex-1">
              <Button
                className="w-full h-12 bg-[#d4af37] hover:bg-[#d4af37]/90 text-black font-sans text-sm font-semibold uppercase tracking-wider rounded-none transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Payment Proof
              </Button>
            </Link>
          )}

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
