"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, XCircle, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentStatus, FulfillmentStatus } from "@/lib/generated/prisma/enums";

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
      case "PAID":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <CreditCard className="w-3 h-3 mr-1" />
            Pending Payment
          </Badge>
        );
    }
  };

  const getFulfillmentStatusBadge = () => {
    switch (fulfillmentStatus) {
      case "DELIVERED":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-border font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            <Package className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
    }
  };

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card rounded-lg", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">
        Status Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Payment</p>
          {getPaymentStatusBadge()}
        </div>
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Fulfillment</p>
          {getFulfillmentStatusBadge()}
        </div>
      </div>
    </Card>
  );
}