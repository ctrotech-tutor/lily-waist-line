"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, CreditCard, Truck, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/optimized-image";
import type { OrderData } from "@/types/order";

export type { OrderData };

interface OrderCardProps {
  order: OrderData;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const router = useRouter();

  const getPaymentStatusBadge = () => {
    switch (order.paymentStatus) {
      case "PAID":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <CheckCircle className="w-2.5 h-2.5 mr-1" />
            Paid
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <XCircle className="w-2.5 h-2.5 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <CreditCard className="w-2.5 h-2.5 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getFulfillmentStatusBadge = () => {
    switch (order.fulfillmentStatus) {
      case "DELIVERED":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <CheckCircle className="w-2.5 h-2.5 mr-1" />
            Delivered
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <Truck className="w-2.5 h-2.5 mr-1" />
            Shipped
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-border font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <XCircle className="w-2.5 h-2.5 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg">
            <Package className="w-2.5 h-2.5 mr-1" />
            Processing
          </Badge>
        );
    }
  };

  const getActionButton = () => {
    if (order.paymentStatus === "PENDING") {
      return (
        <Button
          onClick={() => router.push(`/order/payment-proof/${order.id}`)}
          className="w-full px-4 py-2 text-xs font-button tracking-wide uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
        >
          <CreditCard className="w-3 h-3 mr-1.5" />
          Complete Payment
        </Button>
      );
    }
    if (order.fulfillmentStatus === "SHIPPED") {
      return (
        <Button
          onClick={() => router.push(`/orders/${order.id}/tracking`)}
          variant="outline"
          className="w-full px-4 py-2 text-xs font-button tracking-wide uppercase border-primary/30 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
        >
          <Truck className="w-3 h-3 mr-1.5" />
          Track Order
        </Button>
      );
    }
    return (
      <Button
        onClick={() => router.push(`/orders/${order.id}`)}
        variant="outline"
        className="w-full px-4 py-2 text-xs font-button tracking-wide uppercase border-primary/30 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
      >
        View Details
      </Button>
    );
  };

  const previewImage = order.previewItem?.product?.image?.url;

  return (
    <Card className={cn("border border-border bg-card hover:border-primary/30 transition-colors rounded-lg overflow-hidden", className)}>
      {/* Preview Image */}
      <div className="relative h-40 w-full bg-muted">
        {previewImage ? (
          <OptimizedImage
            src={previewImage}
            alt={order.previewItem?.product?.name || "Order item"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        {/* Status badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {getPaymentStatusBadge()}
          {getFulfillmentStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Order Number and Total */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground leading-tight">
              {order.orderNumber}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="font-sans text-xs">{order.orderDate}</span>
            </div>
          </div>
          <span className="font-heading text-lg font-semibold text-foreground shrink-0 ml-2">
            ${order.total.toFixed(2)}
          </span>
        </div>

        {/* Item Count */}
        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
          <Package className="w-3.5 h-3.5" />
          <span className="font-sans text-xs">
            {order.itemCount} {order.itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Action */}
        {getActionButton()}
      </div>
    </Card>
  );
}