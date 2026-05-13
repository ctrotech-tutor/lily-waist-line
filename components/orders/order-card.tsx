"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Package, CreditCard, Truck, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentStatus = "pending" | "paid" | "failed";
export type FulfillmentStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderData {
  id: string;
  orderNumber: string;
  orderDate: string;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  itemCount: number;
}

interface OrderCardProps {
  order: OrderData;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const router = useRouter();

  const getPaymentStatusBadge = () => {
    switch (order.paymentStatus) {
      case "paid":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="secondary"
            className="bg-destructive/10 text-destructive border border-destructive/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Pending Payment
          </Badge>
        );
    }
  };

  const getFulfillmentStatusBadge = () => {
    switch (order.fulfillmentStatus) {
      case "delivered":
        return (
          <Badge
            variant="secondary"
            className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-500 border border-blue-500/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-500/10 text-gray-500 border border-gray-500/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-purple-500/10 text-purple-500 border border-purple-500/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <Package className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
    }
  };

  const getActionButton = () => {
    // Pending Payment → Complete Payment (go to payment proof upload)
    if (order.paymentStatus === "pending") {
      return (
        <Button
          onClick={() => router.push("/order/payment-proof")}
          className="w-full sm:w-auto px-6 py-2 text-sm font-button tracking-wide uppercase bg-[#d4af37] text-black hover:bg-[#d4af37]/90 transition-colors"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Complete Payment
        </Button>
      );
    }

    // Shipped → Track Order (go to tracking page)
    if (order.fulfillmentStatus === "shipped") {
      return (
        <Button
          onClick={() => router.push(`/orders/${order.id}/tracking`)}
          variant="outline"
          className="w-full sm:w-auto px-6 py-2 text-sm font-button tracking-wide uppercase border-[#d4af37]/30 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-colors"
        >
          <Truck className="w-4 h-4 mr-2" />
          Track Order
        </Button>
      );
    }

    // Paid / Processing / Delivered → View Details
    return (
      <Button
        onClick={() => router.push(`/orders/${order.id}`)}
        variant="outline"
        className="w-full sm:w-auto px-6 py-2 text-sm font-button tracking-wide uppercase border-[#d4af37]/30 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-colors"
      >
        View Details
      </Button>
    );
  };

  return (
    <Card
      className={cn(
        "p-6 md:p-8 border border-border bg-card hover:border-[#d4af37]/30 transition-colors",
        className
      )}
    >
      {/* Header: Order Number and Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
            <Package className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {order.orderNumber}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="font-sans text-xs">{order.orderDate}</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#d4af37]" />
          <span className="font-heading text-xl font-semibold text-foreground">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 mb-6" />

      {/* Status Badges and Item Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {getPaymentStatusBadge()}
          {getFulfillmentStatusBadge()}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="w-4 h-4" />
          <span className="font-sans text-sm">
            {order.itemCount} {order.itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        {getActionButton()}
      </div>
    </Card>
  );
}
