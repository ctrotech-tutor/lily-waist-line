"use client";

import { useState, useMemo } from "react";
import {
  AdminOrdersHeader,
  AdminOrdersFilters,
  AdminOrdersTable,
  AdminOrdersEmpty,
  type FilterStatus,
  type PaymentStatus,
  type FulfillmentStatus,
} from "@/components/admin/orders";
import { mockOrders } from "@/lib/mock/admin-data";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [orders, setOrders] = useState(mockOrders);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== "all") {
        switch (statusFilter) {
          case "pending_payment":
            matchesStatus = order.paymentStatus === "pending_payment";
            break;
          case "paid":
            matchesStatus = order.paymentStatus === "paid";
            break;
          case "processing":
            matchesStatus = order.fulfillmentStatus === "processing";
            break;
          case "shipped":
            matchesStatus = order.fulfillmentStatus === "shipped";
            break;
          case "delivered":
            matchesStatus = order.fulfillmentStatus === "delivered";
            break;
          case "cancelled":
            matchesStatus = order.fulfillmentStatus === "cancelled";
            break;
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleUpdateStatus = (
    orderId: string,
    paymentStatus: PaymentStatus,
    fulfillmentStatus: FulfillmentStatus
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus, fulfillmentStatus }
          : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <AdminOrdersHeader />

      <AdminOrdersFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {filteredOrders.length > 0 ? (
        <AdminOrdersTable
          orders={filteredOrders}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <AdminOrdersEmpty searchQuery={searchQuery} />
      )}
    </div>
  );
}
