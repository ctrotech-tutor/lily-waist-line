"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, ShoppingBag } from "lucide-react";
import { PaymentStatus, FulfillmentStatus } from "./order-card";

export interface OrderActionsProps {
  orderId: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  className?: string;
}

export function OrderActions({
  orderId,
  paymentStatus,
  fulfillmentStatus,
  className,
}: OrderActionsProps) {
  const router = useRouter();

  const showUploadPaymentProof = paymentStatus === "pending";
  const showTrackShipment = fulfillmentStatus === "shipped";

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">
        Actions
      </h2>

      <div className="flex flex-col gap-3">
        {/* Upload Payment Proof - Only when payment pending */}
        {showUploadPaymentProof && (
          <Button
            onClick={() => router.push(`/order/payment-proof/${orderId}`)}
            className="w-full px-6 py-3 text-sm font-button tracking-wide uppercase bg-[#d4af37] text-black hover:bg-[#d4af37]/90 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Upload Payment Proof
          </Button>
        )}

        {/* Track Shipment - Only when shipped */}
        {showTrackShipment && (
          <Button
            onClick={() => router.push(`/orders/${orderId}/tracking`)}
            variant="outline"
            className="w-full px-6 py-3 text-sm font-button tracking-wide uppercase border-[#d4af37]/30 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-colors"
          >
            <Truck className="w-4 h-4 mr-2" />
            Track Shipment
          </Button>
        )}

        {/* Always show Continue Shopping */}
        <Button
          onClick={() => router.push("/shop")}
          variant={showUploadPaymentProof || showTrackShipment ? "outline" : "default"}
          className={cn(
            "w-full px-6 py-3 text-sm font-button tracking-wide uppercase transition-colors",
            showUploadPaymentProof || showTrackShipment
              ? "border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              : "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    </Card>
  );
}
