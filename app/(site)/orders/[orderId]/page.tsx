"use client";

import React from "react";
import {
  OrderDetailsShell,
  OrderDetailsHeader,
  OrderStatusOverview,
  OrderTimeline,
  OrderItemsList,
  OrderActions,
  type OrderItemData,
} from "@/components/orders";
import { useOrder } from "@/hooks/use-orders";

type OrderDetailsItem = {
  id: string;
  product: {
    name: string;
    image: { url: string } | null;
  };
  variant: {
    size: string;
    compressionLevel: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded-lg mb-6" />
      <div className="h-px w-16 bg-muted mb-6" />
      <div className="h-12 w-72 bg-muted rounded-lg mb-3" />
      <div className="h-5 w-48 bg-muted rounded-lg mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = React.use(params);
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <OrderDetailsShell>
            <OrderDetailsSkeleton />
          </OrderDetailsShell>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <OrderDetailsShell>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error instanceof Error ? error.message : "Order not found"}</p>
            </div>
          </OrderDetailsShell>
        </main>
      </div>
    );
  }

  const items: OrderItemData[] = order.items.map((item: OrderDetailsItem) => ({
    id: item.id,
    productName: item.product.name,
    productImage: item.product.image?.url || null,
    size: item.variant.size,
    compression: item.variant.compressionLevel,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  }));

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <main>
        <OrderDetailsShell>
          <OrderDetailsHeader
            orderNumber={order.orderNumber}
            orderDate={orderDate}
            total={order.total}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {order.latestPaymentProof?.rejectionReason && (
                <div role="note" className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
                  <strong>Payment review note:</strong> {order.latestPaymentProof.rejectionReason}
                  <p className="mt-1 text-muted-foreground">
                    This order is closed. If you have already paid, contact support before placing another order.
                  </p>
                </div>
              )}
              <OrderStatusOverview
                paymentStatus={order.paymentStatus}
                fulfillmentStatus={order.fulfillmentStatus}
              />
              <OrderTimeline
                paymentStatus={order.paymentStatus}
                fulfillmentStatus={order.fulfillmentStatus}
              />
              <OrderItemsList items={items} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderActions
                  orderId={order.id}
                  paymentStatus={order.paymentStatus}
                  fulfillmentStatus={order.fulfillmentStatus}
                  hasPendingPaymentProof={order.hasPendingPaymentProof}
                />
              </div>
            </div>
          </div>
        </OrderDetailsShell>
      </main>
    </div>
  );
}