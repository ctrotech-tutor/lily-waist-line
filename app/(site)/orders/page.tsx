"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrdersHeader } from "@/components/orders/orders-header";
import { OrdersList } from "@/components/orders/orders-list";
import { EmptyOrdersState } from "@/components/orders/empty-orders-state";
import { OrderData } from "@/components/orders/order-card";

// Mock orders data - TEMPORARY only
// Set to empty array [] to test empty state, or populate to test with orders
const mockOrders: OrderData[] = [
  {
    id: "LWL-2026-001",
    orderNumber: "LWL-2026-001",
    orderDate: "May 11, 2026",
    total: 149.99,
    paymentStatus: "pending",
    fulfillmentStatus: "processing",
    itemCount: 2,
  },
  {
    id: "LWL-2026-002",
    orderNumber: "LWL-2026-002",
    orderDate: "May 8, 2026",
    total: 239.98,
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    itemCount: 3,
  },
  {
    id: "LWL-2026-003",
    orderNumber: "LWL-2026-003",
    orderDate: "May 5, 2026",
    total: 89.99,
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
    itemCount: 1,
  },
  {
    id: "LWL-2026-004",
    orderNumber: "LWL-2026-004",
    orderDate: "April 28, 2026",
    total: 199.99,
    paymentStatus: "failed",
    fulfillmentStatus: "cancelled",
    itemCount: 2,
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders] = useState<OrderData[]>(mockOrders);
  const [isLoaded] = useState(true);

  const handleStartShopping = () => {
    router.push("/shop");
  };

  const orderCount = orders.length;

  return (
    <>
      <div className="min-h-full">
        {/* Page Header Section */}
        <OrdersHeader
          orderCount={orderCount}
          isLoaded={isLoaded}
        />

        {/* Orders Content Container */}
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
          {orderCount === 0 ? (
            <EmptyOrdersState onStartShopping={handleStartShopping} />
          ) : (
            <OrdersList orders={orders} isLoaded={isLoaded} />
          )}
        </div>
      </div>
    </>
  );
}
