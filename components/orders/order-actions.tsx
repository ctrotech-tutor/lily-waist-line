"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, ShoppingBag } from "lucide-react";
import type { PaymentStatus, FulfillmentStatus } from "@/lib/generated/prisma/enums";
import { ROUTES } from "@/lib/constants/routes";

export interface OrderActionsProps {
  orderId: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  hasPendingPaymentProof?: boolean;
  className?: string;
}

export function OrderActions({
  orderId,
  paymentStatus,
  fulfillmentStatus,
  hasPendingPaymentProof = false,
  className,
}: OrderActionsProps) {
  const router = useRouter();

  const showUploadPaymentProof = paymentStatus === "PENDING"
    && fulfillmentStatus !== "CANCELLED"
    && !hasPendingPaymentProof;
  const showTrackShipment = fulfillmentStatus === "SHIPPED";

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card rounded-lg", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">
        Actions
      </h2>
      <div className="flex flex-col gap-3">
        {showUploadPaymentProof && (
          <Button
            onClick={() => router.push(`/order/payment-proof/${orderId}`)}
            className="w-full px-6 py-3 text-sm font-button tracking-wide uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Upload Payment Proof
          </Button>
        )}
        {showTrackShipment && (
          <Button
            onClick={() => router.push(`/orders/${orderId}/tracking`)}
            variant="outline"
            className="w-full px-6 py-3 text-sm font-button tracking-wide uppercase border-primary/30 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Truck className="w-4 h-4 mr-2" />
            Track Shipment
          </Button>
        )}
        <Button
          onClick={() => router.push(ROUTES.SHOP)}
          variant={showUploadPaymentProof || showTrackShipment ? "outline" : "default"}
          className={cn(
            "w-full px-6 py-3 text-sm font-button tracking-wide uppercase rounded-lg transition-colors",
            showUploadPaymentProof || showTrackShipment
              ? "border-border text-foreground hover:bg-accent"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    </Card>
  );
}