"use client";

import { Package, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminOrderDetail } from "./data";
import { formatOrderDate } from "./data";

interface AdminOrderHeaderProps {
  order: AdminOrderDetail;
}

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Payment Pending", className: "bg-warning/10 text-warning border-warning/20" },
  PAID: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const fulfillmentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-muted/50 text-muted-foreground border-border/50" },
  PROCESSING: { label: "Processing", className: "bg-muted/50 text-muted-foreground border-border/50" },
  SHIPPED: { label: "Shipped", className: "bg-info/10 text-info border-info/20" },
  DELIVERED: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function AdminOrderHeader({ order }: AdminOrderHeaderProps) {
  const paymentBadge = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;
  const fulfillmentBadge = fulfillmentStatusConfig[order.fulfillmentStatus] || fulfillmentStatusConfig.PENDING;

  return (
    <div className="border-b border-border/50 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-secondary" />
            <h1 className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-semibold tracking-tight sm:text-3xl">
              Order {order.id}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span className="font-[family-name:var(--font-montserrat)]">{formatOrderDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="font-[family-name:var(--font-montserrat)]">{order.customerName}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`font-[family-name:var(--font-montserrat)] text-xs ${paymentBadge.className}`}
          >
            {paymentBadge.label}
          </Badge>
          <Badge
            variant="outline"
            className={`font-[family-name:var(--font-montserrat)] text-xs ${fulfillmentBadge.className}`}
          >
            {fulfillmentBadge.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}