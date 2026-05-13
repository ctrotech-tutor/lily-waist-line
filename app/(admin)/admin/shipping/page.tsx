"use client";

import { useState, useMemo } from "react";
import {
  AdminShippingHeader,
  AdminShippingStats,
  AdminShippingTable,
  AdminShippingModal,
  AdminShippingEmpty,
  mockShippingOrders,
  calculateShippingStats,
  type ShippingOrder,
  type ShippingStatus,
  type Carrier,
} from "@/components/admin/shipping";

export default function AdminShippingPage() {
  const [orders, setOrders] = useState<ShippingOrder[]>(mockShippingOrders);
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => calculateShippingStats(orders), [orders]);

  const handleUpdateStatus = (orderId: string, status: ShippingStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updated: ShippingOrder = { ...order, status };

        if (status === "shipped" && !order.shippedDate) {
          updated.shippedDate = new Date().toISOString().split("T")[0];
        }
        if (status === "delivered" && !order.deliveredDate) {
          updated.deliveredDate = new Date().toISOString().split("T")[0];
        }

        return updated;
      })
    );
  };

  const handleAddTracking = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleSaveTracking = (
    orderId: string,
    carrier: Carrier,
    trackingNumber: string,
    shippingDate: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          carrier,
          trackingNumber,
          shippedDate: shippingDate,
          status: "shipped" as ShippingStatus,
        };
      })
    );
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <AdminShippingHeader />
      <AdminShippingStats stats={stats} />

      {orders.length > 0 ? (
        <AdminShippingTable
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onAddTracking={handleAddTracking}
        />
      ) : (
        <AdminShippingEmpty />
      )}

      <AdminShippingModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveTracking}
      />
    </div>
  );
}
