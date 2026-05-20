"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, XCircle, Package, Truck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentStatus, FulfillmentStatus } from "./order-card";

export interface OrderStatusOverviewProps {
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  className?: string;
}

export function OrderStatusOverview({
  paymentStatus,
  fulfillmentStatus,
  className,
}: OrderStatusOverviewProps) {
  const getPaymentStatusBadge = () => {
    switch (paymentStatus) {
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
    switch (fulfillmentStatus) {
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
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Fulfillment
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

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">
        Status Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Payment Status */}
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Payment
          </p>
          {getPaymentStatusBadge()}
        </div>

        {/* Fulfillment Status */}
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Fulfillment
          </p>
          {getFulfillmentStatusBadge()}
        </div>
      </div>
    </Card>
  );
}
