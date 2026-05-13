"use client";

import { Package, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OrderDetails } from "./data";

interface AdminOrderHeaderProps {
  order: OrderDetails;
}

const paymentStatusConfig = {
  pending: { label: "Payment Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  verified: { label: "Payment Verified", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "Payment Rejected", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const fulfillmentStatusConfig = {
  processing: { label: "Processing", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  shipped: { label: "Shipped", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600 border-green-500/20" },
};

export function AdminOrderHeader({ order }: AdminOrderHeaderProps) {
  return (
    <div className="border-b border-border/50 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-[#d4af37]" />
            <h1 className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-semibold tracking-tight sm:text-3xl">
              Order {order.id}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span className="font-[family-name:var(--font-montserrat)]">{order.date}</span>
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
            className={`font-[family-name:var(--font-montserrat)] text-xs ${paymentStatusConfig[order.paymentStatus].className}`}
          >
            {paymentStatusConfig[order.paymentStatus].label}
          </Badge>
          <Badge
            variant="outline"
            className={`font-[family-name:var(--font-montserrat)] text-xs ${fulfillmentStatusConfig[order.fulfillmentStatus].className}`}
          >
            {fulfillmentStatusConfig[order.fulfillmentStatus].label}
          </Badge>
        </div>
      </div>
    </div>
  );
}
