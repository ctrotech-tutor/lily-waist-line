"use client";

import { useRouter } from "next/navigation";
import { Shield, Clock, Zap, RotateCcw, ShoppingBag, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  OrderConfirmationShell,
  OrderSuccessHeader,
  OrderDetailsCard,
  PaymentNextStep,
} from "@/components/order";
import { useOrder } from "@/hooks/use-orders";
import { PaymentStatus } from "@/lib/generated/prisma/enums";
import { ROUTES } from "@/lib/constants/routes";

function OrderConfirmationSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted" />
      </div>
      <div className="text-center space-y-3">
        <div className="h-8 w-64 bg-muted rounded-lg mx-auto" />
        <div className="h-5 w-80 bg-muted rounded-lg mx-auto" />
      </div>
      <div className="h-48 bg-muted rounded-lg" />
      <div className="h-64 bg-muted rounded-lg" />
    </div>
  );
}

interface OrderConfirmationClientProps {
  orderId: string;
}

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const router = useRouter();
  const { data: orderData, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <OrderConfirmationShell>
        <OrderConfirmationSkeleton />
      </OrderConfirmationShell>
    );
  }

  if (error || !orderData) {
    return (
      <OrderConfirmationShell>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="font-sans text-muted-foreground">Order not found</p>
            <Button variant="outline" className="mt-4 rounded-lg" onClick={() => router.push(ROUTES.SHOP)}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </OrderConfirmationShell>
    );
  }

  const paymentMethod = orderData.paymentMethod?.toLowerCase() === "cash_app" ? "cashapp" : "paypal";
  const orderNumber = orderData.orderNumber ?? "LWL-????-????";
  const orderDate = orderData.createdAt
    ? new Date(orderData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const paymentStatus = orderData.paymentStatus ?? PaymentStatus.PENDING;
  const canUploadProof = paymentStatus === PaymentStatus.PENDING;

  return (
    <OrderConfirmationShell>
      <OrderSuccessHeader className="mb-8 md:mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <OrderDetailsCard
            orderNumber={orderNumber}
            orderDate={orderDate}
            paymentStatus={paymentStatus}
          />
          <PaymentNextStep method={paymentMethod} orderId={orderId} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Trust & Assurance */}
            <Card className="p-6 md:p-8 border border-border bg-card rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center border border-primary/30 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground">
                  Trust & Assurance
                </h2>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">Secure Order Handling</p>
                    <p className="font-sans text-xs text-muted-foreground">Your order information is encrypted and protected</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">Manual Payment Verification</p>
                    <p className="font-sans text-xs text-muted-foreground">Our team verifies each payment before processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">Fast Processing</p>
                    <p className="font-sans text-xs text-muted-foreground">Shipping begins within 24 hours of payment confirmation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">Easy Returns</p>
                    <p className="font-sans text-xs text-muted-foreground">30-day hassle-free return policy</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {canUploadProof && (
                <Button
                  onClick={() => router.push(`/order/payment-proof/${orderId}`)}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Payment Proof
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push(ROUTES.SHOP)}
                className="w-full h-12 border-primary/30 text-foreground hover:bg-primary/10 font-sans text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OrderConfirmationShell>
  );
}