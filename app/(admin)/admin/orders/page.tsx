"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminOrders } from "@/hooks/admin/use-admin-orders";
import { AdminOrdersHeader, AdminOrdersFilters, AdminOrdersTableSkeleton, AdminOrdersEmpty } from "@/components/admin/orders";
import type { AdminOrderRow } from "@/components/admin/orders";
import type { FilterStatus } from "@/components/admin/orders/admin-orders-filters";
import { formatOrderDate } from "@/components/admin/order";
import type { PaymentStatus, FulfillmentStatus } from "@/lib/generated/prisma/enums";

const AdminOrdersTable = dynamic(() =>
  import("@/components/admin/orders").then((m) => m.AdminOrdersTable),
  { ssr: false },
);

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filterParams = useMemo((): {
    search?: string;
    paymentStatus?: PaymentStatus;
    fulfillmentStatus?: FulfillmentStatus;
  } => {
    const params: {
      search?: string;
      paymentStatus?: PaymentStatus;
      fulfillmentStatus?: FulfillmentStatus;
    } = {};
    if (searchQuery) params.search = searchQuery;
    switch (statusFilter) {
      case "pending_payment": params.paymentStatus = "PENDING"; break;
      case "paid": params.paymentStatus = "PAID"; break;
      case "processing": params.fulfillmentStatus = "PROCESSING"; break;
      case "shipped": params.fulfillmentStatus = "SHIPPED"; break;
      case "delivered": params.fulfillmentStatus = "DELIVERED"; break;
      case "cancelled": params.fulfillmentStatus = "CANCELLED"; break;
    }
    return params;
  }, [searchQuery, statusFilter]);

  const { data, isLoading, error } = useAdminOrders({
    page,
    limit: 20,
    search: searchQuery || undefined,
    paymentStatus: filterParams.paymentStatus,
    fulfillmentStatus: filterParams.fulfillmentStatus,
  });

  const rows: AdminOrderRow[] = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.map((order) => ({
      id: order.id,
      customerName: order.user.fullName,
      customerEmail: order.user.email,
      amount: Number(order.total),
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      date: formatOrderDate(order.createdAt as unknown as string),
      itemCount: order.orderItems.length,
    }));
  }, [data]);

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <AdminOrdersHeader />
      <AdminOrdersFilters
        searchQuery={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
      />
      {isLoading ? (
        <AdminOrdersTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h2 className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">Failed to Load Orders</h2>
          <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground max-w-md text-center">
            {error instanceof Error ? error.message : 'An unexpected error occurred while loading orders.'}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-primary/50 hover:text-primary"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      ) : rows.length > 0 && pagination ? (
        <AdminOrdersTable
          orders={rows}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      ) : (
        <AdminOrdersEmpty searchQuery={searchQuery} />
      )}
    </div>
  );
}