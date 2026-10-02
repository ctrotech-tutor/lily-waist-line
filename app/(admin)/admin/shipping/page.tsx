"use client";

import { useState, useMemo, useCallback } from "react";
import { AlertCircle, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminShipping } from "@/hooks/admin/use-admin-shipping";
import { useUpdateFulfillmentStatus, useAddTrackingNumber } from "@/hooks/admin/use-admin-orders";
import {
  AdminShippingHeader,
  AdminShippingStats,
  AdminShippingTable,
  AdminShippingModal,
  AdminShippingEmpty,
  AdminShippingStatsSkeleton,
  AdminShippingTableSkeleton,
  type AdminShippingRow,
  computeShippingStats,
  formatShippingDate,
} from "@/components/admin/shipping";
import { formatOrderDate } from "@/components/admin/order";

type TabValue = "all" | "processing" | "shipped" | "delivered";

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

export default function AdminShippingPage() {
  const [currentTab, setCurrentTab] = useState<TabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminShippingRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fulfillmentStatus = currentTab === "all" ? undefined : currentTab.toUpperCase();

  const { data, isLoading, error } = useAdminShipping({
    page,
    search: searchQuery || undefined,
    fulfillmentStatus,
  });

  const updateStatus = useUpdateFulfillmentStatus();
  const addTracking = useAddTrackingNumber();

  const rows: AdminShippingRow[] = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.map((order) => {
      const shipment = order.shipments?.[0] ?? null;
      return {
        id: order.id,
        customerName: order.user.fullName,
        customerEmail: order.user.email,
        fulfillmentStatus: order.fulfillmentStatus as AdminShippingRow['fulfillmentStatus'],
        carrier: shipment?.carrier || null,
        trackingNumber: shipment?.trackingNumber || null,
        orderDate: formatOrderDate(order.createdAt as unknown as string),
        shippedDate: formatShippingDate(shipment?.shippedAt),
        deliveredDate: formatShippingDate(shipment?.deliveredAt),
        itemCount: order.orderItems.length,
        total: Number(order.total),
      };
    });
  }, [data]);

  const stats = useMemo(() => computeShippingStats(rows), [rows]);
  const pagination = data?.pagination;

  const handleTabChange = useCallback((tab: TabValue) => {
    setCurrentTab(tab);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handleAddTracking = useCallback((order: AdminShippingRow) => {
    setSelectedOrder(order);
    setModalOpen(true);
  }, []);

  const handleSaveTracking = useCallback(
    (orderId: string, carrier: string, trackingNumber: string) => {
      addTracking.mutate(
        { orderId, carrier, trackingNumber },
        {
          onSettled: () => {
            setModalOpen(false);
            setSelectedOrder(null);
          },
        }
      );
    },
    [addTracking]
  );

  const handleUpdateStatus = useCallback(
    (orderId: string, newStatus: string) => {
      updateStatus.mutate({ orderId, newStatus: newStatus as 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' });
    },
    [updateStatus]
  );

  return (
    <div className="space-y-6">
      <AdminShippingHeader />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 font-[family-name:var(--font-montserrat)] text-sm rounded-none border-border/50 focus-visible:border-primary focus-visible:ring-0"
          />
        </div>

        <div className="flex gap-1 border border-border/50">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`relative px-4 py-2 font-[family-name:var(--font-montserrat)] text-sm transition-colors ${
                currentTab === tab.value
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <>
          <AdminShippingStatsSkeleton />
          <AdminShippingTableSkeleton />
        </>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">Failed to load orders</h3>
          <p className="mt-2 font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-primary/50 hover:text-primary"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      ) : (
        <>
          <AdminShippingStats stats={stats} />

          {rows.length > 0 && pagination ? (
            <AdminShippingTable
              orders={rows}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              onUpdateStatus={handleUpdateStatus}
              onAddTracking={handleAddTracking}
              isUpdating={updateStatus.isPending}
            />
          ) : (
            <AdminShippingEmpty />
          )}
        </>
      )}

      <AdminShippingModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveTracking}
        isSaving={addTracking.isPending}
      />
    </div>
  );
}