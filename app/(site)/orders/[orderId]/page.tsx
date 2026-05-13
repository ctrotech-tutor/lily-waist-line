"use client";

import { useState, useEffect } from "react";
import {
  OrderDetailsShell,
  OrderDetailsHeader,
  OrderStatusOverview,
  OrderTimeline,
  OrderItemsList,
  OrderActions,
  type OrderItemData,
  type PaymentStatus,
  type FulfillmentStatus,
} from "@/components/orders";

// Mock data - will be replaced with real data later
const mockOrder = {
  id: "LWL-2026-001",
  orderNumber: "LWL-2026-001",
  orderDate: "May 11, 2026",
  total: 120.0,
  paymentStatus: "pending" as PaymentStatus,
  fulfillmentStatus: "processing" as FulfillmentStatus,
};

const mockItems: OrderItemData[] = [
  {
    id: "item-001",
    productName: "Lily Sculpting Waist Trainer",
    productImage: "/img-1.png",
    size: "M",
    compression: "High",
    quantity: 1,
    unitPrice: 85.0,
  },
  {
    id: "item-002",
    productName: "Core Control Compression Band",
    productImage: "/img-1.png",
    size: "S",
    compression: "Medium",
    quantity: 1,
    unitPrice: 35.0,
  },
];

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const [orderId, setOrderId] = useState<string>("");
  
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setOrderId(resolved.orderId);
    };
    resolveParams();
  }, [params]);

  // In the future, this will fetch real order data
  console.log("Order ID:", orderId);

  return (
    <div className="min-h-screen bg-background">

      <main>
        <OrderDetailsShell>
          {/* Header Section */}
          <OrderDetailsHeader
            orderNumber={mockOrder.orderNumber}
            orderDate={mockOrder.orderDate}
            total={mockOrder.total}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Overview */}
              <OrderStatusOverview
                paymentStatus={mockOrder.paymentStatus}
                fulfillmentStatus={mockOrder.fulfillmentStatus}
              />

              {/* Order Timeline */}
              <OrderTimeline
                paymentStatus={mockOrder.paymentStatus}
                fulfillmentStatus={mockOrder.fulfillmentStatus}
              />

              {/* Order Items */}
              <OrderItemsList items={mockItems} />
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderActions
                  orderId={mockOrder.id}
                  paymentStatus={mockOrder.paymentStatus}
                  fulfillmentStatus={mockOrder.fulfillmentStatus}
                />
              </div>
            </div>
          </div>
        </OrderDetailsShell>
      </main>

    </div>
  );
}
